const rawResponse = `{
  "interviewQuestions": [
    {
      "question": "What is your experience with React?",
      "type": "Technical"
    },
    {
      "question": "Tell me about a time you failed.",
      "type": "Behavioral"
    }
  ]
}`;

const parseJsonLoose = (text) => {
    try { 
        return JSON.parse(text); 
    } catch (e) { 
        console.log("Direct JSON parse failed, trying regex...");
    }

    const matchList = text.match(/interviewQuestions\s*=\s*(\[[\s\S]*\])/i);
    if (matchList?.[1]) {
        try {
            return JSON.parse(matchList[1]);
        } catch (e) {
            console.log("Regex match parse failed, trying manual slice...");
        }
    }

    const aStart = text.indexOf('[');
    const aEnd = text.lastIndexOf(']');
    if (aStart !== -1 && aEnd > aStart) {
        const arrSlice = text.slice(aStart, aEnd + 1);
        try { 
            const sanitized = arrSlice.replace(/,\s*\]/g, ']');
            return JSON.parse(sanitized); 
        } catch (e) { 
            console.log("Manual slice parse failed.");
        }
    }
    return [];
};

const cleaned = rawResponse.replace(/```json|```/g, '').trim();
const parsed = parseJsonLoose(cleaned);
console.log("Parsed Object:", parsed);

const questions = parsed?.interviewQuestions ?? (Array.isArray(parsed) ? parsed : []);
console.log("Extracted Questions:", questions);

if (questions.length === 2 && questions[0].question === "What is your experience with React?") {
    console.log("✅ TEST PASSED: Successfully extracted questions from new format.");
} else {
    console.log("❌ TEST FAILED: Extraction logic needs adjustment.");
}
