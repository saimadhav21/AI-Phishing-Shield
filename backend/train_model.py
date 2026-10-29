"""
Model Trainer for Phishing Shield AI
Trains a Scikit-Learn Random Forest Classifier on legitimate and phishing URL patterns.
Outputs trained artifact to backend/models/phishing_rf_model.joblib
"""

import json
import os
import random
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib

from feature_extractor import extract_features, FEATURE_NAMES

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODELS_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODELS_DIR, "phishing_rf_model.joblib")
METADATA_PATH = os.path.join(MODELS_DIR, "model_metadata.json")


def generate_training_data():
    """
    Generates a balanced dataset of verified legitimate and phishing URLs.
    Includes diverse structural archetypes for deep feature learning.
    """
    legitimate_samples = [
        # Search & Tech Giants
        "https://www.google.com", "https://google.com/search?q=cybersecurity",
        "https://www.microsoft.com/en-us/windows", "https://support.microsoft.com",
        "https://aws.amazon.com/console", "https://aws.amazon.com/s3", "https://aws.amazon.com/dynamodb",
        "https://apple.com/iphone", "https://developer.apple.com/documentation",
        "https://github.com", "https://github.com/torvalds/linux", "https://gist.github.com",
        "https://gitlab.com", "https://bitbucket.org",
        "https://stackoverflow.com/questions/tagged/python", "https://stackexchange.com",
        
        # E-commerce & Cloud
        "https://www.amazon.com/gp/bestsellers", "https://www.ebay.com/itm/12345678",
        "https://www.walmart.com", "https://store.steampowered.com", "https://netflix.com/browse",
        "https://open.spotify.com", "https://youtube.com/watch?v=dQw4w9WgXcQ",
        "https://cloud.google.com/vertex-ai", "https://azure.microsoft.com/services",
        "https://digitalocean.com/products/droplets", "https://heroku.com",
        
        # Banking & Finance (Legitimate)
        "https://www.chase.com", "https://www.bankofamerica.com", "https://www.wellsfargo.com",
        "https://www.citi.com", "https://www.fidelity.com", "https://www.vanguard.com",
        "https://www.paypal.com/signin", "https://www.stripe.com/docs",
        
        # Education & News
        "https://www.harvard.edu/academics", "https://mit.edu/research",
        "https://stanford.edu", "https://en.wikipedia.org/wiki/Phishing",
        "https://www.nytimes.com", "https://bbc.com/news", "https://reuters.com",
        "https://techcrunch.com", "https://wired.com", "https://medium.com",
        "https://python.org/downloads", "https://pypi.org/project/scikit-learn",
        "https://developer.mozilla.org/en-US/docs/Web/HTTP", "https://fastapi.tiangolo.com"
    ]

    phishing_samples = [
        # IP-based Phishing
        "http://192.168.1.105/paypal/login.php",
        "http://45.33.32.156/secure/account-update.html",
        "http://216.58.214.206/appleid-recovery/verify.php",
        "http://104.244.42.1/chase/bank/auth?token=x99",
        "http://185.199.108.153:8080/wellsfargo/signin",
        "http://198.51.100.24/online-banking/login.asp",
        
        # Excessive Subdomains & Brand Impersonation
        "http://secure.account.update.paypal.com.account-verify.xyz/login",
        "http://signin.ebay.com.security-check.top/auth/pass.php",
        "http://appleid.apple.com.verify-billing.tk/identity/card",
        "http://netflix.account.billing-update.ml/user/session",
        "http://login.microsoftonline.com.oauth-recovery.ga/token",
        "http://aws.amazon.com.session-expire.cf/console/root",
        "http://secure.chase.com.security-alert-online.gq/login",
        
        # High-risk TLDs + Credential Keywords
        "http://chase-bank-verify-account.xyz/login",
        "http://paypal-account-restricted.top/resolution-center",
        "http://bofa-online-update.buzz/identity",
        "http://wellsfargo-security-alert.icu/auth",
        "http://amazon-prime-renewal-billing.cc/verify",
        "http://apple-icloud-locked-restore.work/login.aspx",
        "http://instagram-copyright-infringement.click/appeal",
        "http://facebook-security-team-checkpoint.surf/verify",
        
        # Obfuscated & Character Spoofing / Redirecting
        "http://login-paypal.com@evilsite.com/capture",
        "http://bankofamerica.com//login/redirect.php?dest=malicious",
        "http://secure-update-password-credentials-wallet.com/login?u=1&token=998877665544332211",
        "http://xn--gogle-pqa.com/search-security-login",
        "http://myetherwallet.com.crypto-airdrop-bonus.xyz/claim?free=1000",
        "http://bit.ly/3xPhishBankVerifyRedirect",
        "http://tinyurl.com/urgent-account-verify-login-2026"
    ]

    # Generate synthetic variations to provide a robust dataset (2000+ balanced samples)
    legit_domains = [
        "google.com", "microsoft.com", "apple.com", "amazon.com", "github.com",
        "cloudflare.com", "salesforce.com", "oracle.com", "adobe.com", "zoom.us",
        "slack.com", "atlassian.net", "dropbox.com", "shopify.com", "linkedin.com",
        "twitter.com", "reddit.com", "quora.com", "cnn.com", "forbes.com"
    ]
    legit_paths = [
        "", "about", "contact", "products", "features", "pricing", "docs/api",
        "blog/2026/security-best-practices", "help/center", "community/forum",
        "services/cloud", "solutions/enterprise", "resources/whitepaper"
    ]

    phish_brands = ["paypal", "chase", "bankofamerica", "wellsfargo", "apple", "amazon", "netflix", "microsoft", "binance", "coinbase"]
    phish_actions = ["login", "verify", "secure", "update", "account-alert", "billing-fix", "unlock", "confirm-id"]
    phish_tlds = ["xyz", "top", "tk", "ml", "ga", "cf", "gq", "buzz", "cc", "icu", "click", "work"]

    data_x = []
    data_y = []

    # Add seeds
    for u in legitimate_samples:
        feat = extract_features(u)["vector"]
        data_x.append(feat)
        data_y.append(0)

    for u in phishing_samples:
        feat = extract_features(u)["vector"]
        data_x.append(feat)
        data_y.append(1)

    # Synthesize diverse legitimate URLs
    for _ in range(1200):
        d = random.choice(legit_domains)
        p = random.choice(legit_paths)
        scheme = "https" if random.random() > 0.1 else "http"
        has_sub = "www." if random.random() > 0.4 else ""
        url = f"{scheme}://{has_sub}{d}/{p}"
        if random.random() > 0.6:
            url += f"?id={random.randint(100, 99999)}&ref={random.choice(['home', 'nav', 'footer'])}"
        data_x.append(extract_features(url)["vector"])
        data_y.append(0)

    # Synthesize diverse phishing URLs
    for _ in range(1200):
        brand = random.choice(phish_brands)
        act = random.choice(phish_actions)
        tld = random.choice(phish_tlds)
        arch = random.randint(1, 4)

        if arch == 1:
            # IP based
            ip = f"{random.randint(11, 220)}.{random.randint(1, 254)}.{random.randint(1, 254)}.{random.randint(1, 254)}"
            url = f"http://{ip}/{brand}/{act}.php?id={random.randint(1000, 99999)}"
        elif arch == 2:
            # Multi subdomain spoofing
            url = f"http://{act}.{brand}.com.session-recovery-service.{tld}/index.html"
        elif arch == 3:
            # High risk TLD + hyphen stuffing
            url = f"http://{brand}-{act}-customer-support-portal.{tld}/auth?user_token={''.join(random.choices('0123456789abcdef', k=24))}"
        else:
            # Long URL with redirects or credentials
            url = f"http://service-alert-{brand}.{tld}/login//redirect?target=http://victim-session-id-{random.randint(100000, 999999)}"

        data_x.append(extract_features(url)["vector"])
        data_y.append(1)

    return data_x, data_y


