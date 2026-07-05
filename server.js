const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "frontend")));

if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.post("/analyze", async (req, res) => {

    try {

        const { message } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({
                error: "Message cannot be empty."
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = `
You are a cybersecurity expert.

Analyze the following SMS, email or website URL.

"${message}"

Return ONLY valid JSON.

{
  "score": 0,
  "reasons": []
}

Rules:

- Score must be between 0 and 100.
- Score indicates probability of scam.
- Give exactly 3-5 short reasons.
- Return ONLY JSON.
`;

        const result = await model.generateContent(prompt);

        let response = result.response.text();

        response = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const jsonMatch = response.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("AI returned invalid JSON.");
        }

        const data = JSON.parse(jsonMatch[0]);

        if (data.score >= 70) {
            data.verdict = "Likely Scam";
        }
        else if (data.score >= 30) {
            data.verdict = "Suspicious";
        }
        else {
            data.verdict = "Safe";
        }

        res.json(data);

    }
    catch (err) {

        console.error(err);

        if (err.status === 429) {
            return res.status(429).json({
                error: "Gemini API free quota exceeded. Please try again later or use another API key."
            });
        }

        res.status(500).json({
            error: err.message || "Internal server error."
        });

    }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});