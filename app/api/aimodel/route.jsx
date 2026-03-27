import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { QUESTION_PROMPT, DISCUSSION_PROMPT } from '@/services/Constant';

const openai = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY,
});

async function getAICompletion(model, prompt, isJson = true, modelName = "Model", timeoutMs = 60000) {
  let retries = 1;
  while (retries >= 0) {
    try {
      console.log(`[Panel Discussion] ${modelName} is starting to think... (Attempt ${2 - retries})`);

      const completionPromise = openai.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: prompt }],
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
          { id: "meta/llama-3.1-8b-instruct", name: "Llama 8B" },
          { id: "meta/llama-3.2-1b-instruct", name: "Llama 1B" }
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
        const [prop1, prop2] = proposals;
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
          .replace('{{proposal3}}', "No proposal available");

        const finalAnswer = await getAICompletion("meta/llama-3.3-70b-instruct", FINAL_DISCUSSION_PROMPT, true, "Lead Interviewer", 60000);

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
