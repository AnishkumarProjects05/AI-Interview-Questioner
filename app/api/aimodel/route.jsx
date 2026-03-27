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
      console.log(`[Panel Discussion] ${modelName} is starting to think... (Attempt ${2-retries})`);

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
       // Detailed logging for fatal errors
      const statusMatch = error.message.match(/\b\d{3}\b/);
      const status = statusMatch ? statusMatch[0] : null;

      if (retries === 0 || status === '404' || status === '401') {
        console.error(`Final failure for ${modelName}: [${status || 'Error'}] ${error.message}`);
        return null;
      }
      
      console.warn(`Retry ${modelName} after issue: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Slightly longer delay between retries
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
  console.log("Starting ULTRA-ROBUST Generation Flow...");

  try {
    // Ultra-reliable model panel: Focusing exclusively on Llama models
    // These are currently the most stable and performant on NVIDIA's endpoint
    const models = [
      { id: "meta/llama-3.1-8b-instruct", name: "Llama 8B" },
      { id: "meta/llama-3.2-1b-instruct", name: "Llama 1B" }
    ];

    // Step 1: Parallel Generation (Generous 60s timeout)
    const resultPromises = models.map(model => getAICompletion(model.id, FINAL_PROMPT, true, model.name, 60000));
    const proposals = await Promise.all(resultPromises);

    const [prop1, prop2] = proposals;

    // Filter out failed proposals
    const validProposals = proposals.filter(p => p !== null);
    
    if (validProposals.length === 0) {
      throw new Error("All models failed to respond. Please check your NVIDIA API key and connectivity.");
    }

    // Step 2: Synthesis / Discussion
    const FINAL_DISCUSSION_PROMPT = DISCUSSION_PROMPT
      .replace('{{jobTitle}}', jobPosition ?? '')
      .replace('{{jobDescription}}', jobDescription ?? '')
      .replace('{{duration}}', duration ?? '')
      .replace('{{type}}', Array.isArray(type) ? type.join(', ') : (type ?? ''))
      .replace('{{proposal1}}', prop1 || "No proposal available")
      .replace('{{proposal2}}', prop2 || "No proposal available")
      .replace('{{proposal3}}', "No proposal available"); // Redundant now but kept for prompt consistency

    console.log("-----------------------------------------");
    console.log("Starting Synthesis Phase...");

    // Using Llama 3.3 70B for synthesis - the gold standard for reliable JSON output
    const finalAnswer = await getAICompletion("meta/llama-3.3-70b-instruct", FINAL_DISCUSSION_PROMPT, true, "Lead Interviewer", 60000);

    if (!finalAnswer) {
      console.warn("Synthesis failed, falling back to the best individual proposal.");
      return NextResponse.json({ content: validProposals[0] });
    }

    console.log("-----------------------------------------");
    console.log("Successfully Generated Interview Questions.");
    console.log("-----------------------------------------");

    return NextResponse.json({ content: finalAnswer });

  } catch (error) {
    console.error('Fatal error in interview question flow:', error);
    return NextResponse.json({
      error: 'Generation Failed',
      details: error.message
    }, { status: 500 });
  }
}
