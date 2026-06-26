import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function POST(request) {
  const tempDir = os.tmpdir();
  let tempPdfPath = null;
  let tempConfigPath = null;

  try {
    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const formData = await request.formData();
    const file = formData.get('resume');
    const jobDescription = formData.get('jobDescription');

    if (!file || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing resume file or job description.' },
        { status: 400 }
      );
    }

    // Save uploaded PDF file to temp folder
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const safeFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    tempPdfPath = path.join(tempDir, safeFileName);
    fs.writeFileSync(tempPdfPath, buffer);

    // Save job description and PDF path to a temporary JSON configuration file
    // This avoids terminal command-line length limits and shell escaping issues
    const configData = {
      pdfPath: tempPdfPath,
      jobDescription: jobDescription,
    };
    tempConfigPath = path.join(tempDir, `config-${Date.now()}.json`);
    fs.writeFileSync(tempConfigPath, JSON.stringify(configData, null, 2), 'utf-8');

    // Execute the Python script
    const pythonScriptPath = path.join(process.cwd(), 'app', 'api', 'analyze-resume', 'training.py');
    const command = `python "${pythonScriptPath}" "${tempConfigPath}"`;

    console.log(`[API Route] Running command: ${command}`);

    const result = await new Promise((resolve, reject) => {
      exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
          console.error(`[API Route] Exec error:`, error);
          console.error(`[API Route] Stderr:`, stderr);
          reject(new Error(stderr || error.message));
          return;
        }
        resolve(stdout);
      });
    });

    console.log('[API Route] Python output received.');
    
    // Find the JSON block in Python output (in case there's extra print statements)
    const stdoutStr = result.toString();
    const jsonStart = stdoutStr.indexOf('{');
    const jsonEnd = stdoutStr.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('[API Route] Raw Python Output:', stdoutStr);
      throw new Error('Python output did not contain a valid JSON block.');
    }

    const jsonString = stdoutStr.substring(jsonStart, jsonEnd + 1);
    const parsedResult = JSON.parse(jsonString);

    return NextResponse.json(parsedResult);

  } catch (error) {
    console.error('[API Route] Error during resume analysis:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during resume analysis.' },
      { status: 500 }
    );
  } finally {
    // Clean up temporary files
    try {
      if (tempPdfPath && fs.existsSync(tempPdfPath)) {
        fs.unlinkSync(tempPdfPath);
      }
      if (tempConfigPath && fs.existsSync(tempConfigPath)) {
        fs.unlinkSync(tempConfigPath);
      }
    } catch (cleanupError) {
      console.error('[API Route] Failed to clean up temp files:', cleanupError);
    }
  }
}
