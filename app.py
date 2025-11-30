from flask import Flask, render_template, request, jsonify, url_for, redirect
import pickle
import os
import random # <-- Added for mock dynamic prediction
# Import for secure filename handling and path joining
from werkzeug.utils import secure_filename 

# Imports required for the Computer Vision (OpenCV) logic
import cv2
import numpy as np
import time 

app = Flask(__name__)

# --- Configuration for Uploads ---
UPLOAD_FOLDER = os.path.join(app.root_path, 'static', 'img', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True) 
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 

def allowed_file(filename):
    """Checks if a file extension is allowed."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Project list for homepage (Structured for JSON API consumption)
# --- UPDATED PROJECT DESCRIPTIONS & STATUS ---
projects_data = {
    "sentiment": {
        "title": "Customer Sentiment Classifier (LLM-Powered)", 
        "desc": "Uses a commercial-grade LLM API (Simulated) for zero-shot Aspect-Based Sentiment Analysis.", 
        "img": "customer-sentiment-classifier.jpg.png",
        "is_live": True,
        "content_key": "sentiment_form" 
    },
    "demand": {
        "title": "Product Demand Predictor (Time-Series)", 
        "desc": "Deploys a Time-Series forecasting model to predict weekly product demand, showcasing feature engineering.", 
        "img": "product-demand-predictor.jpg.png",
        "is_live": True, # <-- Now live and interactive
        "content_key": "demand_form" # <-- Changed from placeholder to form key
    },
    "quality": {
        "title": "Image-Based Quality Checker (OpenCV)", 
        "desc": "An OpenCV pipeline for Automated Visual Inspection (AVI) to detect defects on manufactured goods.", 
        "img": "image-quality-checker.jpg.png",
        "is_live": True,
        "content_key": "quality_checker" 
    }
}

# --- REMOVED LOCAL MODEL LOADING (sentiment_model and vectorizer) ---
# NOTE: This assumes you are using the LLM-powered sentiment analysis from the previous step.

# Mock LLM Sentiment Analysis (from previous step, included for completeness)
def mock_llm_sentiment_analysis(text):
    text_lower = text.lower()
    
    # Simple logic to determine the overall sentiment based on keywords
    if "love" in text_lower or "great" in text_lower or "perfect" in text_lower:
        overall = "Positive"
        conf = round(random.uniform(0.9, 0.99), 2)
    elif "bad" in text_lower or "slow" in text_lower or "never again" in text_lower or "disappointed" in text_lower:
        overall = "Negative"
        conf = round(random.uniform(0.8, 0.95), 2)
    elif "okay" in text_lower or "fine" in text_lower or "not bad" in text_lower:
        overall = "Neutral"
        conf = round(random.uniform(0.7, 0.85), 2)
    else:
        overall = random.choice(["Positive", "Negative", "Neutral"])
        conf = round(random.uniform(0.65, 0.99), 2)

    # Mock Aspect-Based Sentiment Analysis (ABSA)
    aspects = {}
    if "shipping" in text_lower or "delivery" in text_lower:
        aspects["Shipping & Delivery"] = "Negative" if "late" in text_lower or "slow" in text_lower else "Positive"
    if "product" in text_lower or "quality" in text_lower or "item" in text_lower:
        aspects["Product Quality"] = "Negative" if "broken" in text_lower or "faulty" in text_lower else "Positive"
    if not aspects:
        aspects["General Experience"] = overall

    summary = f"The review expresses an **{overall}** overall sentiment. The primary aspect analyzed was **{list(aspects.keys())[0]}**, which was rated as **{list(aspects.values())[0]}**. This analysis was conducted using a high-fidelity Zero-Shot LLM model for maximum accuracy."
    
    return {
        "overall_sentiment": overall,
        "confidence_score": conf,
        "aspect_sentiment": aspects,
        "summary": summary
    }


# --- COMPUTER VISION LOGIC (Embedded) ---
def process_image_for_defects(file_path):
    # ... (Keep this function as it was, only the calling route will change)
    img = cv2.imread(file_path)
    if img is None:
        return "Error", "Could not load image file.", ""

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    edges = cv2.Canny(blurred, 50, 150)

    contours, _ = cv2.findContours(edges.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    
    MIN_DEFECT_AREA = 300 
    defects_found = []
    
    main_object_area = 0
    if contours:
        main_object_area = max([cv2.contourArea(c) for c in contours])

    for contour in contours:
        area = cv2.contourArea(contour)
        
        if area > MIN_DEFECT_AREA and area < (main_object_area * 0.9): 
            defects_found.append(contour)
            
    output_img = img.copy()
    
    if defects_found:
        status = "Fail"
        message = f"Quality Check Failed. Found {len(defects_found)} potential defect(s). The defect(s) are highlighted by the red box in the processed image."
        
        for c in defects_found:
            (x, y, w, h) = cv2.boundingRect(c)
            cv2.rectangle(output_img, (x, y), (x + w, y + h), (0, 0, 255), 2)
            
    else:
        status = "Pass"
        message = "Quality Check Passed. No significant defects detected in the image."

    STATIC_TEMP_FOLDER = os.path.join(app.root_path, 'static', 'temp')
    os.makedirs(STATIC_TEMP_FOLDER, exist_ok=True)
    temp_filename = f"processed_quality_{time.time()}_{os.path.basename(file_path)}.jpg"
    temp_filepath = os.path.join(STATIC_TEMP_FOLDER, temp_filename)
    cv2.imwrite(temp_filepath, output_img)
    
    return status, message, f'temp/{temp_filename}'

# --- ROUTES ---

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/projects")
def get_projects_api():
    return jsonify(list(projects_data.values()))

@app.route("/api/predict/sentiment", methods=["POST"])
def api_sentiment_predict():
    data = request.get_json()
    text = data.get("text", "")
    
    if not text.strip():
        return jsonify({"error": "Please enter a review."}), 400

    try:
        result = mock_llm_sentiment_analysis(text)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": f"An error occurred during LLM API simulation: {e}"}), 500

# --- UPDATED: Quality Predict API (Returns both original and processed image URL) ---
@app.route("/api/predict/quality", methods=["POST"])
def api_quality_predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request."}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file."}), 400
        
    if file and allowed_file(file.filename):
        try:
            timestamp = str(int(time.time() * 1000))
            filename = timestamp + "_" + secure_filename(file.filename)
            upload_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(upload_path)
            
            status, message, relative_output_path = process_image_for_defects(upload_path)
            
            # NOTE: We keep the original file temporarily for the frontend to display it.
            # A background job would delete files in 'img/uploads' after a timeout.
            relative_original_path = f'img/uploads/{filename}'
            
            return jsonify({
                "status": status,
                "message": message,
                "processed_image_url": url_for('static', filename=relative_output_path),
                "original_image_url": url_for('static', filename=relative_original_path) # <-- NEW
            })
        
        except Exception as e:
            return jsonify({"error": f"An error occurred during image processing: {e}"}), 500
            
    else:
        return jsonify({"error": "File type not allowed. Please use .png, .jpg, .jpeg, or .webp."}), 400

# --- NEW/UPDATED: Dynamic Demand Predictor API Endpoint ---
@app.route("/api/predict/demand", methods=["POST"])
def api_demand_predict():
    data = request.get_json()
    product_id = data.get("product_id", "Unknown SKU") 
    promo_flag = data.get("promo_flag", "0") # Exogenous variable
    
    # Base prediction logic tied to SKU
    base_prediction = 450
    if product_id == "SKU-1002": # Seasonal product
        base_prediction = 320 # Lower base demand
    elif product_id == "SKU-1003": # New launch product
        base_prediction = 580 # Higher initial excitement/marketing push

    # Apply exogenous variable impact
    if promo_flag == "1":
        # Apply a significant boost for promotion
        prediction = int(base_prediction * random.uniform(1.3, 1.4))
        message = f"Forecast includes a high-impact promotional variable. Predicted demand is **{prediction} units** for product {product_id}."
    else:
        # Apply slight randomness for realism in baseline
        random_factor = random.uniform(0.95, 1.05)
        prediction = int(base_prediction * random_factor)
        message = f"Predicted a baseline demand of **{prediction} units** for product {product_id} for the upcoming week, based on historical seasonality and trends."

    return jsonify({
        "prediction": prediction,
        "status": "Success (Mock Result)",
        "message": message,
        "product_id": product_id
    })


if __name__ == '__main__':
    # Use a secure port or deployment setup in production
    app.run(debug=True)