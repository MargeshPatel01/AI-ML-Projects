
#!/bin/bash

# Navigate to your main folder
#cd ~/OneDrive\ -\ techwithnvda/Desktop/MargeshGithubRepo

# Create main folders
mkdir -p templates/projects
mkdir -p static/css static/js static/img
mkdir -p projects/customer-sentiment-classifier/model
mkdir -p projects/product-demand-predictor
mkdir -p projects/image-quality-checker

# Create essential files
touch app.py
touch templates/layout.html
touch templates/index.html
touch templates/projects/sentiment.html
touch templates/projects/demand.html
touch templates/projects/quality.html
touch static/css/style.css
touch static/js/script.js
touch projects/customer-sentiment-classifier/logic.py
touch projects/customer-sentiment-classifier/README.md
touch projects/product-demand-predictor/README.md
touch projects/image-quality-checker/README.md

# Add placeholder text to files
echo "<!-- Base layout for portfolio -->" > templates/layout.html
echo "<!-- Portfolio landing page -->" > templates/index.html
echo "<!-- Sentiment project page -->" > templates/projects/sentiment.html
echo "<!-- Demand predictor placeholder -->" > templates/projects/demand.html
echo "<!-- Quality checker placeholder -->" > templates/projects/quality.html
echo "/* Custom styles */" > static/css/style.css
echo "// Custom JS" > static/js/script.js
echo "# Logic for Customer Sentiment Classifier" > projects/customer-sentiment-classifier/logic.py
echo "# Customer Sentiment Classifier Project" > projects/customer-sentiment-classifier/README.md
echo "# Product Demand Predictor Project" > projects/product-demand-predictor/README.md
echo "# Image-Based Quality Checker Project" > projects/image-quality-checker/README.md

# Confirm structure
echo "✅ Portfolio structure created successfully!"
