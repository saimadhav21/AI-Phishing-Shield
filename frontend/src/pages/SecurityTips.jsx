import React from 'react';
import { 
  Lightbulb, 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  Lock, 
  FileCheck, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Info, 
  Shield, 
  Layers, 
  ExternalLink 
} from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function SecurityTips() {
  const redFlags = [
    {
      title: "1. Misleading Subdomain Stacking",
      bad: "http://paypal.com.verify-billing-update.xyz/login",
      explanation: "Threat actors place trusted brand names as subdomains to fool users. Always examine the ROOT domain immediately preceding the first single path slash (/), which in this example is 'verify-billing-update.xyz'."
    },
    {
      title: "2. Raw IP Address Hosts",
      bad: "http://192.168.1.100/chase/bank/auth",
      explanation: "Legitimate enterprise institutions and government portals always use registered domain names with enterprise SSL. If a web address utilizes a raw IPv4 or IPv6 address, it is almost certainly a malicious phishing host."
    },
    {
      title: "3. High-Abuse Top-Level Domains (TLDs)",
      bad: "http://amazon-prime-delivery-status.top/claim",
      explanation: "Cheap or unregulated TLDs (.xyz, .top, .tk, .ml, .buzz, .icu) are frequently chosen by automated threat actors due to minimal registration verification and near-zero cost."
    },
    {
      title: "4. Credential Redirection Symbols (@)",
      bad: "http://google.com@malicious-attacker.com/steal",
      explanation: "In HTTP URL standards, everything before an '@' symbol is treated as inline user credentials and ignored by the browser, silently routing the visitor to 'malicious-attacker.com'."
    }
  ];

  const socBestPractices = [
    {
      icon: Eye,
      title: "Inspect Address Bar & SSL Certificate",
      desc: "Verify the exact spelling of the domain. Watch out for homograph typosquatting (e.g. paypaI.com with capital 'I' instead of 'l'). Remember: HTTPS means encrypted, not necessarily safe."
    },
    {
      icon: AlertTriangle,
      title: "Beware of Artificial Urgency & Coercion",
      desc: "Phishing communications invoke panic ('Account suspended in 24 hours!') to compel victims to bypass rational verification and click links without thinking."
    },
    {
      icon: Lock,
      title: "Enforce Hardware-Bound MFA",
      desc: "Implement Multi-Factor Authentication via FIDO2 / WebAuthn security keys or authenticator apps. Hardware-bound MFA cannot be stolen by standard reverse-proxy phishing kits."
    },
    {
      icon: FileCheck,
      title: "Out-of-Band Verification",
      desc: "If an email or message requests payments, password changes, or credential updates, contact the institution through their officially published telephone number, never through email reply."
    }
  ];

  return (
    <div className="min-h-screen pb-16">
      
      {/* Enterprise Header */}
      <PageHeader 
        breadcrumb="Reporting and Identification Guidelines"
        title="Reporting and Identification of Phishing, Fraudulent E-mail Scams and Fake Web Sites"
        description="Official cybersecurity defense guidelines, URL anatomy breakdown, and threat identification criteria modeled after enterprise security operations center (SOC) and institutional portals."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section 1: Official Disclaimer (Modeled directly after reference site) */}
        <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 shadow-xs space-y-4 transition-colors duration-200">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-[#0B2545] dark:text-white font-mono">
              Disclaimer
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              The Cybersecurity Threat Intelligence Platform, government agencies, and legitimate financial institutions <strong>do not request detailed personal information through e-mail</strong>.
            </p>
            <p>
              The platform and recognized authorities <strong>do not send e-mails requesting your PIN numbers, passwords, OTP tokens, or similar access information</strong> for credit cards, banks, or other financial accounts.
            </p>
          </div>
        </div>

        {/* Section 2: Identification Guidelines (Directly from reference site) */}
        <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 shadow-xs space-y-5 transition-colors duration-200">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-[#0B2545] dark:text-white font-mono">
              Identification of phishing / fraudulent e-mails and fake portals
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <h3 className="font-bold text-sm sm:text-base text-[#0B2545] dark:text-slate-100">
              What is phishing?
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Phishing is the process of attempting to acquire sensitive information such as usernames, passwords, and credit card details by masquerading as a trustworthy entity in an electronic communication. Communications purporting to be from financial institutions, popular social web sites, government agencies, online payment processors, or IT administrators are commonly used to lure the unsuspecting public. Phishing is typically carried out by e-mail or instant messaging, and it often directs users to enter details at a fake website whose look and feel are almost identical to the legitimate one.
            </p>
          </div>
        </div>

        {/* Section 3: Visual Anatomy of a URL */}
        <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 shadow-xs space-y-6 transition-colors duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-blue-700 dark:text-cyan-400 font-bold block mb-1 font-mono">
                Structural Comparison
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#0B2545] dark:text-white font-mono">
                Anatomy of a Phishing URL vs Legitimate URL
              </h2>
            </div>
            <span className="hidden sm:inline text-xs font-mono text-slate-500">
              Lexical Breakdown
            </span>
          </div>

          {/* Phishing Example Box */}
          <div className="space-y-4">
            <div className="p-5 bg-slate-50 dark:bg-[#060A14] rounded-lg border border-rose-200 dark:border-rose-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <XCircle className="w-4 h-4" />
                  Deceptive Phishing URL Structure (High Risk):
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-mono border border-rose-200 dark:border-rose-800">
                  Subdomain Impersonation
                </span>
              </div>

              <div className="font-mono text-xs sm:text-sm p-3.5 bg-white dark:bg-slate-900/90 rounded border border-slate-200 dark:border-slate-800 overflow-x-auto text-slate-800 dark:text-slate-200">
                <span className="text-slate-400">http://</span>
                <span className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1 py-0.5 rounded font-bold">secure.login.paypal.com</span>
                <span className="text-slate-400">.</span>
                <span className="text-rose-600 dark:text-rose-400 font-black bg-rose-50 dark:bg-rose-950/60 px-1 py-0.5 rounded">account-verify.xyz</span>
                <span className="text-blue-700 dark:text-cyan-400">/signin.php?token=alert</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-700 dark:text-slate-300 pt-1">
                <div className="bg-white dark:bg-slate-950/60 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-amber-700 dark:text-amber-400 font-bold block">1. Spoofed Subdomains:</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Brand decoy ('paypal.com')</span>
                </div>
                <div className="bg-white dark:bg-slate-950/60 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-rose-700 dark:text-rose-400 font-bold block">2. Actual Root Domain:</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">'account-verify.xyz' (Malicious)</span>
                </div>
                <div className="bg-white dark:bg-slate-950/60 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-blue-700 dark:text-cyan-400 font-bold block">3. Harvest Path:</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Steals entered credentials</span>
                </div>
              </div>
            </div>

            {/* Legitimate Example Box */}
            <div className="p-5 bg-slate-50 dark:bg-[#060A14] rounded-lg border border-emerald-200 dark:border-emerald-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  Legitimate Organization Structure (Low Risk):
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-mono border border-emerald-200 dark:border-emerald-800">
                  Verified Authority
                </span>
              </div>

              <div className="font-mono text-xs sm:text-sm p-3.5 bg-white dark:bg-slate-900/90 rounded border border-slate-200 dark:border-slate-800 overflow-x-auto text-slate-800 dark:text-slate-200">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">https://</span>
                <span className="text-slate-400">www.</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-black bg-emerald-50 dark:bg-emerald-950/60 px-1 py-0.5 rounded">paypal.com</span>
                <span className="text-slate-500 dark:text-slate-400">/signin</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                The authentic root domain 'paypal.com' is registered to the verified authority and operates strictly over encrypted HTTPS with a valid certificate.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: 4 Critical Red Flags */}
        <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 shadow-xs space-y-6 transition-colors duration-200">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-[#0B2545] dark:text-white uppercase tracking-wider font-mono">
              Top 4 URL Phishing Red Flags
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Common structural patterns identified by our Random Forest classifier:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {redFlags.map((flag, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-[#060A14] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#0B2545] dark:text-white font-mono">{flag.title}</h3>
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 font-mono text-xs text-rose-700 dark:text-rose-300 break-all select-all my-2.5">
                    {flag.bad}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {flag.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Best Practices */}
        <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 shadow-xs space-y-6 transition-colors duration-200">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-[#0B2545] dark:text-white uppercase tracking-wider font-mono">
              Cybersecurity Defense Best Practices
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {socBestPractices.map((bp, idx) => {
              const Icon = bp.icon;
              return (
                <div key={idx} className="bg-slate-50 dark:bg-[#060A14] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-cyan-500/10 text-blue-800 dark:text-cyan-400 border border-blue-200 dark:border-cyan-500/20 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs font-bold text-[#0B2545] dark:text-white uppercase tracking-wider font-mono">{bp.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{bp.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}