import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { QUESTION_PROMPT, DISCUSSION_PROMPT } from '@/services/Constant';

const openRouterApiKey = (
  process.env.OPEN_ROUTER_API_KEY ?? process.env.OPENROUTER_API_KEY
)?.trim();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: openRouterApiKey,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
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

  const { jobPosition, jobDescription, duration, type } = await request.json();

  const FINAL_PROMPT = QUESTION_PROMPT
    .replace('{{jobTitle}}', jobPosition ?? '')
    .replace('{{jobDescription}}', jobDescription ?? '')
    .replace('{{duration}}', duration ?? '')
    .replace('{{type}}', Array.isArray(type) ? type.join(', ') : (type ?? ''));

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
          { id: "google/gemini-3.5-flash", name: "Google Gemini 3.5 Flash" },
          { id: "deepseek/deepseek-v4-pro", name: "DeepSeek v4 Pro" },
          { id: "qwen/qwen3.7-plus", name: "Qwen 3.7 Plus" }
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
        const FINAL_DISCUSSION_PROMPT = DISCUSSION_PROMPT
          .replace('{{jobTitle}}', jobPosition ?? '')
          .replace('{{jobDescription}}', jobDescription ?? '')
          .replace('{{duration}}', duration ?? '')
          .replace('{{type}}', Array.isArray(type) ? type.join(', ') : (type ?? ''))
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

