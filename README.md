# ScamSense AI

### Verify Before You Trust.

ScamSense AI is an AI-powered web application that helps users identify suspicious SMS messages and emails. Users simply paste a message, and the system analyzes it using Google's Gemini AI to determine whether it is safe or potentially a scam.

---

## Features

- AI-powered scam detection using Gemini API
- Scam score from 0-100
- Verdict generation:
  - Safe
  - Suspicious
  - Likely Scam
- Explainable AI with reasons for the analysis
- Simple copy-paste interface
- Fully deployed web application

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
- GitHub
- Render

---

## Project Structure

```text
scamsense-ai
│
├── backend
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
│
├── frontend
│   ├── index.html
│   ├── index.css
│   └── index.js
│
└── README.md
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/hamsa057/scamsense-ai.git
cd scamsense-ai
```

### Install dependencies

```bash
cd backend
npm install
```

### Create a `.env` file

```env
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

### Run the backend server

```bash
node server.js
```

### Run the frontend

Open `frontend/index.html` in your browser.

---

## How It Works

1. User pastes an SMS or email.
2. The frontend sends the message to the backend API.
3. Gemini AI analyzes the content.
4. The system returns:
   - Scam Score
   - Verdict
   - Reasons behind the decision.
5. Results are displayed in a simple and user-friendly interface.

---

## Future Improvements

- Fake website URL detection
- Email attachment analysis
- WhatsApp message scanning
- Multi-language support
- Scam history dashboard
- Personalized scam awareness tips

---

## Author

Hamsa Telikicherla

Built for the Creative Showcase Hackathon.

---

## License

This project is licensed under the MIT License.# ScamSense AI
