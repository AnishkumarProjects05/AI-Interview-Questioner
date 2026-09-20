import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { QUESTION_PROMPT, DISCUSSION_PROMPT, RESUME_QUESTION_PROMPT, RESUME_DISCUSSION_PROMPT } from '@/services/Constant';
import { getAuthenticatedUser } from '@/lib/auth';
import { sanitizePromptInput } from '@/lib/sanitizer';

const DEBATE_ONE = process.env.DEBATE_ONE;
const DEBATE_TWO = process.env.DEBATE_TWO;
const DEBATE_THREE = process.env.DEBATE_THREE;
const DEBATE_FOUR = process.env.DEBATE_FOUR;
const LEAD_DEBATE = process.env.LEAD_DEBATE;

const cleanEnvVar = (val) => {
  if (!val) return val;
  return val.trim().replace(/^['\"]|['\"]$/g, '').trim();
};

const openRouterApiKey = cleanEnvVar(
  process.env.OPEN_ROUTER_API_KEY ?? process.env.OPENROUTER_API_KEY
);

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: openRouterApiKey || "dummy-key-for-build",
  defaultHeaders: {
    "HTTP-Referer": cleanEnvVar(process.env.NEXT_PUBLIC_APP_URL) || "http://localhost:3000",
    "X-Title": "CareerConnect AI",
  },
});

async function getAICompletion(model, prompt, isJson = true, modelName = "Model", timeoutMs = 60000) {
  let retries = 1;
  while (retries >= 0) {
    try {
      console.log(`[Panel Discussion] ${modelName} is starting to think... (Attempt ${2 - retries})`);

      const completionPromise = openai.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        ...(isJson ? { response_format: { type: "json_object" } } : {})
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
      );

      const completion = await Promise.race([completionPromise, timeoutPromise]);

      console.log(`[Panel Discussion] ${modelName} has finished.`);
      return completion.choices[0].message.content;
    } catch (error) {
      console.error(`[Panel Discussion] ${modelName} encountered an error:`, error.message);

      const statusMatch = error.message?.match(/\b\d{3}\b/);
      const status = statusMatch ? statusMatch[0] : null;

      if (retries === 0 || status === '404' || status === '401') {
        console.error(`Final failure for ${modelName}: [${status || 'Error'}] ${error.message}`);
        return null;
      }

      console.warn(`Retry ${modelName} after issue: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      retries--;
    }
  }
}

export async function POST(request) {
  // 1. Verify Server-Side Authentication
  const { user, error: authError } = await getAuthenticatedUser();
  if (!user || authError) {
    return NextResponse.json(
      { error: "Unauthorized: You must be logged in to use the AI interview generator." },
      { status: 401 }
    );
  }

  // 2. Validate API Key configuration
  if (!openRouterApiKey) {
    return NextResponse.json(
      { error: "AI service is currently unavailable. Missing configuration." },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const { jobPosition, jobDescription, duration, type, interviewMode, resumeContent } = body;

  // 3. Sanitize user inputs and cap lengths to prevent prompt injection and token overflow
  const safeJobPosition = sanitizePromptInput(jobPosition, 200) || 'Software Professional';
  const safeJobDescription = sanitizePromptInput(jobDescription, 5000);
  const safeResumeContent = sanitizePromptInput(resumeContent, 10000);
  const safeDuration = sanitizePromptInput(String(duration || ''), 50);

  const formattedType = Array.isArray(type)
    ? type.map(t => sanitizePromptInput(String(t), 50)).filter(Boolean).join(', ')
    : sanitizePromptInput(String(type ?? ''), 100);

  const isResumeMode = interviewMode === 'resume';

  const FINAL_PROMPT = isResumeMode
    ? RESUME_QUESTION_PROMPT
        .replace('{{jobTitle}}', safeJobPosition)
        .replace('{{resumeContent}}', safeResumeContent || safeJobDescription || '')
        .replace('{{duration}}', safeDuration)
        .replace('{{type}}', formattedType)
    : QUESTION_PROMPT
        .replace('{{jobTitle}}', safeJobPosition)
        .replace('{{jobDescription}}', safeJobDescription)
        .replace('{{duration}}', safeDuration)
        .replace('{{type}}', formattedType);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendUpdate = (data) => {
        controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
      };

      try {
        sendUpdate({ status: 'thinking', message: 'AI Panel is starting to think...' });

        const models = [
          { id: DEBATE_ONE, name: "Debate Model 1" },
          { id: DEBATE_TWO, name: "Debate Model 2" },
          { id: DEBATE_THREE, name: "Debate Model 3" },
          { id: DEBATE_FOUR, name: "Debate Model 4" }
        ];

        // Step 1: Parallel Generation  
        const resultPromises = models.map(async (model) => {
          const result = await getAICompletion(model.id, FINAL_PROMPT, true, model.name, 60000);
          if (result) {
            sendUpdate({ status: 'model_finished', model: model.name, message: `${model.name} has finished generating.` });
          }
          return result;
        });

        const proposals = await Promise.all(resultPromises);
        const [prop1, prop2, prop3, prop4] = proposals;
        const validProposals = proposals.filter(p => p !== null);

        if (validProposals.length === 0) {
          throw new Error("All models failed to respond.");
        }

        sendUpdate({ status: 'synthesizing', message: 'Lead Interviewer is synthesising the best questions...' });

        // Step 2: Synthesis
        const FINAL_DISCUSSION_PROMPT = isResumeMode
          ? RESUME_DISCUSSION_PROMPT
              .replace('{{jobTitle}}', jobPosition ?? 'Software Professional')
              .replace('{{resumeContent}}', resumeContent ?? jobDescription ?? '')
              .replace('{{duration}}', duration ?? '')
              .replace('{{type}}', formattedType)
              .replace('{{proposal1}}', prop1 || "No proposal available")
              .replace('{{proposal2}}', prop2 || "No proposal available")
              .replace('{{proposal3}}', prop3 || "No proposal available")
              .replace('{{proposal4}}', prop4 || "No proposal available")
          : DISCUSSION_PROMPT
              .replace('{{jobTitle}}', jobPosition ?? '')
              .replace('{{jobDescription}}', jobDescription ?? '')
              .replace('{{duration}}', duration ?? '')
              .replace('{{type}}', formattedType)
              .replace('{{proposal1}}', prop1 || "No proposal available")
              .replace('{{proposal2}}', prop2 || "No proposal available")
              .replace('{{proposal3}}', prop3 || "No proposal available")
              .replace('{{proposal4}}', prop4 || "No proposal available");

        const synthesisModel = LEAD_DEBATE;
        const finalAnswer = await getAICompletion(synthesisModel, FINAL_DISCUSSION_PROMPT, true, "Lead Debate Model", 60000);

        if (!finalAnswer) {
          sendUpdate({ status: 'fallback', message: 'Using best individual proposal as synthesis timed out.' });
          sendUpdate({ status: 'completed', content: validProposals[0] });
        } else {
          sendUpdate({ status: 'completed', content: finalAnswer });
        }

        controller.close();
      } catch (error) {
        const safeErrorMessage = process.env.NODE_ENV === 'production'
          ? 'Failed to generate interview questions. Please try again later.'
          : (error.message || 'An error occurred');
        sendUpdate({ status: 'error', message: safeErrorMessage });
        controller.close();
      }
    }
  });


  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson' },
  });
}

