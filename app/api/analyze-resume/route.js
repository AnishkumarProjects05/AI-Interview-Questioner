import { NextResponse } from 'next/server';

// Mock DOMMatrix on the server to prevent pdfjs-dist/pdf-parse loading errors in Node
if (typeof global.DOMMatrix === 'undefined') {
  global.DOMMatrix = class DOMMatrix {};
}

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
      const { getDocumentProxy, extractText } = await import('unpdf');
      const pdf = await getDocumentProxy(new Uint8Array(buffer));
      const { text } = await extractText(pdf, { mergePages: true });
      resumeText = text || "";
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

    // 2. Configure model and keys (EXACTLY mirroring training.py)
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const googleApiKey = process.env.GOOGLE_API_KEY;

    if (!googleApiKey) {
      return NextResponse.json(
        { error: 'Google API key missing. Please configure GOOGLE_API_KEY in your environment.' },
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

    // 4. Request completion directly from Google Gemini API via native REST fetch (no OpenAI SDK wrapper)
    const apiKeyCleaned = googleApiKey.trim().replace(/^['"]|['"]$/g, '');
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKeyCleaned}`;
    
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: promptTemplate
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.0,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${response.statusText} (${response.status}) - ${errText}`);
    }

    const responseData = await response.json();
    
    if (!responseData.candidates || responseData.candidates.length === 0 || !responseData.candidates[0].content || !responseData.candidates[0].content.parts || responseData.candidates[0].content.parts.length === 0) {
      throw new Error("No response received from the Gemini model.");
    }

    let rawContent = responseData.candidates[0].content.parts[0].text.trim();
    
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
