import React, { useState, useEffect } from "react";
import { 
  Wifi, 
  Briefcase, 
  DollarSign, 
  Bot, 
  ArrowRight, 
  ShieldAlert, 
  Clock, 
  Play, 
  Settings, 
  Search,
  Bell,
  RefreshCw,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { Notification, Contract, UserProfile } from "../types";

interface DashboardProps {
  isDarkMode: boolean;
  profile: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  speed: number;
  latency: number;
}

export default function Dashboard({
  isDarkMode,
  profile,
  activeTab,
  setActiveTab,
  speed,
  latency
}: DashboardProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [appCount, setAppCount] = useState(0);
  const [earnings, setEarnings] = useState({ cleared: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardStats = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch notifications
      const notifRes = await fetch("/api/notifications");
      const notifs = await notifRes.json();
      setNotifications(notifs);

      // 2. Fetch earnings & contracts
      const earnRes = await fetch("/api/earnings");
      const earnData = await earnRes.json();
      setEarnings({ cleared: earnData.clearedEarnings, pending: earnData.pendingEarnings });
      setContracts(earnData.contracts);

      // 3. Fetch applications count
      const appRes = await fetch("/api/applications");
      const apps = await appRes.json();
      setAppCount(apps.length);
    } catch (err) {
      console.error("Failed fetching dashboard status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [activeTab]);

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/notifications/read-all", {
        method: "POST"
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error("Failed clearing notifications:", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, <span className="text-blue-600 dark:text-blue-500">{profile.name}</span>!
          </h2>
          <p className="text-sm opacity-70 mt-1">
            "Find a way to connect. Find a way to work. Find a way to grow." Platform status is online.
          </p>
        </div>

        <button
          onClick={fetchDashboardStats}
          className="flex items-center gap-2 self-start px-3.5 py-1.5 border rounded-lg text-xs font-semibold hover:bg-slate-500/10 border-slate-700/30"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Synchronize Hub
        </button>
      </div>

      {/* Grid: 4 Core Overview Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        
        {/* Connectivity signal */}
        <div 
          onClick={() => setActiveTab("networks")}
          className={`p-5 rounded-3xl border cursor-pointer transition-all hover:-translate-y-0.5
            ${isDarkMode ? "bg-[#141C2F] border-slate-800/50 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}
        >
          <div className="flex justify-between items-start">
            <span className="font-bold opacity-50 uppercase tracking-wider text-[10px]">Active Connectivity</span>
            <Wifi className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold tracking-tight text-cyan-400">
              {speed > 0 ? `${speed} Mbps` : "Connected"}
            </p>
            <p className="opacity-60 mt-1 flex items-center gap-1">
              Latency: {latency > 0 ? `${latency}ms` : "Good"} • Co-working ready
            </p>
          </div>
        </div>

        {/* Applications pipeline */}
        <div 
          onClick={() => setActiveTab("tracker")}
          className={`p-5 rounded-3xl border cursor-pointer transition-all hover:-translate-y-0.5
            ${isDarkMode ? "bg-[#141C2F] border-slate-800/50 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}
        >
          <div className="flex justify-between items-start">
            <span className="font-bold opacity-50 uppercase tracking-wider text-[10px]">Tracking Pipelines</span>
            <Briefcase className="w-5 h-5 text-blue-400" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold tracking-tight text-blue-400">{appCount} Roles</p>
            <p className="opacity-60 mt-1">Interviews & screening monitored dynamically.</p>
          </div>
        </div>

        {/* Cleared Payout */}
        <div 
          onClick={() => setActiveTab("earnings")}
          className={`p-5 rounded-3xl border cursor-pointer transition-all hover:-translate-y-0.5
            ${isDarkMode ? "bg-[#141C2F] border-slate-800/50 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}
        >
          <div className="flex justify-between items-start">
            <span className="font-bold opacity-50 uppercase tracking-wider text-[10px]">Cleared Earnings</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold tracking-tight text-emerald-400">${earnings.cleared}</p>
            <p className="opacity-60 mt-1">Pending contract value: ${earnings.pending}</p>
          </div>
        </div>

        {/* Nexa AI Diagnostic state */}
        <div 
          onClick={() => setActiveTab("assistant")}
          className={`p-5 rounded-3xl border cursor-pointer transition-all hover:-translate-y-0.5
            ${isDarkMode ? "bg-[#141C2F] border-slate-800/50 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}
        >
          <div className="flex justify-between items-start">
            <span className="font-bold opacity-50 uppercase tracking-wider text-[10px]">Career AI Co-Pilot</span>
            <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold tracking-tight text-indigo-400 font-sans">Nexa Active</p>
            <p className="opacity-60 mt-1">Ask questions about resume scoring & interview drills.</p>
          </div>
        </div>

      </div>

      {/* Main split: Analytics / Milestones & Real-time Alerts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Quick Actions & Milestones (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Quick Action triggers */}
          <div className={`p-6 rounded-3xl border space-y-4
            ${isDarkMode ? "bg-[#141C2F] border-slate-800/50 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}
          >
            <h3 className="font-extrabold text-xs uppercase opacity-60 tracking-wider">Quick Actions Portal</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => setActiveTab("networks")}
                className={`p-3.5 text-left border rounded-2xl hover:border-blue-500/50 hover:bg-blue-600/[0.01] transition-all flex justify-between items-center group
                  ${isDarkMode ? "bg-[#0D1528] border-slate-800/50" : "bg-slate-50 border-slate-200"}`}
              >
                <div>
                  <p className="font-bold text-white dark:text-slate-200">Test Internet Speed</p>
                  <p className="opacity-50 text-[10px] mt-0.5">Diagnose latency & signal strength</p>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className={`p-3.5 text-left border rounded-2xl hover:border-blue-500/50 hover:bg-blue-600/[0.01] transition-all flex justify-between items-center group
                  ${isDarkMode ? "bg-[#0D1528] border-slate-800/50" : "bg-slate-50 border-slate-200"}`}
              >
                <div>
                  <p className="font-bold text-white dark:text-slate-200">Build Dynamic Resume</p>
                  <p className="opacity-50 text-[10px] mt-0.5">Export high-fidelity printable PDFs</p>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab("assistant")}
                className={`p-3.5 text-left border rounded-2xl hover:border-blue-500/50 hover:bg-blue-600/[0.01] transition-all flex justify-between items-center group
                  ${isDarkMode ? "bg-[#0D1528] border-slate-800/50" : "bg-slate-50 border-slate-200"}`}
              >
                <div>
                  <p className="font-bold text-white dark:text-slate-200">Consult AI Co-Pilot</p>
                  <p className="opacity-50 text-[10px] mt-0.5">Optimized mock interview drills</p>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab("jobs")}
                className={`p-3.5 text-left border rounded-2xl hover:border-blue-500/50 hover:bg-blue-600/[0.01] transition-all flex justify-between items-center group
                  ${isDarkMode ? "bg-[#0D1528] border-slate-800/50" : "bg-slate-50 border-slate-200"}`}
              >
                <div>
                  <p className="font-bold text-white dark:text-slate-200">Discover Open Gigs</p>
                  <p className="opacity-50 text-[10px] mt-0.5">Match skills to remote task lists</p>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Connected Contract progress milestones */}
          <div className={`p-6 rounded-3xl border space-y-4
            ${isDarkMode ? "bg-[#141C2F] border-slate-800/50 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-xs uppercase opacity-60 tracking-wider">Active Milestones</h3>
              <button
                onClick={() => setActiveTab("earnings")}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-0.5"
              >
                View Earnings Ledger <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {contracts.slice(0, 2).map(con => (
                <div 
                  key={con.id}
                  className={`p-4 rounded-2xl border space-y-2.5 text-xs
                    ${isDarkMode ? "bg-[#0D1528] border-slate-800/50" : "bg-slate-50 border-slate-200"}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-white dark:text-slate-200">{con.title}</p>
                      <p className="opacity-55 text-[10px] mt-0.5">Client: {con.clientName}</p>
                    </div>
                    <span className="font-mono font-bold text-white">${con.amount}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] opacity-60 font-mono">
                      <span>Completion State</span>
                      <span>{con.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-500/10 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-cyan-500 h-full rounded-full" 
                        style={{ width: `${con.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {contracts.length === 0 && (
                <div className="text-center py-6 text-xs opacity-50">
                  No active milestones logged. Bid on freelance opportunities to initiate contracts.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Col: Notifications & System Signals ledger (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col h-full justify-between">
          <div className={`p-6 rounded-3xl border space-y-4 h-full flex flex-col justify-between
            ${isDarkMode ? "bg-[#141C2F] border-slate-800/50 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-extrabold text-xs uppercase opacity-60 tracking-wider">System Alerts Inbox</h3>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] bg-cyan-400/10 text-cyan-400 font-extrabold px-2 py-0.5 rounded-full hover:bg-cyan-400/15"
                  >
                    Clear {unreadCount} Unread
                  </button>
                )}
              </div>

              {/* Scroll notifications */}
              <div className="space-y-2.5 overflow-y-auto max-h-[340px] pr-1">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-2xl border text-xs leading-snug flex items-start gap-2.5 relative transition-all
                      ${notif.isRead 
                        ? "opacity-60" 
                        : "border-cyan-500/20 bg-cyan-500/[0.01]"}`}
                  >
                    {!notif.isRead && (
                      <span className="absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    )}

                    <div className="flex-1 text-left">
                      <p className="font-bold flex items-center gap-1 text-white">
                        {notif.title}
                      </p>
                      <p className="opacity-70 mt-1 text-[11px] leading-relaxed">{notif.description}</p>
                      <span className="text-[9px] opacity-40 font-mono mt-1.5 block">{notif.timestamp}</span>
                    </div>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="text-center py-20 opacity-50 text-xs">
                    No notifications or matching network signals yet.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-amber-500/5 text-[10px] p-2.5 rounded-xl border border-amber-500/10 text-amber-600 dark:text-amber-400 mt-4 leading-normal flex items-start gap-1.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Anti-Scam Notice:</strong> Security logs are synchronized. Inform moderators about suspicious off-platform redirect messages.
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
