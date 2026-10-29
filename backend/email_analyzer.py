"""
Email Phishing Analysis Module for Phishing Shield AI
Analyzes email text for urgency triggers, credential requests, sensitive indicators, and embedded malicious URLs.
"""

import re
from typing import Dict, List, Any


URGENCY_PATTERNS = [
    (r"\b(immediately|urgent|urgently|right away|at once)\b", "High Urgency Marker", 12),
    (r"\b(within\s+\d+\s+(hours?|minutes?|days?)|24\s*hours?|48\s*hours?)\b", "Artificial Deadline / Time Pressure", 15),
    (r"\b(account\s+(suspended|locked|terminated|disabled|restricted))\b", "Account Suspension Threat", 20),
    (r"\b(security\s+(breach|alert|incident|compromise))\b", "Panic-Inducing Security Alert", 18),
    (r"\b(final\s+notice|last\s+chance|immediate\s+action\s+required)\b", "Coercive Action Phrasing", 15)
]

CREDENTIAL_PATTERNS = [
    (r"\b(password|passcode|secret\s*pin|cvv|ssn|social\s+security)\b", "Direct Credential / Sensitive Data Request", 25),
    (r"\b(verify\s+your\s+(identity|account|credentials|card|bank))\b", "Identity Verification Prompt", 18),
    (r"\b(update\s+(billing|payment|credit\s+card|banking\s+details))\b", "Financial Harvesting Demand", 20),
    (r"\b(click\s+(here|the\s+link|below|this\s+link))\b", "Call-to-Action Link Redirection", 10),
    (r"\b(won\s+a\s+prize|claim\s+your\s+reward|lottery|inheritance|bitcoin\s+transfer)\b", "Financial Reward / Lure Scam", 22)
]

URL_REGEX = re.compile(
    r"https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)"
)


def analyze_email_text(email_text: str, url_scanner_fn=None) -> Dict[str, Any]:
    """
    Scans email content for social engineering tactics and inspects embedded URLs.
    """
    findings = []
    total_penalty = 0

    text_lower = email_text.lower()

    # 1. Check Urgency / Coercion Tactics
    for pattern, title, pts in URGENCY_PATTERNS:
        matches = re.findall(pattern, text_lower)
        if matches:
            total_penalty += pts
            findings.append({
                "type": "urgency",
                "title": title,
                "description": f"Detected coercion trigger pattern: '{matches[0] if isinstance(matches[0], str) else matches[0][0]}'. Phishers use artificial panic to bypass rational judgment.",
                "severity": "danger" if pts >= 18 else "warning",
                "penalty": pts
            })

    # 2. Check Credential & Financial Harvesting Tactics
    for pattern, title, pts in CREDENTIAL_PATTERNS:
        matches = re.findall(pattern, text_lower)
        if matches:
            total_penalty += pts
            findings.append({
                "type": "credential_request",
                "title": title,
                "description": f"Identified sensitive data request trigger: '{matches[0] if isinstance(matches[0], str) else matches[0][0]}'. Legitimate institutions rarely request credentials via email.",
                "severity": "danger" if pts >= 20 else "warning",
                "penalty": pts
            })

    # 3. Extract Embedded URLs
    found_urls = URL_REGEX.findall(email_text)
    embedded_url_analyses = []
    url_max_risk = 0

    if found_urls:
        for raw_url in set(found_urls):
            if url_scanner_fn:
                try:
                    scan_res = url_scanner_fn(raw_url, record_to_history=False)
                    score = scan_res.get("risk_score", 0)
                    url_max_risk = max(url_max_risk, score)
                    embedded_url_analyses.append({
                        "url": raw_url,
                        "risk_score": score,
                        "risk_level": scan_res.get("risk_level", "Unknown"),
                        "ai_prediction": scan_res.get("ai_prediction", "Unknown"),
                        "factors_count": len(scan_res.get("factors", []))
                    })
                except Exception as e:
                    embedded_url_analyses.append({"url": raw_url, "error": str(e)})
            else:
                embedded_url_analyses.append({"url": raw_url, "scanned": False})

        if url_max_risk >= 60:
            total_penalty += 35
            findings.append({
                "type": "malicious_link",
                "title": "High-Risk Malicious Link Embedded",
                "description": f"Email body embeds links with high phishing risk score ({url_max_risk}/100).",
                "severity": "danger",
                "penalty": 35
            })
        elif url_max_risk >= 30:
            total_penalty += 15
            findings.append({
                "type": "suspicious_link",
                "title": "Suspicious Link Embedded",
                "description": f"Embedded URL scored {url_max_risk}/100 with anomalies.",
                "severity": "warning",
                "penalty": 15
            })

    # Compute final score (0-100)
    final_score = min(100, total_penalty)

    if final_score >= 60:
        risk_level = "High Risk"
        color = "red"
        verdict = "High probability of Phishing Attack / Credential Harvesting. Do NOT reply or click any links."
    elif final_score >= 30:
        risk_level = "Suspicious"
        color = "amber"
        verdict = "Suspicious email. Contains urgency markers or unusual data requests. Verify with sender out-of-band."
    else:
        risk_level = "Low Risk"
        color = "green"
        verdict = "Low risk indicators detected. No overt phishing markers identified."

    return {
        "risk_score": final_score,
        "risk_level": risk_level,
        "color": color,
        "verdict": verdict,
        "findings": findings,
        "urls_detected": len(found_urls),
        "embedded_urls": embedded_url_analyses,
        "character_count": len(email_text),
        "word_count": len(email_text.split())
    }

