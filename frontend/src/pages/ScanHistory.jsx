import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  History, 
  Search, 
  Trash2, 
  Download, 
  RefreshCw, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Filter,
  CheckCircle2
} from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function ScanHistory() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'high', 'suspicious', 'safe'
  const [expandedId, setExpandedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const url = search 
        ? `http://localhost:8000/api/history?search=${encodeURIComponent(search)}`
        : "http://localhost:8000/api/history";
      const res = await axios.get(url);
      if (res.data?.success) {
        setScans(res.data.data);
      }
    } catch (err) {
      console.error("Error loading scan history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [search]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Remove this scan record from database?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:8000/api/history/${id}`);
      setScans(scans.filter(s => s.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all scan history records?")) return;
    try {
      await axios.post("http://localhost:8000/api/history/clear");
      setScans([]);
    } catch (err) {
      console.error("Clear error:", err);
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scans, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `phishing-shield-audit-log-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredScans = scans.filter(scan => {
    if (activeFilter === 'high') return scan.risk_level === 'High Risk';
    if (activeFilter === 'suspicious') return scan.risk_level === 'Suspicious';
    if (activeFilter === 'safe') return scan.risk_level === 'Low Risk';
    return true;
  });

  return (
    <div className="min-h-screen pb-16">
      
      {/* Enterprise Header */}
      <PageHeader 
        breadcrumb="Scan Audit Logs & History"
        title="Threat Audit Logs & Historical Scan Records"
        description="Comprehensive audit trail of all evaluated URLs and domains. Synchronized with the database repository, documenting risk scores, model classifications, and timestamps for security compliance."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              disabled={scans.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-[#0A1120] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-medium rounded-lg border border-slate-300 dark:border-slate-700 transition disabled:opacity-50 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleClearAll}
              disabled={scans.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-mono font-medium rounded-lg border border-rose-200 dark:border-rose-800/40 transition disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Clear Log</span>
            </button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 transition-colors duration-200">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by URL, domain, or threat classification..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#060A14] border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-cyan-500/50"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 font-mono text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold dark:bg-cyan-500/15 dark:border-cyan-500/40 dark:text-cyan-300'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-[#060A14] dark:border-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              All ({scans.length})
            </button>

            <button
              onClick={() => setActiveFilter('high')}
              className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap ${
                activeFilter === 'high'
                  ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold dark:bg-rose-500/15 dark:border-rose-500/40 dark:text-rose-300'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-[#060A14] dark:border-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              High Risk ({scans.filter(s => s.risk_level === 'High Risk').length})
            </button>

            <button
              onClick={() => setActiveFilter('suspicious')}
              className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap ${
                activeFilter === 'suspicious'
                  ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold dark:bg-amber-500/15 dark:border-amber-500/40 dark:text-amber-300'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-[#060A14] dark:border-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Suspicious ({scans.filter(s => s.risk_level === 'Suspicious').length})
            </button>

            <button
              onClick={() => setActiveFilter('safe')}
              className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap ${
                activeFilter === 'safe'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold dark:bg-emerald-500/15 dark:border-emerald-500/40 dark:text-emerald-300'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-[#060A14] dark:border-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Safe ({scans.filter(s => s.risk_level === 'Low Risk').length})
            </button>

            <button
              onClick={fetchHistory}
              className="p-2 bg-slate-100 dark:bg-[#060A14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition ml-1"
              title="Refresh Records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-600 dark:text-cyan-400" : ""}`} />
            </button>
          </div>

        </div>

        {/* Audit Log Table Container */}
        <div className="bg-white dark:bg-[#0A1122] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-colors duration-200">
          {filteredScans.length > 0 ? (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 dark:bg-[#060A14] text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Threat Target URL / Host</th>
                      <th className="py-3 px-4">AI Prediction</th>
                      <th className="py-3 px-4">Confidence</th>
                      <th className="py-3 px-4">Score</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredScans.map((scan) => {
                      const isExpanded = expandedId === scan.id;
                      return (
                        <React.Fragment key={scan.id}>
                          <tr 
                            onClick={() => setExpandedId(isExpanded ? null : scan.id)}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer transition"
                          >
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                {scan.risk_level === "High Risk" ? (
                                  <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                                ) : scan.risk_level === "Suspicious" ? (
                                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                                ) : (
                                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                )}
                                <div>
                                  <div className="max-w-xs sm:max-w-md truncate text-slate-900 dark:text-slate-200 font-bold" title={scan.url}>
                                    {scan.url}
                                  </div>
                                  <span className="text-[10px] text-slate-500 block">{scan.domain}</span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-bold">
                              <span className={scan.ai_prediction === "Phishing" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}>
                                {scan.ai_prediction}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                              {scan.ai_confidence}%
                            </td>

                            <td className="py-3.5 px-4 font-bold">
                              <span className={scan.risk_score >= 60 ? "text-rose-600 dark:text-rose-400" : scan.risk_score >= 30 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}>
                                {scan.risk_score}/100
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                                scan.risk_level === "High Risk" 
                                  ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800" 
                                  : scan.risk_level === "Suspicious" 
                                  ? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800" 
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
                              }`}>
                                {scan.risk_level}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                              {new Date(scan.timestamp).toLocaleString()}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={(e) => handleDelete(scan.id, e)}
                                  disabled={deletingId === scan.id}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setExpandedId(isExpanded ? null : scan.id)}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 rounded transition"
                                >
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Detail View */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={7} className="p-5 bg-slate-50 dark:bg-[#060A14] border-t border-b border-slate-200 dark:border-slate-800 space-y-3">
                                <div>
                                  <span className="text-blue-800 dark:text-cyan-400 font-bold block mb-1">Recommended Security Action:</span>
                                  <p className="text-slate-700 dark:text-slate-300 text-xs">{scan.recommendation}</p>
                                </div>

                                <div>
                                  <span className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">Explainable AI Risk Factors:</span>
                                  {scan.factors && scan.factors.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                      {scan.factors.map((f, i) => (
                                        <div key={i} className="p-2.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 flex items-start gap-2">
                                          <span className={f.severity === "danger" ? "text-rose-600 dark:text-rose-400 font-bold" : "text-amber-600 dark:text-amber-400 font-bold"}>•</span>
                                          <div>
                                            <span className="text-slate-900 dark:text-white font-bold">{f.title}:</span>{" "}
                                            <span className="text-slate-600 dark:text-slate-400">{f.description}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-slate-500">No risk factors flagged.</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card View */}
              <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredScans.map((scan) => (
                  <div key={scan.id} className="p-4 space-y-2.5 font-mono text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="truncate text-slate-900 dark:text-slate-200 font-bold" title={scan.url}>
                        {scan.url}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider shrink-0 ${
                        scan.risk_level === "High Risk" ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                      }`}>
                        {scan.risk_level}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                      <span>AI: <strong className={scan.ai_prediction === "Phishing" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}>{scan.ai_prediction}</strong> ({scan.ai_confidence}%)</span>
                      <span className="font-bold text-slate-900 dark:text-white">Score: {scan.risk_score}/100</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>{new Date(scan.timestamp).toLocaleString()}</span>
                      <button
                        onClick={(e) => handleDelete(scan.id, e)}
                        className="text-rose-600 dark:text-rose-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500 font-mono">
              {search ? "No scan records matched your search query." : "No scans logged in database yet. Try scanning a URL!"}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}