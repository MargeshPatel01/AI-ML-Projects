import pandas as pd
import re
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle

# Load dataset
data = pd.read_csv('../data/sample_reviews.csv')

# Text cleaning function
def clean_text(text):
    text = text.lower()  # lowercase
    text = re.sub(r'[^a-zA-Z\s]', '', text)  # remove punctuation/numbers
    return text

# Apply cleaning
data['clean_text'] = data['review_text'].apply(clean_text)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    data['clean_text'], data['sentiment'], test_size=0.2, random_state=42
)

# TF-IDF vectorization
vectorizer = TfidfVectorizer()
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# Save vectorizer and datasets
pickle.dump(vectorizer, open('../data/vectorizer.pkl', 'wb'))
pickle.dump((X_train_tfidf, X_test_tfidf, y_train, y_test), open('../data/data_splits.pkl', 'wb'))

print("Preprocessing complete! Data and vectorizer saved in data/ folder.")
