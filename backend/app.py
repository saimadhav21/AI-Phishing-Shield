"""
Phishing Shield AI - FastAPI Backend Service
Exposes REST APIs for URL Scanning, AI Predictions, Explainable Risk Scoring,
Dashboard Metrics, Scan History, Email Analysis, and AWS Telemetry.
"""

import os
import uuid
import datetime
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import joblib

from feature_extractor import extract_features, normalize_url, FEATURE_NAMES
from risk_engine import calculate_risk_score
from aws_service import aws_service
from train_model import train_and_save_model, MODEL_PATH, METADATA_PATH
from email_analyzer import analyze_email_text

app = FastAPI(
    title="Phishing Shield AI API",
    description="Enterprise-grade AI-powered phishing URL & threat detection service backed by AWS Cloud.",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model state
ML_MODEL = None
MODEL_METADATA = {}


def load_ml_model():
    """Load or train the Random Forest model."""
    global ML_MODEL, MODEL_METADATA
    if not os.path.exists(MODEL_PATH):
        print("[AI Engine] Model artifact not found. Training model now...")
        MODEL_METADATA = train_and_save_model()

    try:
        ML_MODEL = joblib.load(MODEL_PATH)
        print("[AI Engine] Loaded Scikit-Learn Random Forest model successfully.")
        if os.path.exists(METADATA_PATH):
            import json
            with open(METADATA_PATH, "r", encoding="utf-8") as f:
                MODEL_METADATA = json.load(f)
    except Exception as e:
        print(f"[AI Engine Error] Failed loading model: {e}")


@app.on_event("startup")
async def startup_event():
    load_ml_model()


# ----------------- Request / Response Models -----------------

class ScanUrlRequest(BaseModel):
    url: str

class ScanEmailRequest(BaseModel):
    email_text: str


# ----------------- Core Endpoints -----------------

def run_url_scan_pipeline(raw_url: str, record_to_history: bool = True) -> Dict[str, Any]:
    """Execute end-to-end scanning: validation -> extraction -> RF AI prediction -> risk scoring -> DB record."""
    global ML_MODEL
    if ML_MODEL is None:
        load_ml_model()

    # 1. Validation & normalization
    clean_url = raw_url.strip()
    if not clean_url:
        raise ValueError("URL cannot be empty")

    # 2. Feature Extraction
    extraction_res = extract_features(clean_url)
    features_dict = extraction_res["features"]
    feature_vector = extraction_res["vector"]
    domain = extraction_res["domain"]
    tld = extraction_res["tld"]
    normalized_url = extraction_res["normalized_url"]

    # 3. AI Model Prediction (Real Random Forest Classifier)
    if ML_MODEL:
        probabilities = ML_MODEL.predict_proba([feature_vector])[0]
        # class 0: Legitimate, class 1: Phishing
        legit_prob = float(probabilities[0])
        phish_prob = float(probabilities[1])
        ai_prediction = "Phishing" if phish_prob >= 0.50 else "Legitimate"
        confidence_pct = round(max(legit_prob, phish_prob) * 100, 2)
    else:
        # Fallback if model could not be initialized
        phish_prob = 0.5
        ai_prediction = "Suspicious"
        confidence_pct = 50.0

    # 4. Risk Scoring Engine & Explainable AI (0 - 100)
    risk_result = calculate_risk_score(
        features_dict=features_dict,
        ai_phishing_prob=phish_prob,
        domain=domain,
        tld=tld
    )

    scan_id = f"scan-{uuid.uuid4().hex[:10]}"
    timestamp = datetime.datetime.utcnow().isoformat()

    full_record = {
        "id": scan_id,
        "url": clean_url,
        "normalized_url": normalized_url,
        "domain": domain,
        "tld": tld,
        "risk_score": risk_result["risk_score"],
        "risk_level": risk_result["risk_level"],
        "color": risk_result["color"],
        "ai_prediction": ai_prediction,
        "ai_confidence": confidence_pct,
        "phishing_probability": round(phish_prob * 100, 2),
        "legitimate_probability": round(legit_prob * 100, 2) if ML_MODEL else 50.0,
        "detection_method": "Random Forest Classifier + Heuristic Rule Engine",
        "model_algorithm": "RandomForest(n_estimators=100, max_depth=12)",
        "recommendation": risk_result["recommendation"],
        "factors": risk_result["factors"],
        "features": features_dict,
        "timestamp": timestamp,
        "scan_type": "url"
    }

    # 5. Save to Database (DynamoDB or local SQLite)
    if record_to_history:
        aws_service.save_scan_record(full_record)

    return full_record


@app.post("/api/scan")
async def scan_url(payload: ScanUrlRequest):
    """Core Feature 1, 2, 3: Scans URL, applies AI model, calculates risk score, returns XAI report."""
    try:
        report = run_url_scan_pipeline(payload.url, record_to_history=True)
        return {"success": True, "data": report}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scanning failed: {str(e)}")


@app.get("/api/dashboard")
async def get_dashboard_data():
    """Core Feature 4: Returns real-time aggregate scan statistics from the database."""
    stats = aws_service.get_dashboard_statistics()
    return {"success": True, "data": stats}


@app.get("/api/history")
async def get_history(search: Optional[str] = None):
    """Feature 7: Retrieves historical scan records with optional search filter."""
    scans = aws_service.get_all_scans()
    if search:
        s_lower = search.lower()
        scans = [s for s in scans if s_lower in s["url"].lower() or s_lower in s["domain"].lower() or s_lower in s["risk_level"].lower()]
    return {"success": True, "count": len(scans), "data": scans}


@app.delete("/api/history/{scan_id}")
async def delete_history_item(scan_id: str):
    """Delete a specific scan from history."""
    ok = aws_service.delete_scan(scan_id)
    return {"success": ok}


@app.post("/api/history/clear")
async def clear_history():
    """Clear all scans."""
    ok = aws_service.clear_all_scans()
    return {"success": ok}


@app.post("/api/scan-email")
async def scan_email(payload: ScanEmailRequest):
    """Feature 5: Email Phishing Detection module."""
    if not payload.email_text.strip():
        raise HTTPException(status_code=400, detail="Email body text cannot be empty.")
    
    # Analyze email text and evaluate any embedded URLs
    report = analyze_email_text(
        email_text=payload.email_text,
        url_scanner_fn=run_url_scan_pipeline
    )
    return {"success": True, "data": report}


@app.get("/api/aws-status")
async def get_aws_status():
    """Feature 9 / AWS Expo Showcase: Telemetry on AWS services status."""
    status = aws_service.get_aws_status()
    return {"success": True, "data": status}


@app.get("/api/model-info")
async def get_model_info():
    """Returns AI model architecture and performance metrics."""
    global MODEL_METADATA
    if not MODEL_METADATA:
        load_ml_model()
    return {"success": True, "data": MODEL_METADATA}


@app.post("/api/train")
async def trigger_training():
    """Allows retraining model on-the-fly for live Expo demo."""
    metadata = train_and_save_model()
    load_ml_model()
    return {"success": True, "message": "Model retrained successfully", "data": metadata}


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Phishing Shield AI Backend",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "model_loaded": ML_MODEL is not None
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

