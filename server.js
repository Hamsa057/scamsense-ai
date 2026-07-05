const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

app.post("/analyze", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({
                error: "Message is required."
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = `
You are a cybersecurity expert.

Analyze the following SMS or email:

"${message}"

Return ONLY valid JSON in this exact format:

{
  "score": 0,
  "verdict": "",
  "reasons": []
}

Rules:
1. score must be a number between 0 and 100.
2. verdict must be exactly one of:
   - Safe
   - Suspicious
   - Likely Scam
3. reasons should contain at most 4 short bullet points.
4. Each reason should be less than 15 words.
5. Do not include markdown.
6. Do not include explanations outside the JSON.
`;

        const result =
            await model.generateContent(prompt);

        const response =
            result.response.text();

        res.send(response);
    }
    catch (err) {

    console.error(err);

    if (err.status === 429) {
        return res.status(429).json({
            error: "Rate limit reached. Please wait a moment and try again."
        });
    }

    res.status(500).json({
        error: "Internal server error."
    });
}
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});