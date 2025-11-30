// --- CORE SPA APPLICATION LOGIC ---

const mainContent = document.getElementById('main-content-area');

// 1. PROJECT DATA FETCHING
async function fetchProjects() {
    mainContent.innerHTML = `<div class="text-center p-5"><span class="spinner-border text-info"></span> Loading Project Data...</div>`;
    try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Network response was not ok');
        const projects = await response.json();
        renderProjectDashboard(projects);
    } catch (error) {
        mainContent.innerHTML = `<div class="alert alert-danger">System Error: Failed to load project data. Please check Flask server status. ${error.message}</div>`;
    }
}

// 2. RENDERING THE MAIN DASHBOARD
function renderProjectDashboard(projects) {
    let projectCardsHTML = projects.map(project => `
        <div class="col">
            <div class="project-item card h-100 border-0 shadow-lg rounded-4" data-project-key="${project.content_key}">
                <div class="image-container">
                    <img src="/static/img/${project.img}" class="card-img-top project-img" alt="${project.title}">
                    <div class="status-overlay ${project.is_live ? 'bg-success' : 'bg-secondary'}">
                        ${project.is_live ? '<i class="fa-solid fa-bolt"></i> LIVE DEMO' : '<i class="fa-solid fa-hourglass-half"></i> COMING SOON'}
                    </div>
                </div>
                <div class="card-body d-flex flex-column p-4">
                    <h5 class="card-title fw-bold">${project.title}</h5>
                    <p class="card-text small text-secondary">${project.desc}</p>
                    <div class="mt-auto pt-3 border-top border-secondary">
                        <button class="btn w-100 launch-btn ${project.is_live ? 'btn-primary' : 'btn-secondary'}" data-project-key="${project.content_key}" ${!project.is_live ? 'disabled' : ''}>
                            ${project.is_live ? 'ACCESS APPLICATION <i class="fa-solid fa-arrow-right-long"></i>' : 'ACCESS PENDING'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    mainContent.innerHTML = `
        <section class="hero-section text-center py-5 mb-5 rounded-3 shadow-lg" id="home-section">
            <div class="py-5">
                <span class="badge mb-3 fs-6 fw-normal feature-pill accent">PROFESSIONAL MACHINE LEARNING PORTFOLIO</span>
                <h1 class="display-3 fw-bolder mb-3 text-white">Functional AI Deployments Showcase</h1>
                <p class="lead mx-auto mb-4 text-secondary" style="max-width: 800px;">
                    This application demonstrates my ability to build, train, and deploy **end-to-end ML solutions** as functional microservices using Python, Flask, and modern frontend technologies.
                </p>
                <button class="btn btn-primary btn-lg mt-3 project-explore-btn" onclick="scrollToProjects()">
                    EXPLORE PROJECTS <i class="fa-solid fa-angles-down"></i>
                </button>
            </div>
        </section>
        
        <section class="py-5" id="projects-section">
            <h3 class="text-center display-6 fw-bold mb-5 text-white">Functional Project Demonstrations</h3>
            <div class="row row-cols-1 row-cols-md-3 g-4 project-grid">${projectCardsHTML}</div>
        </section>
    `;

    document.querySelectorAll('.launch-btn').forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', (e) => {
                const projectKey = e.target.getAttribute('data-project-key');
                renderProjectDetail(projectKey);
            });
        }
    });
}

function scrollToProjects() {
    const projectsSection = document.getElementById('projects-section');
    if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// 3. RENDERING PROJECT DETAIL VIEWS
function renderProjectDetail(projectKey) {
    let title = 'Project Detail';
    let content = '';

    if (projectKey === 'sentiment_form') {
        title = 'Customer Sentiment Classifier: LLM API Test Interface';
        content = `
            <div class="row mb-5">
                <div class="col-lg-12">
                    <h3 class="display-6 fw-bold mb-3 text-info">Zero-Shot Aspect-Based Sentiment Analysis</h3>
                    <p class="lead text-secondary">
                        This service simulates calling a **Large Language Model (LLM) API** (like Gemini, GPT, or Claude) to perform sophisticated, zero-shot classification without dedicated training data.
                    </p>
                    <div class="alert p-3 my-4 border border-info rounded-3" style="background-color: var(--card-dark);">
                        <p class="mb-0 small fw-bold text-info"><i class="fa-solid fa-rocket me-2"></i>LLM Advantage:</p>
                        <p class="mb-0 small text-secondary">LLMs provide vastly superior contextual understanding, handle evolving language, and perform complex tasks like **Aspect-Based Sentiment Analysis (ABSA)** out of the box.</p>
                    </div>
                </div>
            </div>

            <h3 class="fw-bold mb-4">Live Test Bench (LLM-Powered Analysis)</h3>
            
            <div class="detail-interface">
                <p class="lead text-center text-secondary">Enter a review for deep, contextual sentiment analysis.</p>
                <div class="mb-3">
                    <label for="reviewText" class="form-label text-white">Review Text Input:</label>
                    <textarea id="reviewText" class="form-control" rows="4" placeholder="Example: 'The product quality was fantastic, but the shipping took a week too long and customer service was no help.'"></textarea>
                </div>
                <button id="predictBtn" class="btn btn-primary btn-lg w-100 mb-4">
                    Run LLM Analysis <i class="fa-solid fa-brain ms-2"></i>
                </button>
                
                <div id="predictionResult" class="result-card">
                    <p class="text-center text-secondary mb-0">[STATUS] Ready for LLM input...</p>
                </div>
            </div>
        `;
    } else if (projectKey === 'quality_checker') { 
        title = 'Image-Based Quality Checker: Computer Vision Demo';
        // --- UPDATED QUALITY UI CONTENT (Side-by-Side View) ---
        content = `
            <div class="row mb-5">
                <div class="col-lg-12">
                    <h3 class="display-6 fw-bold mb-3 text-info">Industrial Automated Visual Inspection (AVI)</h3>
                    <p class="lead text-secondary">This project demonstrates a cost-effective Computer Vision (CV) pipeline built with **OpenCV** to perform **Non-Destructive Testing** and Quality Control (QC) on manufactured parts.</p>
                    <div class="row pt-3 mb-4">
                        <div class="col">
                            <span class="feature-pill accent"><i class="fa-solid fa-camera-retro me-1"></i> OpenCV</span>
                            <span class="feature-pill"><i class="fa-solid fa-code me-1"></i> Edge Detection (Canny)</span>
                            <span class="feature-pill"><i class="fa-solid fa-ruler-combined me-1"></i> Contour Analysis</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row align-items-stretch mb-5 detail-interface">
                <div class="col-lg-4 border-end border-secondary pe-4">
                    <h4 class="fw-bold mb-4 text-success">QC Test Bench</h4>
                    <p class="small text-secondary">Upload an image of a product to observe the defect detection pipeline in action.</p>

                    <form id="quality-form" enctype="multipart/form-data" class="mb-4">
                        <div class="mb-3">
                            <label for="image-file" class="form-label fw-bold text-white">Upload Product Image:</label>
                            <input class="form-control" type="file" id="image-file" name="file" accept=".png, .jpg, .jpeg" required>
                            <div class="form-text text-secondary small">Accepted formats: PNG, JPG, JPEG.</div>
                        </div>
                        <button type="submit" id="qualityPredictBtn" class="btn btn-primary w-100">
                            Run Automated Check <i class="fa-solid fa-vial-circle-check ms-2"></i>
                        </button>
                    </form>
                    <div id="qualityErrorMessage" class="alert alert-danger mt-3" style="display: none;"></div>
                </div>
                
                <div class="col-lg-8 ps-4">
                    <h4 class="fw-bold mb-4 text-info">Inspection Results & Visualization</h4>
                    <div id="qualityStatusMessage" class="result-card mb-4">
                        <p class="text-center text-secondary mb-0">[STATUS] Select an image and click 'Run Automated Check'.</p>
                    </div>

                    <div id="qualityResultsArea" style="display: none;">
                        <h5 class="card-title text-white"><span id="result-icon"></span> Inspection Status: <span id="result-status" class="fw-bolder"></span></h5>
                        <p class="small text-secondary mb-3"><strong>Analysis Report:</strong> <span id="result-message"></span></p>
                        
                        <div class="row mt-4">
                            <div class="col-md-6 text-center">
                                <h6 class="text-secondary">Original Image</h6>
                                <div id="original-image-container" class="result-card p-2">
                                    <img id="result-image-original" src="" alt="Original Image" class="img-fluid rounded" style="max-height: 250px;">
                                </div>
                            </div>
                            <div class="col-md-6 text-center">
                                <h6 class="text-info">Processed Output (Defects Highlighted)</h6>
                                <div id="processed-image-container" class="result-card p-2">
                                    <img id="result-image-processed" src="" alt="Processed Image" class="img-fluid rounded" style="max-height: 250px;">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        // --- END UPDATED QUALITY UI CONTENT ---
    } else if (projectKey === 'demand_form') { 
        title = 'Product Demand Predictor: Time-Series Forecasting';
        // --- UPDATED DEMAND UI CONTENT ---
        content = `
            <div class="row mb-5">
                <div class="col-lg-12">
                    <h3 class="display-6 fw-bold mb-3 text-info">Advanced Time-Series Forecasting for Supply Chain</h3>
                    <p class="lead text-secondary">
                        This project showcases the deployment of a **scikit-learn** model for **weekly product demand prediction**, emphasizing the importance of **Feature Engineering** and **Exogenous Variables** in time-series data.
                    </p>
                    <div class="row pt-3 mb-4">
                        <div class="col">
                            <span class="feature-pill accent"><i class="fa-solid fa-calendar-alt me-1"></i> Time Series</span>
                            <span class="feature-pill"><i class="fa-solid fa-cogs me-1"></i> Feature Engineering</span>
                            <span class="feature-pill"><i class="fa-solid fa-chart-line me-1"></i> Regression Model</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row detail-interface">
                <div class="col-lg-5 border-end border-secondary pe-4">
                    <h4 class="fw-bold mb-4 text-success">Forecasting Input Parameters</h4>
                    <p class="small text-secondary">Set the product SKU and promotional status (exogenous variable) to generate a prediction.</p>

                    <div class="mb-4">
                        <label for="productId" class="form-label fw-bold text-white">Product SKU/ID:</label>
                        <select id="productId" class="form-control form-select">
                            <option value="SKU-1001">Product A - SKU-1001 (High Volume)</option>
                            <option value="SKU-1002">Product B - SKU-1002 (Seasonal)</option>
                            <option value="SKU-1003">Product C - SKU-1003 (New Launch)</option>
                        </select>
                    </div>

                    <div class="mb-4">
                        <label for="promoFlag" class="form-label fw-bold text-white">Promotion Flag (Exogenous Variable):</label>
                        <select id="promoFlag" class="form-control form-select">
                            <option value="0">No Promotion (0)</option>
                            <option value="1">Active Promotion (1)</option>
                        </select>
                    </div>

                    <button id="predictDemandBtn" class="btn btn-primary btn-lg w-100">
                        Predict Next Week's Demand <i class="fa-solid fa-arrow-right-to-bracket ms-2"></i>
                    </button>
                    
                </div>
                
                <div class="col-lg-7 ps-4">
                    <h4 class="fw-bold mb-4 text-info">Prediction Output</h4>
                    <div class="metric-box mb-3">
                        <h4 class="text-secondary small">FORECASTED UNITS</h4>
                        <p id="demandPredictionValue" class="display-4 fw-bolder text-white">---</p>
                    </div>
                    
                    <div id="demandPredictionResult" class="result-card">
                        <p class="text-center text-secondary mb-0">[STATUS] Ready to run forecast...</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Placeholder for Demand (This path should now only be hit if a content key is mismatched)
        title = projectKey.toUpperCase() + " Project: Under Development";
        content = `<div class="alert alert-info text-center"><h2>Project Under Development</h2><p>This demo is currently being prepared for deployment. Please check back soon!</p><div class="spinner-grow text-info mt-3"></div></div>`;
    }

    mainContent.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-5 border-bottom border-secondary pb-3">
            <h2 class="display-5 fw-bolder text-white">${title}</h2>
            <button class="btn btn-outline-secondary" onclick="fetchProjects()">
                <i class="fa-solid fa-arrow-left me-2"></i> Back to Dashboard
            </button>
        </div>
        ${content}
    `;

    // Attach prediction logic
    if (projectKey === 'sentiment_form') {
        document.getElementById('predictBtn').addEventListener('click', runSentimentPrediction);
    } else if (projectKey === 'quality_checker') { 
        document.getElementById('quality-form').addEventListener('submit', runQualityPrediction);
    } else if (projectKey === 'demand_form') { 
        document.getElementById('predictDemandBtn').addEventListener('click', runDemandPrediction);
        document.getElementById('demandPredictionValue').textContent = '---';
    }
}

// 4. PREDICTION LOGIC (API CALLS - unchanged or adapted to new data)

async function runSentimentPrediction() {
    // ... (Sentiment prediction logic remains the same as previous step) ...
    const text = document.getElementById('reviewText').value;
    const resultDiv = document.getElementById('predictionResult');
    const predictBtn = document.getElementById('predictBtn');
    
    resultDiv.innerHTML = '<p class="text-center text-info mb-0"><span class="spinner-border spinner-border-sm me-2"></span> Calling LLM API for deep analysis...</p>';
    predictBtn.disabled = true;
    predictBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Analyzing...';

    try {
        const response = await fetch('/api/predict/sentiment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });

        const data = await response.json();

        if (!response.ok) {
            resultDiv.innerHTML = `<p class="text-center text-danger mb-0"><i class="fa-solid fa-circle-exclamation me-2"></i>[ERROR] ${data.error || 'LLM analysis failed.'}</p>`;
            return;
        }

        const overallSentiment = data.overall_sentiment;
        const confidence = (data.confidence_score * 100).toFixed(1) + '%';
        const aspects = data.aspect_sentiment;
        const summary = data.summary;

        const colorClass = overallSentiment === 'Positive' ? 'text-success' : 
                           overallSentiment === 'Negative' ? 'text-danger' : 'text-warning';
        
        const cardGlowClass = overallSentiment === 'Positive' ? 'border-success' : 
                              overallSentiment === 'Negative' ? 'border-danger' : 'border-warning';
        
        // Format aspects into HTML list
        let aspectHTML = '';
        for (const [aspect, sentiment] of Object.entries(aspects)) {
            let aspectColor = sentiment === 'Positive' ? 'text-success' : 
                              sentiment === 'Negative' ? 'text-danger' : 'text-warning';
            let icon = sentiment === 'Positive' ? '<i class="fa-solid fa-thumbs-up me-2"></i>' : 
                       sentiment === 'Negative' ? '<i class="fa-solid fa-thumbs-down me-2"></i>' : '<i class="fa-solid fa-minus me-2"></i>';
                       
            aspectHTML += `<li class="d-flex justify-content-between align-items-center">
                            <span class="text-secondary">${aspect}:</span>
                            <span class="${aspectColor} fw-bold">${icon}${sentiment}</span>
                           </li>`;
        }

        resultDiv.innerHTML = `
            <div class="row align-items-center mb-3">
                <div class="col-md-6 text-start border-end border-secondary">
                    <h5 class="text-secondary small fw-bold">OVERALL SENTIMENT</h5>
                    <h2 class="fw-bolder ${colorClass} display-6">${overallSentiment}</h2>
                </div>
                <div class="col-md-6 text-start ps-4">
                    <h5 class="text-secondary small fw-bold">CONFIDENCE</h5>
                    <h2 class="fw-bolder text-white display-6">${confidence}</h2>
                </div>
            </div>
            <hr class="border-secondary my-3">
            
            <h5 class="text-info mb-3"><i class="fa-solid fa-magnifying-glass me-2"></i>Aspect-Based Analysis (ABSA)</h5>
            <ul class="list-unstyled aspect-list p-3 border rounded ${cardGlowClass}">${aspectHTML}</ul>

            <h5 class="text-info mb-2 mt-4"><i class="fa-solid fa-scroll me-2"></i>LLM Summary</h5>
            <p class="small text-secondary fst-italic p-3 result-card">${summary}</p>
        `;

    } catch (error) {
        resultDiv.innerHTML = `<p class="text-center text-danger mb-0"><i class="fa-solid fa-triangle-exclamation me-2"></i>[NETWORK ERROR] Could not connect to the LLM engine: ${error.message}</p>`;
    } finally {
        predictBtn.disabled = false;
        predictBtn.innerHTML = 'Run LLM Analysis <i class="fa-solid fa-brain ms-2"></i>';
    }
}


// --- UPDATED: Quality Prediction Function (Handles two image URLs) ---
async function runQualityPrediction(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const resultsArea = document.getElementById('qualityResultsArea');
    const errorMessage = document.getElementById('qualityErrorMessage');
    const statusMessage = document.getElementById('qualityStatusMessage');
    const submitButton = document.getElementById('qualityPredictBtn');

    // Reset UI
    resultsArea.style.display = 'none';
    errorMessage.style.display = 'none';
    resultsArea.classList.remove('active', 'border-success', 'border-danger');
    statusMessage.innerHTML = '<p class="text-center text-info mb-0"><span class="spinner-border spinner-border-sm me-2"></span> Processing image with Computer Vision pipeline...</p>';
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';

    try {
        const response = await fetch('/api/predict/quality', {
            method: 'POST',
            body: formData 
        });

        const data = await response.json();
        const resultStatus = document.getElementById('result-status');
        const resultIcon = document.getElementById('result-icon');

        if (!response.ok) {
            errorMessage.textContent = data.error || 'Image processing failed due to an unexpected error.';
            errorMessage.style.display = 'block';
            statusMessage.innerHTML = '<p class="text-center text-danger mb-0"><i class="fa-solid fa-circle-exclamation me-2"></i>[ERROR] Processing failed.</p>';
            return;
        }

        // Success
        resultsArea.style.display = 'block';
        document.getElementById('result-message').textContent = data.message;
        
        // Set status text and styling
        resultStatus.textContent = data.status;
        if (data.status === 'Pass') {
            resultStatus.className = 'text-success fw-bolder';
            resultIcon.innerHTML = '✅';
        } else {
            resultStatus.className = 'text-danger fw-bolder';
            resultIcon.innerHTML = '❌';
        }
        
        // Update image sources (Original and Processed)
        document.getElementById('result-image-original').src = data.original_image_url + '?' + new Date().getTime();
        document.getElementById('result-image-processed').src = data.processed_image_url + '?' + new Date().getTime();
        
        statusMessage.innerHTML = '<p class="text-center text-success mb-0"><i class="fa-solid fa-check-circle me-2"></i>[COMPLETED] Analysis results displayed below.</p>';

    } catch (error) {
        console.error('Fetch error:', error);
        errorMessage.textContent = `[NETWORK ERROR] Could not connect to the processing engine: ${error.message}`;
        errorMessage.style.display = 'block';
        statusMessage.innerHTML = '<p class="text-center text-danger mb-0"><i class="fa-solid fa-triangle-exclamation me-2"></i>[ERROR] Processing failed.</p>';
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Run Automated Check <i class="fa-solid fa-vial-circle-check ms-2"></i>';
    }
}


// --- UPDATED: Demand Prediction Function (Passes two variables) ---
async function runDemandPrediction() {
    const productId = document.getElementById('productId').value;
    const promoFlag = document.getElementById('promoFlag').value;
    const resultDiv = document.getElementById('demandPredictionResult');
    const valueDisplay = document.getElementById('demandPredictionValue');
    const predictBtn = document.getElementById('predictDemandBtn');

    resultDiv.innerHTML = '<p class="text-center text-info mb-0"><span class="spinner-border spinner-border-sm me-2"></span> Calculating Forecast (Running Time-Series Model)...</p>';
    valueDisplay.textContent = '...';
    predictBtn.disabled = true;
    predictBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Forecasting...';

    try {
        const response = await fetch('/api/predict/demand', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, promo_flag: promoFlag })
        });

        const data = await response.json();

        if (!response.ok) {
            resultDiv.innerHTML = `<p class="text-center text-danger mb-0"><i class="fa-solid fa-circle-exclamation me-2"></i>[ERROR] ${data.error || 'Forecasting failed.'}</p>`;
            valueDisplay.textContent = 'Error';
            return;
        }
        
        const prediction = data.prediction.toLocaleString(); // Format number
        const statusMessage = data.message;

        valueDisplay.textContent = prediction;

        resultDiv.innerHTML = `
            <h5 class="text-success fw-bold"><i class="fa-solid fa-chart-bar me-2"></i>Forecast Status: Success</h5>
            <p class="mb-1 small text-white"><strong>Product SKU:</strong> ${data.product_id}</p>
            <p class="small text-secondary mb-0">${statusMessage}</p>
        `;

    } catch (error) {
        resultDiv.innerHTML = `<p class="text-center text-danger mb-0"><i class="fa-solid fa-triangle-exclamation me-2"></i>[NETWORK ERROR] Could not connect to the forecasting engine: ${error.message}</p>`;
        valueDisplay.textContent = 'Failed';
    } finally {
        predictBtn.disabled = false;
        predictBtn.innerHTML = 'Predict Next Week\'s Demand <i class="fa-solid fa-arrow-right-to-bracket ms-2"></i>';
    }
}


// --- INITIALIZE APPLICATION ---
document.addEventListener('DOMContentLoaded', fetchProjects);