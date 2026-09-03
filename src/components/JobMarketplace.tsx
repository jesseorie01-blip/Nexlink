import React, { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Percent, 
  CheckCircle, 
  Bookmark, 
  BookmarkCheck, 
  ShieldAlert, 
  Flag, 
  Info,
  ChevronRight,
  AlertTriangle,
  Send,
  Building
} from "lucide-react";
import { JobOpportunity, UserProfile } from "../types";

interface JobMarketplaceProps {
  isDarkMode: boolean;
  jobs: JobOpportunity[];
  profile: UserProfile;
  onApply: (jobId: string, status: string, notes?: string) => void;
  onSave: (jobId: string) => void;
  savedJobIds: string[];
  appliedJobIds: string[];
}

export default function JobMarketplace({
  isDarkMode,
  jobs: initialJobs,
  profile,
  onApply,
  onSave,
  savedJobIds,
  appliedJobIds
}: JobMarketplaceProps) {
  const [jobs, setJobs] = useState<JobOpportunity[]>(initialJobs);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeExp, setActiveExp] = useState("All");
  const [salaryLimit, setSalaryLimit] = useState(0);

  // Application Modal state
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [applicationNotes, setApplicationNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successApply, setSuccessApply] = useState(false);

  // Scam reporting state
  const [reportingJobId, setReportingJobId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("Suspicious/Fake Post");
  const [reportDetails, setReportDetails] = useState("");

  const handleFetchJobs = async () => {
    let url = `/api/jobs?search=${encodeURIComponent(search)}`;
    if (activeCategory !== "All") url += `&type=${activeCategory}`;
    if (activeExp !== "All") url += `&exp=${activeExp}`;
    if (salaryLimit > 0) url += `&minSalary=${salaryLimit}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Error loading jobs:", err);
    }
  };

  useEffect(() => {
    handleFetchJobs();
  }, [search, activeCategory, activeExp, salaryLimit, initialJobs]);

  const handleApplyWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: selectedJob.id,
          status: "Applied",
          notes: applicationNotes
        })
      });
      if (res.ok) {
        onApply(selectedJob.id, "Applied", applicationNotes);
        setSuccessApply(true);
        setTimeout(() => {
          setSuccessApply(false);
          setSelectedJob(null);
          setApplicationNotes("");
          handleFetchJobs(); // reload match markers
        }, 1800);
      }
    } catch (err) {
      console.error("Failed submitting application:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportScam = async (jobId: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: reportReason,
          details: reportDetails
        })
      });
      if (res.ok) {
        alert("Thank you! This listing has been reported to Trust & Safety and marked suspicious.");
        setReportingJobId(null);
        setReportDetails("");
        handleFetchJobs(); // refresh status
      }
    } catch (err) {
      console.error("Failed reporting job:", err);
    }
  };

  const categories = ["All", "Full-time", "Part-time", "Remote", "Freelance", "Contract", "Internship", "Gig"];
  const experiences = ["All", "Entry-level", "Mid-level", "Senior"];

  return (
    <div className="space-y-6 text-left">
      {/* Header and Anti-Scam Banner */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Opportunity Engine</h2>
        <p className="text-sm opacity-70 mt-1">Discover, match, and apply securely to global remote, hybrid, and local technology jobs.</p>
      </div>

      {/* Trust & Safety Scam Alert Notice */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-3">
        <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0" />
        <div className="flex-1 text-xs">
          <p className="font-bold text-amber-600 dark:text-amber-400">NexLink Trust & Safety Advisory</p>
          <p className="opacity-80 mt-0.5">
            Never pay an employer to receive a job or equipment. Do not share credentials, OTPs, or sensitive financial account numbers. Verified employers are designated with the check badge.
          </p>
        </div>
      </div>

      {/* Main Filter Toolbar */}
      <div className={`p-4 rounded-3xl border grid grid-cols-1 md:grid-cols-12 gap-4 items-center
        ${isDarkMode ? "bg-[#141C2F] border-slate-800/50" : "bg-white border-slate-200"}`}
      >
        {/* Search input */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 opacity-50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles, companies, or skills (e.g. React)..."
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border outline-none transition-all
              ${isDarkMode 
                ? "bg-[#0D1528] border-slate-800/50 text-slate-100 focus:border-blue-500/50" 
                : "bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600"}`}
          />
        </div>

        {/* Experience Dropdown */}
        <div className="md:col-span-3">
          <select
            value={activeExp}
            onChange={(e) => setActiveExp(e.target.value)}
            className={`w-full p-2 text-xs rounded-xl border outline-none
              ${isDarkMode ? "bg-[#0D1528] border-slate-800/50 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-800"}`}
          >
            <option value="All">All Levels</option>
            {experiences.slice(1).map(exp => (
              <option key={exp} value={exp}>{exp}</option>
            ))}
          </select>
        </div>

        {/* Salary filter range */}
        <div className="md:col-span-4 flex items-center gap-2">
          <span className="text-[10px] opacity-60 font-semibold whitespace-nowrap">MIN SALARY:</span>
          <input
            type="range"
            min="0"
            max="6000"
            step="500"
            value={salaryLimit}
            onChange={(e) => setSalaryLimit(parseInt(e.target.value))}
            className="w-full accent-blue-500 h-1.5 bg-slate-500/20 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-blue-500">${salaryLimit || "0"}</span>
        </div>
      </div>

      {/* Category Tabs list */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors
              ${activeCategory === cat 
                ? "bg-blue-600 text-white" 
                : isDarkMode 
                  ? "bg-[#141C2F] border border-slate-850 text-slate-400 hover:bg-slate-800" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Opportunity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => {
          const isSaved = savedJobIds.includes(job.id);
          const isApplied = appliedJobIds.includes(job.id);
          
          return (
            <div
              key={job.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between relative overflow-hidden group
                ${isDarkMode ? "bg-[#141C2F] border-slate-800/50 hover:border-slate-700/50 text-slate-100" : "bg-white border-slate-200 hover:border-slate-300"}
                ${job.isSuspicious ? "border-rose-500/40 bg-rose-500/[0.01]" : ""}`}
            >
              {/* Highlight Compatibility Eyebrow */}
              {job.matchScore !== undefined && !job.isSuspicious && (
                <div className={`absolute top-0 left-0 right-0 h-1 transition-colors
                  ${job.matchScore > 80 ? "bg-emerald-500" : job.matchScore > 50 ? "bg-blue-500" : "bg-slate-500"}`}
                />
              )}

              <div className="space-y-4">
                {/* Upper row: Logo placeholders, title and saves */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600/20 to-purple-600/20 flex items-center justify-center text-blue-500 font-extrabold text-sm shrink-0">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base leading-tight group-hover:text-blue-500 transition-colors">{job.title}</h3>
                      <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
                        <span>{job.company}</span>
                        {job.isVerifiedEmployer && (
                          <span className="text-blue-500 inline-block" title="Verified Employer Entity">
                            <CheckCircle className="w-3.5 h-3.5 fill-current text-white dark:text-slate-900" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSave(job.id)}
                    className={`p-2 rounded-lg border transition-colors shrink-0
                      ${isSaved 
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-500" 
                        : isDarkMode ? "border-slate-800 hover:bg-slate-800 text-slate-400" : "border-slate-200 hover:bg-slate-100 text-slate-500"}`}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                {/* Core descriptors: Location, Sal, Exp */}
                <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-slate-700/10 text-[11px] opacity-80">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="font-semibold">{job.salaryRange.split("/")[0]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{job.experienceLevel}</span>
                  </div>
                </div>

                {/* Tags required */}
                <div className="flex flex-wrap gap-1">
                  {job.skillsRequired.map(skill => {
                    const ownsSkill = profile.skills.some(ps => ps && skill && ps.toLowerCase() === skill.toLowerCase());
                    return (
                      <span 
                        key={skill} 
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-md
                          ${ownsSkill 
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                            : isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"}`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>

                {/* Intelligent Compatibility Analyzer Explanation */}
                {job.matchScore !== undefined && (
                  <div className={`p-2.5 rounded-lg text-[11px] leading-relaxed flex items-start gap-1.5
                    ${job.isSuspicious
                      ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                      : job.matchScore > 75 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400"}`}
                  >
                    {job.isSuspicious ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <strong>Suspicious Listing Flagged!</strong> High pay with low experience requirements resembles typical freelance/arbitrage phishing layouts. Proceed with absolute caution.
                        </div>
                      </>
                    ) : (
                      <>
                        <Percent className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-500" />
                        <div>
                          <strong>{job.matchScore}% Match Score:</strong> {job.matchExplanation}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Application CTA Row */}
              <div className="mt-5 pt-3 border-t border-slate-700/10 flex items-center justify-between gap-3">
                <span className="text-[10px] opacity-50 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Deadline: {job.deadline}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => setReportingJobId(job.id)}
                    className={`p-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-colors
                      ${isDarkMode ? "border-slate-800 hover:bg-slate-800 hover:text-rose-500 text-slate-500" : "border-slate-200 hover:bg-slate-50 hover:text-rose-600 text-slate-400"}`}
                    title="Report scam or abuse"
                  >
                    <Flag className="w-3 h-3" /> Report
                  </button>

                  <button
                    onClick={() => setSelectedJob(job)}
                    disabled={isApplied}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all
                      ${isApplied 
                        ? "bg-slate-500/20 text-slate-400 cursor-not-allowed" 
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"}`}
                  >
                    {isApplied ? "Applied" : "View & Apply"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {jobs.length === 0 && (
          <div className="text-center py-16 md:col-span-2">
            <Building className="w-12 h-12 mx-auto text-slate-500 opacity-50 mb-3" />
            <p className="text-base font-bold opacity-80">No Job Listings Match Criteria</p>
            <p className="text-sm opacity-60 mt-1">Try expanding your search query, Category filter tabs, or adjusting your salary sliders.</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); setActiveExp("All"); setSalaryLimit(0); }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* APPLICATION PROCESS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-lg rounded-2xl border p-6 text-left relative transition-all
            ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}
          >
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 font-bold"
            >
              ✕
            </button>

            {successApply ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6 animate-bounce" />
                </div>
                <h3 className="text-lg font-bold">Application Sent Successfully!</h3>
                <p className="text-xs opacity-60">Your submission was routed. Added tracking stats to your Kanban tracker.</p>
              </div>
            ) : (
              <form onSubmit={handleApplyWorkflow} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-500 uppercase">Apply to Listing</span>
                  <h3 className="text-xl font-extrabold tracking-tight mt-0.5">{selectedJob.title}</h3>
                  <p className="text-xs opacity-60 mt-0.5">{selectedJob.company} • {selectedJob.location}</p>
                </div>

                {/* Scam Advisory */}
                <div className="bg-rose-500/10 text-rose-500 p-3 rounded-lg text-xs flex items-start gap-1.5">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Anti-Phishing Shield:</strong> Never send financial deposits, buy gift cards, or submit private identity numbers. If asked to pay for tools, report immediately.
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold opacity-70">Resume / Digital Profile Attachment</label>
                  <div className="p-3 bg-slate-500/5 border border-dashed border-slate-700/30 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold">{profile.name} - Resume Profile</p>
                      <p className="text-[10px] opacity-50">{profile.headline}</p>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full font-bold">
                      READY TO SUBMIT
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold opacity-70">Cover Note or Special Instructions</label>
                  <textarea
                    rows={4}
                    value={applicationNotes}
                    onChange={(e) => setApplicationNotes(e.target.value)}
                    placeholder="Briefly state why your skills align or list any connection requirements..."
                    className={`w-full p-3 text-xs rounded-xl border outline-none resize-none
                      ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-slate-700/10">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="px-4 py-2 border rounded-lg text-xs font-semibold hover:bg-slate-500/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" /> {isSubmitting ? "Routing..." : "Submit Application"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SCAM REPORTING DIALOG */}
      {reportingJobId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md rounded-2xl border p-6 text-left relative
            ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200"}`}
          >
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Flag className="w-5 h-5 text-rose-500" /> Flag Suspicious Posting
            </h3>
            <p className="text-xs opacity-60 mt-1">Help protect the NexLink ecosystem by flagging suspicious, fake, or fraudulent behavior.</p>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold opacity-70 mb-1">Reason for Flagging</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className={`w-full p-2 text-xs rounded-lg border outline-none
                    ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300"}`}
                >
                  <option value="Fake / Scam Post">Fake / Scam Post</option>
                  <option value="Unsolicited Payment Demanded">Unsolicited Payment Demanded</option>
                  <option value="Phishing Link / Out of Platform redirect">Phishing Link / Out of Platform redirect</option>
                  <option value="Incorrect Wage / Discriminatory info">Incorrect Wage / Discriminatory info</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold opacity-70 mb-1">Additional Details</label>
                <textarea
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Provide details about payment requests, off-platform communication, etc..."
                  className={`w-full p-2 text-xs rounded-lg border outline-none resize-none
                    ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-white border-slate-200"}`}
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  onClick={() => setReportingJobId(null)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold hover:bg-slate-500/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReportScam(reportingJobId)}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
