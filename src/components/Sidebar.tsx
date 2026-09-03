import React from "react";
import { 
  Network, 
  Briefcase, 
  MessageSquare, 
  User, 
  LayoutDashboard, 
  Layers, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  Sun, 
  Moon, 
  ArrowLeftRight,
  Crown,
  GraduationCap,
  LogOut
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  userRole: "candidate" | "employer";
  setUserRole: (role: "candidate" | "employer") => void;
  isPremium: boolean;
  onUpgradeClick: () => void;
  onSignOut?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  userRole,
  setUserRole,
  isPremium,
  onUpgradeClick,
  onSignOut
}: SidebarProps) {

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "network", label: "Network Locator", icon: Network },
    { id: "jobs", label: "Opportunity Hub", icon: Briefcase },
    { id: "marketplace", label: "Gig Marketplace", icon: Layers },
    { id: "tracker", label: "App Tracker", icon: TrendingUp },
    { id: "academy", label: "Academy & Rewards", icon: GraduationCap },
    { id: "messages", label: "Inbox", icon: MessageSquare },
    { id: "profile", label: "Career Profile", icon: User },
    { id: "admin", label: "Admin Control", icon: ShieldAlert },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        id="desktop-sidebar"
        className={`hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r transition-colors duration-200 z-30
          ${isDarkMode 
            ? "bg-[#0D1528] border-slate-800/80 text-slate-100" 
            : "bg-white border-slate-200 text-slate-800"
          }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Network className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-white uppercase">NEXLINK</h1>
              <span className="text-[9px] tracking-widest font-bold opacity-50 block leading-none">WORK SYSTEM</span>
            </div>
          </div>
        </div>

        {/* User Quick Role Switch & Premium Badge */}
        <div className={`p-4 mx-3 my-4 rounded-xl border border-dashed flex flex-col gap-3
          ${isDarkMode ? "border-slate-800 bg-[#141C2F]/50" : "border-slate-200 bg-slate-50"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isPremium ? "bg-amber-500/20 text-amber-400" : "bg-slate-500/20 text-slate-400"}`}>
                {isPremium ? "PRO STATUS" : "FREE STATUS"}
              </span>
              {!isPremium && (
                <button 
                  onClick={onUpgradeClick}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-extrabold flex items-center gap-0.5"
                >
                  <Crown className="w-3 h-3 text-amber-500" /> Upgrade
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1.5 border-t border-slate-700/10 dark:border-slate-800">
            <span className="text-[10px] font-bold opacity-60">ROLE</span>
            <button
              onClick={() => setUserRole(userRole === "candidate" ? "employer" : "candidate")}
              className={`text-[10px] px-2.5 py-1 rounded-md font-extrabold flex items-center gap-1 transition-all
                ${userRole === "candidate" 
                  ? "bg-blue-600/90 hover:bg-blue-600 text-white" 
                  : "bg-emerald-600/90 hover:bg-emerald-600 text-white"
                }`}
            >
              <ArrowLeftRight className="w-3 h-3" />
              {userRole === "candidate" ? "Candidate" : "Employer"}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 px-4 py-1 space-y-1 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group
                  ${isActive 
                    ? "bg-blue-600/10 text-blue-400 rounded-xl border border-blue-500/20 font-bold" 
                    : isDarkMode 
                      ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                  }`}
              >
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "text-blue-400" : "opacity-75"}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Nexa AI Sidebar Prompt Box */}
        {isDarkMode && (
          <div className="p-4 m-4 bg-gradient-to-br from-[#141C2F] to-[#0D1528] rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">NEXA AI</span>
            </div>
            <p className="text-[10px] leading-relaxed text-slate-400">
              Co-working network maps and 12 premium high-match jobs synchronized.
            </p>
          </div>
        )}

        {/* Sidebar Footer / Theme Toggle & Logout */}
        <div className="p-4 border-t border-inherit flex items-center justify-between">
          <button
            onClick={onSignOut}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-bold transition-colors"
            title="Sign out of Firebase Auth"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg border transition-colors
              ${isDarkMode 
                ? "border-slate-800 bg-slate-800/50 text-amber-400 hover:bg-slate-800" 
                : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav 
        id="mobile-bottom-nav"
        className={`md:hidden fixed bottom-0 left-0 right-0 border-t flex justify-around items-center py-2 px-1 z-40 transition-colors duration-200
          ${isDarkMode 
            ? "bg-slate-900 border-slate-800 text-slate-100" 
            : "bg-white border-slate-200 text-slate-800"
          }`}
      >
        {tabs.slice(0, 8).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 flex-1 py-1 transition-colors
                ${isActive 
                  ? "text-blue-500" 
                  : isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-medium tracking-tight whitespace-nowrap">{tab.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
