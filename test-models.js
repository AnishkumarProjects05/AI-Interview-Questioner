const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY || process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "CareerConnect AI",
  }
});

const models = [
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash" },
  { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B" },
  { id: "deepseek/deepseek-chat", name: "DeepSeek Chat" }
];

async function testModel(model) {
  console.log(`Testing ${model.name} (${model.id})...`);
  try {
    const start = Date.now();
    const completion = await openai.chat.completions.create({
      model: model.id,
      messages: [{ role: "user", content: "Say 'Hello' in JSON format: {\"message\": \"Hello\"}" }],
      max_tokens: 100,
      response_format: { type: "json_object" }
    });
    const duration = Date.now() - start;
    console.log(`✅ ${model.name} responded in ${duration}ms:`, completion.choices[0].message.content);
    return { success: true, duration };
  } catch (error) {
    console.error(`❌ ${model.name} failed:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  const results = {};
  for (const model of models) {
    results[model.name] = await testModel(model);
  }
  console.log("\nSummary:");
  console.table(results);
}

runTests();
