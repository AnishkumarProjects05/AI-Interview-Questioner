require("dotenv").config();
const axios = require("axios");

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error("❌ OPENROUTER_API_KEY not found in .env file");
  process.exit(1);
}

async function testOpenRouter() {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/free",
        messages: [
          {
            role: "user",
            content: "Say API key is working",
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ OpenRouter API key is working");
    console.log(response.data.choices[0].message.content);
  } catch (error) {
    console.error("❌ OpenRouter API key test failed");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Error:", error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testOpenRouter();