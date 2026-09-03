import React, { useState } from "react";
import { 
  User, 
  Plus, 
  Trash, 
  Eye, 
  Download, 
  Share2, 
  Sparkles, 
  Award, 
  Briefcase, 
  GraduationCap, 
  Save, 
  DollarSign,
  CheckCircle2,
  Copy,
  Trophy,
  Zap
} from "lucide-react";
import { UserProfile as ProfileType } from "../types";

interface UserProfileProps {
  isDarkMode: boolean;
  profile: ProfileType;
  onUpdateProfile: (newProfile: ProfileType) => void;
}

export default function UserProfile({ isDarkMode, profile, onUpdateProfile }: UserProfileProps) {
  const [name, setName] = useState(profile.name);
  const [headline, setHeadline] = useState(profile.headline);
  const [expectedIncome, setExpectedIncome] = useState(profile.expectedIncome);
  const [workPreference, setWorkPreference] = useState(profile.workPreference);
  const [availability, setAvailability] = useState(profile.availability);
  
  // Extra user details requested
  const [phone, setPhone] = useState(profile.phone || "08031234567");
  const [gender, setGender] = useState(profile.gender || "Male");
  const [age, setAge] = useState(profile.age || 23);
  const [stateOfOrigin, setStateOfOrigin] = useState(profile.stateOfOrigin || "Lagos State");
  const [ageError, setAgeError] = useState("");

  // Skill chips state
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState<string[]>(profile.skills);

  // Experience state
  const [experiences, setExperiences] = useState(profile.experience);
  const [expCompany, setExpCompany] = useState("");
  const [expRole, setExpRole] = useState("");
  const [expDuration, setExpDuration] = useState("");
  const [expDesc, setExpDesc] = useState("");

  // Education state
  const [education, setEducation] = useState(profile.education);
  const [eduSchool, setEduSchool] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduYear, setEduYear] = useState("");

  // Resume builder view toggles
  const [resumeMode, setResumeMode] = useState<"edit" | "preview">("edit");
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSaveProfile = () => {
    // Security restriction: Age must be 18 and above
    if (age < 18) {
      setAgeError("In compliance with remote labor policy, you must be 18 or older to register on NexLink.");
      alert("Registration Denied: Candidate must be 18 years of age or older to participate.");
      return;
    }
    setAgeError("");

    // Sync skills with skillEndorsements
    const existingEndorsements = profile.skillEndorsements || [];
    const syncedEndorsements: any[] = skills.map(skillName => {
      const match = existingEndorsements.find(e => e && e.name && skillName && e.name.toLowerCase() === skillName.toLowerCase());
      if (match) {
        return match;
      } else {
        return {
          name: skillName,
          endorsements: [],
          isValidated: false
        };
      }
    });

    // Gamification milestone triggers
    const currentBadges = profile.badges || [];
    const hasProfileBadge = currentBadges.some(b => b.title === "Profile Architect");
    const updatedBadges = [...currentBadges];
    let extraPoints = 0;

    if (!hasProfileBadge) {
      updatedBadges.push({
        id: "badge-1",
        title: "Profile Architect",
        description: "Fully completed professional career dossier on NexLink",
        iconName: "UserCheck",
        dateEarned: new Date().toLocaleDateString()
      });
      extraPoints = 150; // Award +150 XP for profile completion milestone
    }

    const updatedPoints = (profile.gamificationPoints || 350) + extraPoints;

    const updated: ProfileType = {
      ...profile,
      name,
      headline,
      phone,
      gender,
      age: Number(age),
      stateOfOrigin,
      expectedIncome,
      workPreference,
      availability,
      skills,
      experience: experiences,
      education,
      skillEndorsements: syncedEndorsements,
      gamificationPoints: updatedPoints,
      badges: updatedBadges
    };
    onUpdateProfile(updated);
    if (extraPoints > 0) {
      alert(`🎉 Milestone Unlocked: Profile Architect! +150 XP Points awarded successfully!`);
    } else {
      alert("Career Profile saved successfully!");
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim() || skills.includes(newSkill.trim())) return;
    const updated = [...skills, newSkill.trim()];
    setSkills(updated);
    setNewSkill("");
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    const updated = skills.filter(s => s !== skillToDelete);
    setSkills(updated);
  };

  const handleAddExperience = () => {
    if (!expCompany || !expRole) return;
    const newItem = {
      id: `exp-${experiences.length + 1}`,
      company: expCompany,
      role: expRole,
      duration: expDuration || "Present",
      description: expDesc
    };
    const updated = [...experiences, newItem];
    setExperiences(updated);
    setExpCompany("");
    setExpRole("");
    setExpDuration("");
    setExpDesc("");
  };

  const handleDeleteExperience = (id: string) => {
    const updated = experiences.filter(e => e.id !== id);
    setExperiences(updated);
  };

  const handleAddEducation = () => {
    if (!eduSchool || !eduDegree) return;
    const newItem = {
      id: `edu-${education.length + 1}`,
      school: eduSchool,
      degree: eduDegree,
      year: eduYear || "2026"
    };
    const updated = [...education, newItem];
    setEducation(updated);
    setEduSchool("");
    setEduDegree("");
    setEduYear("");
  };

  const handleDeleteEducation = (id: string) => {
    const updated = education.filter(e => e.id !== id);
    setEducation(updated);
  };

  const handleShareProfile = () => {
    const shareUrl = `https://nexlink.work/candidate/jesse-orie`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportResume = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-left">
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">User Career Profile</h2>
          <p className="text-sm opacity-70 mt-1">Refine your professional résumé, add verification milestones, and build high-fidelity print portfolios.</p>
        </div>

        {/* View toggles */}
        <div className="flex gap-2">
          <button
            onClick={() => setResumeMode(resumeMode === "edit" ? "preview" : "edit")}
            className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5
              ${resumeMode === "preview" 
                ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                : isDarkMode ? "border-slate-800 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-50 text-slate-700"}`}
          >
            <Eye className="w-4 h-4" />
            {resumeMode === "preview" ? "Edit Profile Builder" : "Preview Digital Resume"}
          </button>
          
          <button
            onClick={handleShareProfile}
            className={`p-2 rounded-lg border transition-all text-xs font-semibold flex items-center gap-1.5
              ${copiedLink 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" 
                : isDarkMode ? "border-slate-800 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copiedLink ? "Link Copied!" : "Share Profile"}
          </button>
        </div>
      </div>

      {/* Gamification Milestone Quick Info Banner */}
      <div className={`p-5 rounded-3xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4
        ${isDarkMode ? "bg-[#141C2F] border-slate-800/50 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20 shadow-md shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="text-xs text-left">
            <p className="font-extrabold text-white text-sm">Gamified Profile Ecosystem</p>
            <p className="opacity-60 mt-0.5">Your cumulative points: <strong className="text-cyan-400">{profile.gamificationPoints || 350} XP</strong>. Unlocked <strong className="text-amber-400">{(profile.badges || []).length || 2} credentials</strong> on NexLink.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(profile.badges || []).map((badge, bIdx) => (
            <span 
              key={badge.id || bIdx} 
              title={badge.description}
              className={`px-3 py-1 rounded-xl border text-[10px] font-bold flex items-center gap-1 cursor-help
                ${isDarkMode ? "bg-[#0D1528] border-slate-800/80 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"}`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              {badge.title}
            </span>
          ))}
        </div>
      </div>

      {resumeMode === "preview" ? (
        /* PREMIUM PRINTABLE RESUME PREVIEW */
        <div className="space-y-4">
          <div className="p-3 bg-blue-600/10 border border-blue-500/20 text-blue-500 text-xs rounded-xl flex items-center justify-between">
            <span>💡 <strong>Tip:</strong> Press <strong>Export Résumé</strong> to print or save a PDF formatted with perfect margin layouts.</span>
            <button
              onClick={handleExportResume}
              className="px-3 py-1 bg-blue-600 text-white font-bold rounded-md flex items-center gap-1 hover:bg-blue-700"
            >
              <Download className="w-3.5 h-3.5" /> Export Résumé
            </button>
          </div>

          <div 
            id="printable-resume-paper"
            className="p-8 md:p-12 bg-white text-slate-900 border border-slate-300 shadow-xl rounded-2xl max-w-3xl mx-auto space-y-8 font-sans transition-all"
          >
            {/* Header section */}
            <div className="border-b border-slate-900/15 pb-6 flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">{name || "Your Name"}</h1>
                <p className="text-base text-blue-600 font-bold mt-1.5">{headline || "Professional Headline"}</p>
                <div className="text-xs text-slate-500 mt-2 space-y-1">
                  <p>{profile.email} • {phone || "08031234567"}</p>
                  <p>Gender: <strong>{gender || "Male"}</strong> • Age: <strong>{age || 23}</strong> • State: <strong>{stateOfOrigin || "Lagos State"}</strong></p>
                  <p>{profile.portfolioUrls[0] || "https://jesseorie.dev"} • {profile.portfolioUrls[1] || "https://github.com/jesseorie"}</p>
                </div>
              </div>

              <div className="text-right text-xs text-slate-500 space-y-0.5 font-mono">
                <p>WORK preference: <strong>{(workPreference || "Remote").toUpperCase()}</strong></p>
                <p>EXPECTED: <strong>${expectedIncome || 3000}/MO</strong></p>
                <p>STATUS: <strong>{(availability || "Available").toUpperCase()}</strong></p>
              </div>
            </div>

            {/* Profile Summary statement */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" /> Career Profile
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Highly motivated candidate specializing in {(skills || []).slice(0, 3).join(", ")}. Proven capacity to design responsive templates, implement clean API routes, and collaborate under secure conditions on NexLink. Open for {(workPreference || "Remote").toLowerCase()} opportunities with {(availability || "Available").toLowerCase()} availability.
              </p>
            </div>

            {/* Skills matrix */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-500 shrink-0" /> Professional Capabilities
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <span key={s} className="bg-slate-100 text-slate-800 font-bold text-[10px] px-3 py-1 rounded-md border border-slate-200/50">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience timeline */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-500 shrink-0" /> Work History
              </h3>
              
              <div className="space-y-4">
                {experiences.map(exp => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <strong className="text-slate-900 text-sm">{exp.role}</strong>
                        <span className="text-slate-500 ml-1">at {exp.company}</span>
                      </div>
                      <span className="font-mono text-slate-500">{exp.duration}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                  </div>
                ))}

                {experiences.length === 0 && (
                  <p className="text-xs text-slate-500 italic">No professional history specified. Edit profile to populate résumé details.</p>
                )}
              </div>
            </div>

            {/* Education timeline */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-purple-500 shrink-0" /> Academic Background
              </h3>

              <div className="space-y-3">
                {education.map(edu => (
                  <div key={edu.id} className="flex justify-between text-xs">
                    <div>
                      <strong className="text-slate-900">{edu.degree}</strong>
                      <span className="text-slate-500 block">{edu.school}</span>
                    </div>
                    <span className="font-mono text-slate-500">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resume Footer info */}
            <div className="border-t border-slate-200 pt-4 text-center">
              <p className="text-[10px] text-slate-400 font-mono">Generated securely via NexLink Work Ecosystem • Authorized Digital Portfolio Document</p>
            </div>
          </div>
        </div>
      ) : (
        /* INTERACTIVE BUILDER FORM */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Core Fields (7 Cols) */}
          <div className={`lg:col-span-7 p-6 rounded-2xl border space-y-5
            ${isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}
          >
            <h3 className="font-extrabold text-base tracking-tight border-b border-slate-700/15 pb-2">Core Candidate Info</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold opacity-75">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border outline-none
                    ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300"}`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold opacity-75">Professional Headline / Profession</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border outline-none
                    ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300"}`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold opacity-75">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 08031234567"
                  className={`w-full p-2.5 rounded-lg border outline-none
                    ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300"}`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold opacity-75">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border outline-none
                    ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300"}`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold opacity-75">Age (Must be 18 or above)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setAge(val);
                    if (val < 18) {
                      setAgeError("Labor regulation alert: Age must be 18 and above.");
                    } else {
                      setAgeError("");
                    }
                  }}
                  className={`w-full p-2.5 rounded-lg border outline-none
                    ${ageError ? "border-rose-500 bg-rose-500/5 text-rose-500" : isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300"}`}
                />
                {ageError && <p className="text-[10px] text-rose-500 font-bold">{ageError}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold opacity-75">State of Origin</label>
                <input
                  type="text"
                  value={stateOfOrigin}
                  onChange={(e) => setStateOfOrigin(e.target.value)}
                  placeholder="e.g. Lagos State"
                  className={`w-full p-2.5 rounded-lg border outline-none
                    ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300"}`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold opacity-75">Desired Monthly Salary ($)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-2.5 top-3 opacity-50" />
                  <input
                    type="number"
                    value={expectedIncome}
                    onChange={(e) => setExpectedIncome(parseInt(e.target.value) || 0)}
                    className={`w-full pl-8 pr-3 py-2.5 rounded-lg border outline-none
                      ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300"}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold opacity-75">Work Location Preference</label>
                <select
                  value={workPreference}
                  onChange={(e) => setWorkPreference(e.target.value as any)}
                  className={`w-full p-2.5 rounded-lg border outline-none
                    ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300"}`}
                >
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold opacity-75">Availability Status</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as any)}
                  className={`w-full p-2.5 rounded-lg border outline-none
                    ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300"}`}
                >
                  <option value="Immediate">Immediate</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>
            </div>

            {/* Skills dynamic chip injector */}
            <div className="space-y-2 text-xs pt-3 border-t border-slate-700/15">
              <label className="font-semibold opacity-75 block">Capabilities & Technologies</label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Next.js, Redux, Docker"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                  className={`flex-1 p-2 rounded-lg border outline-none
                    ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300"}`}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 font-bold"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {skills.map(s => {
                  const matchingEndors = (profile.skillEndorsements || []).find(
                    e => e && e.name && s && e.name.toLowerCase() === s.toLowerCase()
                  );
                  const isVerified = matchingEndors?.isValidated;
                  const count = matchingEndors?.endorsements?.length || 0;

                  return (
                    <span 
                      key={s} 
                      className={`text-[10px] font-bold pl-2.5 pr-1 py-1 rounded-md border flex items-center gap-1.5
                        ${isDarkMode ? "bg-slate-850 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                    >
                      {isVerified && <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />}
                      {s}
                      {count > 0 && (
                        <span className="text-[9px] font-mono font-bold text-blue-500 bg-blue-600/10 px-1 rounded">
                          +{count}
                        </span>
                      )}
                      <button 
                        type="button" 
                        onClick={() => handleDeleteSkill(s)}
                        className="text-slate-400 hover:text-rose-500 font-bold ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
              </div>
              <p className="text-[10px] opacity-60 mt-2">
                💡 Want to run automated Nexa AI exams or request community reviews? Navigate to the <strong>Academy & Rewards</strong> tab.
              </p>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-700/10 flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Profile Details
              </button>
            </div>
          </div>

          {/* Right Column: Experience & Education Timeline Builder (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Experience Builder Block */}
            <div className={`p-5 rounded-2xl border space-y-4 text-xs
              ${isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}
            >
              <h3 className="font-extrabold text-base border-b border-slate-700/15 pb-2">Add Work Experience</h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold opacity-75">Company</label>
                    <input
                      type="text"
                      placeholder="Google Inc."
                      value={expCompany}
                      onChange={(e) => setExpCompany(e.target.value)}
                      className={`w-full p-2 rounded-lg border outline-none
                        ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300"}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold opacity-75">Role</label>
                    <input
                      type="text"
                      placeholder="Frontend Lead"
                      value={expRole}
                      onChange={(e) => setExpRole(e.target.value)}
                      className={`w-full p-2 rounded-lg border outline-none
                        ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300"}`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold opacity-75">Duration</label>
                  <input
                    type="text"
                    placeholder="Jun 2024 - Present"
                    value={expDuration}
                    onChange={(e) => setExpDuration(e.target.value)}
                    className={`w-full p-2 rounded-lg border outline-none
                      ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300"}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold opacity-75">Role description / Achievements</label>
                  <textarea
                    rows={2}
                    placeholder="Built responsive visual layouts, resolved performance bugs..."
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    className={`w-full p-2 rounded-lg border outline-none resize-none
                      ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddExperience}
                  disabled={!expCompany || !expRole}
                  className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1
                    ${(!expCompany || !expRole) 
                      ? "bg-slate-500/20 text-slate-400 cursor-not-allowed" 
                      : "bg-blue-600 text-white hover:bg-blue-700"}`}
                >
                  <Plus className="w-3.5 h-3.5" /> Insert Work Experience
                </button>
              </div>

              {/* List added experiences */}
              <div className="space-y-2 pt-2 border-t border-slate-700/10 max-h-[140px] overflow-y-auto">
                {experiences.map(exp => (
                  <div key={exp.id} className="p-2 bg-slate-500/5 rounded-lg border border-slate-700/10 flex justify-between items-start">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-bold truncate">{exp.role}</p>
                      <p className="opacity-60 text-[10px] truncate">{exp.company} • {exp.duration}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 shrink-0"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Builder Block */}
            <div className={`p-5 rounded-2xl border space-y-4 text-xs
              ${isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}
            >
              <h3 className="font-extrabold text-base border-b border-slate-700/15 pb-2">Add Education</h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold opacity-75">School / Academy</label>
                    <input
                      type="text"
                      placeholder="Tech University"
                      value={eduSchool}
                      onChange={(e) => setEduSchool(e.target.value)}
                      className={`w-full p-2 rounded-lg border outline-none
                        ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300"}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold opacity-75">Degree</label>
                    <input
                      type="text"
                      placeholder="B.Sc. Computer Science"
                      value={eduDegree}
                      onChange={(e) => setEduDegree(e.target.value)}
                      className={`w-full p-2 rounded-lg border outline-none
                        ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300"}`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold opacity-75">Graduation Year</label>
                  <input
                    type="text"
                    placeholder="2026"
                    value={eduYear}
                    onChange={(e) => setEduYear(e.target.value)}
                    className={`w-full p-2 rounded-lg border outline-none
                      ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300"}`}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddEducation}
                  disabled={!eduSchool || !eduDegree}
                  className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1
                    ${(!eduSchool || !eduDegree) 
                      ? "bg-slate-500/20 text-slate-400 cursor-not-allowed" 
                      : "bg-blue-600 text-white hover:bg-blue-700"}`}
                >
                  <Plus className="w-3.5 h-3.5" /> Insert Education Record
                </button>
              </div>

              {/* List added education */}
              <div className="space-y-2 pt-2 border-t border-slate-700/10 max-h-[120px] overflow-y-auto">
                {education.map(edu => (
                  <div key={edu.id} className="p-2 bg-slate-500/5 rounded-lg border border-slate-700/10 flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{edu.degree}</p>
                      <p className="opacity-60 text-[10px] truncate">{edu.school} • {edu.year}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 shrink-0"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
