import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { QUESTION_PROMPT } from '@/services/Constant';

export async function POST(request) {

  const { jobPosition, jobDescription, duration, type } = await request.json();
  const FINAL_PROMPT = QUESTION_PROMPT
    .replace('{{jobTitle}}', jobPosition ?? '')
    .replace('{{jobDescription}}', jobDescription ?? '')
    .replace('{{duration}}', duration ?? '')
    .replace('{{type}}', Array.isArray(type) ? type.join(', ') : (type ?? ''));

  console.log(FINAL_PROMPT);
  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPEN_ROUTER_API_KEY,
    });

    let completion;
    let retries = 3;
    let delay = 1000;

    while (retries > 0) {
      try {
        completion = await openai.chat.completions.create({
          model: "meta-llama/llama-3.3-70b-instruct",
          messages: [
            {
              "role": "user",
              "content": FINAL_PROMPT
            }
          ]
        });
        break; // Success
      } catch (error) {
        if (error.status === 429 && retries > 1) {
          console.log(`Rate limit hit. Retrying in ${delay}ms... (${retries - 1} retries left)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retries--;
          delay *= 2; // Exponential backoff
        } else {
          throw error;
        }
      }
    }

    console.log(completion.choices[0].message);
    return NextResponse.json(completion.choices[0].message);
  }
  catch (error) {
    console.error('Error detail:', error);

    if (error.status === 429) {
      return NextResponse.json({
        error: 'Rate limit reached. The AI provider is busy.',
        status: 429
      }, { status: 429 });
    }

    if (error.status === 402) {
      return NextResponse.json({
        error: 'Payment Required: This model requires credits or is currently unavailable in the free tier.',
        status: 402
      }, { status: 402 });
    }

    return NextResponse.json({
      error: 'Failed to generate questions. Please try again.',
      details: error.message
    }, { status: error.status || 500 });
  }
}