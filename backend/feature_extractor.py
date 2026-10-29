"""
Feature Extraction Engine for Phishing Shield AI
Extracts 18 lexical, structural, and semantic features from URLs for machine learning classification.
"""

import re
from urllib.parse import urlparse
import ipaddress

SUSPICIOUS_KEYWORDS = [
    "login", "verify", "account", "update", "banking", "secure", "confirm",
    "password", "credential", "wallet", "paypal", "signin", "auth", "ebay",
    "amazon", "appleid", "support", "billing", "recover", "security", "token",
    "free", "prize", "bonus", "winner", "service", "validation"
]

SUSPICIOUS_TLDS = {
    "xyz", "top", "tk", "ml", "ga", "cf", "gq", "buzz", "cc", "icu",
    "work", "click", "fit", "surf", "date", "racing", "review", "country",
    "kim", "cricket", "science", "party", "gdn", "mom", "vip"
}

SHORTENING_SERVICES = {
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly",
    "adf.ly", "bit.do", "cutt.ly", "tiny.cc", "rebrand.ly", "qr.ae", "rb.gy"
}

FEATURE_NAMES = [
    "url_length",
    "domain_length",
    "num_dots",
    "num_hyphens",
    "num_subdomains",
    "has_ip_address",
    "has_at_symbol",
    "has_double_slash_redirect",
    "is_https",
    "has_shortener",
    "suspicious_keywords_count",
    "suspicious_tld",
    "special_char_ratio",
    "digit_ratio",
    "consecutive_digits_max",
    "has_punycode",
    "has_port_in_url",
    "path_depth"
]


def normalize_url(url: str) -> str:
    """Ensure URL has a proper scheme for parsing."""
    url = url.strip()
    if not url.startswith("http://") and not url.startswith("https://"):
        return f"http://{url}"
    return url


def is_ip(domain: str) -> int:
    """Check if domain is a direct IPv4 or IPv6 address."""
    # Strip port if present
    host = domain.split(":")[0] if ":" in domain else domain
    try:
        ipaddress.ip_address(host)
        return 1
    except ValueError:
        return 0


def count_subdomains(domain: str) -> int:
    """Calculate the number of subdomains in domain."""
    host = domain.split(":")[0] if ":" in domain else domain
    parts = host.split(".")
    # Filter out empty parts
    parts = [p for p in parts if p]
    if len(parts) <= 2:
        return 0
    return max(0, len(parts) - 2)


def max_consecutive_digits(text: str) -> int:
    """Find maximum length of consecutive digits in text."""
    matches = re.findall(r"\d+", text)
    if not matches:
        return 0
    return max(len(m) for m in matches)


def extract_features(raw_url: str) -> dict:
    """
    Extracts 18 numerical and categorical features from raw URL.
    Returns both a dictionary of named features and a numeric vector for model input.
    """
    norm_url = normalize_url(raw_url)
    parsed = urlparse(norm_url)

    domain = parsed.netloc.lower()
    path = parsed.path
    query = parsed.query

    # 1. Lengths
    url_length = len(raw_url)
    domain_length = len(domain)

    # 2. Symbols
    num_dots = raw_url.count(".")
    num_hyphens = raw_url.count("-")
    num_subdomains = count_subdomains(domain)

    # 3. IP Address Host
    has_ip = is_ip(domain)

    # 4. Dangerous Patterns
    has_at = 1 if "@" in raw_url else 0
    # Check for // in path/query (redirect evasion)
    has_double_slash = 1 if "//" in path or "//" in query else 0

    # 5. Security & Protocol
    is_https = 1 if raw_url.lower().startswith("https://") else 0

    # 6. URL Shortener
    has_shortener = 1 if any(shortener in domain for shortener in SHORTENING_SERVICES) else 0

    # 7. Keywords
    url_lower = raw_url.lower()
    keyword_count = sum(1 for kw in SUSPICIOUS_KEYWORDS if kw in url_lower)

    # 8. Suspicious TLD
    domain_parts = domain.split(".")
    tld = domain_parts[-1] if domain_parts else ""
    suspicious_tld = 1 if tld in SUSPICIOUS_TLDS else 0

    # 9. Character distributions
    special_chars = set("-_=?&%#+@!~$,")
    special_count = sum(1 for c in raw_url if c in special_chars)
    special_char_ratio = round(special_count / max(1, url_length), 4)

    digit_count = sum(1 for c in raw_url if c.isdigit())
    digit_ratio = round(digit_count / max(1, url_length), 4)
    consecutive_digits = max_consecutive_digits(raw_url)

    # 10. Advanced Indicators
    has_punycode = 1 if "xn--" in domain else 0
    has_port = 1 if parsed.port is not None and parsed.port not in (80, 443) else 0
    path_depth = len([segment for segment in path.split("/") if segment])

    feature_dict = {
        "url_length": url_length,
        "domain_length": domain_length,
        "num_dots": num_dots,
        "num_hyphens": num_hyphens,
        "num_subdomains": num_subdomains,
        "has_ip_address": has_ip,
        "has_at_symbol": has_at,
        "has_double_slash_redirect": has_double_slash,
        "is_https": is_https,
        "has_shortener": has_shortener,
        "suspicious_keywords_count": keyword_count,
        "suspicious_tld": suspicious_tld,
        "special_char_ratio": special_char_ratio,
        "digit_ratio": digit_ratio,
        "consecutive_digits_max": consecutive_digits,
        "has_punycode": has_punycode,
        "has_port_in_url": has_port,
        "path_depth": path_depth,
    }

    feature_vector = [feature_dict[name] for name in FEATURE_NAMES]

    return {
        "features": feature_dict,
        "vector": feature_vector,
        "domain": domain,
        "tld": tld,
        "protocol": "https" if is_https else "http",
        "normalized_url": norm_url
    }

