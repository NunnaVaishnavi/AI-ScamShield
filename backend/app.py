from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
import os

app = Flask(__name__)
CORS(app)

# ============================================================
# LOAD TRAINED AI MODEL
# ============================================================

#model = joblib.load("scam_model.pkl")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = joblib.load(os.path.join(BASE_DIR, "scam_model.pkl"))


# ============================================================
# CATEGORY DETECTION
# ============================================================

def detect_category(message):

    text = message.lower()

    # OTP fraud
    if any(word in text for word in [
        "otp",
        "one time password",
        "verification code",
        "security code"
    ]):
        return "OTP Fraud"

    # Banking / KYC fraud
    if any(word in text for word in [
        "kyc",
        "bank account",
        "bank",
        "credit card",
        "debit card",
        "cvv",
        "pin",
        "account blocked",
        "account will be blocked"
    ]):
        return "Banking / KYC Fraud"

    # UPI / Payment fraud
    if any(word in text for word in [
        "upi",
        "payment",
        "transaction",
        "refund",
        "cashback",
        "send money",
        "transfer money",
        "pay immediately"
    ]):
        return "UPI / Payment Fraud"

    # Lottery / Prize scams
    if any(word in text for word in [
        "lottery",
        "prize",
        "won",
        "winner",
        "reward",
        "claim your prize",
        "lucky winner"
    ]):
        return "Lottery / Prize Scam"

    # Job scams
    if any(word in text for word in [
        "work from home",
        "registration fee",
        "job offer",
        "employment",
        "joining fee",
        "processing fee",
        "job vacancy"
    ]):
        return "Job Scam"

    # Shopping / delivery
    if any(word in text for word in [
        "amazon",
        "flipkart",
        "order",
        "delivery",
        "courier",
        "shipment",
        "package"
    ]):
        return "Shopping / Delivery"

    # Utility scams
    if any(word in text for word in [
        "electricity",
        "power",
        "connection",
        "disconnected",
        "electricity bill"
    ]):
        return "Utility Scam"

    return "General"


# ============================================================
# SUSPICIOUS INDICATORS
# ============================================================

def find_suspicious_indicators(message):

    text = message.lower()

    indicators = []

    suspicious_patterns = {

        "urgent": [
            "urgent",
            "immediately",
            "act now",
            "right now",
            "within 24 hours",
            "last warning"
        ],

        "account threat": [
            "account will be blocked",
            "account blocked",
            "account suspended",
            "account will be suspended",
            "service will be disconnected"
        ],

        "suspicious link": [
            "click this link",
            "click the link",
            "open this link",
            "verify using this link",
            "visit this link"
        ],

        "financial request": [
            "pay",
            "payment",
            "send money",
            "transfer money",
            "registration fee",
            "processing fee",
            "joining fee",
            "security deposit"
        ],

        "OTP request": [
            "otp",
            "one time password",
            "verification code"
        ],

        "KYC request": [
            "kyc",
            "complete kyc",
            "update kyc",
            "verify kyc"
        ],

        "prize / lottery": [
            "lottery",
            "prize",
            "winner",
            "won",
            "reward",
            "claim"
        ],

        "personal information": [
            "cvv",
            "pin",
            "password",
            "bank details",
            "card details",
            "account details"
        ]
    }

    for category, words in suspicious_patterns.items():

        for word in words:

            if word in text:

                if category not in indicators:
                    indicators.append(category)

                break

    # Detect URLs
    url_pattern = r"(https?://\S+|www\.\S+|\b[a-zA-Z0-9-]+\.(com|in|net|org)\b)"

    if re.search(url_pattern, text):

        if "suspicious link" not in indicators:
            indicators.append("suspicious link")

    return indicators


# ============================================================
# RISK SCORE
# ============================================================

def calculate_risk(prediction, confidence, indicators):

    # Legitimate messages are low risk
    if prediction == "legitimate":

        return {
            "level": "LOW",
            "score": round(max(0, 100 - confidence * 0.5), 2)
        }

    # Start with AI confidence
    score = confidence

    # Increase risk when suspicious indicators are found
    score += len(indicators) * 4

    # Limit score to 100
    score = min(score, 100)

    # Risk categories
    if score >= 80:

        level = "HIGH"

    elif score >= 60:

        level = "MEDIUM"

    else:

        level = "LOW"

    return {
        "level": level,
        "score": round(score, 2)
    }


# ============================================================
# EXPLANATION GENERATOR
# ============================================================

def generate_explanation(message, prediction, indicators):

    text = message.lower()

    explanations = []

    if prediction == "legitimate":

        explanations.append(
            "No strong scam indicators were detected."
        )

        if "http://" in text or "https://" in text:

            explanations.append(
                "A link was found, so verify that the sender and website are trusted."
            )

        return explanations

    # Scam detected

    if "urgent" in indicators:

        explanations.append(
            "Urgency or pressure to act quickly was detected."
        )

    if "account threat" in indicators:

        explanations.append(
            "The message contains a threat of account blocking or suspension."
        )

    if "suspicious link" in indicators:

        explanations.append(
            "The message contains or requests a suspicious link."
        )

    if "financial request" in indicators:

        explanations.append(
            "The message requests money, payment, or a fee."
        )

    if "OTP request" in indicators:

        explanations.append(
            "The message requests an OTP or verification code."
        )

    if "KYC request" in indicators:

        explanations.append(
            "The message requests KYC or account verification."
        )

    if "prize / lottery" in indicators:

        explanations.append(
            "The message contains prize, lottery, reward, or winning claims."
        )

    if "personal information" in indicators:

        explanations.append(
            "The message requests sensitive personal or financial information."
        )

    if not explanations:

        explanations.append(
            "The AI model detected patterns associated with suspicious communication."
        )

    return explanations[:5]


# ============================================================
# HOME ROUTE
# ============================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({

        "message": "AI-ScamShield API is running successfully",

        "status": "online",

        "version": "1.0"

    })


# ============================================================
# PREDICTION API
# ============================================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        # ----------------------------------------------------
        # Validate request
        # ----------------------------------------------------

        if not data or "message" not in data:

            return jsonify({

                "error": "Please provide a message"

            }), 400

        message = str(data["message"]).strip()

        if not message:

            return jsonify({

                "error": "Message cannot be empty"

            }), 400

        # ----------------------------------------------------
        # AI prediction
        # ----------------------------------------------------

        prediction = model.predict([message])[0]

        probabilities = model.predict_proba([message])[0]

        confidence = max(probabilities) * 100

        confidence = round(confidence, 2)

        # ----------------------------------------------------
        # Additional analysis
        # ----------------------------------------------------

        category = detect_category(message)

        indicators = find_suspicious_indicators(message)

        risk = calculate_risk(
            prediction,
            confidence,
            indicators
        )

        explanation = generate_explanation(
            message,
            prediction,
            indicators
        )

        # ----------------------------------------------------
        # Final response
        # ----------------------------------------------------

        return jsonify({

            "message": message,

            "prediction": prediction,

            "confidence": confidence,

            "risk_level": risk["level"],

            "risk_score": risk["score"],

            "category": category,

            "indicators": indicators,

            "explanation": explanation

        })

    except Exception as e:

        return jsonify({

            "error": "Prediction failed",

            "details": str(e)

        }), 500


# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=int(os.environ.get("PORT",5000))
    )