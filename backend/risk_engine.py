"""
Risk Scoring & Explainable AI (XAI) Engine for Phishing Shield AI
Computes an authentic risk score (0-100) and compiles structured, human-readable explanations.
"""

from typing import Dict, List, Any


def calculate_risk_score(features_dict: Dict[str, Any], ai_phishing_prob: float, domain: str, tld: str) -> Dict[str, Any]:
    """
    Computes a 0-100 risk score combining Machine Learning probability with heuristic security signals.
    Returns:
      - risk_score: int (0 to 100)
      - risk_level: str ("Low Risk", "Suspicious", "High Risk")
      - color: str ("green", "amber", "red")
      - factors: List[Dict] with explanation, severity, and point impact
      - recommendation: str action advice for users
    """
    factors = []
    
    # 1. Base Score from AI Model (0 to 50 points directly from ML probability)
    # ai_phishing_prob is between 0.0 and 1.0
    ml_points = round(ai_phishing_prob * 50)
    
    if ai_phishing_prob >= 0.80:
        factors.append({
            "title": "Machine Learning Flagged High Threat",
            "description": f"Random Forest AI model classified URL features as malicious with {round(ai_phishing_prob * 100, 1)}% confidence.",
            "severity": "danger",
            "points": ml_points
        })
    elif ai_phishing_prob >= 0.50:
        factors.append({
            "title": "AI Model Detected Suspicious Characteristics",
            "description": f"AI model detected anomalous lexical markers ({round(ai_phishing_prob * 100, 1)}% phishing probability).",
            "severity": "warning",
            "points": ml_points
        })
    else:
        factors.append({
            "title": "AI Model Validated Standard Structure",
            "description": f"AI model evaluated URL as legitimate ({round((1 - ai_phishing_prob) * 100, 1)}% confidence).",
            "severity": "safe",
            "points": ml_points
        })

    # 2. Heuristic Penalties (up to 50 additional points)
    heuristic_points = 0

    # IP address instead of domain
    if features_dict.get("has_ip_address", 0) == 1:
        heuristic_points += 25
        factors.append({
            "title": "Raw IP Address Host",
            "description": f"The host '{domain}' is a raw IP address instead of a verified domain name. Legitimate services almost never require raw IP access.",
            "severity": "danger",
            "points": 25
        })

    # Excessive subdomains
    num_subdomains = features_dict.get("num_subdomains", 0)
    if num_subdomains >= 3:
        pts = 20 if num_subdomains >= 4 else 12
        heuristic_points += pts
        factors.append({
            "title": f"Excessive Subdomain Stacking ({num_subdomains} subdomains)",
            "description": "High number of subdomains detected. Phishers frequently stack trusted brand names as subdomains on untrusted root domains.",
            "severity": "danger" if num_subdomains >= 4 else "warning",
            "points": pts
        })

    # Suspicious TLD
    if features_dict.get("suspicious_tld", 0) == 1:
        heuristic_points += 15
        factors.append({
            "title": f"High-Risk Top Level Domain (.{tld})",
            "description": f"The domain uses '.{tld}', a top-level domain frequently utilized in automated phishing campaigns.",
            "severity": "warning",
            "points": 15
        })

    # Suspicious keywords
    kw_count = features_dict.get("suspicious_keywords_count", 0)
    if kw_count >= 2:
        pts = 15 if kw_count >= 3 else 10
        heuristic_points += pts
        factors.append({
            "title": f"Credential Harvesting Keywords ({kw_count} matches)",
            "description": "Contains sensitive authentication keywords (e.g., login, verify, account, banking) in suspicious context.",
            "severity": "danger" if kw_count >= 3 else "warning",
            "points": pts
        })
    elif kw_count == 1:
        heuristic_points += 5
        factors.append({
            "title": "Authentication Keyword Detected",
            "description": "URL contains sensitive keyword in path or query parameters.",
            "severity": "warning",
            "points": 5
        })

    # Insecure HTTP
    if features_dict.get("is_https", 1) == 0:
        heuristic_points += 10
        factors.append({
            "title": "Missing SSL/TLS Encryption (HTTP)",
            "description": "The URL uses unencrypted plain HTTP. Modern legitimate authentication portals always enforce HTTPS.",
            "severity": "warning",
            "points": 10
        })

    # URL Shortener
    if features_dict.get("has_shortener", 0) == 1:
        heuristic_points += 10
        factors.append({
            "title": "URL Shortener / Masked Destination",
            "description": "The domain is a known URL shortening service, obscuring the final destination.",
            "severity": "warning",
            "points": 10
        })

    # Dangerous symbols (@, // redirects, punycode)
    if features_dict.get("has_at_symbol", 0) == 1:
        heuristic_points += 18
        factors.append({
            "title": "Credentials Redirection Symbol (@)",
            "description": "Contains '@' symbol in URL, often used to fool browsers into ignoring the leading prefix.",
            "severity": "danger",
            "points": 18
        })

    if features_dict.get("has_double_slash_redirect", 0) == 1:
        heuristic_points += 12
        factors.append({
            "title": "Embedded Redirect Pattern (//)",
            "description": "Contains embedded double-slash in path/query, commonly used for open redirect exploitation.",
            "severity": "warning",
            "points": 12
        })

    if features_dict.get("has_punycode", 0) == 1:
        heuristic_points += 20
        factors.append({
            "title": "Punycode / Homograph Impersonation (xn--)",
            "description": "Domain contains punycode characters, typically used to spoof legitimate brand spellings.",
            "severity": "danger",
            "points": 20
        })

    # Unusually long URL or domain
    url_len = features_dict.get("url_length", 0)
    if url_len > 90:
        heuristic_points += 8
        factors.append({
            "title": f"Abnormally Long URL ({url_len} characters)",
            "description": "URL length exceeds normal benchmarks, often hiding malicious payloads or tokens.",
            "severity": "warning",
            "points": 8
        })

    # Calculate final combined score (clamped strictly 0 to 100)
    raw_score = ml_points + heuristic_points

    # Bonus discount if AI is very confident legitimate AND no critical red flags
    if ai_phishing_prob < 0.15 and features_dict.get("has_ip_address", 0) == 0 and features_dict.get("suspicious_tld", 0) == 0:
        raw_score = min(raw_score, 25)

    risk_score = max(0, min(100, raw_score))

    # Categorize Risk Level
    if risk_score >= 60:
        risk_level = "High Risk"
        color = "red"
        recommendation = "DO NOT VISIT OR ENTER CREDENTIALS. This website exhibits strong phishing signatures and is likely designed to steal personal or financial information."
    elif risk_score >= 30:
        risk_level = "Suspicious"
        color = "amber"
        recommendation = "PROCEED WITH CAUTION. The website displays multiple security anomalies. Verify the sender and do not input passwords or payment details."
    else:
        risk_level = "Low Risk"
        color = "green"
        recommendation = "SAFE TO VISIT. The URL adheres to legitimate structural conventions and lacks phishing indicators."

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "color": color,
        "factors": factors,
        "recommendation": recommendation,
        "ml_contribution": ml_points,
        "heuristic_contribution": heuristic_points
    }

