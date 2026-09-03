import React, { useState } from "react";
import { 
  GraduationCap, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  Award, 
  Zap, 
  UserCheck, 
  Users, 
  Check, 
  Plus, 
  Play, 
  Flame,
  Star,
  Activity,
  ThumbsUp,
  ShieldAlert,
  Search
} from "lucide-react";
import { UserProfile as ProfileType, UserBadge, UserSkill } from "../types";

interface AcademyProps {
  isDarkMode: boolean;
  profile: ProfileType;
  onUpdateProfile: (newProfile: ProfileType) => void;
}

// Fixed static learning course catalog
const COURSE_CATALOG = [
  {
    id: "course-react-advanced",
    title: "Advanced React 19 Patterns & Performance",
    provider: "Meta Tech Academy",
    skillName: "React",
    type: "Course",
    duration: "4 hours",
    pointsAwarded: 150,
    description: "Master Concurrent rendering, server actions, and layout memoization techniques."
  },
  {
    id: "course-ts-strict",
    title: "TypeScript Strict Mode Masterclass",
    provider: "Vite Core Lab",
    skillName: "TypeScript",
    type: "Tutorial",
    duration: "2 hours",
    pointsAwarded: 100,
    description: "Write ultra-safe typings using advanced discriminated unions and generics."
  },
  {
    id: "course-tailwind-grids",
    title: "Fluid Layout Design with Tailwind CSS v4",
    provider: "Tailwind CSS",
    skillName: "Tailwind CSS",
    type: "Article",
    duration: "45 mins",
    pointsAwarded: 50,
    description: "Construct grid ratios and responsive interfaces with absolute layout precision."
  },
  {
    id: "course-node-scale",
    title: "Scaling Node.js APIs & Memory Profiling",
    provider: "OpenJS Foundation",
    skillName: "Node.js",
    type: "Course",
    duration: "6 hours",
    pointsAwarded: 200,
    description: "Benchmark garbage collection metrics and structure modular Express backends."
  },
  {
    id: "course-figma-vars",
    title: "Figma Variables & Advanced Design Tokens",
    provider: "Figma Academy",
    skillName: "Figma",
    type: "Tutorial",
    duration: "3 hours",
    pointsAwarded: 120,
    description: "Synchronize visual light/dark modes and establish geometric spacing tokens."
  },
  {
    id: "course-db-drizzle",
    title: "Relational Mapping with Drizzle & Cloud SQL",
    provider: "Database Collective",
    skillName: "Database",
    type: "Course",
    duration: "5 hours",
    pointsAwarded: 180,
    description: "Draft typesafe database schemas and build real-time query joins."
  },
  {
    id: "course-docker-prod",
    title: "Production Docker & Container Orchestration",
    provider: "Docker Labs",
    skillName: "Docker",
    type: "Tutorial",
    duration: "3 hours",
    pointsAwarded: 120,
    description: "Create lightweight multi-stage Dockerfiles and deploy to secure sandboxes."
  },
  {
    id: "course-ai-gemini",
    title: "Prompt Engineering & Gemini API Integrations",
    provider: "Google Developer",
    skillName: "Gemini API",
    type: "Course",
    duration: "4 hours",
    pointsAwarded: 150,
    description: "Incorporate server-side Google GenAI SDK calls with tools and structural grounding."
  }
];

// Predefined career goals and their required skill sets
const CAREER_GOALS = [
  { id: "frontend", label: "Senior Frontend Engineer", requiredSkills: ["React", "TypeScript", "Tailwind CSS", "Figma"] },
  { id: "fullstack", label: "Full-Stack Software Creator", requiredSkills: ["React", "TypeScript", "Node.js", "Database", "Express"] },
  { id: "devops", label: "Cloud & DevOps Architect", requiredSkills: ["Docker", "Networking", "Node.js", "Express"] },
  { id: "ai", label: "AI Integration Practitioner", requiredSkills: ["React", "TypeScript", "Gemini API"] }
];

