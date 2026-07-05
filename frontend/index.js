const analyzeBtn = document.getElementById("analyze-btn");
const messageInput = document.getElementById("message-input");
const resultCard = document.getElementById("result-card");

const score = document.getElementById("score");
const verdict = document.getElementById("verdict");
const reasonsList = document.getElementById("reasons-list");
const errorMessage = document.getElementById("error-message");

analyzeBtn.addEventListener("click", async function () {
    const message = messageInput.value.trim();

    if (message === "") {
        errorMessage.innerText =
            "Please paste an SMS or email first.";
        return;
    }

    errorMessage.innerText = "";

    analyzeBtn.innerText = "Analyzing...";
    analyzeBtn.disabled = true;

 try {
    const response = await fetch(
        "http://localhost:5000/analyze",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        }
    );

    const data = await response.json();

    // Handle backend errors (429, 500, etc.)
    if (!response.ok) {
        errorMessage.innerText = data.error || "Something went wrong.";
        return;
    }

    // Validate AI response
    if (
        typeof data.score !== "number" ||
        !Array.isArray(data.reasons)
    ) {
        errorMessage.innerText = "Invalid response received from AI.";
        return;
    }

    resultCard.hidden = false;

    score.innerText = `${data.score}/100`;
    verdict.innerText = data.verdict;

    let html = "";

    for (const reason of data.reasons) {
        html += `<li>${reason}</li>`;
    }

    reasonsList.innerHTML = html;

    // Score color
    if (data.score >= 70) {
        score.style.color = "#ef4444";
    }
    else if (data.score >= 30) {
        score.style.color = "#f59e0b";
    }
    else {
        score.style.color = "#22c55e";
    }

    // Verdict color
    if (data.verdict === "Likely Scam") {
        verdict.style.color = "#ef4444";
    }
    else if (data.verdict === "Suspicious") {
        verdict.style.color = "#f59e0b";
    }
    else {
        verdict.style.color = "#22c55e";
    }
}
catch (err) {
    console.error(err);
    errorMessage.innerText =
        "Unable to connect to the server.";
}
finally {
    analyzeBtn.innerText = "Analyze Message";
    analyzeBtn.disabled = false;
}
});