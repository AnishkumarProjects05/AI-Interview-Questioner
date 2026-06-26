import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume');
    const jobDescription = formData.get('jobDescription');

    if (!file || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing resume file or job description.' },
        { status: 400 }
      );
    }

    // 1. Read PDF file into buffer and extract text in-memory
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let resumeText = "";
    try {
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
      const data = new Uint8Array(buffer);
      const pdfFile = await pdfjs.getDocument({ data }).promise;
      for (let i = 1; i <= pdfFile.numPages; i++) {
        const page = await pdfFile.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        resumeText += pageText + "\n";
      }
      resumeText = resumeText.trim();
    } catch (pdfError) {
      console.error("PDF parsing error:", pdfError);
      return NextResponse.json(
        { error: `Failed to parse PDF resume: ${pdfError.message}` },
        { status: 500 }
      );
    }

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Could not extract any text content from the uploaded resume.' },
        { status: 400 }
      );
    }

    // 2. Configure OpenAI client (fallback from OpenRouter to Google Gemini API compatibility)
    let openai;
    let modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const openRouterApiKey = process.env.OPEN_ROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
    const googleApiKey = process.env.GOOGLE_API_KEY;

    if (openRouterApiKey) {
      openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: openRouterApiKey.trim().replace(/^['"]|['"]$/g, ''),
        defaultHeaders: {
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "CareerConnect AI",
        },
      });
      // Prepend google/ for OpenRouter if not already present
      if (!modelName.includes("/")) {
        modelName = "google/" + modelName;
      }
    } else if (googleApiKey) {
      // Use direct Gemini API (OpenAI compatibility layer)
      openai = new OpenAI({
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
        apiKey: googleApiKey.trim().replace(/^['"]|['"]$/g, ''),
      });
    } else {
      return NextResponse.json(
        { error: 'AI provider API key missing. Please configure OPEN_ROUTER_API_KEY or GOOGLE_API_KEY in your environment.' },
        { status: 500 }
      );
    }

    // 3. Build Prompt Template (EXACTLY mirroring training.py)
    const promptTemplate = `
    You are an expert technical recruiter analyzing a target Job Description against a specific candidate's resume.
    
    Job Description:
    ${jobDescription}
    
    Candidate Resume:
    ${resumeText}
    
    Perform a strict, realistic skill evaluation based ONLY on the provided resume.
    Calculate an accurate skill match percentage (0-100) based on how well their skills, experience, and tools align with the requirements.
    
    You must output a clean, valid JSON object with exactly the following structure:
    {
        "candidate_name": "Extract candidate name if present, else use Unknown",
        "skill_match_percentage": 85,
        "matched_skills": ["skill1", "skill2"],
        "missing_skills": ["skill3"],
        "justification": "A brief sentence explaining the percentage evaluation score."
    }
    `;

    // 4. Request completion with temperature 0.0 and JSON response format (EXACTLY mirroring training.py)
    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: [{ role: "user", content: promptTemplate }],
      temperature: 0.0,
      response_format: { type: "json_object" }
    });

    let rawContent = completion.choices[0].message.content.trim();
    
    // CLEANUP: Strip out markdown formatting if the model accidentally includes it (EXACTLY mirroring training.py)
    if (rawContent.startsWith("```json")) {
      rawContent = rawContent.substring(7);
    } else if (rawContent.startsWith("```")) {
      rawContent = rawContent.substring(3);
    }
    if (rawContent.endsWith("```")) {
      rawContent = rawContent.substring(0, rawContent.length - 3);
    }
    rawContent = rawContent.trim();

    const parsedResult = JSON.parse(rawContent);
    return NextResponse.json(parsedResult);

  } catch (error) {
    console.error('[API Route] Error during resume analysis:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during resume analysis.' },
      { status: 500 }
    );
  }
}
