import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { QUESTION_PROMPT, DISCUSSION_PROMPT, RESUME_QUESTION_PROMPT, RESUME_DISCUSSION_PROMPT } from '@/services/Constant';
import fs from 'fs';

const logPath = 'e:/ai-interview/aimodel-error.log';

const cleanEnvVar = (val) => {
  if (!val) return val;
  return val.trim().replace(/^['"]|['"]$/g, '').trim();
};

const openRouterApiKey = cleanEnvVar(
  process.env.OPEN_ROUTER_API_KEY ?? process.env.OPENROUTER_API_KEY
);

// Obfuscate key for logging
const keyLog = openRouterApiKey
  ? `${openRouterApiKey.substring(0, 8)}...${openRouterApiKey.substring(openRouterApiKey.length - 8)}`
  : 'UNDEFINED';

if (process.env.NODE_ENV === 'development') {
  try {
    fs.appendFileSync(logPath, `[API Route Init] Loaded key: ${keyLog}\n`);
  } catch (e) {
    console.error("Failed to write initialization log:", e);
  }
}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: openRouterApiKey,
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
      // Log to file for visibility in development
      if (process.env.NODE_ENV === 'development') {
        try {
          const errorDetails = `[${new Date().toISOString()}] [${modelName}] ERROR:\n` +
            `Message: ${error.message}\n` +
            `Status: ${error.status}\n` +
            `Code: ${error.code}\n` +
            `Type: ${error.type}\n` +
            `Raw: ${JSON.stringify(error, null, 2)}\n` +
            `ApiKey: ${keyLog}\n\n`;
          fs.appendFileSync(logPath, errorDetails);
        } catch (logErr) {
          console.error("Failed to write error to file log:", logErr);
        }
      }

      // 🔴 DETAILED ERROR LOGGING
      console.error(`[${modelName}] ===== FULL ERROR =====`);
      console.error(`[${modelName}] Message:`, error.message);
      console.error(`[${modelName}] Status:`, error.status);
      console.error(`[${modelName}] Error code:`, error.code);
      console.error(`[${modelName}] Error type:`, error.type);
      console.error(`[${modelName}] Raw error:`, JSON.stringify(error, null, 2));
      console.error(`[${modelName}] =====================`);

      const statusMatch = error.message.match(/\b\d{3}\b/);
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
  if (!openRouterApiKey) {
    return NextResponse.json(
      { error: "OPEN_ROUTER_API_KEY is not set in environment variables." },
      { status: 500 }
    );
  }

  const { jobPosition, jobDescription, duration, type, interviewMode, resumeContent } = await request.json();

  const formattedType = Array.isArray(type) ? type.join(', ') : (type ?? '');
  const isResumeMode = interviewMode === 'resume';

  const FINAL_PROMPT = isResumeMode
    ? RESUME_QUESTION_PROMPT
        .replace('{{jobTitle}}', jobPosition ?? 'Software Professional')
        .replace('{{resumeContent}}', resumeContent ?? jobDescription ?? '')
        .replace('{{duration}}', duration ?? '')
        .replace('{{type}}', formattedType)
    : QUESTION_PROMPT
        .replace('{{jobTitle}}', jobPosition ?? '')
        .replace('{{jobDescription}}', jobDescription ?? '')
        .replace('{{duration}}', duration ?? '')
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
          { id: "meta-llama/llama-3.2-3b-instruct:free", name: "LLaMA 3.2 (Free)" },
          { id: "google/gemini-2.5-flash", name: "Google Gemini 2.5 Flash" },
          { id: "deepseek/deepseek-chat", name: "DeepSeek Chat" },
          { id: "qwen/qwen-2.5-72b-instruct", name: "Qwen 2.5 72B Instruct" }
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

        const synthesisModel = "google/gemini-2.5-flash";
        const finalAnswer = await getAICompletion(synthesisModel, FINAL_DISCUSSION_PROMPT, true, "Google Gemini 2.5 Flash", 60000);

        if (!finalAnswer) {
          sendUpdate({ status: 'fallback', message: 'Using best individual proposal as synthesis timed out.' });
          sendUpdate({ status: 'completed', content: validProposals[0] });
        } else {
          sendUpdate({ status: 'completed', content: finalAnswer });
        }

        controller.close();
      } catch (error) {
        sendUpdate({ status: 'error', message: error.message });
        controller.close();
      }
    }
  });


  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson' },
  });
}

