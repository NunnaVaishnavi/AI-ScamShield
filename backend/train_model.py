import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report


# Load dataset
data = pd.read_csv("../dataset/balanced_dataset.csv")

# Remove empty rows
data = data.dropna(subset=["message", "label"])

# Input and output
X = data["message"]
y = data["label"]


# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# Create AI model
model = Pipeline([
    ("tfidf", TfidfVectorizer(
        lowercase=True,
        ngram_range=(1, 2)
    )),
    ("classifier", LogisticRegression(
        max_iter=1000
    ))
])


# Train model
model.fit(X_train, y_train)


# Test model
predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("\n==============================")
print("AI-SCAMSHIELD MODEL RESULTS")
print("==============================")

print(f"\nAccuracy: {accuracy * 100:.2f}%")

print("\nClassification Report:")
print(classification_report(y_test, predictions))


# Save trained model
joblib.dump(model, "../model/scam_model.pkl")

print("\nModel saved successfully as scam_model.pkl")