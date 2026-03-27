const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY,
});

const models = [
  { id: "meta/llama-3.1-8b-instruct", name: "Llama 8B" },
  { id: "mistralai/mistral-7b-instruct-v0.3", name: "Mistral 7B" },
  { id: "google/gemma-2-9b-it", name: "Gemma 9B" },
  { id: "qwen/qwen2.5-7b-instruct", name: "Qwen 7B" },
  { id: "deepseek-ai/deepseek-v3", name: "DeepSeek V3" },
  { id: "meta/llama-3.3-70b-instruct", name: "Lead Interviewer" }
];

async function testModel(model) {
  console.log(`Testing ${model.name} (${model.id})...`);
  try {
    const start = Date.now();
    const completion = await openai.chat.completions.create({
      model: model.id,
      messages: [{ role: "user", content: "Say 'Hello' in JSON format: {\"message\": \"Hello\"}" }],
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
