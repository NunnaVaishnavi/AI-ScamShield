import pandas as pd
from pathlib import Path

# Find the main project folder
BASE_DIR = Path(__file__).resolve().parent.parent

# Dataset location
DATASET_PATH = BASE_DIR / "dataset" / "scam_messages.csv"

# Read CSV
data = pd.read_csv(DATASET_PATH)

print("================================")
print("DATASET CHECK")
print("================================")

print("Dataset loaded successfully!")

print("\nNumber of rows:", len(data))

print("\nColumn names:")
print(data.columns.tolist())

print("\nFirst 5 records:")
print(data.head())

print("\nLabel distribution:")
print(data["label"].value_counts())

print("\nMissing values:")
print(data.isnull().sum())