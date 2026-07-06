const analyzeBtn = document.getElementById("analyze-btn");
const messageInput = document.getElementById("message-input");
const resultCard = document.getElementById("result-card");

const score = document.getElementById("score");
const verdict = document.getElementById("verdict");
const source = document.getElementById("source");

const reasonsList = document.getElementById("reasons-list");
const errorMessage = document.getElementById("error-message");

analyzeBtn.addEventListener("click", async () => {

    const message = messageInput.value.trim();

    if (message === "") {
        errorMessage.innerText =
            "Please enter an SMS, email, or website URL.";

        resultCard.hidden = true;
        return;
    }

    errorMessage.innerText = "";

    analyzeBtn.disabled = true;
    analyzeBtn.innerText = "Analyzing...";

    try {

        const response = await fetch("/analyze", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });

        const data = await response.json();

        if (!response.ok) {

            errorMessage.innerText =
                data.error || "Something went wrong.";

            resultCard.hidden = true;
            return;
        }

        resultCard.hidden = false;

        score.innerText = `${data.score}/100`;
        verdict.innerText = data.verdict;

        source.innerText =
            data.source || "Google Gemini AI";

        reasonsList.innerHTML = "";

        data.reasons.forEach(reason => {

            const li = document.createElement("li");
            li.innerText = reason;

            reasonsList.appendChild(li);

        });

        if (data.score >= 70) {

            score.style.color = "#ef4444";

        }
        else if (data.score >= 30) {

            score.style.color = "#f59e0b";

        }
        else {

            score.style.color = "#22c55e";

        }

        if (data.verdict === "Likely Scam") {

            verdict.style.color = "#ef4444";

        }
        else if (data.verdict === "Suspicious") {

            verdict.style.color = "#f59e0b";

        }
        else {

            verdict.style.color = "#22c55e";

        }

        if (data.source === "Google Gemini AI") {

            source.style.color = "#3b82f6";

        }
        else {

            source.style.color = "#a855f7";

        }

    }
    catch (err) {

        console.error(err);

        resultCard.hidden = true;

        errorMessage.innerText =
            "Unable to connect to the server.";

    }
    finally {

        analyzeBtn.disabled = false;
        analyzeBtn.innerText = "Analyze";

    }

});