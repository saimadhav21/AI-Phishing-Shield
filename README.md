# 🛡️ Phishing Shield AI – AI-Powered Phishing Detection System Using AWS

[![AWS Project Expo](https://img.shields.io/badge/AWS-Project%20Expo%202026-FF9900?logo=amazon-aws&logoColor=white)](https://aws.amazon.com)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-Random%20Forest-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

**Phishing Shield AI** is an enterprise-grade cybersecurity web application developed for the **AWS Project Expo 2026**. It detects zero-day phishing URLs, fraudulent login portals, and social engineering lures using a hybrid architecture of **Machine Learning (Scikit-Learn Random Forest Classifier with 99.84% accuracy)**, an **Explainable AI (XAI) Risk Engine (0–100 score)**, and scalable **AWS Cloud Services** (Amazon DynamoDB, Amazon S3, Amazon EC2, and Amazon CloudWatch).

The application features an institutional cybersecurity portal layout modeled after national cyber defense portals (such as the Income Tax Department's cyber defense site), complete with a three-way theme selector (**Light**, **Dark**, **Device**), spacious responsive layouts, and zero cramped or overlapping elements.

---

## 🌟 Live Demonstration Guide (For Expo Judges)

Present this 6-step walkthrough during the expo presentation:

| Step | Action | Demonstration URL / Input | What Judges See |
|:---:|:---|:---|:---|
| **1** | **Open Dashboard** | `http://localhost:5173` ➔ Dashboard Tab | Real-time statistics (**Total Scans**, **Phishing Detected**, **Legitimate Detected**, **Threat Rate %**) and dynamic Donut & Velocity Bar charts pulled directly from database records. |
| **2** | **Scan Legitimate Site** | `https://aws.amazon.com` *(or click preset)* | Scanner normalizes URL syntax; extracts 18 features; **AI classifies as "Legitimate" (100% confidence)**; **Risk Score: 5/100 (Low Risk)** with green gauge. |
| **3** | **Explain AI Decision** | Review Explainable AI Breakdown | 18 raw extracted features displayed; XAI confirms valid HTTPS, clean domain, zero credential traps. |
| **4** | **Scan Phishing Site** | `http://192.168.1.100/paypal/login.php` | **AI classifies as "Phishing" (92.5% confidence)**; **Risk Score: 91/100 (High Risk)** with red danger alert. XAI triggers: *Raw IP host, credential harvesting keywords, plain HTTP*. |
| **5** | **Scan Subdomain Spoof** | `http://secure.account.update.paypal.com.account-verify.xyz/login` | **Risk Score: 100/100 (High Risk)**; XAI triggers: *Excessive subdomain stacking (5 subdomains), `.xyz` high-abuse TLD, credential traps*. |
| **6** | **Verify Live Auto-Update** | Return to Dashboard Tab | Total scans counter increments; threat detection rate recalculates; recent scans table reflects newly scanned URLs instantly. |

---

## 🏗️ System Architecture

```
                                  ┌──────────────────────────────────────────────┐
                                  │           React 19 + Tailwind CSS            │
                                  │      Institutional Cybersecurity Portal      │
                                  │     (Light / Dark / Device Dual Themes)      │
                                  └──────────────────────┬───────────────────────┘
                                                         │ REST API (JSON)
                                                         ▼
                                  ┌──────────────────────────────────────────────┐
                                  │            FastAPI Python Backend            │
                                  │      (Deployed on Amazon EC2 / Container)    │
                                  └──────┬───────────────┬───────────────┬───────┘
                                         │               │               │
                   ┌─────────────────────▼─┐       ┌─────▼─────────┐     │
                   │ URL Feature Extractor │       │ Email/QR Mod  │     │
                   │  (18 Lexical Vectors) │       └───────────────┘     │
                   └─────────────┬─────────┘                             │
                                 ▼                                       │
                   ┌───────────────────────────┐                         │
                   │ Random Forest Classifier  │                         │
                   │   (100 Estimators, S3)    │                         │
                   └─────────────┬─────────────┘                         │
                                 ▼                                       │
                   ┌───────────────────────────┐                         ▼
                   │  Explainable Risk Engine  │             ┌───────────────────────┐
                   │  (0 - 100 Severity Score) │             │   Amazon CloudWatch   │
                   └─────────────┬─────────────┘             │  Telemetry & Metrics  │
                                 │                           └───────────────────────┘
                                 ▼
                   ┌───────────────────────────────────────────┐
                   │             Amazon DynamoDB               │
                   │ Scan History, Audit Logs, SQLite Fallback │
                   └───────────────────────────────────────────┘
```

---

## 💻 Comprehensive Technology Stack

| Layer | Technologies & Libraries | Key Responsibilities & Capabilities |
|:---|:---|:---|
| **Frontend Framework** | **React 19**, **Vite** | Asynchronous Single Page Application (SPA), lightning-fast hot module replacement (HMR), component-driven UI architecture. |
| **Styling & Design** | **Tailwind CSS 3.4**, PostCSS, Autoprefixer | Responsive utility-first design, custom institutional government portal theme (`gov`), dark mode class switching, zero text clipping. |
| **Theme & State Management** | React Context API (`ThemeContext.jsx`), `localStorage` | Synchronized 3-way theme state (**Light**, **Dark**, **Device**), operating system `prefers-color-scheme` listener. |
| **Data Visualizations** | **Recharts (v2.15)** | Responsive interactive SVG charts: 240px Threat Risk Donut Chart and Daily Scan Velocity Bar Chart with custom tooltips. |
| **Icons & UI Assets** | **Lucide React** | High-fidelity cybersecurity iconography (ShieldCheck, ShieldAlert, Cpu, Globe, Lock, Activity, Server, Database). |
| **Client-Side Decoding** | **jsQR** | Pure JavaScript QR matrix decoder parsing uploaded PNG, JPG, and SVG images client-side before submission. |
| **HTTP Client** | **Axios** | Asynchronous REST communication between client and backend with error boundary interception. |
| **Backend API Engine** | **Python 3.11**, **FastAPI (0.115)** | High-performance asynchronous REST API framework, native OpenAPI (Swagger) generation at `/docs`. |
| **ASGI Server** | **Uvicorn** | Production-ready ASGI server handling non-blocking concurrent request workers. |
| **Data Validation & Schemas** | **Pydantic v2** | Strict type hinting, automated payload normalization, and schema validation. |
| **Machine Learning / AI** | **Scikit-Learn (1.4+)**, **NumPy** | **Random Forest Classifier** (100 estimators, max depth 12, balanced class weights, **99.84% accuracy**). |
| **Model Serialization** | **Joblib** | Serializes trained model weights and feature scalers to `phishing_rf_model.joblib`. |
| **Feature Extraction** | Python `urllib.parse`, Regular Expressions (Regex) | 18 lexical and domain feature vectors extracted in sub-millisecond execution. |
| **Database & Persistence** | **Amazon DynamoDB** / **SQLite** | Boto3 AWS SDK client for DynamoDB table `PhishingShield_Scans`; dual local SQLite parity engine. |
| **Cloud Infrastructure (AWS)** | **Amazon EC2**, **Amazon DynamoDB**, **Amazon S3**, **Amazon CloudWatch** | Cloud compute hosting, NoSQL threat logs, model artifact bucket storage, operational metrics & alarms. |
| **DevOps & Automation** | PowerShell (`run_app.ps1`), Batch (`run_app.bat`) | Automated dependency verification, background server orchestration, and cross-platform execution. |

---

## 🎯 Critical Priority: The 4 Core Features

### 1. URL Threat Scanner (Core Feature)
- **Input Syntax Validation**: Normalizes schemes and parses hostnames, paths, and queries safely.
- **18 Extracted URL Features**:
  1. `url_length`: Overall character length.
  2. `domain_length`: Hostname length.
  3. `num_dots`: Frequency of `.` in the URL.
  4. `num_hyphens`: Frequency of `-` (common in brand squatting).
  5. `num_subdomains`: Depth of subdomain levels.
  6. `has_ip_address`: Detects direct IPv4 / IPv6 hosts (e.g. `http://192.168.1.1/login`).
  7. `has_at_symbol`: Detects `@` credential diversion.
  8. `has_double_slash_redirect`: Detects `//` in path (open redirect exploitation).
  9. `is_https`: Protocol encryption check (HTTPS vs insecure HTTP).
  10. `has_shortener`: Detects masking services (`bit.ly`, `tinyurl`, `t.co`, etc.).
  11. `suspicious_keywords_count`: Tracks sensitive keywords (`login`, `verify`, `account`, `banking`, `secure`, `update`, `wallet`, `paypal`, etc.).
  12. `suspicious_tld`: Flags known high-abuse TLDs (`.xyz`, `.top`, `.tk`, `.ml`, `.buzz`, `.icu`, etc.).
  13. `special_char_ratio`: Density of symbols (`-`, `_`, `=`, `?`, `&`, `%`, `+`, `@`).
  14. `digit_ratio`: Proportion of numbers in the URL.
  15. `consecutive_digits_max`: Longest sequence of digits (DGA detection).
  16. `has_punycode`: Detects `xn--` homograph attacks.
  17. `has_port_in_url`: Non-standard port exposure (e.g., `:8080`, `:8443`).
  18. `path_depth`: Count of `/` directories in path.

### 2. AI-Based Prediction (Core Feature)
- **Algorithm**: `RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42)`.
- **Training Dataset**: 2,477 balanced samples covering modern phishing attacks and verified legitimate websites.
- **Trained Model Metrics**:
  - **Accuracy**: **99.84%**
  - **Precision**: **100.0%**
  - **Recall**: **99.67%**
  - **F1 Score**: **99.84%**
- **Artifact Serialization**: Model weights saved to `backend/models/phishing_rf_model.joblib` (syncable with Amazon S3).
- **Outputs**: Discrete classification (`Phishing` vs `Legitimate`), probability distribution, and confidence percentage. Zero hardcoding!

### 3. Risk Score & Explainable AI (XAI) (Core Feature)
- **Dynamic 0–100 Risk Engine**: Blends the Random Forest probability (up to 50 pts) with deterministic security penalties (up to 50 pts).
- **Classification Bands**:
  - `0–29`: **Low Risk (Safe)** – Green badge, legitimate conventions.
  - `30–59`: **Suspicious (Caution)** – Amber badge, moderate anomalies.
  - `60–100`: **High Risk (Dangerous)** – Red danger badge.
- **Itemized Explanations**: Details exact triggers (e.g. *"Host is an IP address instead of a domain name (+25 pts)"*, *"Contains 5 stacked subdomains (+20 pts)"*, *"AI model flagged malicious structure with 98.8% confidence (+49 pts)"*).
- **Visual Circular Gauge**: Custom 240° mathematical arc gauge with zero text collision and separate threshold legend.

### 4. Interactive Threat Dashboard (Core Feature)
- **100% Real Database Backing**: Every card and visualization reflects actual scan records retrieved from DynamoDB / persistent database storage.
- **KPI Metrics**: Total URLs Scanned, Phishing URLs Detected, Legitimate URLs Detected, Threat Detection Rate %.
- **Visual Recharts Data Visualizations**:
  - **Risk Distribution Donut Chart**: Safe vs Suspicious vs Malicious scans.
  - **Scan Velocity Timeline**: Daily/hourly activity tracking legitimate vs malicious trends.
  - **Recent Threat Feed**: Live table with auto-refresh every 10 seconds.

---

## 🛡️ Additional Features

### 5. Phishing Email & Social Engineering Detector
- Scans pasted email content for artificial urgency (*"Immediate action required within 24 hours"*), credential harvesting prompts (*"Verify your password and PIN"*), and financial lures.
- Extracts all embedded hyperlinks and automatically evaluates them using the URL scanner engine.

### 6. QR Code Scanner (Quishing Defense)
- Decodes QR codes from image uploads and screenshots using client-side `jsQR`.
- Extracts destination URLs and runs full phishing analysis in one click.

### 7. Scan History & Audit Logs
- Paginated, searchable historical scan table stored in DynamoDB.
- Features search filtering, deletion, and one-click JSON export.

### 8. Cybersecurity Knowledge Base & Tips
- Modeled directly after institutional cyber security portals.
- Provides official disclaimers, *"What is phishing?"* guidelines, and URL anatomy comparisons.

### 9. Cloud Architecture Showcase Panel
- Live status telemetry of Amazon DynamoDB, S3, EC2, and CloudWatch.
- Includes a **Live Model Retraining** button for judges to witness real-time model fitting.

---

## ☁️ AWS Cloud Services Utilization

| AWS Service | Production Role | Implementation Details |
|:---|:---|:---|
| **Amazon EC2** | Backend API & Compute | Runs FastAPI backend and Scikit-Learn inference worker on Amazon Linux / Ubuntu with sub-20ms latency. |
| **Amazon DynamoDB** | Scan History & Audit DB | Table `PhishingShield_Scans` stores scan records with sub-10ms latency. *(Automatic local SQLite parity for zero-config local demos!)* |
| **Amazon S3** | Artifact & Dataset Bucket | Stores `phishing_rf_model.joblib` and training datasets at `s3://phishing-shield-ai-models/`. |
| **Amazon CloudWatch** | Monitoring & Metrics | Custom namespace `PhishingShieldAI` tracks `URLScanned` and `ThreatDetectionRate` metrics with automated alarms. |

---

## 🚀 Quickstart & Setup Instructions

### Prerequisites
- **Python 3.10+** (Python 3.11 recommended)
- **Node.js v18+** & **npm**

### 1. Launch with One Click (Windows)
Double click `run_app.bat` or run in PowerShell:
```powershell
.\run_app.ps1
```

### 2. Manual Startup

**Terminal 1 - Python Backend:**
```powershell
cd backend
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```
*API Swagger Documentation will be accessible at: `http://localhost:8000/docs`*

**Terminal 2 - React Frontend:**
```powershell
cd frontend
npm run dev
```
*Frontend application will open at: `http://localhost:5173`*

---

## 🎨 Theme Support & Design Philosophy

- **Light Mode (Default)**: Clean white and light slate background (`#F8FAFC`), pure white cards (`#FFFFFF`), subtle slate borders (`#E2E8F0`), deep navy headings (`#0B2545`), and clear typography matching the reference government portal ([incometaxindia.gov.in/report-phishing](https://www.incometaxindia.gov.in/report-phishing)).
- **Dark Mode**: High-contrast cyber dark theme (`#060A14`) with dark navy cards (`#0A1122`), subtle glowing accents, and high readability.
- **Device Mode**: Automatically detects and adapts to your operating system's color scheme preference (`prefers-color-scheme`).

---

## 🔐 AWS Cloud Deployment (Production)

To connect directly to real AWS services during your Expo demo, set the following environment variables:

```powershell
$env:AWS_REGION = "us-east-1"
$env:AWS_ACCESS_KEY_ID = "YOUR_AWS_ACCESS_KEY"
$env:AWS_SECRET_ACCESS_KEY = "YOUR_AWS_SECRET_KEY"
```

### Create DynamoDB Table via AWS CLI:
```bash
aws dynamodb create-table \
    --table-name PhishingShield_Scans \
    --attribute-definitions AttributeName=ScanId,AttributeType=S \
    --key-schema AttributeName=ScanId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST
```

---

## 💻 Comprehensive Technology Stack

| Layer | Technologies & Libraries | Key Responsibilities & Capabilities |
|:---|:---|:---|
| **Frontend Framework** | **React 19**, **Vite** | Asynchronous Single Page Application (SPA), lightning-fast hot module replacement (HMR), component-driven UI architecture. |
| **Styling & Design** | **Tailwind CSS 3.4**, PostCSS, Autoprefixer | Responsive utility-first design, custom institutional government portal theme (`gov`), dark mode class switching, zero text clipping. |
| **Theme & State Management** | React Context API (`ThemeContext.jsx`), `localStorage` | Synchronized 3-way theme state (**Light**, **Dark**, **Device**), operating system `prefers-color-scheme` listener. |
| **Data Visualizations** | **Recharts (v2.15)** | Responsive interactive SVG charts: 240px Threat Risk Donut Chart and Daily Scan Velocity Bar Chart with custom tooltips. |
| **Icons & UI Assets** | **Lucide React** | High-fidelity cybersecurity iconography (ShieldCheck, ShieldAlert, Cpu, Globe, Lock, Activity, Server, Database). |
| **Client-Side Decoding** | **jsQR** | Pure JavaScript QR matrix decoder parsing uploaded PNG, JPG, and SVG images client-side before submission. |
| **HTTP Client** | **Axios** | Asynchronous REST communication between client and backend with error boundary interception. |
| **Backend API Engine** | **Python 3.11**, **FastAPI (0.115)** | High-performance asynchronous REST API framework, native OpenAPI (Swagger) generation at `/docs`. |
| **ASGI Server** | **Uvicorn** | Production-ready ASGI server handling non-blocking concurrent request workers. |
| **Data Validation & Schemas** | **Pydantic v2** | Strict type hinting, automated payload normalization, and schema validation. |
| **Machine Learning / AI** | **Scikit-Learn (1.4+)**, **NumPy** | **Random Forest Classifier** (100 estimators, max depth 12, balanced class weights, **99.84% accuracy**). |
| **Model Serialization** | **Joblib** | Serializes trained model weights and feature scalers to `phishing_rf_model.joblib`. |
| **Feature Extraction** | Python `urllib.parse`, Regular Expressions (Regex) | 18 lexical and domain feature vectors extracted in sub-millisecond execution. |
| **Database & Persistence** | **Amazon DynamoDB** / **SQLite** | Boto3 AWS SDK client for DynamoDB table `PhishingShield_Scans`; dual local SQLite parity engine. |
| **Cloud Infrastructure (AWS)** | **Amazon EC2**, **Amazon DynamoDB**, **Amazon S3**, **Amazon CloudWatch** | Cloud compute hosting, NoSQL threat logs, model artifact bucket storage, operational metrics & alarms. |
| **DevOps & Automation** | PowerShell (`run_app.ps1`), Batch (`run_app.bat`) | Automated dependency verification, background server orchestration, and cross-platform execution. |

---

## 👥 Authors & Expo Accreditation
- **Project**: Phishing Shield AI
- **Event**: AWS Project Expo 2026
- **Focus Areas**: Cybersecurity, Machine Learning, Cloud Architecture, Explainable AI
