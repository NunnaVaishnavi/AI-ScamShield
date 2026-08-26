# 🛡️ AI-ScamShield

### AI-Powered Scam Message Detection and Risk Analysis System

AI-ScamShield is an AI-powered web application that analyzes suspicious messages and identifies potential scams in real time. It combines **Machine Learning, Natural Language Processing, rule-based indicators, and risk scoring** to provide users with an understandable scam assessment.

The system does more than simply classify a message as **Scam** or **Safe**. It also identifies the **type of scam, risk level, risk score, confidence, warning indicators, and reasons behind the prediction**.

---

## 🌐 Live Demo

### 🚀 AI-ScamShield Web Application

**Live Website:**
https://ai-scamshield-1-dj18.onrender.com/

### 🔗 Backend API

**Flask API:**
https://ai-scamshield-uakm.onrender.com

### 🔍 Prediction Endpoint

```text
POST /predict
```

---

# 📌 Problem Statement

Online scams are becoming increasingly common through SMS, messaging applications, emails, and social media platforms.

Scammers often use techniques such as:

* Urgent payment requests
* Fake banking notifications
* KYC verification threats
* Prize and lottery scams
* Fake job offers
* Investment fraud
* Account suspension threats
* Requests for OTPs, passwords, or sensitive information

Many users find it difficult to determine whether a message is genuine or fraudulent.

Traditional spam filters may only provide a basic classification and often do not explain **why a message is considered suspicious**.

Therefore, there is a need for an intelligent system that can analyze suspicious messages and provide a clear, explainable risk assessment.

---

# 💡 Proposed Solution

AI-ScamShield provides an automated solution for detecting potentially fraudulent messages.

The user enters a message into the web application. The system processes the text using Natural Language Processing and a trained Machine Learning model.

It then combines the ML prediction with scam-related indicators to generate a final risk assessment.

### The system provides:

* 🔎 Scam/Safe prediction
* 📊 Model confidence
* 🚨 Risk level
* 🎯 Risk score
* 🏦 Scam category
* ⚠️ Suspicious indicators
* 💬 Explanation for the prediction

---

# ✨ Key Features

## 🤖 AI-Based Scam Detection

Uses a Machine Learning text-classification model to identify whether a message is likely to be a scam.

## 🧠 NLP-Based Text Analysis

The system converts text messages into numerical features using **TF-IDF vectorization** before passing them to the ML classifier.

## 🚨 Risk Scoring

The system generates a risk score based on the ML prediction and detected suspicious characteristics.

## 🏷️ Scam Category Detection

The application identifies common scam categories such as:

* Banking / KYC Fraud
* Job Scam
* Prize / Lottery Scam
* Investment Scam
* Payment Scam
* Account Suspension Scam
* Other Suspicious Messages

## 🔍 Explainable Results

Instead of only displaying "Scam", the system explains why the message is suspicious.

For example:

> Urgency or pressure to act quickly was detected.

> The message contains a threat of account blocking or suspension.

> The message requests money, payment, or a fee.

## 🌐 Web-Based Interface

Users can analyze messages directly through the browser without installing additional software.

## ☁️ Cloud Deployment

The frontend and backend are deployed online using Render.

---

# 🏗️ System Architecture