export default function Academy({ isDarkMode, profile, onUpdateProfile }: AcademyProps) {
  const [activeSubTab, setActiveSubTab] = useState<"paths" | "endorsements" | "leaderboard">("paths");
  
  // Selected Goal defaults to "frontend" if not set in profile
  const [selectedGoalId, setSelectedGoalId] = useState(
    CAREER_GOALS.find(g => g.label === profile.careerGoal)?.id || "frontend"
  );

  // Skill assessments loading states
  const [assessingSkill, setAssessingSkill] = useState<string | null>(null);
  const [assessmentSuccess, setAssessmentSuccess] = useState<string | null>(null);

  // Active learning courses simulation progress state
  const [learningProgressList, setLearningProgressList] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    profile.learningProgress?.forEach(p => {
      initial[p.courseId] = p.progress;
    });
    return initial;
  });

  // Fetch target goal object
  const currentGoal = CAREER_GOALS.find(g => g.id === selectedGoalId) || CAREER_GOALS[0];

  // Calculate missing skills based on current user skills
  const missingSkills = currentGoal.requiredSkills.filter(
    reqSkill => !profile.skills.some(s => s.toLowerCase() === reqSkill.toLowerCase())
  );

  // Calculate matching courses for missing skills or overall career goal
  const suggestedCourses = COURSE_CATALOG.filter(course => 
    currentGoal.requiredSkills.includes(course.skillName)
  );

  // Points total
  const currentPoints = profile.gamificationPoints || 350;

  // Handle Career Goal Update
  const handleUpdateGoal = (goalId: string) => {
    setSelectedGoalId(goalId);
    const goalObj = CAREER_GOALS.find(g => g.id === goalId);
    if (goalObj) {
      const updated: ProfileType = {
        ...profile,
        careerGoal: goalObj.label
      };
      onUpdateProfile(updated);
    }
  };

  // Run skill test assessment
  const handleRunNexaAssessment = (skillName: string) => {
    setAssessingSkill(skillName);
    setAssessmentSuccess(null);
    
    setTimeout(() => {
      // Create user skill representation if not present
      const endorsements = profile.skillEndorsements || [];
      const exists = endorsements.find(s => s.name.toLowerCase() === skillName.toLowerCase());
      
      let updatedEndorsements: UserSkill[] = [];
      if (exists) {
        updatedEndorsements = endorsements.map(s => 
          s.name.toLowerCase() === skillName.toLowerCase()
            ? { ...s, isValidated: true }
            : s
        );
      } else {
        updatedEndorsements = [
          ...endorsements,
          {
            name: skillName,
            endorsements: [{ endorserName: "Nexa AI Diagnostic Bot", isSystem: true, date: new Date().toLocaleDateString() }],
            isValidated: true
          }
        ];
      }

      // Add points for completing system assessment
      const extraPoints = 100;
      const updatedPoints = currentPoints + extraPoints;

      // Check if they unlocked "Nexa Certified" badge
      const badges = profile.badges || [];
      const hasNexaBadge = badges.some(b => b.title === "Nexa Certified");
      const updatedBadges = [...badges];
      if (!hasNexaBadge) {
        updatedBadges.push({
          id: `badge-nexa-${Date.now()}`,
          title: "Nexa Certified",
          description: "Successfully validated engineering core skills via computerized system tests",
          iconName: "Zap",
          dateEarned: new Date().toLocaleDateString()
        });
      }

      const updatedProfile: ProfileType = {
        ...profile,
        skillEndorsements: updatedEndorsements,
        gamificationPoints: updatedPoints,
        badges: updatedBadges
      };

      onUpdateProfile(updatedProfile);
      setAssessingSkill(null);
      setAssessmentSuccess(skillName);
      setTimeout(() => setAssessmentSuccess(null), 4000);
    }, 1500);
  };

  // Simulate community or client endorsement
  const handleSimulateEndorsement = (skillName: string) => {
    const names = [
      "Elena Rostova (Client)",
      "Sarah Jenkins (Recruiter @ SyncLink)",
      "Alex Rivera (Pro Developer)",
      "Liam Gallagher (Project Owner)",
      "Kenji Sato (Lead DevOps)"
    ];
    const chosenName = names[Math.floor(Math.random() * names.length)];

    const endorsements = profile.skillEndorsements || [];
    const exists = endorsements.find(s => s.name.toLowerCase() === skillName.toLowerCase());

    let updatedEndorsements: UserSkill[] = [];
    if (exists) {
      // Check if already endorsed by chosenName
      if (exists.endorsements.some(e => e.endorserName === chosenName)) {
        alert(`You already received an endorsement from ${chosenName} for ${skillName}!`);
        return;
      }
      updatedEndorsements = endorsements.map(s => 
        s.name.toLowerCase() === skillName.toLowerCase()
          ? { 
              ...s, 
              endorsements: [...s.endorsements, { endorserName: chosenName, isSystem: false, date: new Date().toLocaleDateString() }] 
            }
          : s
      );
    } else {
      updatedEndorsements = [
        ...endorsements,
        {
          name: skillName,
          endorsements: [{ endorserName: chosenName, isSystem: false, date: new Date().toLocaleDateString() }],
          isValidated: false
        }
      ];
    }

    // Award +25 points for receiving dynamic peer praise
    const updatedPoints = currentPoints + 25;

    const updatedProfile: ProfileType = {
      ...profile,
      skillEndorsements: updatedEndorsements,
      gamificationPoints: updatedPoints
    };

    onUpdateProfile(updatedProfile);
  };

  // Course progress trigger
  const handleSimulateCourseProgress = (courseId: string, skillName: string, points: number) => {
    const currentProg = learningProgressList[courseId] || 0;
    
    if (currentProg >= 100) return;

    const nextProg = Math.min(currentProg + 25, 100);
    const isNowCompleted = nextProg === 100;

    // Update in-memory local react tracking state
    setLearningProgressList(prev => ({ ...prev, [courseId]: nextProg }));

    // Prepare updated profile
    const currentProgressArray = profile.learningProgress || [];
    const existingProgressIndex = currentProgressArray.findIndex(p => p.courseId === courseId);

    let updatedProgressArray = [...currentProgressArray];
    if (existingProgressIndex > -1) {
      updatedProgressArray[existingProgressIndex] = {
        ...updatedProgressArray[existingProgressIndex],
        progress: nextProg,
        isCompleted: isNowCompleted,
        lastActive: new Date().toLocaleDateString()
      };
    } else {
      updatedProgressArray.push({
        courseId,
        progress: nextProg,
        isCompleted: isNowCompleted,
        startDate: new Date().toLocaleDateString(),
        lastActive: new Date().toLocaleDateString()
      });
    }

    let updatedSkills = [...profile.skills];
    let updatedEndorsements = profile.skillEndorsements || [];
    let updatedPoints = currentPoints + 30; // +30 points for partial step action
    const updatedBadges = [...(profile.badges || [])];

    if (isNowCompleted) {
      // Award completed points
      updatedPoints += points;
      
      // Auto acquire skill on user profile if not exists
      if (!updatedSkills.some(s => s.toLowerCase() === skillName.toLowerCase())) {
        updatedSkills.push(skillName);
      }

      // Add high-fidelity NexLink assessment verification stamp to skillEndorsements
      const endorsExists = updatedEndorsements.find(s => s.name.toLowerCase() === skillName.toLowerCase());
      if (endorsExists) {
        updatedEndorsements = updatedEndorsements.map(s => 
          s.name.toLowerCase() === skillName.toLowerCase()
            ? { ...s, isValidated: true }
            : s
        );
      } else {
        updatedEndorsements = [
          ...updatedEndorsements,
          {
            name: skillName,
            endorsements: [{ endorserName: "NexLink Academy Graduate Board", isSystem: true, date: new Date().toLocaleDateString() }],
            isValidated: true
          }
        ];
      }

      // Check for Continuous Learner badge
      const hasLearnBadge = updatedBadges.some(b => b.title === "Continuous Learner");
      if (!hasLearnBadge) {
        updatedBadges.push({
          id: `badge-learn-${Date.now()}`,
          title: "Continuous Learner",
          description: "Earned a verified passing mark in a digital career academy course module",
          iconName: "GraduationCap",
          dateEarned: new Date().toLocaleDateString()
        });
      }
    }

    const updatedProfile: ProfileType = {
      ...profile,
      skills: updatedSkills,
      skillEndorsements: updatedEndorsements,
      learningProgress: updatedProgressArray,
      gamificationPoints: updatedPoints,
      badges: updatedBadges
    };

    onUpdateProfile(updatedProfile);
  };

  // Mocked Leaderboard list with user profile spliced in
  const LEADERBOARD_SEED = [
    { rank: 1, name: "Liam Gallagher", points: 890, badgesCount: 6, role: "Senior Architect", active: true },
    { rank: 2, name: "Elena Rostova", points: 760, badgesCount: 5, role: "UX Strategist", active: true },
    { rank: 3, name: "Kenji Sato", points: 650, badgesCount: 4, role: "Site Reliability", active: true },
    { rank: 4, name: "Jesse Orie (You)", points: currentPoints, badgesCount: profile.badges?.length || 2, role: profile.headline, active: false, isUser: true },
    { rank: 5, name: "Alex Rivera", points: 310, badgesCount: 2, role: "Freelance Dev", active: false },
    { rank: 6, name: "Maria Chen", points: 280, badgesCount: 1, role: "Product Manager", active: false }
  ].sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-6 text-left">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">NexLink Academy & Gamification</h2>
          <p className="text-sm opacity-70 mt-1">
            Validate technical skill arrays, close competitive career gaps, and unlock system rewards.
          </p>
        </div>

        {/* Dynamic score summary header card */}
        <div className="p-3.5 px-5 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-slate-800/80 flex items-center gap-4 text-xs">
          <div className="text-center border-r border-slate-850 pr-4">
            <p className="text-[10px] uppercase font-bold opacity-60">My Points</p>
            <p className="text-xl font-extrabold text-cyan-400 mt-0.5">{currentPoints} <span className="text-[10px] text-slate-500 font-normal">XP</span></p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold opacity-60">Unlocked Badges</p>
            <p className="text-xl font-extrabold text-amber-400 mt-0.5">
              {(profile.badges?.length || 2)} <span className="text-[10px] text-slate-500 font-normal">items</span>
            </p>
          </div>
        </div>
      </div>

      {/* SUB-TAB NAVS */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveSubTab("paths")}
          className={`px-5 py-3 text-xs font-bold transition-all relative flex items-center gap-2
            ${activeSubTab === "paths" 
              ? "text-blue-400 border-b-2 border-blue-500" 
              : "text-slate-400 hover:text-slate-200"}`}
        >
          <GraduationCap className="w-4 h-4" /> Career Learning Paths
        </button>

        <button
          onClick={() => setActiveSubTab("endorsements")}
          className={`px-5 py-3 text-xs font-bold transition-all relative flex items-center gap-2
            ${activeSubTab === "endorsements" 
              ? "text-blue-400 border-b-2 border-blue-500" 
              : "text-slate-400 hover:text-slate-200"}`}
        >
          <Award className="w-4 h-4" /> Endorsements & Nexa Validation
        </button>

        <button
          onClick={() => setActiveSubTab("leaderboard")}
          className={`px-5 py-3 text-xs font-bold transition-all relative flex items-center gap-2
            ${activeSubTab === "leaderboard" 
              ? "text-blue-400 border-b-2 border-blue-500" 
              : "text-slate-400 hover:text-slate-200"}`}
        >
          <Trophy className="w-4 h-4" /> Platform Leaderboard
        </button>
      </div>

      {/* CORE VIEWPORT */}
      {activeSubTab === "paths" && (
        <div className="space-y-6">
          
          {/* TOP SECTION: SELECT CAREER GOAL & IDENTIFY GAPS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* CAREER SELECTOR */}
            <div className="lg:col-span-4 p-6 bg-[#141C2F] rounded-3xl border border-slate-800/50 space-y-4">
              <div>
                <h3 className="font-extrabold text-sm uppercase opacity-75 tracking-wider">Target Career Goal</h3>
                <p className="text-[11px] text-slate-400 mt-1">Select a career pathway to automatically analyze required technical arrays.</p>
              </div>

              <div className="space-y-2.5">
                {CAREER_GOALS.map(goal => (
                  <button
                    key={goal.id}
                    onClick={() => handleUpdateGoal(goal.label)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all flex flex-col gap-1
                      ${selectedGoalId === goal.id || profile.careerGoal === goal.label
                        ? "border-blue-500/50 bg-blue-600/10 text-blue-400 font-bold"
                        : "border-slate-800 bg-slate-950/40 text-slate-300 hover:bg-slate-950/80"}`}
                  >
                    <span className="font-bold">{goal.label}</span>
                    <span className="text-[10px] opacity-65 font-normal">Skills: {goal.requiredSkills.join(", ")}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* GAP ANALYSIS DISPLAY */}
            <div className="lg:col-span-8 p-6 bg-[#141C2F] rounded-3xl border border-slate-800/50 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-slate-850 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm uppercase opacity-75 tracking-wider">Identified Skill Gaps</h3>
                    <p className="text-[11px] text-slate-400 mt-1">Dynamic audit comparing your profile skills against target benchmarks.</p>
                  </div>
                  <span className="text-[10px] bg-indigo-500/15 text-indigo-400 font-bold px-2.5 py-1 rounded-full">
                    {missingSkills.length} Gaps Pending
                  </span>
                </div>

                {/* VISUAL MATRIX CHIPS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Verified Skills */}
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Acquired Benchmark Skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {currentGoal.requiredSkills
                        .filter(skill => !missingSkills.includes(skill))
                        .map(skill => (
                          <span key={skill} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-1">
                            <Check className="w-3 h-3" /> {skill}
                          </span>
                        ))}
                      {currentGoal.requiredSkills.filter(skill => !missingSkills.includes(skill)).length === 0 && (
                        <p className="text-xs text-slate-500 italic">None of the required skills have been logged yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Skills Missing */}
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Outstanding Skill Gaps
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {missingSkills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-xl flex items-center gap-1">
                          ⚡ Needs {skill}
                        </span>
                      ))}
                      {missingSkills.length === 0 && (
                        <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-1">
                          🎉 Perfect Core Match!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* NEXA AI AUDITOR CALLOUT */}
              <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-2xl flex items-center gap-3.5 text-xs leading-normal mt-4">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <p className="font-bold text-slate-200">AI Co-pilot Diagnostic</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {missingSkills.length > 0 
                      ? `Your profile is missing ${missingSkills.join(", ")}. Complete the matching modules below to acquire verified checkmarks and earn up to ${missingSkills.length * 150} combined XP points instantly!`
                      : "Outstanding! Your skill matrix is a perfect match for Senior Frontend roles. Keep studying other tracks to unlock more certifications."}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* DYNAMIC COURSE LISTINGS MATCHING SELECTED TRACK */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2 pt-2">
              <BookOpen className="w-5 h-5 text-blue-400" /> Sugggested Learning & Training Tutorials
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedCourses.map(course => {
                const isAcquired = profile.skills.some(s => s.toLowerCase() === course.skillName.toLowerCase());
                const progress = learningProgressList[course.id] || 0;
                
                return (
                  <div
                    key={course.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col justify-between relative overflow-hidden
                      ${isAcquired 
                        ? "bg-slate-900/30 border-slate-800/30 opacity-75" 
                        : "bg-[#141C2F] border-slate-800/50 hover:border-slate-700/50"}`}
                  >
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-bold bg-blue-600/10 text-blue-400 px-2.5 py-0.5 rounded-full uppercase">
                            {course.type}
                          </span>
                          <span className="text-[9px] font-bold bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-full uppercase ml-1.5">
                            {course.duration}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-cyan-400">
                          +{course.pointsAwarded} XP
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-white">{course.title}</h4>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{course.description}</p>
                      <p className="text-[10px] opacity-60">Provider: {course.provider} • Target skill: <strong>{course.skillName}</strong></p>
                    </div>

                    {/* PROGRESS BAR & START BUTTON */}
                    <div className="mt-4 pt-4 border-t border-slate-850 flex flex-col gap-3">
                      <div className="flex justify-between text-[10px] font-bold opacity-70">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      
                      <div className="w-full bg-slate-500/10 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-blue-500 h-full rounded-full transition-all duration-300" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="flex gap-2 justify-end mt-1 text-xs">
                        {progress >= 100 ? (
                          <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl flex items-center gap-1 w-full justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Module Completed • Skill Unlocked
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSimulateCourseProgress(course.id, course.skillName, course.pointsAwarded)}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-1 transition-all"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            {progress > 0 ? "Resume Learning Session (+25%)" : "Start Study Session (+25%)"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {activeSubTab === "endorsements" && (
        <div className="space-y-6">
          
          <div className="p-6 bg-[#141C2F] rounded-3xl border border-slate-800/50 space-y-4">
            <div>
              <h3 className="font-extrabold text-sm uppercase opacity-75 tracking-wider">Interactive Skill Validation Matrix</h3>
              <p className="text-xs text-slate-400 mt-1">
                Run automated Nexa assessments to certify outstanding skills, or request community endorsements to build professional credibility on our platform.
              </p>
            </div>

            {assessmentSuccess && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs rounded-2xl flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Success! <strong>{assessmentSuccess}</strong> has been fully certified by our automated AI examiner. +100 XP awarded!</span>
              </div>
            )}

            <div className="space-y-3">
              {profile.skills.map(skill => {
                const matchingEndors = (profile.skillEndorsements || []).find(
                  s => s && s.name && skill && s.name.toLowerCase() === skill.toLowerCase()
                );
                const hasNexaVerification = matchingEndors?.isValidated;
                const endorsersList = matchingEndors?.endorsements || [];

                return (
                  <div 
                    key={skill}
                    className="p-4 bg-slate-950/40 rounded-2xl border border-slate-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
                  >
                    {/* Skill Info */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5">
                        <strong className="text-sm font-bold text-white">{skill}</strong>
                        
                        {hasNexaVerification ? (
                          <span className="px-2 py-0.5 bg-cyan-400/10 text-cyan-400 font-bold text-[9px] rounded-full border border-cyan-400/20 flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> Nexa Verified
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-500/10 text-slate-400 font-bold text-[9px] rounded-full border border-slate-800">
                            Self-Declared
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 opacity-60 text-[11px]">
                        <Users className="w-3.5 h-3.5" />
                        <span>
                          {endorsersList.length > 0 
                            ? `Endorsed by: ${endorsersList.map(e => e.endorserName).join(", ")}` 
                            : "No community endorsements yet."}
                        </span>
                      </div>
                    </div>

                    {/* Endorsements Actions */}
                    <div className="flex gap-2 w-full md:w-auto">
                      <button
                        onClick={() => handleSimulateEndorsement(skill)}
                        className="flex-1 md:flex-none px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold hover:text-white flex items-center justify-center gap-1 transition-all"
                      >
                        <ThumbsUp className="w-3 h-3" /> Simulate peer endorsement (+25 XP)
                      </button>

                      <button
                        onClick={() => handleRunNexaAssessment(skill)}
                        disabled={assessingSkill === skill || hasNexaVerification}
                        className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all
                          ${hasNexaVerification 
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 cursor-not-allowed" 
                            : "bg-blue-600 hover:bg-blue-500 text-white"}`}
                      >
                        {assessingSkill === skill ? (
                          <>
                            <Activity className="w-3 h-3 animate-spin" /> Verifying...
                          </>
                        ) : hasNexaVerification ? (
                          <>
                            <Check className="w-3 h-3" /> Certified
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" /> Run Nexa Exam (+100 XP)
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {activeSubTab === "leaderboard" && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* GAMIFIED REWARDS / BADGES LEDGER (5 Cols) */}
            <div className="lg:col-span-5 p-6 bg-[#141C2F] rounded-3xl border border-slate-800/50 space-y-4">
              <div>
                <h3 className="font-extrabold text-sm uppercase opacity-75 tracking-wider">Unlocked Platform Badges</h3>
                <p className="text-[11px] text-slate-400 mt-1">Earn unique credentials by completing work tasks, network speed tests, and verified courses.</p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {(profile.badges || []).map((badge, idx) => (
                  <div key={badge.id || idx} className="p-3.5 bg-slate-950/40 rounded-2xl border border-slate-850 flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0 text-amber-400 shadow-md">
                      {badge.title === "Continuous Learner" ? <GraduationCap className="w-5 h-5" /> : 
                       badge.title === "Nexa Certified" ? <Zap className="w-5 h-5" /> :
                       badge.title === "Signal Seeker" ? <Activity className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                    </div>
                    <div className="text-xs space-y-0.5">
                      <p className="font-extrabold text-white">{badge.title}</p>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{badge.description}</p>
                      <p className="text-[10px] opacity-40 font-mono">Date Unlocked: {badge.dateEarned}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LIVE LEADERBOARD DISPLAY (7 Cols) */}
            <div className="lg:col-span-7 p-6 bg-[#141C2F] rounded-3xl border border-slate-800/50 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-sm uppercase opacity-75 tracking-wider">Top Talent Leaderboard</h3>
                  <p className="text-[11px] text-slate-400 mt-1">Real-time ranking based on cumulative points, course completions, and contract deliveries.</p>
                </div>
                <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-orange-500 shrink-0 animate-bounce" /> Active Season 1
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-850">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950/80 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-850">
                    <tr>
                      <th className="p-3.5 pl-5">Rank</th>
                      <th className="p-3.5">Candidate</th>
                      <th className="p-3.5">Primary Specialization</th>
                      <th className="p-3.5 text-right pr-5">Total Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {LEADERBOARD_SEED.map((row, idx) => (
                      <tr 
                        key={idx}
                        className={`transition-colors
                          ${row.isUser 
                            ? "bg-blue-600/15 font-bold" 
                            : "hover:bg-slate-900/40 bg-slate-950/20"}`}
                      >
                        <td className="p-3.5 pl-5">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-extrabold text-[11px]
                            ${row.rank === 1 ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                              row.rank === 2 ? "bg-slate-400/10 text-slate-300 border border-slate-400/20" :
                              row.rank === 3 ? "bg-amber-700/10 text-amber-600 border border-amber-700/20" : "bg-slate-800/30 text-slate-400"}`}>
                            #{row.rank}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div>
                            <span className="font-bold text-white block">{row.name}</span>
                            <span className="text-[10px] opacity-55 font-mono">{row.badgesCount} badges</span>
                          </div>
                        </td>
                        <td className="p-3.5 opacity-85 text-slate-300">
                          {row.role}
                        </td>
                        <td className="p-3.5 text-right font-mono font-extrabold text-cyan-400 pr-5">
                          {row.points} XP
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
