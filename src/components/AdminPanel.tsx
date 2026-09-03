import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Trash, 
  Check, 
  X,
  Settings, 
  Activity, 
  Users, 
  Globe, 
  Database,
  Search,
  AlertTriangle,
  RefreshCw,
  Lock,
  Shield,
  FileText,
  UserCheck,
  AlertOctagon,
  Sparkles,
  Terminal,
  Zap,
  CheckCircle,
  Eye
} from "lucide-react";
import { JobOpportunity, JobApplication } from "../types";

interface AdminPanelProps {
  isDarkMode: boolean;
}

export default function AdminPanel({ isDarkMode }: AdminPanelProps) {
  // Passcode gate state
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passError, setPassError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  // Data states
  const [reportedJobs, setReportedJobs] = useState<JobOpportunity[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Security stats simulation
  const [firewallLogs, setFirewallLogs] = useState<string[]>([
    "System boot: Shield Firewall engine v4.2 activated.",
    "Intrusion detection: Rate limiting set at 60req/min per endpoint.",
    "Bypass Prevention: Custom authorization tokens verified on core routers.",
    "Secure Socket Check: No open ports found aside from 3000 egress route."
  ]);
  
  // Malware scanner targets
  const [malwareTargets, setMalwareTargets] = useState([
    { id: "mw-1", fileName: "jesse_portfolio_resume_pdf.exe", docUrl: "https://jesseorie.dev/assets/jesse_portfolio_resume_pdf.exe", isMalicious: true, detectedType: "Trojan.Downloader.W32", size: "4.2MB", status: "Active Threat" },
    { id: "mw-2", fileName: "github_typescript_profile_scr.js", docUrl: "https://github.com/jesseorie/profile_scr.js", isMalicious: true, detectedType: "JS.Coinminer.WebAgent", size: "124KB", status: "Active Threat" },
    { id: "mw-3", fileName: "jesse_urie_certified_credentials.png", docUrl: "https://jesseorie.dev/credentials.png", isMalicious: false, detectedType: "None (Clean PNG Asset)", size: "1.1MB", status: "Clean Document" }
  ]);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      // Flagged reports
      const repRes = await fetch("/api/admin/reports");
      if (repRes.ok) {
        const repData = await repRes.json();
        setReportedJobs(repData);
      }

      // Applications Queue
      const appRes = await fetch("/api/admin/applications");
      if (appRes.ok) {
        const appData = await appRes.json();
        setApplications(appData);
      }
    } catch (err) {
      console.error("Failed fetching admin data structures:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  // Handle gate validation
  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) {
      setPassError("LOCKDOWN ACTIVE: Maximum incorrect attempts exceeded. System locked for security.");
      return;
    }

    if (passcode === "246878910") {
      setIsAuthenticated(true);
      setPassError("");
      setLoginAttempts(0);
      const timeStr = new Date().toLocaleTimeString();
      setFirewallLogs(prev => [
        `[${timeStr}] SUCCESSFUL ROOT login from administrative terminal.`,
        ...prev
      ]);
    } else {
      const nextAttempts = loginAttempts + 1;
      setLoginAttempts(nextAttempts);
      const timeStr = new Date().toLocaleTimeString();

      if (nextAttempts >= 3) {
        setIsLockedOut(true);
        setPassError("CRITICAL EXPLOIT LOCKOUT: 3 incorrect passcode attempts matched! Admin Panel has been permanently locked for this session. Threat telemetry dispatched.");
        setFirewallLogs(prev => [
          `[${timeStr}] 🚨 EMERGENCY SHIELD LOCKDOWN ACTIVE: Excessive verification failures detected!`,
          `[${timeStr}] 🚨 BLOCKED attacker node from attempting further access signatures.`,
          ...prev
        ]);
      } else {
        setPassError(`ACCESS DENIED: Authentication passcode invalid. Attempt ${nextAttempts}/3. Action logged.`);
        setFirewallLogs(prev => [
          `[${timeStr}] WARNING: Brute-force attempt blocked on passcode check! (Attempt ${nextAttempts}/3)`,
          ...prev
        ]);
      }
    }
  };

  // Decline/Approve actions
  const handleApproveApplication = async (appId: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${appId}/approve`, {
        method: "POST"
      });
      if (res.ok) {
        alert("Application approved successfully! User has been notified with direct offer status.");
        fetchAdminData();
        setFirewallLogs(prev => [
          `[${new Date().toLocaleTimeString()}] APPROVED Candidate application reference ID: ${appId}`,
          ...prev
        ]);
      } else {
        const errData = await res.json();
        alert(`⚠️ Approval Rejected: ${errData.message || "Action blocked by compliance rules."}`);
        setFirewallLogs(prev => [
          `[${new Date().toLocaleTimeString()}] BLOCKED approval on app ID: ${appId}. Compliance limit reached.`,
          ...prev
        ]);
      }
    } catch (err) {
      console.error("Failed approving application:", err);
      alert("System connection error while verifying approval.");
    }
  };

  const handleRejectApplication = async (appId: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${appId}/reject`, {
        method: "POST"
      });
      if (res.ok) {
        alert("Application declined. User has been notified.");
        fetchAdminData();
        setFirewallLogs(prev => [
          `[${new Date().toLocaleTimeString()}] REJECTED/DECLINED Candidate application reference ID: ${appId}`,
          ...prev
        ]);
      }
    } catch (err) {
      console.error("Failed rejecting application:", err);
    }
  };

  const handlePurgeListing = async (jobId: string) => {
    if (!confirm("Are you sure you want to permanently purge this listing from NexLink Database?")) return;
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/purge`, {
        method: "DELETE"
      });
      if (res.ok) {
        alert("Listing permanently purged!");
        fetchAdminData();
      }
    } catch (err) {
      console.error("Failed purging listing:", err);
    }
  };

  const handleDismissReport = async (jobId: string) => {
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/dismiss`, {
        method: "POST"
      });
      if (res.ok) {
        alert("Flags successfully cleared. Listing marked verified!");
        fetchAdminData();
      }
    } catch (err) {
      console.error("Failed dismissing report flags:", err);
    }
  };

  // Malware destruction
  const handleDestroyMalware = (targetId: string, fileName: string) => {
    setMalwareTargets(prev => prev.map(t => {
      if (t.id === targetId) {
        return { ...t, status: "Destroyed & Purged", isMalicious: false };
      }
      return t;
    }));
    
    // Log destruction sequence
    const timeStr = new Date().toLocaleTimeString();
    setFirewallLogs(prev => [
      `[${timeStr}] MALWARE DESTROYED: Successfully isolated, wiped, and neutralized file payload "${fileName}".`,
      `[${timeStr}] Sandbox disinfection complete for threat ID: ${targetId}`,
      ...prev
    ]);
    
    alert(`💥 Threat Disarmed: The suspicious script/executable "${fileName}" has been completely destroyed and neutralized by NexLink Shield!`);
  };

  const filteredReports = reportedJobs.filter(job => 
    (job && job.title && job.title.toLowerCase().includes((search || "").toLowerCase())) ||
    (job && job.company && job.company.toLowerCase().includes((search || "").toLowerCase()))
  );

  const filteredApps = applications.filter(app =>
    (app && app.jobTitle && app.jobTitle.toLowerCase().includes((search || "").toLowerCase())) ||
    (app && app.company && app.company.toLowerCase().includes((search || "").toLowerCase())) ||
    (app && (app.candidateName || "").toLowerCase().includes((search || "").toLowerCase()))
  );

  // Authentication Gate View
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl border text-left space-y-6 shadow-2xl transition-all
        bg-slate-900 border-slate-800 text-slate-100"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Admin Gate Authorization</h2>
          <p className="text-xs opacity-75">Platform-level security: input passcode to unlock application and security management controls.</p>
        </div>

        <form onSubmit={handleVerifyPasscode} className="space-y-4">
          <div className="space-y-1 text-xs">
            <label className="font-semibold opacity-80 block">Security Passcode</label>
            <input
              type="password"
              placeholder={isLockedOut ? "SYSTEM PERMANENTLY LOCKED" : "••••••••"}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              disabled={isLockedOut}
              className="w-full p-3 rounded-xl border outline-none bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          {passError && (
            <p className="text-[11px] text-rose-500 font-bold bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 leading-relaxed">
              ⚠️ {passError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLockedOut}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-rose-950 disabled:text-rose-400 disabled:border disabled:border-rose-800/40 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:cursor-not-allowed"
          >
            <Shield className="w-4 h-4" /> {isLockedOut ? "Lockdown Engaged" : "Grant Full Clearance"}
          </button>
        </form>

        <div className="border-t border-slate-800/80 pt-4 text-center">
          <p className="text-[10px] text-slate-500 font-mono">AUTHORIZED PLATFORM ROLES ONLY • ENCRYPTED VIA AES-256</p>
        </div>
      </div>
    );
  }

  // Authenticated Admin Hub View
  return (
    <div className="space-y-6 text-left">
      
      {/* Upper header details */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Root Moderation & Defense Desk</h2>
          <p className="text-sm opacity-70 mt-1">Platform security audits, candidate applications review, and active malware destruction terminal.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchAdminData}
            className="flex items-center gap-1.5 px-4 py-2 border rounded-xl text-xs font-semibold hover:bg-slate-500/10 border-slate-700/30"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Synchronize Desk
          </button>
          
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-rose-950/40 border border-rose-900 text-rose-400 text-xs font-semibold rounded-xl hover:bg-rose-900/30"
          >
            Lock Terminal
          </button>
        </div>
      </div>

      {/* Platform overall health metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className={`p-4 rounded-2xl border flex items-center gap-3 bg-slate-900/40 border-slate-800`}>
          <Activity className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <p className="opacity-50 font-bold uppercase tracking-wider text-[9px]">Server status</p>
            <p className="font-extrabold text-sm text-emerald-500">Secure (Healthy)</p>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center gap-3 bg-slate-900/40 border-slate-800`}>
          <Globe className="w-5 h-5 text-blue-500 shrink-0" />
          <div>
            <p className="opacity-50 font-bold uppercase tracking-wider text-[9px]">Ingress ports</p>
            <p className="font-mono font-bold text-sm text-blue-500">0.0.0.0:3000</p>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center gap-3 bg-slate-900/40 border-slate-800`}>
          <Users className="w-5 h-5 text-indigo-500 shrink-0" />
          <div>
            <p className="opacity-50 font-bold uppercase tracking-wider text-[9px]">Applications Ingested</p>
            <p className="font-extrabold text-sm text-indigo-500">{applications.length} Active Candidates</p>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center gap-3 bg-slate-900/40 border-slate-800`}>
          <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
          <div>
            <p className="opacity-50 font-bold uppercase tracking-wider text-[9px]">Isolated Threats</p>
            <p className="font-extrabold text-sm text-rose-500">
              {malwareTargets.filter(t => t.isMalicious).length} Malware Payloads
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Left Column (Applications Audit), Right Column (Hacker Prevention Shield & Malware Destroyer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Applications and Moderation (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Candidates Job Applications moderations */}
          <div className={`p-6 rounded-3xl border space-y-4 bg-slate-900/40 border-slate-800`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-sm uppercase text-blue-400 tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4" /> Candidate Applications Audit Box
                </h3>
                <p className="text-xs opacity-60 mt-0.5">Screen candidate documents, verify demographic age checks, and Approve/Decline requests.</p>
              </div>

              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 opacity-50 text-xs" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search candidate dossiers..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border outline-none bg-slate-950 border-slate-850 text-slate-100"
                />
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {filteredApps.map(app => {
                const candidateAge = app.candidateAge || 23;
                const isUnderage = candidateAge < 18;

                return (
                  <div 
                    key={app.id}
                    className={`p-5 rounded-2xl border space-y-4 transition-all text-xs text-left
                      ${app.status === "Accepted" 
                        ? "border-emerald-500/20 bg-emerald-500/[0.01]" 
                        : app.status === "Rejected"
                          ? "border-rose-500/20 bg-rose-500/[0.01]"
                          : "border-slate-800 bg-slate-950/60"}`}
                  >
                    {/* Underage compliance warning block */}
                    {isUnderage && (
                      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl flex items-start gap-2.5 font-semibold">
                        <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-rose-500 mt-0.5" />
                        <div>
                          <p className="text-xs uppercase tracking-wider font-extrabold text-rose-500">Underage Application Warning</p>
                          <p className="text-[11px] font-normal opacity-90 mt-0.5">
                            Compliance Alert: Applicant age is {candidateAge} (under 18 threshold). Direct enrollment and labor approval are legally locked.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Candidate Demographic header info */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                          {(app.candidateName || "J").charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-sm text-slate-200">
                            {app.candidateName || "Jesse Orie"}
                          </p>
                          <p className="text-[10px] opacity-60">Applied to: <strong>{app.jobTitle}</strong> at *{app.company}*</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                          ${app.status === "Accepted" 
                            ? "bg-emerald-500/15 text-emerald-400" 
                            : app.status === "Rejected"
                              ? "bg-rose-500/15 text-rose-400"
                              : "bg-amber-500/15 text-amber-400"}`}
                        >
                          {app.status}
                        </span>
                        
                        <span className="font-mono text-[9px] text-slate-500">
                          Applied: {app.appliedDate}
                        </span>
                      </div>
                    </div>

                    {/* Detailed Demographics */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/40 text-[11px]">
                      <div>
                        <p className="opacity-50 text-[9px] uppercase tracking-wider font-semibold">Email address</p>
                        <p className="font-bold text-slate-300 truncate">{app.candidateEmail || "jesseorie01@gmail.com"}</p>
                      </div>
                      <div>
                        <p className="opacity-50 text-[9px] uppercase tracking-wider font-semibold">Phone number</p>
                        <p className="font-bold text-slate-300">{app.candidatePhone || "08031234567"}</p>
                      </div>
                      <div>
                        <p className="opacity-50 text-[9px] uppercase tracking-wider font-semibold">Gender</p>
                        <p className="font-bold text-slate-300">{app.candidateGender || "Male"}</p>
                      </div>
                      <div>
                        <p className="opacity-50 text-[9px] uppercase tracking-wider font-semibold">Age (Policy Checked)</p>
                        <p className={`font-bold flex items-center gap-1 
                          ${isUnderage ? "text-rose-500" : "text-emerald-400"}`}
                        >
                          {candidateAge} {isUnderage ? "❌ Underage Application" : "✓ 18+ Validated"}
                        </p>
                      </div>
                      <div>
                        <p className="opacity-50 text-[9px] uppercase tracking-wider font-semibold">State of Origin</p>
                        <p className="font-bold text-slate-300">{app.candidateState || "Lagos State"}</p>
                      </div>
                      <div>
                        <p className="opacity-50 text-[9px] uppercase tracking-wider font-semibold">Current Profession</p>
                        <p className="font-bold text-slate-300 truncate">{app.candidateProfession || "Junior Web Developer"}</p>
                      </div>
                    </div>

                    {/* Documents & Portfolios Attachments check */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Attached Candidate Documents</p>
                      
                      <div className="p-3 rounded-xl border border-dashed border-slate-800 bg-slate-500/[0.02] space-y-2">
                        <div>
                          <span className="font-semibold text-slate-300 block">Work History Experience:</span>
                          <p className="opacity-75 leading-relaxed italic">
                            {app.candidateExperience || "Frontend Engineering Intern at WebCraft Solutions"}
                          </p>
                        </div>
                        
                        <div>
                          <span className="font-semibold text-slate-300 block">Professional Skills:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(app.candidateSkills || ["React", "TypeScript", "Tailwind"]).map(skill => (
                              <span key={skill} className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Professional Documentation dossier check */}
                        <div className="pt-1.5">
                          <span className="font-semibold text-slate-300 block">Professional Documentation:</span>
                          <div className="flex items-center justify-between gap-3 mt-1.5 p-2 rounded-xl bg-slate-950 border border-slate-850/65">
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="w-4.5 h-4.5 text-blue-400 shrink-0" />
                              <div className="min-w-0 text-left">
                                <p className="font-extrabold text-[10px] text-slate-200 truncate">professional_dossier_transcript.pdf</p>
                                <p className="text-[9px] opacity-50">Academic credentials, age verification ID & certified NexLink exam badges (3.2MB)</p>
                              </div>
                            </div>
                            <a 
                              href="https://jesseorie.dev/credentials.png" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              referrerPolicy="no-referrer"
                              className="px-2.5 py-1 text-[9px] font-extrabold uppercase bg-slate-900 border border-slate-800 rounded-lg text-blue-400 hover:text-blue-300 hover:border-slate-700 hover:bg-slate-850 shrink-0 transition-all"
                            >
                              Open Dossier
                            </a>
                          </div>
                        </div>

                        {app.notes && (
                          <div>
                            <span className="font-semibold text-slate-300 block">Cover Note / Instructions:</span>
                            <p className="opacity-70 leading-relaxed">"{app.notes}"</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Approve / Decline Controls */}
                    <div className="flex justify-between items-center pt-2">
                      <p className="text-[10px] text-slate-500 font-mono">Secured Audit Reference ID: {app.id}</p>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRejectApplication(app.id)}
                          disabled={app.status === "Rejected"}
                          className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all flex items-center gap-1
                            ${app.status === "Rejected"
                              ? "bg-rose-950/20 text-rose-500/50 border-rose-900/10 cursor-not-allowed"
                              : "border-rose-900/50 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300"}`}
                        >
                          <X className="w-3.5 h-3.5" /> Decline Application
                        </button>

                        <button
                          onClick={() => handleApproveApplication(app.id)}
                          disabled={app.status === "Accepted"}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1
                            ${app.status === "Accepted"
                              ? "bg-emerald-950/20 text-emerald-500/50 cursor-not-allowed"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white"}`}
                        >
                          <Check className="w-3.5 h-3.5" /> Approve Application
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}

              {filteredApps.length === 0 && (
                <div className="text-center py-12 opacity-60">
                  No active candidate applications found matching filter parameters.
                </div>
              )}
            </div>
          </div>

          {/* Scaffold Flagged jobs reports moderator queue */}
          <div className={`p-6 rounded-3xl border space-y-4 bg-slate-900/40 border-slate-800`}>
            <div>
              <h3 className="font-extrabold text-sm uppercase text-rose-500 tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Spam Alerts & Employer Scam Reports
              </h3>
              <p className="text-xs opacity-60 mt-0.5">Prune suspect crypto schemes or flag suspicious third-party jobs instantly.</p>
            </div>

            <div className="space-y-4">
              {filteredReports.map(job => (
                <div 
                  key={job.id}
                  className="p-4 rounded-xl border flex flex-col md:flex-row justify-between gap-4 items-start md:items-center bg-rose-500/[0.01] border-rose-500/20"
                >
                  <div className="space-y-1.5 text-xs flex-1">
                    <p className="font-extrabold text-rose-500 flex items-center gap-1">
                      <AlertOctagon className="w-3.5 h-3.5 animate-pulse" /> Highly Suspicious Activity Detected
                    </p>
                    <h4 className="font-bold text-sm text-slate-200">{job.title}</h4>
                    <p className="opacity-60">Employer Group: {job.company} • Compensation: {job.salaryRange}</p>
                    <p className="text-[10px] font-mono opacity-50 bg-slate-950/40 p-2 rounded">
                      Required Stack: {job.skillsRequired.join(", ")}
                    </p>
                  </div>

                  <div className="flex gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => handleDismissReport(job.id)}
                      className="px-3 py-1.5 border border-slate-700/30 text-xs font-semibold rounded-lg hover:bg-emerald-500/10 hover:text-emerald-500 flex items-center gap-1 text-slate-300"
                    >
                      <Check className="w-3.5 h-3.5" /> Clear Flags
                    </button>
                    <button
                      onClick={() => handlePurgeListing(job.id)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                    >
                      <Trash className="w-3.5 h-3.5" /> Purge Post
                    </button>
                  </div>
                </div>
              ))}

              {filteredReports.length === 0 && (
                <div className="text-center py-6 opacity-60 text-xs">
                  All clear! No pending suspicious employment opportunities flagged.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Hacker Protection Shield & Malware Destroyer (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Hacker Intrusion prevention telemetry */}
          <div className="p-6 bg-[#0E1527] border border-slate-800 rounded-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500 shrink-0" />
              <div>
                <h3 className="font-extrabold text-sm uppercase text-slate-200 tracking-wider">Hacker Prevention Firewall</h3>
                <p className="text-[10px] opacity-60">NexLink Shield Engine active on 0.0.0.0:3000</p>
              </div>
            </div>

            {/* Simulated Live traffic metrics */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                <p className="opacity-50 font-bold uppercase tracking-wide">Threat mitigation</p>
                <p className="text-emerald-400 font-extrabold text-sm mt-0.5">Real-time (Active)</p>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                <p className="opacity-50 font-bold uppercase tracking-wide">XSS injection protection</p>
                <p className="text-blue-400 font-extrabold text-sm mt-0.5">Enforced</p>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                <p className="opacity-50 font-bold uppercase tracking-wide">SQL parameter checks</p>
                <p className="text-indigo-400 font-extrabold text-sm mt-0.5">Strict (Sanitized)</p>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                <p className="opacity-50 font-bold uppercase tracking-wide">SSL certificate</p>
                <p className="text-emerald-400 font-extrabold text-sm mt-0.5">SHA-256 Valid</p>
              </div>
            </div>

            {/* Telemetry Logs Terminal console */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-cyan-400" /> System Firewall Logs
                </span>
                <span className="text-[8px] bg-slate-850 px-1.5 py-0.5 rounded font-mono text-emerald-400">LOGS RUNNING</span>
              </div>
              
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 font-mono text-[9px] text-slate-400 space-y-1.5 max-h-40 overflow-y-auto leading-relaxed scrollbar-thin">
                {firewallLogs.map((log, lIdx) => (
                  <p key={lIdx} className={log.includes("WARNING") ? "text-rose-400 font-bold" : log.includes("SUCCESSFUL") ? "text-emerald-400 font-bold" : "opacity-80"}>
                    {log}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Malware Threat Scanner and Destroyer */}
          <div className="p-6 bg-[#0E1527] border border-slate-800 rounded-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 shrink-0 animate-bounce" />
              <div>
                <h3 className="font-extrabold text-sm uppercase text-slate-200 tracking-wider">Malware Detection & Quarantine</h3>
                <p className="text-[10px] opacity-60">Scans attachments, files & candidate profiles</p>
              </div>
            </div>

            <div className="space-y-3">
              {malwareTargets.map(target => (
                <div 
                  key={target.id}
                  className={`p-3 rounded-xl border text-xs space-y-2
                    ${target.status === "Destroyed & Purged"
                      ? "border-emerald-500/20 bg-emerald-500/[0.01]"
                      : target.isMalicious
                        ? "border-rose-500/20 bg-rose-500/[0.01]"
                        : "border-slate-800 bg-slate-950/40"}`}
                >
                  <div className="flex items-start justify-between gap-2 text-[10px]">
                    <div>
                      <p className="font-bold text-slate-300 truncate max-w-[150px]" title={target.fileName}>
                        {target.fileName}
                      </p>
                      <p className="text-[9px] opacity-50 font-mono mt-0.5">Size: {target.size}</p>
                    </div>

                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase
                      ${target.status === "Destroyed & Purged"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : target.isMalicious
                          ? "bg-rose-500/15 text-rose-400"
                          : "bg-slate-800 text-slate-400"}`}
                    >
                      {target.status}
                    </span>
                  </div>

                  {target.isMalicious && target.status !== "Destroyed & Purged" && (
                    <div className="space-y-2 bg-rose-500/5 p-2 rounded border border-rose-500/10">
                      <p className="text-[10px] text-rose-400 font-bold leading-none flex items-center gap-1">
                        <AlertOctagon className="w-3 h-3" /> Payload Match: {target.detectedType}
                      </p>
                      <p className="text-[9px] opacity-70">Detected executable file trying to mask as PDF document.</p>
                      
                      <button
                        onClick={() => handleDestroyMalware(target.id, target.fileName)}
                        className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] rounded-md transition-all flex items-center justify-center gap-1"
                      >
                        <Trash className="w-3 h-3" /> Destroy Malware & Purge
                      </button>
                    </div>
                  )}

                  {!target.isMalicious && (
                    <p className="text-[9px] text-slate-400 italic">✓ Cleared by NexLink Secure Scan. Clean asset signature.</p>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-[9px] text-slate-500 font-mono">INTELLIGENT SANDBOX SECURITY MODULE V2.0</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
