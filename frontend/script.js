let scanChart = null;
let riskChart = null;


// =========================================
// SCAN MESSAGE
// =========================================

async function scanMessage() {

    const messageInput =
        document.getElementById("message");

    const result =
        document.getElementById("result");

    const loading =
        document.getElementById("loading");

    const scanButton =
        document.getElementById("scanButton");

    const message =
        messageInput.value.trim();


    // =========================================
    // EMPTY MESSAGE
    // =========================================

    if (!message) {

        result.style.display = "block";

        result.className = "result scam";

        result.innerHTML = `
            <h2>⚠️ Message Required</h2>
            <p>
                Please paste a message before starting
                the AI analysis.
            </p>
        `;

        return;
    }


    loading.style.display = "flex";

    result.style.display = "none";

    scanButton.disabled = true;


    try {

        // =========================================
        // SEND MESSAGE TO FLASK
        // =========================================

        const response = await fetch(
            "https://ai-scamshield-uakm.onrender.com//predict",
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


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Server error"
            );
        }


        // =========================================
        // GET AI RESPONSE
        // =========================================

        const prediction =
            data.prediction;

        const confidence =
            data.confidence;

        const risk =
            data.risk_level || "UNKNOWN";

        const riskScore =
            data.risk_score ?? 0;

        const category =
            data.category || "General";

        const indicators =
            Array.isArray(data.indicators)
                ? data.indicators
                : [];

        const explanation =
            Array.isArray(data.explanation)
                ? data.explanation
                : ["No additional explanation available."];


        result.style.display = "block";


        // =========================================
        // SCAM RESULT
        // =========================================

        if (prediction === "scam") {

            result.className =
                "result scam";


            // Select risk class
            let riskClass = "risk-low";

            if (risk === "HIGH") {
                riskClass = "risk-high";
            }
            else if (risk === "MEDIUM") {
                riskClass = "risk-medium";
            }


            // Indicators HTML
            const indicatorsHTML =
                indicators.length > 0

                    ? `
                        <h3>🚨 Suspicious Indicators</h3>

                        <div class="indicator-list">

                            ${indicators.map(
                                item =>
                                `<span class="indicator">
                                    ${escapeHTML(item)}
                                </span>`
                            ).join("")}

                        </div>
                    `

                    : "";


            result.innerHTML = `

                <h2>
                    🔴 THREAT DETECTED
                </h2>

                <p>
                    AI analysis indicates that this message
                    contains patterns associated with scam
                    or fraudulent activity.
                </p>


                <div class="result-details">

                    <div>
                        <strong>Risk Level</strong>

                        <span class="${riskClass}">
                            ${escapeHTML(risk)}
                        </span>
                    </div>


                    <div>
                        <strong>Risk Score</strong>

                        <span>
                            ${escapeHTML(String(riskScore))}/100
                        </span>
                    </div>


                    <div>
                        <strong>Threat Category</strong>

                        <span>
                            ${escapeHTML(category)}
                        </span>
                    </div>


                    <div>
                        <strong>AI Confidence</strong>

                        <span>
                            ${escapeHTML(String(confidence))}%
                        </span>
                    </div>

                </div>


                ${indicatorsHTML}


                <h3>
                    🧠 AI Analysis
                </h3>


                <ul>

                    ${explanation.map(
                        item =>
                        `<li>${escapeHTML(item)}</li>`
                    ).join("")}

                </ul>


                <div class="warning">

                    ⚠️

                    Do not click suspicious links,
                    share OTPs, passwords, PINs,
                    CVVs, or banking information.

                </div>
            `;

        }


        // =========================================
        // LEGITIMATE RESULT
        // =========================================

        else {

            result.className =
                "result legitimate";


            let riskClass = "risk-low";

            if (risk === "HIGH") {
                riskClass = "risk-high";
            }
            else if (risk === "MEDIUM") {
                riskClass = "risk-medium";
            }


            result.innerHTML = `

                <h2>
                    🟢 MESSAGE APPEARS SAFE
                </h2>

                <p>
                    The AI model did not detect strong
                    scam patterns in this message.
                </p>


                <div class="result-details">

                    <div>
                        <strong>Risk Level</strong>

                        <span class="${riskClass}">
                            ${escapeHTML(risk)}
                        </span>
                    </div>


                    <div>
                        <strong>Risk Score</strong>

                        <span>
                            ${escapeHTML(String(riskScore))}/100
                        </span>
                    </div>


                    <div>
                        <strong>Category</strong>

                        <span>
                            ${escapeHTML(category)}
                        </span>
                    </div>


                    <div>
                        <strong>AI Confidence</strong>

                        <span>
                            ${escapeHTML(String(confidence))}%
                        </span>
                    </div>

                </div>


                <h3>
                    🧠 AI Analysis
                </h3>


                <ul>

                    ${explanation.map(
                        item =>
                        `<li>${escapeHTML(item)}</li>`
                    ).join("")}

                </ul>


                <div class="warning">

                    ℹ️ Even legitimate-looking messages
                    should be verified when they request
                    sensitive information.

                </div>
            `;

        }


        // =========================================
        // SAVE TO HISTORY
        // =========================================

        saveToHistory({

            message: message,

            prediction: prediction,

            confidence: confidence,

            risk: risk,

            riskScore: riskScore,

            category: category,

            indicators: indicators,

            explanation: explanation,

            time:
                new Date().toLocaleString()

        });


        // =========================================
        // UPDATE UI
        // =========================================

        updateDashboard();

        displayHistory();

        updateCharts();

    }


    catch (error) {

        result.style.display = "block";

        result.className =
            "result scam";


        result.innerHTML = `

            <h2>
                ❌ AI Engine Unavailable
            </h2>

            <p>
                Could not connect to the ScamShield
                Flask API.
            </p>

            <p>
                Make sure Flask is running at
                <strong>
                    127.0.0.1:5000
                </strong>.
            </p>

        `;

        console.error(error);

    }


    finally {

        loading.style.display = "none";

        scanButton.disabled = false;

    }

}


