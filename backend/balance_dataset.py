import pandas as pd

print("================================")
print("BALANCING DATASET")
print("================================")

# Load the original dataset
df = pd.read_csv("../dataset/scam_messages.csv")

print("\nOriginal dataset:")
print(df["label"].value_counts())

# Separate scam and legitimate messages
scam = df[df["label"] == "scam"]
legitimate = df[df["label"] == "legitimate"]

# Find the size of the smaller class
n = min(len(scam), len(legitimate))

# Select equal number of messages
scam_sample = scam.sample(n=n, random_state=42)
legitimate_sample = legitimate.sample(n=n, random_state=42)

# Combine both classes
balanced_df = pd.concat([scam_sample, legitimate_sample])

# Shuffle the rows
balanced_df = balanced_df.sample(
    frac=1,
    random_state=42
).reset_index(drop=True)

# Save the balanced dataset
balanced_df.to_csv(
    "../dataset/balanced_dataset.csv",
    index=False
)

print("\n================================")
print("BALANCED DATASET")
print("================================")

print("Scam messages:", len(scam_sample))
print("Legitimate messages:", len(legitimate_sample))
print("Total messages:", len(balanced_df))

print("\nNew label distribution:")
print(balanced_df["label"].value_counts())

print("\nBalanced dataset saved successfully!")