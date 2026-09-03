import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import NetworkLocator from "./components/NetworkLocator";
import JobMarketplace from "./components/JobMarketplace";
import FreelanceMarketplace from "./components/FreelanceMarketplace";
import ApplicationTracker from "./components/ApplicationTracker";
import MessagingCenter from "./components/MessagingCenter";
import UserProfile from "./components/UserProfile";
import AdminPanel from "./components/AdminPanel";
import NexaAssistant from "./components/NexaAssistant";
import Academy from "./components/Academy";
import Auth from "./components/Auth";
import { auth, onAuthStateChanged, signOut } from "./firebase";

import { 
  JobOpportunity, 
  UserProfile as ProfileType, 
  FreelanceGig, 
  Conversation, 
  JobApplication,
  NetworkLocation
} from "./types";
import { 
  Bot, 
  Sparkles, 
  Crown, 
  ArrowRight, 
  Building, 
  Plus, 
  Briefcase, 
  Send 
} from "lucide-react";

export default function App() {
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<"candidate" | "employer">("candidate");
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [showFloatingNexa, setShowFloatingNexa] = useState<boolean>(false);

  // Core Data States
  const [profile, setProfile] = useState<ProfileType>({
    id: "usr-1",
    name: "Jesse Orie",
    email: "jesseorie01@gmail.com",
    headline: "Junior Web Application Developer",
    skills: ["React", "TypeScript", "Tailwind CSS", "Express", "Node.js"],
    experience: [],
    education: [],
    portfolioUrls: [],
    expectedIncome: 2500,
    workPreference: "Remote",
    availability: "Immediate"
  });

  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [gigs, setGigs] = useState<FreelanceGig[]>([]);
  const [networks, setNetworks] = useState<NetworkLocation[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  
  // Interaction states
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  // Connectivity sync states
  const [syncedSpeed, setSyncedSpeed] = useState<number>(0);
  const [syncedLatency, setSyncedLatency] = useState<number>(0);

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticatedUser(true);
        setProfile(p => ({
          ...p,
          name: user.displayName || user.email?.split("@")[0] || p.name,
          email: user.email || p.email
        }));
      } else {
        setIsAuthenticatedUser(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsAuthenticatedUser(false);
    } catch (err) {
      console.error("Sign out error:", err);
      setIsAuthenticatedUser(false);
    }
  };

  // Load initial backend database states
  const loadPlatformData = async () => {
    try {
      // Profile
      const profRes = await fetch("/api/profile");
      if (profRes.ok) {
        const prof = await profRes.json();
        setProfile(prof);
      }

      // Jobs
      const jobsRes = await fetch("/api/jobs");
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData);
      }

      // Gigs
      const gigsRes = await fetch("/api/gigs");
      if (gigsRes.ok) {
        const gigsData = await gigsRes.json();
        setGigs(gigsData);
      }

      // Networks
      const netRes = await fetch("/api/networks");
      if (netRes.ok) {
        const netData = await netRes.json();
        setNetworks(netData);
      }

      // Conversations
      const convRes = await fetch("/api/conversations");
      if (convRes.ok) {
        const convs = await convRes.json();
        setConversations(convs);
      }

      // Applications
      const appRes = await fetch("/api/applications");
      if (appRes.ok) {
        const apps = await appRes.json();
        setApplications(apps);
        setAppliedJobIds(apps.map((a: any) => a.jobId));
      }
    } catch (err) {
      console.error("Failed synchronizing platform databases:", err);
    }
  };

  useEffect(() => {
    loadPlatformData();
  }, []);

  // Sync theme changes with standard document elements
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      root.style.backgroundColor = "#0A0F1E"; // Sleek Interface dark blue
    } else {
      root.classList.remove("dark");
      root.style.backgroundColor = "#f8fafc"; // Slate 50
    }
  }, [isDarkMode]);

  // Employer Portal Job Posting State
  const [postTitle, setPostTitle] = useState("");
  const [postCompany, setPostCompany] = useState("");
  const [postSalary, setPostSalary] = useState("");
  const [postSkills, setPostSkills] = useState("");
  const [postType, setPostType] = useState("Full-time");
  const [postLocation, setPostLocation] = useState("Remote");

  const handleCreateJobPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postCompany) return;

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: postTitle,
          company: postCompany,
          salaryRange: postSalary || "$3,000 - $5,000/month",
          skillsRequired: postSkills.split(",").map(s => s.trim()).filter(Boolean),
          type: postType,
          location: postLocation,
          deadline: "2026-10-30"
        })
      });

      if (res.ok) {
        alert("Job posted successfully! Your listing was distributed to candidates on NexLink.");
        setPostTitle("");
        setPostCompany("");
        setPostSalary("");
        setPostSkills("");
        loadPlatformData();
      }
    } catch (err) {
      console.error("Failed creating job listing:", err);
    }
  };

  // Interactions logic
  const handleSaveJob = (jobId: string) => {
    setSavedJobIds(prev => 
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const handleApplyJob = async (jobId: string, status: string, notes?: string) => {
    setAppliedJobIds(prev => [...prev, jobId]);

    // Award +50 XP and unlock Market Active badge
    const currentBadges = profile.badges || [];
    const hasJobBadge = currentBadges.some(b => b.title === "Market Active");
    const updatedBadges = [...currentBadges];
    if (!hasJobBadge) {
      updatedBadges.push({
        id: `badge-job-${Date.now()}`,
        title: "Market Active",
        description: "Submitted a verified job application inside the opportunity hub",
        iconName: "Briefcase",
        dateEarned: new Date().toLocaleDateString()
      });
    }

    const updatedProfile: ProfileType = {
      ...profile,
      gamificationPoints: (profile.gamificationPoints || 350) + 50,
      badges: updatedBadges
    };

    await handleUpdateProfile(updatedProfile);
    loadPlatformData(); // refresh tracker count and lists
  };

  const handleUpdateApplicationStatus = async (
    jobId: string, 
    status: string, 
    notes?: string, 
    interviewDate?: string, 
    followUpDate?: string
  ) => {
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, status, notes, interviewDate, followUpDate })
      });
      if (res.ok) {
        loadPlatformData();
      }
    } catch (err) {
      console.error("Failed updating tracker details:", err);
    }
  };

  const handleUpdateProfile = async (newProfile: ProfileType) => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfile)
      });
      if (res.ok) {
        setProfile(newProfile);
      }
    } catch (err) {
      console.error("Failed saving profile:", err);
    }
  };

  const handleUpgradeToPremium = () => {
    setIsPremium(true);
    setShowUpgradeModal(false);
    alert("Congratulations! You are now subscribed to NexLink Premium. High-speed signal maps and direct API interfaces unlocked.");
  };

  // Render tab modules
  const renderActiveTabContent = () => {
    if (userRole === "employer") {
      /* EMPLOYER PORTAL */
      return (
        <div className="space-y-6 text-left">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Employer Dashboard</h2>
            <p className="text-sm opacity-70 mt-1">Post opportunities and manage inbound applications seamlessly.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Post opportunity card (7 Cols) */}
            <div className={`lg:col-span-7 p-6 rounded-2xl border space-y-4
              ${isDarkMode ? "bg-slate-900/40 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}
            >
              <h3 className="font-extrabold text-base flex items-center gap-1.5 border-b border-slate-700/10 pb-2">
                <Building className="w-5 h-5 text-blue-500" /> Create Opportunity Listing
              </h3>

              <form onSubmit={handleCreateJobPost} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold opacity-75">Opportunity Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Frontend Engineer"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className={`w-full p-2.5 rounded-lg border outline-none
                        ${isDarkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-200"}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold opacity-75">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Tech Solutions"
                      value={postCompany}
                      onChange={(e) => setPostCompany(e.target.value)}
                      className={`w-full p-2.5 rounded-lg border outline-none
                        ${isDarkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-200"}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold opacity-75">Salary Range / Budget</label>
                    <input
                      type="text"
                      placeholder="e.g. $4,000 - $6,000/month"
                      value={postSalary}
                      onChange={(e) => setPostSalary(e.target.value)}
                      className={`w-full p-2.5 rounded-lg border outline-none
                        ${isDarkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-200"}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold opacity-75">Required Skills (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. React, Next.js, Node.js"
                      value={postSkills}
                      onChange={(e) => setPostSkills(e.target.value)}
                      className={`w-full p-2.5 rounded-lg border outline-none
                        ${isDarkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-200"}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold opacity-75">Employment Type</label>
                    <select
                      value={postType}
                      onChange={(e) => setPostType(e.target.value)}
                      className={`w-full p-2.5 rounded-lg border outline-none
                        ${isDarkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-200"}`}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Remote">Remote</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold opacity-75">Workplace Location</label>
                    <input
                      type="text"
                      value={postLocation}
                      onChange={(e) => setPostLocation(e.target.value)}
                      className={`w-full p-2.5 rounded-lg border outline-none
                        ${isDarkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-200"}`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Distribute Opportunity Listing
                </button>
              </form>
            </div>

            {/* Inbound Applicant checklist (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className={`p-6 rounded-2xl border space-y-3
                ${isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}
              >
                <h3 className="font-extrabold text-base border-b border-slate-700/10 pb-2">Active Inbound Applicants</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {applications.map(app => (
                    <div 
                      key={app.id} 
                      className={`p-3 rounded-xl border text-xs text-left flex justify-between items-center
                        ${isDarkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-200"}`}
                    >
                      <div>
                        <p className="font-bold">Jesse Orie</p>
                        <p className="opacity-60 text-[10px] mt-0.5">Applied to: {app.jobTitle}</p>
                        <p className="opacity-50 text-[9px] mt-1 italic">Notes: "{app.notes || "None"}"</p>
                      </div>

                      <span className="text-[9px] bg-blue-600/10 text-blue-500 font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
                        {app.status}
                      </span>
                    </div>
                  ))}

                  {applications.length === 0 && (
                    <div className="text-center py-10 opacity-50 text-xs">
                      No candidate submissions received yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard 
            isDarkMode={isDarkMode} 
            profile={profile} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            speed={syncedSpeed}
            latency={syncedLatency}
          />
        );
      case "network":
        return (
          <NetworkLocator 
            isDarkMode={isDarkMode}
            networks={networks}
            onRefresh={loadPlatformData}
            onSpeedChange={async (speed, latency) => {
              setSyncedSpeed(speed);
              setSyncedLatency(latency);
              
              // Gamification trigger: Award +100 XP and signal seeker badge
              const currentBadges = profile.badges || [];
              const hasSignalBadge = currentBadges.some(b => b.title === "Signal Seeker");
              const updatedBadges = [...currentBadges];
              if (!hasSignalBadge) {
                updatedBadges.push({
                  id: "badge-sig-1",
                  title: "Signal Seeker",
                  description: "Validated remote capacity parameters and latency inside Network Locator",
                  iconName: "Wifi",
                  dateEarned: new Date().toLocaleDateString()
                });
              }

              const updatedProfile: ProfileType = {
                ...profile,
                gamificationPoints: (profile.gamificationPoints || 350) + 100,
                badges: updatedBadges
              };
              await handleUpdateProfile(updatedProfile);
            }}
          />
        );
      case "jobs":
        return (
          <JobMarketplace 
            isDarkMode={isDarkMode}
            jobs={jobs}
            profile={profile}
            onSave={handleSaveJob}
            onApply={handleApplyJob}
            savedJobIds={savedJobIds}
            appliedJobIds={appliedJobIds}
          />
        );
      case "marketplace":
        return (
          <FreelanceMarketplace 
            isDarkMode={isDarkMode}
            gigs={gigs}
            profile={profile}
            onRefresh={loadPlatformData}
          />
        );
      case "tracker":
        return (
          <ApplicationTracker 
            isDarkMode={isDarkMode}
            applications={applications}
            onUpdateStatus={handleUpdateApplicationStatus}
          />
        );
      case "academy":
        return (
          <Academy 
            isDarkMode={isDarkMode}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case "messages":
        return (
          <MessagingCenter 
            isDarkMode={isDarkMode}
            conversations={conversations}
            onRefreshConversations={loadPlatformData}
          />
        );
      case "profile":
        return (
          <UserProfile 
            isDarkMode={isDarkMode}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case "admin":
        return (
          <AdminPanel 
            isDarkMode={isDarkMode}
          />
        );
      default:
        return (
          <Dashboard 
            isDarkMode={isDarkMode} 
            profile={profile} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            speed={syncedSpeed}
            latency={syncedLatency}
          />
        );
    }
  };

  if (!isAuthenticatedUser) {
    return (
      <Auth 
        isDarkMode={isDarkMode} 
        onAuthSuccess={(user) => {
          setProfile(p => ({
            ...p,
            name: user.name,
            email: user.email
          }));
          setIsAuthenticatedUser(true);
        }} 
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 pb-20 md:pb-0
      ${isDarkMode ? "bg-[#0A0F1E] text-slate-100" : "bg-white text-slate-900"}`}
    >
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode}
        userRole={userRole}
        setUserRole={setUserRole}
        isPremium={isPremium}
        onUpgradeClick={() => setShowUpgradeModal(true)}
        onSignOut={handleSignOut}
      />

      {/* Main viewport Container */}
      <main className="md:pl-64 min-h-screen flex flex-col">
        {/* Upper responsive Top Bar */}
        <header className={`py-4 px-6 md:px-8 border-b flex items-center justify-between transition-colors
          ${isDarkMode ? "bg-slate-900/20 border-slate-800" : "bg-white border-slate-200"}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono tracking-widest text-blue-500 uppercase">
              {activeTab === "network" ? "Signal locator" : activeTab}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold">{profile.name}</p>
              <p className="text-[10px] opacity-60 leading-none">{profile.headline}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {profile.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Dynamic Inner Tab Viewport with pristine margins */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {renderActiveTabContent()}
        </div>
      </main>

      {/* PERSISTENT FLOATING CO-PILOT DRAGGABLE BUBBLE */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowFloatingNexa(!showFloatingNexa)}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform"
          title="Toggle Nexa Career Co-Pilot"
        >
          <Bot className="w-5 h-5 animate-pulse" />
        </button>

        {showFloatingNexa && (
          <div className={`fixed bottom-20 right-6 w-full max-w-sm rounded-2xl border shadow-2xl p-5 text-left transition-all max-h-[500px] overflow-y-auto z-50
            ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}
          >
            <div className="flex justify-between items-center border-b border-slate-700/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-extrabold text-sm">Nexa AI Co-Pilot (Live)</h3>
              </div>
              <button 
                onClick={() => setShowFloatingNexa(false)}
                className="text-slate-400 hover:text-rose-500 font-bold"
              >
                ✕
              </button>
            </div>
            <NexaAssistant isDarkMode={isDarkMode} />
          </div>
        )}
      </div>

      {/* PREMIUM UPGRADE MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md rounded-2xl border p-6 text-left relative
            ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}
          >
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Crown className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-extrabold tracking-tight">Upgrade to NexLink Premium</h3>
              <p className="text-xs opacity-70">Unlock platforms capabilities, unlimited co-working signals map routes, high-yield freelance contract bids, and faster network setup diagnostics.</p>
              
              <div className="p-4 rounded-xl border border-dashed border-slate-700/35 bg-slate-500/5 text-xs text-left space-y-2">
                <p className="font-semibold">Unlock Premium Privileges:</p>
                <ul className="space-y-1 opacity-80 list-disc list-inside">
                  <li>Real-time high-speed hotspot mapping</li>
                  <li>Inbound client rating insight diagnostic indicators</li>
                  <li>Priority resume PDF portfolio formatting</li>
                  <li>Direct AI coaching chats on mock tech drills</li>
                </ul>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold hover:bg-slate-500/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpgradeToPremium}
                  className="px-5 py-2.5 bg-gradient-to-tr from-amber-500 to-yellow-600 hover:opacity-90 text-white rounded-lg text-xs font-bold"
                >
                  Activate Lifetime Access - $9
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