// =========================================
// EXAMPLE MESSAGE
// =========================================

function useExample(message) {

    const input =
        document.getElementById("message");

    input.value = message;

    updateCharacterCount();

    document
        .getElementById("scanner")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// =========================================
// CHARACTER COUNT
// =========================================

function updateCharacterCount() {

    const input =
        document.getElementById("message");

    const counter =
        document.getElementById("charCount");

    if (counter) {

        counter.textContent =
            input.value.length;

    }

}


// =========================================
// SAVE HISTORY
// =========================================

function saveToHistory(scan) {

    let history =
        JSON.parse(
            localStorage.getItem(
                "scamShieldHistory"
            )
        ) || [];


    history.unshift(scan);


    history =
        history.slice(0, 20);


    localStorage.setItem(
        "scamShieldHistory",
        JSON.stringify(history)
    );

}


// =========================================
// DISPLAY HISTORY
// =========================================

function displayHistory() {

    const historyList =
        document.getElementById(
            "historyList"
        );

    if (!historyList) {
        return;
    }


    let history =
        JSON.parse(
            localStorage.getItem(
                "scamShieldHistory"
            )
        ) || [];


    if (history.length === 0) {

        historyList.innerHTML = `

            <div class="empty-history">

                <div>◷</div>

                <p>
                    No messages analyzed yet.
                </p>

                <small>
                    Your recent scans will appear here.
                </small>

            </div>

        `;

        return;
    }


    historyList.innerHTML =
        history.map(scan => {

            const isScam =
                scan.prediction === "scam";


            const risk =
                scan.risk || "LOW";


            return `

                <div class="history-item">

                    <div class="history-message">

                        <p>
                            ${escapeHTML(
                                scan.message
                            )}
                        </p>


                        <div class="history-date">

                            ${escapeHTML(
                                scan.time
                            )}

                        </div>


                        <div class="history-confidence">

                            Confidence:
                            ${escapeHTML(
                                String(scan.confidence)
                            )}%

                            &nbsp; • &nbsp;

                            ${escapeHTML(
                                scan.category || "General"
                            )}

                            &nbsp; • &nbsp;

                            Risk:
                            ${escapeHTML(risk)}

                        </div>

                    </div>


                    <div class="
                        history-status
                        ${isScam
                            ? "scam"
                            : "legitimate"}
                    ">

                        ${isScam
                            ? "🔴 SCAM"
                            : "🟢 SAFE"}

                    </div>

                </div>

            `;

        }).join("");

}


// =========================================
// DASHBOARD
// =========================================

function updateDashboard() {

    let history =
        JSON.parse(
            localStorage.getItem(
                "scamShieldHistory"
            )
        ) || [];


    const scams =
        history.filter(
            item =>
            item.prediction === "scam"
        ).length;


    const legitimate =
        history.filter(
            item =>
            item.prediction === "legitimate"
        ).length;


    const highRisk =
        history.filter(
            item =>
            item.risk &&
            item.risk.toUpperCase() === "HIGH"
        ).length;


    const mediumRisk =
        history.filter(
            item =>
            item.risk &&
            item.risk.toUpperCase() === "MEDIUM"
        ).length;


    const totalElement =
        document.getElementById(
            "totalScans"
        );

    const scamElement =
        document.getElementById(
            "scamCount"
        );

    const legitimateElement =
        document.getElementById(
            "legitimateCount"
        );

    const highRiskElement =
        document.getElementById(
            "highRiskCount"
        );


    if (totalElement) {

        totalElement.textContent =
            history.length;

    }


    if (scamElement) {

        scamElement.textContent =
            scams;

    }


    if (legitimateElement) {

        legitimateElement.textContent =
            legitimate;

    }


    if (highRiskElement) {

        highRiskElement.textContent =
            highRisk;

    }

}


// =========================================
// CLEAR MESSAGE
// =========================================

function clearMessage() {

    document.getElementById(
        "message"
    ).value = "";


    updateCharacterCount();


    const result =
        document.getElementById(
            "result"
        );


    result.style.display =
        "none";


    result.innerHTML = "";

}


// =========================================
// CLEAR HISTORY
// =========================================

function clearHistory() {

    const confirmation =
        confirm(
            "Clear all ScamShield scan history?"
        );


    if (!confirmation) {

        return;

    }


    localStorage.removeItem(
        "scamShieldHistory"
    );


    displayHistory();

    updateDashboard();

    updateCharts();

}


// =========================================
// ANALYTICS
// =========================================

function updateCharts() {

    if (typeof Chart === "undefined") {

        return;

    }


    let history =
        JSON.parse(
            localStorage.getItem(
                "scamShieldHistory"
            )
        ) || [];


    const scams =
        history.filter(
            item =>
            item.prediction === "scam"
        ).length;


    const legitimate =
        history.filter(
            item =>
            item.prediction === "legitimate"
        ).length;


    const high =
        history.filter(
            item =>
            item.risk &&
            item.risk.toUpperCase() === "HIGH"
        ).length;


    const medium =
        history.filter(
            item =>
            item.risk &&
            item.risk.toUpperCase() === "MEDIUM"
        ).length;


    const low =
        history.filter(
            item =>
            item.risk &&
            item.risk.toUpperCase() === "LOW"
        ).length;


    // =========================================
    // SCAN CHART
    // =========================================

    const scanCanvas =
        document.getElementById(
            "scanChart"
        );


    if (scanCanvas) {

        if (scanChart) {

            scanChart.destroy();

        }


        scanChart =
            new Chart(
                scanCanvas,
                {

                    type: "doughnut",

                    data: {

                        labels: [
                            "Scam",
                            "Legitimate"
                        ],

                        datasets: [{

                            data: [
                                scams,
                                legitimate
                            ],

                            borderWidth: 0

                        }]

                    },

                    options: {

                        responsive: true,

                        cutout: "72%",

                        plugins: {

                            legend: {

                                position:
                                    "bottom",

                                labels: {

                                    color:
                                        "#94a3b8",

                                    font: {
                                        size: 11
                                    }

                                }

                            }

                        }

                    }

                }
            );

    }


    // =========================================
    // RISK CHART
    // =========================================

    const riskCanvas =
        document.getElementById(
            "riskChart"
        );


    if (riskCanvas) {

        if (riskChart) {

            riskChart.destroy();

        }


        riskChart =
            new Chart(
                riskCanvas,
                {

                    type: "bar",

                    data: {

                        labels: [
                            "High",
                            "Medium",
                            "Low"
                        ],

                        datasets: [{

                            data: [
                                high,
                                medium,
                                low
                            ],

                            borderRadius: 6,

                            borderWidth: 0

                        }]

                    },

                    options: {

                        responsive: true,

                        plugins: {

                            legend: {
                                display: false
                            }

                        },

                        scales: {

                            x: {

                                ticks: {
                                    color:
                                        "#94a3b8"
                                },

                                grid: {
                                    display: false
                                }

                            },

                            y: {

                                beginAtZero: true,

                                ticks: {

                                    color:
                                        "#64748b",

                                    stepSize: 1

                                },

                                grid: {

                                    color:
                                        "#1e293b"

                                }

                            }

                        }

                    }

                }
            );

    }

}


// =========================================
// SECURITY
// =========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


// =========================================
// INITIALIZE
// =========================================

window.addEventListener(
    "DOMContentLoaded",
    function () {

        displayHistory();

        updateDashboard();

        updateCharts();

        updateCharacterCount();


        const messageInput =
            document.getElementById(
                "message"
            );


        if (messageInput) {

            messageInput.addEventListener(
                "input",
                updateCharacterCount
            );

        }

    }
);