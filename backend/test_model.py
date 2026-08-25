import joblib

# Load trained model
model = joblib.load("scam_model.pkl")

print("==============================")
print("AI-SCAMSHIELD MODEL TEST")
print("==============================")

while True:
    message = input("\nEnter a message (or type 'exit' to stop): ")

    if message.lower() == "exit":
        break

    prediction = model.predict([message])[0]

    probabilities = model.predict_proba([message])[0]
    confidence = max(probabilities) * 100

    print("\nPrediction:", prediction.upper())
    print(f"Confidence: {confidence:.2f}%")