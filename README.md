# ScamSense AI

ScamSense AI is an AI-powered web application that helps users identify phishing attempts, scam messages, fraudulent emails. Users simply paste a message or email, and the application analyzes it using Google's Gemini AI to estimate the likelihood of a scam and explain the reasoning behind the result.

---

## Features

- AI-powered scam detection using Google Gemini API
- Analyze SMS messages
- Analyze emails
- Scam score (0–100)
- Verdict generation:
  - Safe
  - Suspicious
  - Likely Scam
- Explainable AI with detailed reasons
- Responsive design for desktop and mobile devices
- Simple and user-friendly interface

---

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js

### AI

- Google Gemini API

### Deployment

- Render

### Version Control

- Git & GitHub

---

## Project Structure

```
scamsense-ai/
│
├── frontend/
│   ├── index.html
│   ├── index.css
│   └── index.js
│
├── node_modules/
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/hamsa057/scamsense-ai.git
```

```bash
cd scamsense-ai
```

### Install dependencies

```bash
npm install
```

### Create a `.env` file

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PORT=5000
```

### Start the application

```bash
node server.js
```

Open your browser and visit:

```
http://localhost:5000
```

---

## How It Works

1. Paste an SMS, email, or website URL.
2. Click **Analyze**.
3. The frontend sends the input to the Express backend.
4. The backend securely communicates with the Google Gemini API.
5. Gemini analyzes the content.
6. The application returns:
   - Scam Score
   - Verdict
   - Reasons explaining the analysis
7. Results are displayed in a clean and responsive interface.

---

## Example Analysis

### Input

```
URGENT! Your bank account will be blocked today.
Click here immediately and enter your password and OTP.
```

### Output

**Scam Score**

```
98/100
```

**Verdict**

```
Likely Scam
```

**Reasons**

- Creates false urgency.
- Requests sensitive credentials.
- Banks never ask for OTPs through SMS or email.
- Attempts to pressure the user into immediate action.

---

## Future Improvements

- QR code scam detection
- File attachment analysis
- WhatsApp message analysis
- Browser extension
- Real-time URL reputation checking
- Multi-language support
- Scam reporting dashboard
- User authentication and history
- Dark/Light mode
- Downloadable analysis reports

---

## Environment Variables

Create a `.env` file in the project root.

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PORT=5000
```

---

## API Endpoint

### POST `/analyze`

Analyzes a message or email.

#### Request

```json
{
  "message": "Your text or URL"
}
```

#### Response

```json
{
  "score": 92,
  "verdict": "Likely Scam",
  "reasons": [
    "Creates urgency.",
    "Requests sensitive information.",
    "Uses phishing language."
  ]
}
```

---

## Known Limitations

- AI responses depend on the Google Gemini API.
- Free-tier Gemini API usage is subject to daily request quotas.
- Website URL analysis is based on AI reasoning and does not perform live reputation or malware checks.

---

## Author

**Hamsa Telikicherla**

Built as part of the Creative Showcase Hackathon.