def train_and_save_model():
    """Trains the Random Forest model and serializes the weights and metadata."""
    print("Generating training dataset...")
    X, y = generate_training_data()

    print(f"Dataset generated: {len(X)} samples ({y.count(0)} legitimate, {y.count(1)} phishing).")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)

    print("Training Random Forest Classifier (100 estimators)...")
    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=12,
        min_samples_split=4,
        random_state=42,
        class_weight="balanced"
    )
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    accuracy = round(accuracy_score(y_test, y_pred) * 100, 2)
    precision = round(precision_score(y_test, y_pred) * 100, 2)
    recall = round(recall_score(y_test, y_pred) * 100, 2)
    f1 = round(f1_score(y_test, y_pred) * 100, 2)

    print(f"Model Training Results:")
    print(f" - Accuracy:  {accuracy}%")
    print(f" - Precision: {precision}%")
    print(f" - Recall:    {recall}%")
    print(f" - F1 Score:  {f1}%")

    # Save model artifact
    joblib.dump(clf, MODEL_PATH)
    print(f"Model saved to: {MODEL_PATH}")

    # Compute Feature Importances
    importances = clf.feature_importances_
    feat_importance_list = [
        {"feature": name, "importance": round(float(imp) * 100, 2)}
        for name, imp in sorted(zip(FEATURE_NAMES, importances), key=lambda x: x[1], reverse=True)
    ]

    metadata = {
        "model_name": "Phishing Shield Random Forest Classifier",
        "version": "1.0.0",
        "algorithm": "RandomForestClassifier(n_estimators=100, max_depth=12)",
        "features_count": len(FEATURE_NAMES),
        "feature_names": FEATURE_NAMES,
        "feature_importances": feat_importance_list,
        "metrics": {
            "accuracy": accuracy,
            "precision": precision,
            "recall": recall,
            "f1_score": f1,
            "total_samples": len(X),
            "train_samples": len(X_train),
            "test_samples": len(X_test)
        }
    }

    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"Metadata saved to: {METADATA_PATH}")
    return metadata


if __name__ == "__main__":
    train_and_save_model()