```text
                    ┌───────────────────────┐
                    │        USER           │
                    │   Enters a Message    │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   FRONTEND WEB APP    │
                    │                       │
                    │ HTML + CSS + JavaScript│
                    └───────────┬───────────┘
                                │
                                │ POST /predict
                                ▼
                    ┌───────────────────────┐
                    │    FLASK REST API     │
                    │      Python           │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  TEXT PREPROCESSING   │
                    │                       │
                    │ Cleaning & Processing │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │    TF-IDF VECTORIZER  │
                    │                       │
                    │ Text → Numerical Data │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   ML CLASSIFIER       │
                    │                       │
                    │ Logistic Regression   │
                    └───────────┬───────────┘
                                │
                                ▼
              ┌────────────────────────────────────┐
              │       SCAM ANALYSIS ENGINE         │
              │                                    │
              │ • Scam Indicators                  │
              │ • Category Detection               │
              │ • Risk Calculation                 │
              │ • Explanation Generation           │
              └──────────────────┬─────────────────┘
                                 │
                                 ▼
                    ┌───────────────────────┐
                    │     FINAL RESULT      │
                    │                       │
                    │ Prediction            │
                    │ Category              │
                    │ Confidence            │
                    │ Risk Level            │
                    │ Risk Score             │
                    │ Explanation           │
                    └───────────────────────┘
```

---

# 🔄 How It Works

### Step 1 — User Input

The user enters a suspicious message into the AI-ScamShield web interface.

### Step 2 — API Request

The frontend sends the message to the Flask backend using a REST API request.

```text
POST /predict
```

### Step 3 — Text Processing

The backend preprocesses the message before passing it to the Machine Learning model.

### Step 4 — Feature Extraction

The processed message is converted into numerical features using **TF-IDF**.

### Step 5 — Machine Learning Prediction

The trained Logistic Regression model predicts whether the message is likely to be:

```text
SCAM
```

or

```text
SAFE
```

### Step 6 — Scam Indicator Analysis

The system checks for suspicious characteristics such as:

* Urgency
* Threats
* Financial requests
* Account suspension
* Prize claims
* Job registration fees
* Investment promises
* Suspicious requests

### Step 7 — Risk Calculation

The system combines the prediction and detected indicators to calculate an overall risk score.

### Step 8 — Result Generation

The final result is returned to the frontend as structured JSON and displayed to the user.

---

# 🧪 Example

### Input

```text
Your bank account will be blocked today. Pay immediately.
```

### AI-ScamShield Output

```text
Prediction: SCAM

Category: Banking / KYC Fraud

Risk Level: HIGH

Risk Score: 96.46

Confidence: 84.46%

Indicators:
- Urgent
- Account threat
- Financial request
```

### Explanation

```text
- Urgency or pressure to act quickly was detected.
- The message contains a threat of account blocking or suspension.
- The message requests money, payment, or a fee.
```

---

# 🛠️ Technology Stack

## Frontend

* HTML5
* CSS3
* JavaScript

## Backend

* Python
* Flask
* Flask-CORS

## Machine Learning

* Scikit-learn
* TF-IDF Vectorization
* Logistic Regression
* Joblib

## Data Processing

* Pandas
* NumPy
* Regular Expressions

## Deployment

* GitHub
* Render

---

# 📂 Project Structure

```text
AI-ScamShield/
│
├── backend/
│   ├── app.py
│   ├── train_model.py
│   ├── scam_model.pkl
│   ├── dataset.csv
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .gitignore
├── README.md
└── ...
```

---

# 🔌 API Documentation

## Prediction API

### Endpoint

```text
POST /predict
```

### URL

```text
https://ai-scamshield-uakm.onrender.com/predict
```

### Request

```json
{
  "message": "Your bank account will be blocked today. Pay immediately."
}
```

### Response

```json
{
  "category": "Banking / KYC Fraud",
  "confidence": 84.46,
  "explanation": [
    "Urgency or pressure to act quickly was detected.",
    "The message contains a threat of account blocking or suspension.",
    "The message requests money, payment, or a fee."
  ],
  "indicators": [
    "urgent",
    "account threat",
    "financial request"
  ],
  "message": "Your bank account will be blocked today. Pay immediately.",
  "prediction": "scam",
  "risk_level": "HIGH",
  "risk_score": 96.46
}
```

---

# 🚀 Running the Project Locally

## 1. Clone the Repository

```bash
git clone https://github.com/NunnaVaishnavi/AI-ScamShield.git
```

Move into the project:

```bash
cd AI-ScamShield
```

