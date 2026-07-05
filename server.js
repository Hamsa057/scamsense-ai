const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "frontend")));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Analyze endpoint
app.post("/analyze", async (req, res) => {
    try {

        const { message } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = `
You are a cybersecurity expert.

Analyze the following SMS, email or website URL.

"${message}"

Return ONLY valid JSON in this format:

{
  "score": 0,
  "reasons": []
}

Rules:

- Score = probability that it is a scam.
- Integer from 0 to 100.
- 0 = completely safe.
- 100 = definitely scam.
- Give 3-5 short reasons.
- Return ONLY JSON.
`;

        const result = await model.generateContent(prompt);

        let response = result.response.text();

        response = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const data = JSON.parse(response);

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
                error: "Rate limit reached. Please try again later."
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
