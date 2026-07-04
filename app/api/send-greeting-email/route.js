import { NextResponse } from 'next/server';

export async function POST(request) {
  const mailgunApiKey = process.env.MAILGUN_API_KEY;
  const sandboxDomain = process.env.SANDBOX_DOMAIN;

  if (!mailgunApiKey || !sandboxDomain) {
    console.error("Mailgun environment variables are missing.");
    return NextResponse.json(
      { error: "Mailgun configuration is missing on the server." },
      { status: 500 }
    );
  }

  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required." },
        { status: 400 }
      );
    }

    const userName = name || email.split('@')[0];

    // HTML Email Template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to CareerConnect AI</title>
        <style>
          body {
            background-color: #0b0f19;
            color: #e2e8f0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #0f172a;
            border: 1px solid rgba(99, 102, 241, 0.2);
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          }
          .header {
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            padding-bottom: 24px;
            margin-bottom: 24px;
          }
          .logo {
            font-size: 24px;
            font-weight: 900;
            color: #ffffff;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .logo-highlight {
            color: #6366f1;
          }
          h1 {
            color: #ffffff;
            font-size: 22px;
            font-weight: 800;
            margin-top: 0;
            margin-bottom: 16px;
          }
          p {
            color: #94a3b8;
            font-size: 15px;
            line-height: 1.6;
            margin-top: 0;
            margin-bottom: 16px;
          }
          .features {
            background-color: rgba(99, 102, 241, 0.05);
            border: 1px solid rgba(99, 102, 241, 0.1);
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
          }
          .feature-item {
            margin-bottom: 12px;
            font-size: 14px;
          }
          .feature-item:last-child {
            margin-bottom: 0;
          }
          .feature-title {
            color: #818cf8;
            font-weight: 700;
          }
          .btn-container {
            text-align: center;
            margin-top: 32px;
            margin-bottom: 16px;
          }
          .btn {
            background-color: #4f46e5;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 28px;
            font-size: 15px;
            font-weight: 800;
            border-radius: 10px;
            display: inline-block;
            box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
            transition: all 0.3s ease;
          }
          .footer {
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding-top: 24px;
            margin-top: 32px;
            font-size: 11px;
            color: #64748b;
            line-height: 1.5;
          }
          .footer a {
            color: #6366f1;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">CareerConnect <span class="logo-highlight">AI</span></div>
          </div>
          
          <h1>Welcome to the Future of Interview Prep, ${userName}!</h1>
          
          <p>I am absolutely thrilled to welcome you to CareerConnect AI. This platform is engineered to transform standard interview preparation into a high-stakes, realistic simulation using advanced neural intelligence.</p>
          
          <p>Here is what you can leverage right now to start your preparation:</p>
          
          <div class="features">
            <div class="feature-item">
              <span class="feature-title">🎙️ Immersive AI Voice Interview:</span>
              <span style="color: #cbd5e1;"> Experience a live technical round in our Google Meet-style workspace, powered by low-latency natural voice synthesis.</span>
            </div>
            <div class="feature-item">
              <span class="feature-title">📊 Resume & JD Meta Analyzer:</span>
              <span style="color: #cbd5e1;"> Upload your PDF resume or paste a job description to instantly extract skills and assess target compatibility.</span>
            </div>
            <div class="feature-item">
              <span class="feature-title">⚙️ Custom Session Scope:</span>
              <span style="color: #cbd5e1;"> Customise mock interview duration and focus areas (Technical, Behavioral, Coding) based on your needs.</span>
            </div>
          </div>
          
          <div class="btn-container">
            <a href="https://career-connect-ai.vercel.app/dashboard" class="btn">Launch Your Dashboard</a>
          </div>
          
          <p style="font-size: 13px; text-align: center; color: #64748b; margin-top: 24px;">
            Need help? Reach out at <a href="mailto:anishrkumar2k5@gmail.com" style="color: #6366f1; text-decoration: underline;">anishrkumar2k5@gmail.com</a>
          </p>
          
          <div class="footer">
            <p style="margin-bottom: 8px;">"Developed by an Undergraduate and Used by Job Seekers, Graduates, Undergraduates"</p>
            <p>&copy; ${new Date().getFullYear()} CareerConnect AI. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Construct Mailgun endpoint & request params
    const endpoint = `https://api.mailgun.net/v3/${sandboxDomain}/messages`;
    const authString = Buffer.from(`api:${mailgunApiKey}`).toString('base64');

    const formData = new URLSearchParams();
    formData.append('from', `CareerConnect AI <postmaster@${sandboxDomain}>`);
    formData.append('to', email);
    formData.append('subject', 'Welcome to CareerConnect AI!');
    formData.append('html', htmlContent);
    formData.append('text', `Hi ${userName},\n\nWelcome to CareerConnect AI!\n\nAccess your dashboard here: https://career-connect-ai.vercel.app/dashboard\n\nDeveloped by an Undergraduate and Used by Job Seekers, Graduates, Undergraduates.`);

    console.log(`[Mailgun] Attempting to send greeting email to: ${email}`);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    const responseData = await res.text();

    if (!res.ok) {
      console.error(`[Mailgun Error] Failed to send email. Status: ${res.status}. Response: ${responseData}`);
      return NextResponse.json(
        { 
          success: false, 
          error: `Mailgun API returned error status ${res.status}`, 
          details: responseData 
        },
        { status: res.status }
      );
    }

    console.log(`[Mailgun Success] Email sent successfully. Response: ${responseData}`);
    return NextResponse.json({ success: true, message: "Welcome email sent successfully." });

  } catch (err) {
    console.error(`[Mailgun Exception] Exception occurred while sending email:`, err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
