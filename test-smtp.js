const fs = require('fs');

// Load environment variables from .env or .env.local
try {
  if (fs.existsSync('.env.local')) {
    require('dotenv').config({ path: '.env.local' });
  } else {
    require('dotenv').config();
  }
} catch (err) {
  console.warn("⚠️ Warning: dotenv package not found, using raw process.env values.");
}

const mailgunApiKey = process.env.MAILGUN_API_KEY;
const sandboxDomain = process.env.SANDBOX_DOMAIN;

const recipientEmail = process.argv[2];
const testType = process.argv[3] || 'direct'; // 'direct' or 'api'

if (!recipientEmail) {
  console.log(`
🚀 CareerConnect AI Welcome Email Tester
=========================================

This script helps you test sending the welcome greeting email when a user logs in.

Usage:
  node test-smtp.js <recipient-email> [type]

Arguments:
  <recipient-email>  The email address to send the test email to.
  [type]             Optional. Either 'direct' or 'api' (default: 'direct').
                     - 'direct': Sends directly to Mailgun using env credentials.
                     - 'api': Sends by calling the local Next.js API route (http://localhost:3000/api/send-greeting-email).

Examples:
  1. Test Mailgun credentials directly:
     node test-smtp.js your-email@example.com direct

  2. Test local Next.js endpoint (ensure 'npm run dev' is running):
     node test-smtp.js your-email@example.com api

💡 Mailgun Sandbox Domain Reminder:
If you are using a Mailgun Sandbox domain (e.g. sandbox*.mailgun.org), you can ONLY send emails to:
  - The email address used to register the Mailgun account.
  - Or email addresses added to the "Authorized Recipients" list in your Mailgun Dashboard and verified.
`);
  process.exit(0);
}

const userName = recipientEmail.split('@')[0];

if (testType === 'api') {
  // Option 2: Test by calling the local API route
  testLocalApi();
} else {
  // Option 1: Test Mailgun directly
  testMailgunDirectly();
}

// -------------------------------------------------------------
// Test 1: Direct Mailgun API Integration
// -------------------------------------------------------------
async function testMailgunDirectly() {
  console.log("\n--- Testing Mailgun Direct Integration ---");
  if (!mailgunApiKey || !sandboxDomain) {
    console.error("❌ Error: MAILGUN_API_KEY or SANDBOX_DOMAIN is missing in environment variables.");
    console.error("Please check your .env or .env.local file.");
    process.exit(1);
  }

  // Same HTML template used in route.js
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to CareerConnect AI</title>
      <style>
        body { background-color: #0b0f19; color: #e2e8f0; font-family: sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 20px auto; background-color: #0f172a; border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 16px; padding: 40px; }
        h1 { color: #ffffff; font-size: 22px; }
        p { color: #94a3b8; font-size: 15px; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to the Future of Interview Prep, ${userName}! (Direct Test)</h1>
        <p>This is a test greeting email sent directly using your Mailgun API keys to verify configuration.</p>
        <p>&copy; ${new Date().getFullYear()} CareerConnect AI. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const endpoint = `https://api.mailgun.net/v3/${sandboxDomain}/messages`;
  const authString = Buffer.from(`api:${mailgunApiKey}`).toString('base64');

  const formData = new URLSearchParams();
  formData.append('from', `CareerConnect AI Test <postmaster@${sandboxDomain}>`);
  formData.append('to', recipientEmail);
  formData.append('subject', 'Test Welcome to CareerConnect AI! (Direct)');
  formData.append('html', htmlContent);
  formData.append('text', `Hi ${userName},\n\nThis is a direct Mailgun credentials test email from CareerConnect AI.`);

  console.log(`[Mailgun] Attempting to send greeting email via endpoint: ${endpoint}`);
  console.log(`[Mailgun] Recipient: ${recipientEmail}`);

  try {
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
      console.error(`\n❌ [Mailgun Error] Failed to send email. Status: ${res.status}`);
      console.error(`Response details: ${responseData}`);
      console.error("\n💡 Sandbox Tip: Verify if you are using an Authorized Recipient email address.");
      process.exit(1);
    }

    console.log(`\n✅ [Mailgun Success] Email sent successfully!`);
    console.log(`Response: ${responseData}`);
  } catch (err) {
    console.error(`\n❌ [Mailgun Exception] Exception occurred while sending:`, err);
    process.exit(1);
  }
}

// -------------------------------------------------------------
// Test 2: Local Next.js API Endpoint
// -------------------------------------------------------------
async function testLocalApi() {
  console.log("\n--- Testing Local Next.js API Route ---");
  const localUrl = 'http://localhost:3000/api/send-greeting-email';
  console.log(`Sending POST request to: ${localUrl}`);
  console.log(`Payload: { email: "${recipientEmail}", name: "${userName}" }`);

  try {
    const res = await fetch(localUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: recipientEmail,
        name: userName
      })
    });

    const responseJson = await res.json().catch(() => null);

    if (!res.ok) {
      console.error(`\n❌ [API Error] Local API returned status ${res.status}`);
      console.error(`Response payload:`, responseJson || "Not a valid JSON response");
      console.error("\n💡 Dev Tip: Make sure your Next.js local server is running with 'npm run dev' on port 3000.");
      process.exit(1);
    }

    console.log(`\n✅ [API Success] API returned successful response:`, responseJson);
  } catch (err) {
    console.error(`\n❌ [Connection Error] Could not connect to the local server.`);
    console.error(`Error details: ${err.message}`);
    console.error("\n💡 Dev Tip: Please run 'npm run dev' first so the server is listening at http://localhost:3000.");
    process.exit(1);
  }
}
