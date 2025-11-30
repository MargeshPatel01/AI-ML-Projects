import cv2
import numpy as np
import os
from flask import current_app

def process_image_for_defects(image_path):
    """
    Detects potential defects in an image using basic edge detection.
    
    Args:
        image_path (str): The path to the uploaded image.

    Returns:
        tuple: (status, message, output_image_relative_url)
               status: 'Pass' or 'Fail'
               message: A description of the finding.
               output_image_relative_url: URL to the processed image file.
    """
    
    # 1. Load the image
    img = cv2.imread(image_path)
    if img is None:
        return ('Fail', 'Error: Could not load image.', None)

    # Define parameters for defect detection (can be tuned)
    MIN_DEFECT_AREA = 50  # Minimum size of an 'edge' cluster to be considered a defect
    CANNY_LOWER = 100
    CANNY_UPPER = 200

    # 2. Pre-processing: Convert to grayscale and blur
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # 3. Edge detection
    edges = cv2.Canny(blurred, CANNY_LOWER, CANNY_UPPER)

    # 4. Find contours of the edges
    # Use RETR_EXTERNAL to find only the outermost contours
    contours, _ = cv2.findContours(edges.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Initialize defect count and a copy for drawing
    defect_count = 0
    img_with_defects = img.copy()

    # 5. Analyze contours
    for contour in contours:
        area = cv2.contourArea(contour)
        
        # Check if the area is above the threshold (potential defect)
        if area > MIN_DEFECT_AREA:
            # Draw a bounding box and text around the potential defect
            (x, y, w, h) = cv2.boundingRect(contour)
            cv2.rectangle(img_with_defects, (x, y), (x + w, y + h), (0, 0, 255), 3) # Red rectangle
            cv2.putText(img_with_defects, 'DEFECT', (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            defect_count += 1
            
    # 6. Determine overall status
    if defect_count > 0:
        status = 'Fail'
        message = f"Quality Check Failed. Found {defect_count} potential defects."
    else:
        status = 'Pass'
        message = "Quality Check Passed. No significant defects detected."

    # 7. Save the output image with annotations
    # Create a unique filename for the output image
    base_name = os.path.basename(image_path)
    name, ext = os.path.splitext(base_name)
    output_filename = f"processed_{name}.jpg"
    
    # Define the save path (relative to static/img)
    output_image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], 'processed', output_filename)
    # Ensure the output directory exists
    os.makedirs(os.path.dirname(output_image_path), exist_ok=True)
    
    # Save the annotated image
    cv2.imwrite(output_image_path, img_with_defects)
    
    # Return the relative URL for the web (e.g., /static/img/processed/processed_myimage.jpg)
    relative_url = os.path.join('img', 'processed', output_filename).replace('\\', '/')

    return (status, message, relative_url)