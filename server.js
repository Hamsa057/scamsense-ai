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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const trustedDomains = [

    "google.com",
    "microsoft.com",
    "apple.com",
    "amazon.com",
    "amazon.in",

    "airtel.in",
    "jio.com",

    "sbi.co.in",
    "onlinesbi.sbi",

    "kotak.com",
    "kotak.bank.in",

    "icicibank.com",
    "hdfcbank.com",

    "axisbank.com",

    "paytm.com",

    "phonepe.com",

    "flipkart.com"

];

function isTrustedURL(message) {

    const match = message.match(/https?:\/\/([^\/]+)/i);

    if (!match) return false;

    const domain = match[1].toLowerCase();

    return trustedDomains.some(d =>
        domain === d || domain.endsWith("." + d)
    );

}

function ruleBasedAnalyzer(message) {

    const text = message.toLowerCase().trim();

    let score = 0;
    const reasons = [];

    for (const domain of trustedDomains) {

        if (text.includes(domain)) {

            return {
                score: 2,
                verdict: "Safe",
                source: "Trusted Domain Database",
                reasons: [
                    "The website belongs to a trusted organization.",
                    "The domain matches the official website.",
                    "No phishing indicators were detected."
                ]
            };

        }

    }


    const isURL = /^https?:\/\//i.test(text);

    if (isURL) {

        score += 10;

        reasons.push("Website URL detected.");

        const riskyDomains = [
            ".xyz",
            ".top",
            ".click",
            ".live",
            ".tk",
            ".cf",
            ".gq",
            ".ml"
        ];

        for (const ext of riskyDomains) {

            if (text.includes(ext)) {

                score += 35;

                reasons.push("Uses a high-risk domain extension.");

                break;

            }

        }

        const fakeBrands = [
            "sbi",
            "icici",
            "hdfc",
            "axis",
            "paypal",
            "google",
            "amazon",
            "microsoft",
            "facebook",
            "instagram"
        ];

        for (const brand of fakeBrands) {

            if (
                text.includes(brand) &&
                !trustedDomains.some(d => text.includes(d))
            ) {

                score += 40;

                reasons.push("Uses a popular brand name in the domain.");

                break;

            }

        }

        const hyphenCount = (text.match(/-/g) || []).length;

        if (hyphenCount >= 2) {

            score += 20;

            reasons.push("Domain contains multiple hyphens.");

        }

        if (/https?:\/\/\d+\.\d+\.\d+\.\d+/i.test(text)) {

            score += 40;

            reasons.push("Uses an IP address instead of a trusted domain.");

        }

        if (/@/.test(text)) {

            score += 30;

            reasons.push("URL contains '@' which can hide the real destination.");

        }

        if (/bit\.ly|tinyurl|t\.co|rb\.gy|shorturl/i.test(text)) {

            score += 25;

            reasons.push("Uses a shortened URL.");

        }

    }

    const rules = [

        {
            keywords: ["urgent","immediately","act now","limited time","hurry"],
            score:20,
            reason:"Creates urgency."
        },

        {
            keywords:["otp","password","pin","cvv","credit card","debit card"],
            score:35,
            reason:"Requests sensitive information."
        },

        {
            keywords:["bank","account blocked","verify account","security alert","suspended"],
            score:25,
            reason:"Pretends to be a trusted organization."
        },

        {
            keywords:["click here","verify now","login","claim now"],
            score:20,
            reason:"Attempts to redirect the user."
        },

        {
            keywords:["winner","lottery","reward","gift","prize"],
            score:20,
            reason:"Uses prize or reward bait."
        },

        {
            keywords:["bitcoin","crypto","wire transfer","gift card"],
            score:20,
            reason:"Requests unusual payment methods."
        }

    ];

    for (const rule of rules) {

        if (rule.keywords.some(k => text.includes(k))) {

            score += rule.score;

            if (!reasons.includes(rule.reason))
                reasons.push(rule.reason);

        }

    }

    score = Math.min(score,100);

    let verdict;

    if(score>=70)
        verdict="Likely Scam";
    else if(score>=30)
        verdict="Suspicious";
    else
        verdict="Safe";

    if(reasons.length===0){

        reasons.push("No common scam indicators were detected.");

    }

    return{
        score,
        verdict,
        reasons,
        source:"Rule-Based Detection"
    };

}


app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "frontend",
            "index.html"
        )
    );
});

app.post("/analyze", async (req, res) => {

    const { message } = req.body;
    const input = message.trim().toLowerCase();

if (/^https?:\/\//.test(input)) {

    return res.json(ruleBasedAnalyzer(input));

}

    if (!message || message.trim() === "") {

        return res.status(400).json({
            error: "Please enter a message."
        });

    }

    if (isTrustedURL(message)) {

        return res.json({
            score: 10,
            verdict: "Safe",
            reasons: [
                "The URL belongs to a well-known trusted organization.",
                "No phishing indicators were detected.",
                "The domain matches an official website."
            ],
            source: "Trusted Domain Database"
        });

    }


    try {

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

const prompt = `
You are a cybersecurity expert specializing in phishing, scam, and fraud detection.

Analyze the following SMS, email, or website URL.

Input:
"${message}"

Scoring Guidelines:

0-20:
Safe.
Official messages, promotional offers, or trusted websites with no phishing indicators.

21-40:
Mostly Safe.
May contain marketing language or promotional content, but no attempt to steal information.

41-69:
Suspicious.
Contains unusual requests, unknown domains, misleading language, or requires verification.

70-100:
Likely Scam.
Contains phishing indicators such as:
- Requests for OTP
- Requests for passwords
- Requests for PIN/CVV
- Threatens account suspension
- Creates false urgency
- Fake prizes or lottery
- Suspicious or misspelled domains
- Impersonates trusted companies
- Shortened URLs hiding destinations

IMPORTANT:

DO NOT classify something as a scam simply because:
- it contains a website link
- it contains an offer
- it mentions a bank
- it is a promotional SMS
- it asks users to visit an official website

Official domains like:
- microsoft.com
- google.com
- apple.com
- amazon.in
- airtel.in
- jio.com
- sbi.co.in
- onlinesbi.sbi
- kotak.com
- kotak.bank.in
should generally be considered SAFE unless there are obvious phishing indicators.

If the message looks like a normal promotional SMS from a known company, give a score below 30.

Return ONLY valid JSON in this format:

{
  "score": 0,
  "reasons": []
}
`;

        const result =
            await model.generateContent(prompt);

        let response =
            result.response.text();

        response = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const match =
            response.match(/\{[\s\S]*\}/);

        if (!match) {

            throw new Error(
                "Invalid AI response."
            );

        }

        const data =
            JSON.parse(match[0]);

        if (data.score >= 70) {
            data.verdict = "Likely Scam";
        }
        else if (data.score >= 30) {
            data.verdict = "Suspicious";
        }
        else {
            data.verdict = "Safe";
        }

        data.source = "Google Gemini AI";

        return res.json(data);

    }

    catch (err) {

        console.log(
            "Gemini unavailable. Switching to Rule-Based Detection."
        );

        console.error(err.message);

        const fallback =
            ruleBasedAnalyzer(message);

        return res.json(fallback);

    }

});

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});