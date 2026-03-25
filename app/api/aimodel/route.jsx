import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { QUESTION_PROMPT, DISCUSSION_PROMPT } from '@/services/Constant';

const openai = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY,
});

async function getAICompletion(model, prompt, isJson = true, modelName = "Model", timeoutMs = 30000) {
  let retries = 1; // Reduced retries to save time
  while (retries >= 0) {
    try {
      console.log(`[Panel Discussion] ${modelName} is starting to think...`);
      
      // Implement timeout using Promise.race
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
      if (retries === 0) {
        console.error(`Final error/timeout calling ${modelName}:`, error.message);
        return null;
      }
      console.warn(`Retry ${modelName} after error:`, error.message);
      await new Promise(resolve => setTimeout(resolve, 500));
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

  console.log("-----------------------------------------");
  console.log("Starting Optimized Multi-Model Generation...");

  try {
    // Using faster/smaller models to ensure <1 minute total time
    const models = [
      { id: "meta/llama-3.1-8b-instruct", name: "Llama 8B" },
      { id: "nvidia/llama-3.1-nemotron-70b-instruct", name: "Nemotron 70B" },
      { id: "qwen/qwen-2.5-7b-instruct", name: "Qwen 7B" },
      { id: "google/gemma-2-9b-it", name: "Gemma 9B" },
      { id: "deepseek-ai/deepseek-v3", name: "DeepSeek V3" }
    ];

    // Step 1: Parallel Generation (Timeout: 30s)
    const resultPromises = models.map(model => getAICompletion(model.id, FINAL_PROMPT, true, model.name, 35000));
    const proposals = await Promise.all(resultPromises);

    const [prop1, prop2, prop3, prop4, prop5] = proposals;

    // Step 2: Synthesis / Discussion
    const FINAL_DISCUSSION_PROMPT = DISCUSSION_PROMPT
      .replace('{{jobTitle}}', jobPosition ?? '')
      .replace('{{jobDescription}}', jobDescription ?? '')
      .replace('{{duration}}', duration ?? '')
      .replace('{{type}}', Array.isArray(type) ? type.join(', ') : (type ?? ''))
      .replace('{{proposal1}}', prop1 || "Model failed to generate")
      .replace('{{proposal2}}', prop2 || "Model failed to generate")
      .replace('{{proposal3}}', prop3 || "Model failed to generate")
      .replace('{{proposal4}}', prop4 || "Model failed to generate")
      .replace('{{proposal5}}', prop5 || "Model failed to generate");

    console.log("-----------------------------------------");
    console.log("Starting Synthesis Phase (Lead Interviewer is thinking...)");
    
    // Using a fast but strong model for synthesis
    const finalAnswer = await getAICompletion("nvidia/llama-3.1-nemotron-70b-instruct", FINAL_DISCUSSION_PROMPT, true, "Lead Interviewer", 40000);

    if (!finalAnswer) {
      const validProposal = proposals.find(p => p !== null);
      if (validProposal) {
        console.warn("Synthesis failed/timed out, falling back to a single model proposal");
        return NextResponse.json({ content: validProposal });
      }
      throw new Error("Generation timed out. Please try again.");
    }

    console.log("-----------------------------------------");
    console.log("Generated Final Interview Questions:");
    console.log(finalAnswer);
    console.log("-----------------------------------------");

    return NextResponse.json({ content: finalAnswer });

  } catch (error) {
    console.error('Error in multi-model flow:', error);
    return NextResponse.json({
      error: 'Failed to generate questions quickly enough. Please try again.',
      details: error.message
    }, { status: 500 });
  }
}


