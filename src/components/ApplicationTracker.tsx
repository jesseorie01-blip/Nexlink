import React, { useState } from "react";
import { 
  Trello, 
  List, 
  Calendar as CalendarIcon, 
  ArrowRight, 
  Plus, 
  CheckCircle, 
  Clock, 
  User, 
  XCircle,
  HelpCircle,
  TrendingUp,
  FileEdit
} from "lucide-react";
import { JobApplication } from "../types";

interface ApplicationTrackerProps {
  isDarkMode: boolean;
  applications: JobApplication[];
  onUpdateStatus: (jobId: string, status: string, notes?: string, interviewDate?: string, followUpDate?: string) => void;
}

export default function ApplicationTracker({ isDarkMode, applications, onUpdateStatus }: ApplicationTrackerProps) {
  const [viewMode, setViewMode] = useState<"kanban" | "list" | "calendar">("kanban");
  
  // Interactive modal to update details
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [notes, setNotes] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [statusVal, setStatusVal] = useState<any>("Applied");

  const statuses = ["Saved", "Applied", "Screening", "Interview", "Offer", "Accepted", "Rejected"] as const;

  const handleSaveDetails = () => {
    if (!editingApp) return;
    onUpdateStatus(editingApp.jobId, statusVal, notes, interviewDate, followUpDate);
    setEditingApp(null);
  };

  const openEditModal = (app: JobApplication) => {
    setEditingApp(app);
    setNotes(app.notes || "");
    setInterviewDate(app.interviewDate || "");
    setFollowUpDate(app.followUpDate || "");
    setStatusVal(app.status);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Application Pipeline</h2>
          <p className="text-sm opacity-70 mt-1">Manage and track your active job processes, interview timelines, and follow-ups.</p>
        </div>

        {/* View Mode Switcher */}
        <div className={`p-1 rounded-lg border flex gap-1 text-xs
          ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"}`}
        >
          <button
            onClick={() => setViewMode("kanban")}
            className={`px-3 py-1.5 rounded-md font-bold flex items-center gap-1 transition-colors
              ${viewMode === "kanban" 
                ? "bg-blue-600 text-white" 
                : isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Trello className="w-3.5 h-3.5" /> Kanban Board
          </button>
          
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded-md font-bold flex items-center gap-1 transition-colors
              ${viewMode === "list" 
                ? "bg-blue-600 text-white" 
                : isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-900"}`}
          >
            <List className="w-3.5 h-3.5" /> List view
          </button>

          <button
            onClick={() => setViewMode("calendar")}
            className={`px-3 py-1.5 rounded-md font-bold flex items-center gap-1 transition-colors
              ${viewMode === "calendar" 
                ? "bg-blue-600 text-white" 
                : isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-900"}`}
          >
            <CalendarIcon className="w-3.5 h-3.5" /> Schedule
          </button>
        </div>
      </div>

      {/* KANBAN BOARD */}
      {viewMode === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4 pt-2">
          {statuses.map(column => {
            const colApps = applications.filter(a => a.status === column);
            return (
              <div 
                key={column}
                className={`min-w-[240px] flex-1 max-w-[280px] rounded-3xl p-4 border flex flex-col gap-3 shrink-0
                  ${isDarkMode ? "bg-[#141C2F] border-slate-800/50 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-extrabold text-xs uppercase tracking-wider">{column}</span>
                  <span className="text-[10px] bg-blue-600/10 text-blue-500 font-bold px-2 py-0.5 rounded-full">
                    {colApps.length}
                  </span>
                </div>

                {/* Column list items */}
                <div className="space-y-2 flex-1 overflow-y-auto max-h-[420px]">
                  {colApps.map(app => (
                    <div
                      key={app.id}
                      onClick={() => openEditModal(app)}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all hover:-translate-y-0.5
                        ${isDarkMode 
                          ? "bg-[#0D1528] border-slate-800/50 hover:border-slate-700/50 text-slate-100" 
                          : "bg-white border-slate-200 hover:border-slate-300 text-slate-800"}`}
                    >
                      <h4 className="font-bold text-xs truncate">{app.jobTitle}</h4>
                      <p className="text-[10px] opacity-60 truncate">{app.company}</p>
                      
                      {app.interviewDate && (
                        <div className="mt-2 text-[9px] text-amber-500 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Interview: {app.interviewDate}
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-700/10 text-[9px]">
                        <span className="opacity-50">Applied {app.appliedDate}</span>
                        <span className="text-blue-500 font-bold flex items-center gap-0.5">
                          <FileEdit className="w-2.5 h-2.5" /> Edit
                        </span>
                      </div>
                    </div>
                  ))}

                  {colApps.length === 0 && (
                    <div className="text-center py-10 opacity-40 text-[10px] border border-dashed border-slate-700/15 rounded-lg">
                      No applications
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className={`rounded-xl border overflow-hidden
          ${isDarkMode ? "bg-slate-900/30 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b font-semibold opacity-70
                  ${isDarkMode ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-slate-50"}`}
                >
                  <th className="p-4">ROLE & EMPLOYER</th>
                  <th className="p-4">APPLIED DATE</th>
                  <th className="p-4">CURRENT PIPELINE STATUS</th>
                  <th className="p-4">INTERVIEW DATE</th>
                  <th className="p-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-750/10">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-500/[0.02]">
                    <td className="p-4">
                      <div>
                        <p className="font-bold">{app.jobTitle}</p>
                        <p className="text-[10px] opacity-60">{app.company}</p>
                      </div>
                    </td>
                    <td className="p-4 opacity-70">{app.appliedDate}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase
                        ${app.status === "Offer" || app.status === "Accepted"
                          ? "bg-emerald-500/15 text-emerald-500" 
                          : app.status === "Interview" || app.status === "Screening"
                            ? "bg-amber-500/15 text-amber-500" 
                            : app.status === "Rejected"
                              ? "bg-rose-500/15 text-rose-500"
                              : "bg-slate-500/10 text-slate-400"}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-semibold opacity-80">{app.interviewDate || "Not Scheduled"}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openEditModal(app)}
                        className="text-blue-500 hover:text-blue-600 font-bold text-xs"
                      >
                        Configure Details
                      </button>
                    </td>
                  </tr>
                ))}

                {applications.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-8 opacity-60">
                      No active application tracked.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SCHEDULE VIEW */}
      {viewMode === "calendar" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Calendar visual schedule block */}
          <div className={`md:col-span-8 p-6 rounded-xl border space-y-4
            ${isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}
          >
            <h3 className="font-bold text-sm uppercase opacity-60 tracking-wider">Upcoming Interview Events</h3>
            
            <div className="space-y-3">
              {applications.filter(a => a.interviewDate).map(app => (
                <div 
                  key={app.id}
                  className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex justify-between items-center text-xs"
                >
                  <div>
                    <strong className="text-sm block">{app.jobTitle}</strong>
                    <span className="opacity-70 mt-1 block">Company: {app.company}</span>
                    <span className="opacity-70 text-[10px] mt-2 block">Notes: {app.notes || "No notes yet"}</span>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[10px] font-mono bg-amber-500/20 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-lg font-bold block">
                      {app.interviewDate}
                    </span>
                  </div>
                </div>
              ))}

              {applications.filter(a => a.interviewDate).length === 0 && (
                <div className="text-center py-12 opacity-60 border border-dashed border-slate-700/20 rounded-xl">
                  No upcoming interview dates configured. Add dates by selecting cards on the Kanban board.
                </div>
              )}
            </div>
          </div>

          {/* Tips block */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div className={`p-5 rounded-xl border text-xs space-y-3
              ${isDarkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200"}`}
            >
              <h4 className="font-bold text-sm">Action Reminders Checklist</h4>
              <p className="opacity-70 leading-relaxed">NexLink recommends follow-up emails exactly 3 business days after initial screening milestones.</p>
              
              <ul className="space-y-2 pt-2 border-t border-slate-700/15">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Prepare portfolio links
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Formulate question list
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Check Wi-Fi speed capability
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL DIALOG */}
      {editingApp && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md rounded-2xl border p-6 text-left relative
            ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}
          >
            <h3 className="text-lg font-extrabold">Configure Submission details</h3>
            <p className="text-xs opacity-60 mt-0.5">{editingApp.jobTitle} at {editingApp.company}</p>

            <div className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold opacity-75 mb-1">Pipeline Status</label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value as any)}
                  className={`w-full p-2 rounded-lg border outline-none
                    ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300"}`}
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold opacity-75 mb-1">Interview Date</label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className={`w-full p-2 rounded-lg border outline-none
                      ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                  />
                </div>
                <div>
                  <label className="block font-semibold opacity-75 mb-1">Follow-up Reminder Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className={`w-full p-2 rounded-lg border outline-none
                      ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold opacity-75 mb-1">Interviewer Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record interview focus points, required documentation..."
                  className={`w-full p-2 rounded-lg border outline-none resize-none
                    ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                />
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-700/10">
                <button
                  onClick={() => setEditingApp(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-500/10 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDetails}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold"
                >
                  Update Pipeline details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