---

## 2. Create a Virtual Environment

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

---

## 3. Install Dependencies

```bash
pip install -r backend/requirements.txt
```

---

## 4. Start the Flask Backend

```bash
cd backend
python app.py
```

The backend will normally run at:

```text
http://127.0.0.1:5000
```

---

## 5. Start the Frontend

Open:

```text
frontend/index.html
```

in a browser.

For local development, make sure the frontend API URL points to your local Flask server.

For production, it points to the deployed Render API.

---

# ☁️ Deployment

AI-ScamShield uses a separate frontend and backend deployment architecture.

### Frontend

```text
Render Static Site
        │
        ▼
https://ai-scamshield-1-dj18.onrender.com
```

### Backend

```text
Render Web Service
        │
        ▼
https://ai-scamshield-uakm.onrender.com
```

The frontend communicates with the backend through the `/predict` REST API.

---

# 🔐 Security Considerations

AI-ScamShield is designed as a scam detection and awareness tool.

The system should not be considered a replacement for:

* Bank security systems
* Government cybercrime services
* Professional fraud investigation
* Official financial institution verification

Users should independently verify suspicious messages through official channels.

Sensitive information such as passwords, OTPs, banking credentials, and private personal information should never be entered into the application.

---

# ⚠️ Limitations

The current version has some limitations:

* Detection quality depends on the training dataset.
* New scam patterns may not always be detected.
* False positives and false negatives are possible.
* The system primarily analyzes the text content of a message.
* URLs are not currently verified against external reputation databases.
* The model may perform differently on languages or writing styles that are underrepresented in the dataset.

---

# 🔮 Future Enhancements

Future versions can include:

### 🌍 Multilingual Scam Detection

Support for Indian languages such as:

* Telugu
* Hindi
* Tamil
* Kannada
* Malayalam

### 🔗 URL Analysis

Automatically inspect URLs contained in suspicious messages using trusted threat-intelligence services.

### 📱 Mobile Application

Develop an Android application that can analyze suspicious SMS and notifications.

### 📩 SMS Integration

Automatically scan incoming SMS messages with appropriate user permissions.

### 🎙️ Voice Scam Detection

Extend the system to analyze suspicious voice calls using speech-to-text and AI.

### 🧠 Advanced Machine Learning

Experiment with advanced NLP models such as:

* BERT
* DistilBERT
* Transformer-based classifiers

### 🔄 Continuous Learning

Allow the model to improve using newly identified scam patterns and user feedback.

---

# 📊 Project Highlights

| Feature        | Implementation        |
| -------------- | --------------------- |
| Scam Detection | Machine Learning      |
| NLP            | TF-IDF                |
| Classifier     | Logistic Regression   |
| Backend        | Flask                 |
| Frontend       | HTML, CSS, JavaScript |
| API            | REST                  |
| Risk Analysis  | Rule-Based + ML       |
| Deployment     | Render                |
| Source Control | GitHub                |

---

# 🎯 Project Objectives

The major objectives of AI-ScamShield are:

1. Detect potentially fraudulent messages automatically.
2. Reduce the difficulty of identifying online scams.
3. Provide understandable explanations for predictions.
4. Categorize different types of scams.
5. Provide a risk level and risk score.
6. Provide an accessible web-based interface.
7. Demonstrate the practical application of AI and NLP in cybersecurity awareness.

---

# 👩‍💻 Author

**Nunna Vaishnavi**

AI-ScamShield — AI-Based Scam Detection and Risk Analysis System

---

# 📜 Disclaimer

AI-ScamShield is an educational and research-oriented project designed to demonstrate the use of Artificial Intelligence and Machine Learning for scam-message detection.

Predictions are probabilistic and may not always be accurate. Users should verify suspicious communications through official sources before taking any financial or security-related action.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**Live Demo:**
https://ai-scamshield-1-dj18.onrender.com

