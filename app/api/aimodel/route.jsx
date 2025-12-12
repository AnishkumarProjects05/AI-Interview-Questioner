import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { QUESTION_PROMPT } from '@/services/Constant';

export async function POST(request){

    const {jobPosition,jobDescription,duration,type} = await request.json();
    const FINAL_PROMPT = QUESTION_PROMPT
    .replace('{{jobTitle}}',jobPosition ?? '')
    .replace('{{jobDescription}}',jobDescription ?? '')
    .replace('{{duration}}', duration ?? '')
    .replace('{{type}}',Array.isArray(type) ? type.join(', ') : (type ?? ''));

    console.log(FINAL_PROMPT);
    try{
        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPEN_ROUTER_API_KEY,
            
        });
        const completion = await openai.chat.completions.create({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [
              {
                "role": "user",
                "content":FINAL_PROMPT 
              }
            ]
          });
        
          console.log(completion.choices[0].message);
          return NextResponse.json(completion.choices[0].message);
    }
    catch(error){
        console.error('Error:', error);
        return NextResponse.json(error);
    }
}