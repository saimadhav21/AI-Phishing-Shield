import React, { useState } from 'react';
import axios from 'axios';
import { 
  Mail, 
  ShieldAlert, 
  AlertTriangle, 
  ShieldCheck, 
  ExternalLink, 
  RefreshCw, 
  Send, 
  FileText,
  Link2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import RiskGauge from '../components/RiskGauge';
import PageHeader from '../components/PageHeader';

export default function EmailScanner() {
  const [emailText, setEmailText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const sampleEmails = [
    {
      title: "Phishing: PayPal Suspension",
      text: "URGENT NOTICE: Your PayPal account has been temporarily restricted due to suspicious login attempts. Immediate action required within 24 hours to prevent permanent account suspension. Please click the link below to verify your account identity and update your credit card details immediately:\n\nhttp://secure.account.update.paypal.com.account-verify.xyz/login\n\nFailure to confirm will result in termination of your balance."
    },
    {
      title: "Phishing: Bank Security Breach",
      text: "Security Alert: A critical security breach has been detected on your online banking profile. To safeguard your funds, please update your password, passcode, and secret PIN immediately. Click here to confirm your credentials:\n\nhttp://192.168.1.105/paypal/login.php\n\nCustomer Protection Team."
    },
    {
      title: "Legitimate: Service Newsletter",
      text: "Hello Developer,\n\nHere is your monthly summary of updates. Explore our latest announcements regarding serverless architectures, artificial intelligence, and performance enhancements.\n\nRead the official documentation here: https://aws.amazon.com/blogs/aws/\n\nThank you for choosing our platform."
    }
  ];

  const handleScan = async (content = emailText) => {
    const textToScan = content || emailText;
    if (!textToScan.trim()) {
      setError("Please paste or type email content to analyze.");
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("http://localhost:8000/api/scan-email", { email_text: textToScan });
      if (res.data?.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Email analysis failed. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      
      {/* Enterprise Header */}
      <PageHeader 
        breadcrumb="Reporting and Identification of Phishing E-Mails"
        title="Reporting and Identification of Phishing E-Mails, Fake Communications & Scam Messages"
        description="Inspect suspicious incoming emails for artificial urgency, credential harvesting prompts, fake account warnings, and verify embedded hyperlinks using our cybersecurity detection engine."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Email Input Form */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 shadow-xs space-y-5 transition-colors duration-200">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-800 dark:text-cyan-400" />
                  <h2 className="text-sm sm:text-base font-bold text-[#0B2545] dark:text-white uppercase tracking-wider font-mono">
                    Email Forensics Input
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  NLP + Heuristic Analysis
                </span>
              </div>

              {/* Sample Presets */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block font-mono">
                  Quick Demo Test Samples:
                </span>
                <div className="flex flex-wrap gap-2">
                  {sampleEmails.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setEmailText(sample.text);
                        handleScan(sample.text);
                      }}
                      disabled={loading}
                      className="px-2.5 py-1.5 rounded text-xs font-mono bg-slate-100 hover:bg-slate-200 dark:bg-[#060A14] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-cyan-500/40 transition"
                    >
                      {sample.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
                  Email Message Body / Header Content:
                </label>
                <textarea
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  rows={8}
                  placeholder="Paste email content here (e.g., 'URGENT: Your account will be suspended within 24 hours. Click here to confirm your password...')"
                  className="w-full p-4 bg-slate-50 dark:bg-[#060A14] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-cyan-500/50 text-xs sm:text-sm font-mono leading-relaxed transition"
                  disabled={loading}
                />
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {emailText.length} characters • {emailText.split(/\s+/).filter(Boolean).length} words
                </span>

                <button
                  onClick={() => handleScan()}
                  disabled={loading || !emailText.trim()}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0B2545] hover:bg-[#1E3A8A] dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-600 text-white dark:text-slate-950 font-bold rounded-lg shadow-sm text-xs uppercase tracking-wider transition disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Analyze Email Content</span>
                </button>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

            </div>

          </div>

          {/* Right Column: Identification Guidelines (Directly inspired by reference website) */}
          <div className="space-y-6">
            
            <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4 transition-colors duration-200">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-[#0B2545] dark:text-cyan-400 font-bold text-xs uppercase tracking-wider font-mono">
                <Info className="w-4 h-4" />
                <span>Identification of Phishing E-Mails</span>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  <strong className="text-[#0B2545] dark:text-white">What is Email Phishing?</strong><br />
                  Phishing is the attempt to acquire sensitive credentials such as usernames, passwords, OTPs, and financial data by masquerading as a legitimate organization in an electronic communication.
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Phishing emails frequently employ psychological pressure—such as <strong>artificial urgency</strong>, <strong>threat of legal penalties</strong>, or <strong>immediate account suspension</strong>—to trick recipients into acting without verification.
                </p>
              </div>

              <div className="pt-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
                Rule Engine: 10 Urgent Panic & Credential Patterns
              </div>
            </div>

            <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-3 transition-colors duration-200">
              <h3 className="text-xs font-bold text-[#0B2545] dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 font-mono">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Common Red Flags
              </h3>

              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span><strong className="text-slate-800 dark:text-slate-200">Artificial Deadlines:</strong> Demands immediate action within "24 hours" or "account will be closed".</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span><strong className="text-slate-800 dark:text-slate-200">Credential Demands:</strong> Requests entering passwords, card numbers, or OTP tokens.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span><strong className="text-slate-800 dark:text-slate-200">Generic Greetings:</strong> Addresses you as "Valued Customer" instead of your actual registered name.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Results Report Display */}
        {result && (
          <div className="space-y-6 pt-4 animate-fadeIn">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              
              <div className="h-full">
                <RiskGauge score={result.risk_score} riskLevel={result.risk_level} />
              </div>

              <div className="md:col-span-2 h-full bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 flex flex-col justify-between shadow-xs transition-colors duration-200">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                      Social Engineering Assessment
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider font-mono ${
                      result.risk_level === "High Risk" 
                        ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800" 
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
                    }`}>
                      {result.risk_level}
                    </span>
                  </div>

                  <h3 className={`text-xl font-black font-mono ${
                    result.risk_level === "High Risk" ? "text-rose-600 dark:text-rose-400" : result.risk_level === "Suspicious" ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                  }`}>
                    {result.verdict}
                  </h3>

                  <div className="grid grid-cols-3 gap-3 mt-4 text-xs font-mono">
                    <div className="bg-slate-50 dark:bg-[#060A14] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 block text-[11px]">Links Detected:</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 block">{result.urls_detected}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#060A14] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 block text-[11px]">Risk Triggers:</span>
                      <span className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5 block">{result.findings?.length || 0}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#060A14] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 block text-[11px]">Total Words:</span>
                      <span className="text-lg font-bold text-slate-700 dark:text-slate-300 mt-0.5 block">{result.word_count}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-mono pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80">
                  Pattern matching: Urgency heuristics, credential requests, hyperlink inspection
                </div>
              </div>

            </div>

            {/* Social Engineering Triggers List */}
            <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 shadow-xs space-y-4 transition-colors duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-700 dark:text-cyan-400" />
                  <h3 className="text-sm font-bold text-[#0B2545] dark:text-white tracking-wide uppercase font-mono">
                    Identified Threat Indicators ({result.findings?.length || 0})
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">NLP Trigger Evaluation</span>
              </div>

              {result.findings && result.findings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {result.findings.map((f, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-lg border flex items-start gap-3.5 ${
                        f.severity === "danger"
                          ? "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/20 dark:border-rose-800/40 dark:text-rose-200"
                          : "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:border-amber-800/40 dark:text-amber-200"
                      }`}
                    >
                      {f.severity === "danger" ? (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold font-mono">{f.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-black/50 border border-slate-200 dark:border-transparent font-bold">+{f.penalty} pts</span>
                        </div>
                        <p className="text-xs leading-relaxed opacity-90">{f.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No urgency markers, panic triggers, or credential requests detected in text.</span>
                </div>
              )}
            </div>

            {/* Embedded URLs Scan */}
            {result.embedded_urls && result.embedded_urls.length > 0 && (
              <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 shadow-xs space-y-4 transition-colors duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                    <h3 className="text-sm font-bold text-[#0B2545] dark:text-white tracking-wide uppercase font-mono">
                      Embedded Hyperlink Deep Scans ({result.embedded_urls.length})
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-blue-700 dark:text-cyan-400">Random Forest Evaluated</span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {result.embedded_urls.map((link, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 dark:bg-[#060A14] border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="truncate text-slate-800 dark:text-slate-200 max-w-xl text-xs" title={link.url}>{link.url}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`font-bold ${
                          link.risk_score >= 60 ? "text-rose-600 dark:text-rose-400" : link.risk_score >= 30 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                        }`}>
                          Threat: {link.risk_score}/100
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          link.risk_level === "High Risk" 
                            ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800" 
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
                        }`}>
                          {link.risk_level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}