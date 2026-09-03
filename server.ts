import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { 
  UserProfile, 
  NetworkLocation, 
  JobOpportunity, 
  FreelanceGig, 
  JobApplication, 
  Conversation, 
  Message, 
  Notification, 
  Contract, 
  EarningRecord, 
  UserReport 
} from "./src/types";

interface DatabaseSchema {
  profile: UserProfile;
  networks: NetworkLocation[];
  jobs: JobOpportunity[];
  gigs: FreelanceGig[];
  applications: JobApplication[];
  conversations: Conversation[];
  messages: Message[];
  notifications: Notification[];
  contracts: Contract[];
  earnings: EarningRecord[];
  reports: UserReport[];
}

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini SDK lazily to protect against key exceptions
const apiKey = process.env.GEMINI_API_KEY;
let ai: any = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } catch (err) {
    console.warn("Failed to initialize GoogleGenAI with key, fallback enabled:", err);
  }
}

// --- MOCK DATABASE STATE ---
const seedNetworks: NetworkLocation[] = [
  {
    id: "net-1",
    name: "NY Public Plaza High-Speed",
    location: "Bryant Park, New York",
    distance: 0.2,
    latitude: 40.7536,
    longitude: -73.9832,
    availability: "Available",
    connectionType: "Wi-Fi",
    estimatedSpeed: 150,
    provider: "LinkNYC",
    openingHours: "24/7",
    rating: 4.6,
    securityClassification: "Encrypted Public",
    connectionInstructions: "Connect to 'LinkNYC Free Wi-Fi' and click Accept in the captive portal.",
    cost: "Free",
    locationType: "Community Center"
  },
  {
    id: "net-2",
    name: "Telegraph Creative Hub",
    location: "Oakland, California",
    distance: 1.1,
    latitude: 37.8044,
    longitude: -122.2712,
    availability: "Available",
    connectionType: "Symmetric Ethernet",
    estimatedSpeed: 500,
    provider: "Telegraph Coworking Inc",
    openingHours: "08:00 - 22:00",
    rating: 4.9,
    securityClassification: "Secure (WPA3)",
    connectionInstructions: "Select 'Telegraph_Guest' and request temporary day-pass code from receptionist.",
    cost: "Subscription",
    locationType: "Coworking"
  },
  {
    id: "net-3",
    name: "Lagos Community Mesh Node 4",
    location: "Yaba, Lagos",
    distance: 0.8,
    latitude: 6.5244,
    longitude: 3.3792,
    availability: "Busy",
    connectionType: "Community Mesh",
    estimatedSpeed: 45,
    provider: "Yaba Tech Collective",
    openingHours: "06:00 - 23:00",
    rating: 4.2,
    securityClassification: "Medium Risk (WPA2)",
    connectionInstructions: "Select 'Yaba_Mesh_Free' and authenticate via phone OTP.",
    cost: "Free",
    locationType: "Community Center"
  },
  {
    id: "net-4",
    name: "Central Library Gigabit Fiber",
    location: "City Center Library",
    distance: 1.5,
    latitude: 37.7749,
    longitude: -122.4194,
    availability: "Available",
    connectionType: "Fiber",
    estimatedSpeed: 800,
    provider: "Municipal Broadband Service",
    openingHours: "09:00 - 18:00",
    rating: 4.8,
    securityClassification: "Secure (WPA3)",
    connectionInstructions: "Login using your Library Membership Card barcode.",
    cost: "Free",
    locationType: "Library"
  },
  {
    id: "net-5",
    name: "The Daily Brew Workspace",
    location: "Soma District",
    distance: 0.5,
    latitude: 37.7790,
    longitude: -122.4110,
    availability: "Offline",
    connectionType: "Wi-Fi",
    estimatedSpeed: 85,
    provider: "Daily Brew Coffee",
    openingHours: "07:00 - 19:00",
    rating: 3.9,
    securityClassification: "Medium Risk (WPA2)",
    connectionInstructions: "Password printed on purchase receipt.",
    cost: "Customer-Only",
    locationType: "Cafe"
  },
  {
    id: "net-6",
    name: "London Southbank Public Net",
    location: "Waterloo Area, London",
    distance: 2.3,
    latitude: 51.5072,
    longitude: -0.1276,
    availability: "Available",
    connectionType: "5G Hotspot",
    estimatedSpeed: 120,
    provider: "Southbank Arts Council",
    openingHours: "24/7",
    rating: 4.4,
    securityClassification: "Open (Captive Portal)",
    connectionInstructions: "Connect to 'Southbank_Public_WiFi' and agree to terms.",
    cost: "Free",
    locationType: "Public Park"
  }
];

const seedJobs: JobOpportunity[] = [
  {
    id: "job-1",
    title: "Senior React & TypeScript Developer",
    company: "SyncLink Technologies",
    location: "Remote (USA/Europe)",
    type: "Remote",
    salaryRange: "$4,500 - $6,500/month",
    salaryMin: 4500,
    skillsRequired: ["React", "TypeScript", "Tailwind CSS", "Vite", "Node.js"],
    experienceLevel: "Senior",
    postedDate: "2026-09-01",
    deadline: "2026-09-30",
    isVerifiedEmployer: true
  },
  {
    id: "job-2",
    title: "Junior UI/UX Web Designer",
    company: "PixelCraft Agency",
    location: "Hybrid (New York, NY)",
    type: "Part-time",
    salaryRange: "$2,000 - $3,200/month",
    salaryMin: 2000,
    skillsRequired: ["Figma", "UI/UX", "Tailwind CSS", "Design Systems"],
    experienceLevel: "Entry-level",
    postedDate: "2026-09-02",
    deadline: "2026-09-25",
    isVerifiedEmployer: true
  },
  {
    id: "job-3",
    title: "Technical Content Writer & Translator",
    company: "GlobalEd Foundation",
    location: "Remote (Worldwide)",
    type: "Freelance",
    salaryRange: "$1,200 - $1,800/month",
    salaryMin: 1200,
    skillsRequired: ["Technical Writing", "Translation", "Markdown", "SEO"],
    experienceLevel: "Mid-level",
    postedDate: "2026-09-01",
    deadline: "2026-09-28",
    isVerifiedEmployer: true
  },
  {
    id: "job-4",
    title: "Community Network Setup Assistant",
    company: "Lagos Connectivity Project",
    location: "On-site (Yaba, Lagos)",
    type: "Gig",
    salaryRange: "$300 - $500/gig",
    salaryMin: 300,
    skillsRequired: ["Networking", "Wi-Fi Config", "Hardware setup", "Troubleshooting"],
    experienceLevel: "Entry-level",
    postedDate: "2026-09-02",
    deadline: "2026-09-15",
    isVerifiedEmployer: false,
    isSuspicious: false
  },
  {
    id: "job-5",
    title: "Urgent Crypto Arbitrage Admin (HIGH PAY)",
    company: "Decentralized Wealth Solutions",
    location: "Remote (Global)",
    type: "Gig",
    salaryRange: "$5,000 - $10,000/week",
    salaryMin: 20000,
    skillsRequired: ["Crypto", "Telegram", "No Experience Required"],
    experienceLevel: "Entry-level",
    postedDate: "2026-09-02",
    deadline: "2026-09-10",
    isVerifiedEmployer: false,
    isSuspicious: true // flagged by our smart scam detector (no experience, high weekly pay!)
  },
  {
    id: "job-6",
    title: "Logistics Coordinator & Router",
    company: "NexLink Delivery Hub",
    location: "On-site (San Francisco, CA)",
    type: "Full-time",
    salaryRange: "$3,500 - $4,800/month",
    salaryMin: 3500,
    skillsRequired: ["Logistics", "Operations", "Google Maps", "Customer Service"],
    experienceLevel: "Mid-level",
    postedDate: "2026-09-01",
    deadline: "2026-09-29",
    isVerifiedEmployer: true
  }
];

const seedFreelanceGigs = [
  {
    id: "gig-1",
    title: "E-Commerce Landing Page Build",
    clientName: "EcoBrands Inc.",
    clientRating: 4.8,
    budget: 850,
    description: "Looking for a React developer to build a modern, responsive landing page using Tailwind CSS. Must include animations with motion.",
    skillsRequired: ["React", "Tailwind CSS", "Motion"],
    duration: "1 week",
    proposalsCount: 8,
    postedDate: "2026-09-02"
  },
  {
    id: "gig-2",
    title: "Company Presentation Deck Revamp",
    clientName: "Zenith Capital",
    clientRating: 4.5,
    budget: 400,
    description: "Re-design a 15-slide PowerPoint deck to match our new sleek dark luxury branding guidelines.",
    skillsRequired: ["Figma", "Design", "Copywriting"],
    duration: "3 days",
    proposalsCount: 3,
    postedDate: "2026-09-01"
  },
  {
    id: "gig-3",
    title: "SEO Blog Post Series",
    clientName: "DevHQ Media",
    clientRating: 4.9,
    budget: 600,
    description: "Write 5 articles on Web Performance and Core Web Vitals optimized for modern search engines.",
    skillsRequired: ["Technical Writing", "SEO", "Vite"],
    duration: "2 weeks",
    proposalsCount: 12,
    postedDate: "2026-08-31"
  }
];

// Seed state in memory for mutations
let database: DatabaseSchema = {
  profile: {
    id: "usr-1",
    name: "Jesse Orie",
    email: "jesseorie01@gmail.com",
    headline: "Junior Full-Stack React & Node Developer",
    phone: "08031234567",
    gender: "Male",
    age: 23,
    stateOfOrigin: "Lagos State",
    skills: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "Node.js", "Figma"],
    experience: [
      {
        id: "exp-1",
        company: "WebCraft Solutions",
        role: "Frontend Engineering Intern",
        duration: "Jan 2026 - Present",
        description: "Built responsive dashboards using React and styled layout containers with Tailwind CSS utility classes."
      }
    ],
    education: [
      {
        id: "edu-1",
        school: "State Technology Academy",
        degree: "B.Sc. in Computer Science",
        year: "2022 - 2026"
      }
    ],
    certifications: ["Meta Front-End Developer Professional Certificate", "Vite Mastery Certificate"],
    portfolioUrls: ["https://jesseorie.dev", "https://github.com/jesseorie"],
    languages: ["English", "Spanish"],
    workPreference: "Remote" as const,
    expectedIncome: 3500,
    availability: "Immediate" as const,
    isPremium: false,
    gamificationPoints: 350,
    badges: [
      {
        id: "badge-1",
        title: "Profile Architect",
        description: "Fully completed professional career dossier on NexLink",
        iconName: "UserCheck",
        dateEarned: "2026-09-02"
      },
      {
        id: "badge-2",
        title: "Signal Seeker",
        description: "Executed localized broadband diagnostics to secure connection strength",
        iconName: "Wifi",
        dateEarned: "2026-09-03"
      }
    ],
    skillEndorsements: [
      {
        name: "React",
        endorsements: [
          { endorserName: "Alex Rivera (EcoBrands)", isSystem: false, date: "2026-09-02" }
        ],
        isValidated: true
      },
      {
        name: "TypeScript",
        endorsements: [],
        isValidated: true
      },
      {
        name: "Tailwind CSS",
        endorsements: [
          { endorserName: "Nexa AI Diagnostic Assessment", isSystem: true, date: "2026-09-03" }
        ],
        isValidated: true
      },
      {
        name: "Node.js",
        endorsements: [],
        isValidated: false
      }
    ],
    learningProgress: [
      {
        courseId: "course-react-advanced",
        progress: 40,
        isCompleted: false,
        startDate: "2026-09-02",
        lastActive: "2026-09-03"
      }
    ],
    careerGoal: "Frontend Developer"
  },
  networks: [...seedNetworks],
  jobs: [...seedJobs],
  gigs: [...seedFreelanceGigs],
  applications: [
    {
      id: "app-1",
      jobId: "job-1",
      jobTitle: "Senior React & TypeScript Developer",
      company: "SyncLink Technologies",
      appliedDate: "2026-09-02",
      status: "Applied" as const,
      notes: "Submitted tailored resume and portfolio. Looking forward to review!",
      candidateName: "Jesse Orie",
      candidateEmail: "jesseorie01@gmail.com",
      candidatePhone: "08031234567",
      candidateGender: "Male",
      candidateAge: 23,
      candidateState: "Lagos State",
      candidateSkills: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "Node.js"],
      candidateProfession: "Junior Full-Stack React & Node Developer",
      candidateExperience: "Frontend Engineering Intern at WebCraft Solutions (Jan 2026 - Present)"
    },
    {
      id: "app-2",
      jobId: "job-3",
      jobTitle: "Technical Content Writer & Translator",
      company: "GlobalEd Foundation",
      appliedDate: "2026-08-30",
      status: "Screening" as const,
      notes: "Recruiter screened profile, expecting interview date soon.",
      candidateName: "Jesse Orie",
      candidateEmail: "jesseorie01@gmail.com",
      candidatePhone: "08031234567",
      candidateGender: "Male",
      candidateAge: 23,
      candidateState: "Lagos State",
      candidateSkills: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "Node.js"],
      candidateProfession: "Junior Full-Stack React & Node Developer",
      candidateExperience: "Frontend Engineering Intern at WebCraft Solutions (Jan 2026 - Present)"
    }
  ],
  conversations: [
    {
      id: "conv-1",
      participantName: "Sarah Jenkins (Recruiter @ SyncLink)",
      participantRole: "Employer",
      lastMessage: "Hi Jesse, we received your application. Could you share some projects built with TypeScript?",
      lastTimestamp: "10:42 AM",
      unreadCount: 1
    },
    {
      id: "conv-2",
      participantName: "Alex Rivera (Client @ EcoBrands)",
      participantRole: "Freelance Client",
      lastMessage: "Your proposal looks impressive! Let's schedule a call.",
      lastTimestamp: "Yesterday",
      unreadCount: 0
    }
  ],
  messages: [
    {
      id: "msg-1",
      conversationId: "conv-1",
      senderId: "employer-sarah",
      senderName: "Sarah Jenkins",
      text: "Hi Jesse, we received your application. Could you share some projects built with TypeScript?",
      timestamp: "10:42 AM",
      jobId: "job-1"
    },
    {
      id: "msg-2",
      conversationId: "conv-2",
      senderId: "usr-1",
      senderName: "Jesse Orie",
      text: "Hello Alex, I'd love to help you build the landing page! Here is my portfolio link.",
      timestamp: "Yesterday"
    },
    {
      id: "msg-3",
      conversationId: "conv-2",
      senderId: "client-alex",
      senderName: "Alex Rivera",
      text: "Your proposal looks impressive! Let's schedule a call.",
      timestamp: "Yesterday"
    }
  ],
  notifications: [
    {
      id: "notif-1",
      type: "application" as const,
      title: "Application Status Updated",
      description: "Your application for Technical Content Writer has been moved to Screening.",
      timestamp: "2 hours ago",
      isRead: false
    },
    {
      id: "notif-2",
      type: "network" as const,
      title: "High-Speed Internet Hotspot Nearby",
      description: "NY Public Plaza High-Speed (150 Mbps) discovered 0.2km away from your position.",
      timestamp: "5 hours ago",
      isRead: false
    },
    {
      id: "notif-3",
      type: "security" as const,
      title: "Suspicious Job Warning",
      description: "A crypto arbitrage posting was flagged as unsafe. Never send money to employers.",
      timestamp: "1 day ago",
      isRead: true
    }
  ],
  contracts: [
    {
      id: "con-1",
      gigId: "gig-1",
      title: "E-Commerce Landing Page Build",
      clientName: "EcoBrands Inc.",
      amount: 850,
      status: "Active" as const,
      progress: 60,
      startDate: "2026-09-02"
    }
  ],
  earnings: [
    {
      id: "earn-1",
      source: "Logo Concept Delivery",
      amount: 150,
      date: "2026-08-28",
      status: "Cleared" as const,
      type: "Gig" as const
    },
    {
      id: "earn-2",
      source: "SEO Article Writing",
      amount: 300,
      date: "2026-08-25",
      status: "Cleared" as const,
      type: "Gig" as const
    },
    {
      id: "earn-3",
      source: "Landing Page Milestone 1",
      amount: 400,
      date: "2026-09-02",
      status: "Pending" as const,
      type: "Contract" as const
    }
  ],
  reports: [
    {
      id: "rep-1",
      reportedId: "job-5",
      reportedType: "Job" as const,
      reportedName: "Urgent Crypto Arbitrage Admin (HIGH PAY)",
      reporterName: "System Flag",
      reason: "Suspiciously High Pay / SCAM indicator",
      details: "Demands no experience but offers $5,000-$10,000/week. Classic phishing/arbitrage scam model.",
      date: "2026-09-03",
      status: "Pending" as const
    }
  ]
};

// --- API ENDPOINTS ---

// Malware and injection script pattern checks
const EXECUTABLE_PATTERN = /\.(exe|bat|sh|cmd|com|vbs|scr|msi)$/i;

function hasMaliciousContent(val: any): { detected: boolean; reason: string } | null {
  if (typeof val === "string") {
    if (/<script/i.test(val) || /<\/script>/i.test(val)) {
      return { detected: true, reason: "Malicious <script> block injection detected." };
    }
    if (/javascript:/i.test(val)) {
      return { detected: true, reason: "javascript: protocol URI injection detected." };
    }
    if (/\bon[a-zA-Z]+\s*=/i.test(val)) {
      return { detected: true, reason: "Inline DOM event-listener script injection detected." };
    }
    if (/\b(eval|system|exec|base64_decode)\s*\(/i.test(val)) {
      return { detected: true, reason: "Server-side dynamic code execution payload matched." };
    }
    if (/\bcmd\.exe\b/i.test(val) || /\/bin\/sh\b/i.test(val) || /\/bin\/bash\b/i.test(val)) {
      return { detected: true, reason: "Shell command terminal payload injection detected." };
    }
    if (EXECUTABLE_PATTERN.test(val) && !val.startsWith("https://") && !val.startsWith("http://")) {
      return { detected: true, reason: "Unauthorized executable file extension payload detected." };
    }
  } else if (typeof val === "object" && val !== null) {
    for (const key in val) {
      if (Object.prototype.hasOwnProperty.call(val, key)) {
        const result = hasMaliciousContent(val[key]);
        if (result) return result;
      }
    }
  }
  return null;
}

// Global sanitization security layer middleware
app.use("/api", (req, res, next) => {
  const threat = hasMaliciousContent(req.body) || hasMaliciousContent(req.query) || hasMaliciousContent(req.params);
  if (threat) {
    console.warn(`[SECURITY SYSTEM ALERT] Intercepted payload threat: ${threat.reason}`);
    
    // Push security alert telemetry log into database reports queue so Admin sees it
    if (database && database.reports) {
      database.reports.unshift({
        id: `rep-${database.reports.length + 1}`,
        reportedId: "system-threat-block",
        reportedType: "Job" as const, // Match DB types
        reportedName: "NexLink Firewall Threat Intercept",
        reporterName: "Automated IPS Firewall",
        reason: `Threat Blocked: ${threat.reason}`,
        details: `Blocked injection attempt at ${req.method} ${req.path}. Payload blocked cleanly.`,
        date: new Date().toISOString().split("T")[0],
        status: "Pending" as const
      });
    }

    return res.status(400).json({ 
      error: "Security Alert", 
      message: "Security Alert: Malicious payload or script injection intercepted and blocked by NexLink Shield.", 
      reason: threat.reason 
    });
  }
  next();
});

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. Profile API
app.get("/api/profile", (req, res) => {
  res.json(database.profile);
});

app.post("/api/profile", (req, res) => {
  database.profile = { ...database.profile, ...req.body };
  res.json(database.profile);
});

// 3. Network Discovery API
app.get("/api/networks", (req, res) => {
  const { query, speed, cost, distance, type } = req.query;
  let filtered = [...database.networks];

  if (query) {
    const q = String(query).toLowerCase();
    filtered = filtered.filter(n =>
      n.name.toLowerCase().includes(q) ||
      n.location.toLowerCase().includes(q) ||
      n.provider.toLowerCase().includes(q) ||
      n.connectionType.toLowerCase().includes(q)
    );
  }

  if (speed) {
    const minSpeed = parseInt(String(speed));
    filtered = filtered.filter(n => n.estimatedSpeed >= minSpeed);
  }

  if (cost) {
    filtered = filtered.filter(n => n.cost.toLowerCase() === String(cost).toLowerCase());
  }

  if (distance) {
    const maxDist = parseFloat(String(distance));
    filtered = filtered.filter(n => n.distance <= maxDist);
  }

  if (type) {
    filtered = filtered.filter(n => n.locationType.toLowerCase() === String(type).toLowerCase());
  }

  res.json(filtered);
});

// 4. Job Opportunity Engine API
app.get("/api/jobs", (req, res) => {
  const { search, type, exp, minSalary } = req.query;
  let filtered = [...database.jobs];

  if (search) {
    const s = String(search).toLowerCase();
    filtered = filtered.filter(j =>
      j.title.toLowerCase().includes(s) ||
      j.company.toLowerCase().includes(s) ||
      j.skillsRequired.some(sk => sk.toLowerCase().includes(s))
    );
  }

  if (type && type !== "All") {
    filtered = filtered.filter(j => j.type.toLowerCase() === String(type).toLowerCase());
  }

  if (exp && exp !== "All") {
    filtered = filtered.filter(j => j.experienceLevel.toLowerCase() === String(exp).toLowerCase());
  }

  if (minSalary) {
    const min = parseInt(String(minSalary));
    filtered = filtered.filter(j => j.salaryMin >= min);
  }

  // Calculate Match Score based on user profile skills
  const userSkills = database.profile.skills.map(s => s.toLowerCase());
  const enriched = filtered.map(job => {
    const matched = job.skillsRequired.filter(s => userSkills.includes(s.toLowerCase()));
    const score = job.skillsRequired.length > 0 
      ? Math.round((matched.length / job.skillsRequired.length) * 100)
      : 50;
    
    // Add custom explanation
    let explanation = `Your profile shows matching capabilities in ${matched.join(", ") || "development parameters"}.`;
    if (score > 80) {
      explanation = `Excellent! Your skills in ${matched.join(", ")} strongly match the primary tech requirements.`;
    } else if (score < 50) {
      explanation = `Consider taking learning assets for ${job.skillsRequired.filter(s => !matched.includes(s.toLowerCase())).join(", ")} to boost alignment.`;
    }

    return {
      ...job,
      matchScore: score,
      matchExplanation: explanation
    };
  });

  // Sort by match score descending by default
  enriched.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  res.json(enriched);
});

// Post job (Employer portal)
app.post("/api/jobs", (req, res) => {
  const { title, company, location, type, salaryRange, skillsRequired, experienceLevel, deadline } = req.body;
  if (!title || !company) {
    return res.status(400).json({ error: "Title and Company are required fields." });
  }

  const newJob = {
    id: `job-${database.jobs.length + 1}`,
    title,
    company,
    location: location || "Remote",
    type: type || "Full-time",
    salaryRange: salaryRange || "$3,000 - $4,500/month",
    salaryMin: parseInt(salaryRange?.replace(/[^0-9]/g, "")) || 3000,
    skillsRequired: skillsRequired || [],
    experienceLevel: experienceLevel || "Mid-level",
    postedDate: new Date().toISOString().split("T")[0],
    deadline: deadline || "2026-10-15",
    isVerifiedEmployer: true
  };

  database.jobs.push(newJob);

  // Send a security / new matching job notification
  database.notifications.unshift({
    id: `notif-${database.notifications.length + 1}`,
    type: "job",
    title: "New Job Posted",
    description: `${company} just posted a role matching your interests: ${title}`,
    timestamp: "Just now",
    isRead: false
  });

  res.json(newJob);
});

// Report Scam Job API
app.post("/api/jobs/:id/report", (req, res) => {
  const { id } = req.params;
  const { reason, details } = req.body;
  const targetJob = database.jobs.find(j => j.id === id);

  if (!targetJob) {
    return res.status(404).json({ error: "Job opportunity not found." });
  }

  const newReport = {
    id: `rep-${database.reports.length + 1}`,
    reportedId: id,
    reportedType: "Job" as const,
    reportedName: targetJob.title,
    reporterName: database.profile.name,
    reason: reason || "Suspicious or Scam listing",
    details: details || "No details provided.",
    date: new Date().toISOString().split("T")[0],
    status: "Pending" as const
  };

  database.reports.unshift(newReport);

  // If reports reach higher threshold or system marks it, flag it as suspicious
  targetJob.isSuspicious = true;

  res.json({ message: "Job reported successfully. Our trust and safety team will review.", report: newReport });
});

// 5. Application Tracking API
app.get("/api/applications", (req, res) => {
  res.json(database.applications);
});

app.post("/api/applications", (req, res) => {
  const { jobId, status, notes, interviewDate, followUpDate } = req.body;
  const targetJob = database.jobs.find(j => j.id === jobId);

  if (!targetJob) {
    return res.status(404).json({ error: "Job not found" });
  }

  const userAge = database.profile.age || 23;
  const isUnderageApplicant = userAge < 18;

  const existingIdx = database.applications.findIndex(a => a.jobId === jobId);

  if (existingIdx > -1) {
    // Update existing
    database.applications[existingIdx] = {
      ...database.applications[existingIdx],
      status: isUnderageApplicant ? "Rejected" : (status || database.applications[existingIdx].status),
      notes: isUnderageApplicant 
        ? "Automatically flagged and filtered: Underage candidate." 
        : (notes !== undefined ? notes : database.applications[existingIdx].notes),
      interviewDate: interviewDate !== undefined ? interviewDate : database.applications[existingIdx].interviewDate,
      followUpDate: followUpDate !== undefined ? followUpDate : database.applications[existingIdx].followUpDate,
      isUnderage: isUnderageApplicant
    };
    res.json(database.applications[existingIdx]);
  } else {
    // Create new tracking
    const expText = database.profile.experience.map(e => `${e.role} at ${e.company} (${e.duration})`).join("; ") || "No experience listed";
    const newApp = {
      id: `app-${database.applications.length + 1}`,
      jobId,
      jobTitle: targetJob.title,
      company: targetJob.company,
      appliedDate: new Date().toISOString().split("T")[0],
      status: isUnderageApplicant ? "Rejected" as const : (status || "Saved"),
      notes: isUnderageApplicant 
        ? "Automatically flagged and filtered: Underage candidate." 
        : (notes || ""),
      interviewDate,
      followUpDate,
      candidateName: database.profile.name,
      candidateEmail: database.profile.email,
      candidatePhone: database.profile.phone || "08031234567",
      candidateGender: database.profile.gender || "Male",
      candidateAge: userAge,
      candidateState: database.profile.stateOfOrigin || "Lagos State",
      candidateSkills: database.profile.skills,
      candidateProfession: database.profile.headline,
      candidateExperience: expText,
      isUnderage: isUnderageApplicant
    };
    database.applications.push(newApp);

    // Notify user
    database.notifications.unshift({
      id: `notif-${database.notifications.length + 1}`,
      type: "application",
      title: isUnderageApplicant ? "Application Flagged ⚠️" : "Application Tracked",
      description: isUnderageApplicant 
        ? `Compliance Warning: Underage Application for ${targetJob.title} flagged and filtered.`
        : `Added ${targetJob.title} at ${targetJob.company} to your Tracker (${status || "Saved"}).`,
      timestamp: "Just now",
      isRead: false
    });

    res.json(newApp);
  }
});

// 6. Freelance Marketplace API
app.get("/api/gigs", (req, res) => {
  res.json(database.gigs);
});

app.post("/api/gigs/propose", (req, res) => {
  const { gigId, bidAmount, proposalText } = req.body;
  const targetGig = database.gigs.find(g => g.id === gigId);

  if (!targetGig) {
    return res.status(404).json({ error: "Freelance gig not found." });
  }

  targetGig.proposalsCount += 1;

  // Add a contract
  const newContract = {
    id: `con-${database.contracts.length + 1}`,
    gigId,
    title: targetGig.title,
    clientName: targetGig.clientName,
    amount: bidAmount || targetGig.budget,
    status: "Pending Approval" as const,
    progress: 0,
    startDate: new Date().toISOString().split("T")[0]
  };

  database.contracts.push(newContract);

  // Setup message thread automatically
  const newConv = {
    id: `conv-${database.conversations.length + 3}`,
    participantName: `${targetGig.clientName} (Client)`,
    participantRole: "Freelance Client",
    lastMessage: `Submitted proposal: "${proposalText?.slice(0, 40)}..."`,
    lastTimestamp: "Just now",
    unreadCount: 0
  };
  database.conversations.unshift(newConv);

  database.messages.push({
    id: `msg-${database.messages.length + 1}`,
    conversationId: newConv.id,
    senderId: "usr-1",
    senderName: database.profile.name,
    text: `PROPOSAL (${targetGig.title}):\nBid: $${bidAmount || targetGig.budget}\n\n${proposalText}`,
    timestamp: "Just now"
  });

  res.json({ message: "Proposal submitted successfully! Opened thread with client.", contract: newContract });
});

// 7. Income & Earnings Center
app.get("/api/earnings", (req, res) => {
  const activeContracts = database.contracts;
  const earningsHistory = database.earnings;
  const totalCleared = earningsHistory.filter(e => e.status === "Cleared").reduce((acc, current) => acc + current.amount, 0);
  const totalPending = earningsHistory.filter(e => e.status === "Pending").reduce((acc, current) => acc + current.amount, 0) + 
                       activeContracts.filter(c => c.status === "Active").reduce((acc, current) => acc + current.amount * (current.progress / 100), 0);

  res.json({
    clearedEarnings: Math.round(totalCleared),
    pendingEarnings: Math.round(totalPending),
    contracts: activeContracts,
    history: earningsHistory
  });
});

// 8. Communication API
app.get("/api/conversations", (req, res) => {
  res.json(database.conversations);
});

app.get("/api/messages/:convId", (req, res) => {
  const filtered = database.messages.filter(m => m.conversationId === req.params.convId);
  
  // Clear unread count when reading
  const conv = database.conversations.find(c => c.id === req.params.convId);
  if (conv) conv.unreadCount = 0;

  res.json(filtered);
});

app.post("/api/messages", (req, res) => {
  const { conversationId, text, jobId } = req.body;
  if (!conversationId || !text) {
    return res.status(400).json({ error: "conversationId and text are required." });
  }

  const newMessage = {
    id: `msg-${database.messages.length + 1}`,
    conversationId,
    senderId: "usr-1",
    senderName: database.profile.name,
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    jobId
  };

  database.messages.push(newMessage);

  // Update conversation last message
  const conv = database.conversations.find(c => c.id === conversationId);
  if (conv) {
    conv.lastMessage = text;
    conv.lastTimestamp = "Just now";
  }

  res.json(newMessage);
});

// 9. Admin Moderation & Analytics
app.get("/api/admin/reports", (req, res) => {
  res.json(database.reports);
});

// Admin applications queue
app.get("/api/admin/applications", (req, res) => {
  res.json(database.applications);
});

// Admin approve application
app.post("/api/admin/applications/:id/approve", (req, res) => {
  const { id } = req.params;
  const appItem = database.applications.find(a => a.id === id);
  if (appItem) {
    if (appItem.isUnderage || (appItem.candidateAge && appItem.candidateAge < 18)) {
      return res.status(400).json({ error: "Validation Error", message: "Cannot approve underage applicants. Minimum required age is 18." });
    }
    appItem.status = "Accepted";
    
    // Add real-time user notification
    database.notifications.unshift({
      id: `notif-${database.notifications.length + 1}`,
      type: "application",
      title: "Application Approved! 🎉",
      description: `Your submission for ${appItem.jobTitle} at ${appItem.company} has been Approved by Admin.`,
      timestamp: "Just now",
      isRead: false
    });

    // Find or create direct message conversation
    let conv = database.conversations.find(c => c.participantName.includes(appItem.company));
    if (!conv) {
      conv = {
        id: `conv-${database.conversations.length + 1}`,
        participantName: `${appItem.company} (HR & Talent Team)`,
        participantRole: "Employer",
        lastMessage: "Your application has been Approved! 🎉",
        lastTimestamp: "Just now",
        unreadCount: 1
      };
      database.conversations.unshift(conv);
    } else {
      conv.lastMessage = "Your application has been Approved! 🎉";
      conv.lastTimestamp = "Just now";
      conv.unreadCount += 1;
    }

    database.messages.push({
      id: `msg-${database.messages.length + 1}`,
      conversationId: conv.id,
      senderId: "employer-system",
      senderName: `${appItem.company} Recruiting`,
      text: `Congratulations Jesse! We are pleased to inform you that your application for "${appItem.jobTitle}" has been APPROVED. We are setting up your digital workspace onboarding protocols. We will follow up with scheduling the contract signing and orientation soon. Welcome aboard!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      jobId: appItem.jobId
    });
    
    return res.json({ success: true, application: appItem });
  }
  res.status(404).json({ error: "Application not found" });
});

// Admin reject application
app.post("/api/admin/applications/:id/reject", (req, res) => {
  const { id } = req.params;
  const appItem = database.applications.find(a => a.id === id);
  if (appItem) {
    appItem.status = "Rejected";
    
    // Add real-time user notification
    database.notifications.unshift({
      id: `notif-${database.notifications.length + 1}`,
      type: "application",
      title: "Application Rejected",
      description: `Your application for ${appItem.jobTitle} at ${appItem.company} was declined by Admin.`,
      timestamp: "Just now",
      isRead: false
    });

    // Find or create direct message conversation
    let conv = database.conversations.find(c => c.participantName.includes(appItem.company));
    if (!conv) {
      conv = {
        id: `conv-${database.conversations.length + 1}`,
        participantName: `${appItem.company} (HR & Talent Team)`,
        participantRole: "Employer",
        lastMessage: "Application status updated.",
        lastTimestamp: "Just now",
        unreadCount: 1
      };
      database.conversations.unshift(conv);
    } else {
      conv.lastMessage = "Application status updated.";
      conv.lastTimestamp = "Just now";
      conv.unreadCount += 1;
    }

    database.messages.push({
      id: `msg-${database.messages.length + 1}`,
      conversationId: conv.id,
      senderId: "employer-system",
      senderName: `${appItem.company} Recruiting`,
      text: `Thank you for your interest in the "${appItem.jobTitle}" position. Unfortunately, after careful consideration, we have decided not to move forward with your application at this time. We wish you the best in your career pursuits.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      jobId: appItem.jobId
    });
    
    return res.json({ success: true, application: appItem });
  }
  res.status(404).json({ error: "Application not found" });
});

// Admin dismiss single reported job flag
app.post("/api/admin/jobs/:jobId/dismiss", (req, res) => {
  const { jobId } = req.params;
  const job = database.jobs.find(j => j.id === jobId);
  if (job) {
    job.isSuspicious = false;
    job.isVerifiedEmployer = true;
    database.reports = database.reports.filter(r => r.reportedId !== jobId);
    return res.json({ success: true });
  }
  res.status(404).json({ error: "Job listing not found" });
});

// Admin permanently purge job listing
app.delete("/api/admin/jobs/:jobId/purge", (req, res) => {
  const { jobId } = req.params;
  database.jobs = database.jobs.filter(j => j.id !== jobId);
  database.reports = database.reports.filter(r => r.reportedId !== jobId);
  res.json({ success: true });
});

app.post("/api/admin/reports/:id/resolve", (req, res) => {
  const { id } = req.params;
  const rep = database.reports.find(r => r.id === id);
  if (rep) {
    rep.status = "Resolved";
    // Resolve action (e.g. permanently deleting or warning)
    if (rep.reportedType === "Job") {
      database.jobs = database.jobs.filter(j => j.id !== rep.reportedId);
    }
    return res.json({ message: "Report resolved and item moderated.", report: rep });
  }
  res.status(404).json({ error: "Report not found" });
});

app.get("/api/admin/analytics", (req, res) => {
  const activeUsers = 1240;
  const jobsModerated = database.reports.filter(r => r.status === "Resolved" && r.reportedType === "Job").length;
  const verifiedRate = Math.round((database.jobs.filter(j => j.isVerifiedEmployer).length / database.jobs.length) * 100);
  
  const cpu = Math.floor(Math.random() * 15) + 5; // 5-20%
  const mem = Math.floor(Math.random() * 20) + 35; // 35-55%
  const latency = Math.floor(Math.random() * 40) + 12; // 12-52ms

  res.json({
    activeUsers,
    jobsModerated,
    verifiedRate,
    systemHealth: {
      cpuUsage: cpu,
      memoryUsage: mem,
      apiLatency: latency,
      activeConnections: database.conversations.length * 3
    }
  });
});

// 10. AI Career Assistant (NEXA) Chat Endpoint
app.post("/api/nexa/chat", async (req, res) => {
  const { prompt, chatHistory } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided" });
  }

  // Build high-fidelity dynamic real-time environment telemetry to feed into the Gemini system context
  const activeJobsText = database.jobs.map(j => `* Title: "${j.title}" at "${j.company}", Salary Range: "${j.salaryRange}", Tech Required: [${j.skillsRequired.join(", ")}], Match rating based on User skills: ${database.profile.skills.filter(s => j.skillsRequired.some(js => js.toLowerCase() === s.toLowerCase())).length}/${j.skillsRequired.length}`).join("\n");
  const activeGigsText = database.gigs.map(g => `* Freelance Gig: "${g.title}", Client: "${g.clientName}", Budget: "$${g.budget}", Duration: "${g.duration}"`).join("\n");
  const activeNetworksText = database.networks.map(n => `* Hotspot: "${n.name}" (${n.location}), Distance: ${n.distance}km, Rated Speed: ${n.estimatedSpeed}Mbps, Cost: ${n.cost}, Security: "${n.securityClassification}"`).join("\n");
  const activeContractsText = database.contracts.map(c => `* Project Title: "${c.title}", Client: "${c.clientName}", Payment: $${c.amount}, Current Progress: ${c.progress}%, Status: "${c.status}"`).join("\n");
  const activeBadgesText = (database.profile.badges || []).map(b => `"${b.title}" (${b.description})`).join(", ");

  const profileContext = `
USER CURRENT PROFILE:
Name: ${database.profile.name}
Headline: ${database.profile.headline}
Current Profile Skills: ${database.profile.skills.join(", ")}
Work Preference: ${database.profile.workPreference} (Expected Rate: $${database.profile.expectedIncome}/month)
Availability Status: ${database.profile.availability}
Gamification Balance: ${database.profile.gamificationPoints || 350} XP Points
Earned Achievements: [${activeBadgesText}]

REAL-TIME PLATFORM ASSETS DATABASE:
--- ACTIVE REMOTE JOBS ---
${activeJobsText}

--- ACTIVE FREELANCE GIGS ---
${activeGigsText}

--- COWORKING FREE WIFI HOTSPOTS ---
${activeNetworksText}

--- CONTRACTS & REVENUE HISTORY ---
${activeContractsText}
Total Cleared Earnings: $${database.earnings.filter(e => e.status === "Cleared").reduce((acc, c) => acc + c.amount, 0)}
Total Pending Escrows: $${database.earnings.filter(e => e.status === "Pending").reduce((acc, c) => acc + c.amount, 0)}
`;

  const systemInstruction = `You are "Nexa", the intelligent AI Career & Connectivity Assistant built directly into NEXLINK WORK.
Your voice is exceptionally helpful, warm, professional, and encouraging. You never sound robotic or generic.
Use rich markdown elements (bolding, custom bullet points, numeric checklists, headers, and code snippets) to make answers visually beautiful, highly scannable, and extremely professional.

We combine high-speed Network Access with Remote Job Discovery:
1. You answer any question about active remote jobs, freelance gigs, and connection points on NexLink. Refer to the real-time database lists provided below to give exact answers!
2. You suggest optimizations for their Career Profile, resume formats, and portfolio assets.
3. You provide technical mock interview drills, salary expectations, and security tips (e.g. warning candidates of recruitment scams and deposit fraud).
4. You guide candidates on closing their skill gaps by completing NexLink Academy modules to earn XP and certified badges.

Here is the real-time system context you must use to answer:
${profileContext}
`;

  // Try real Gemini API first
  if (ai) {
    try {
      const contentsList: any[] = [];
      
      // Populate chat history
      if (chatHistory && Array.isArray(chatHistory)) {
        chatHistory.forEach(item => {
          contentsList.push({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: item.content }]
          });
        });
      }
      
      // Push current user input
      contentsList.push({
        role: "user",
        parts: [{ text: prompt }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contentsList,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });

      const text = response.text || "I was unable to formulate a response. Let me help you with some default suggestions instead!";
      return res.json({ text });

    } catch (error) {
      console.error("Gemini API Error, falling back to simulated Nexa:", error);
    }
  }

  // --- NEXA DYNAMIC RESILIENT FALLBACK ENGINE ---
  // A state-of-the-art answering machine that resolves all queries using actual mock database properties
  const p = prompt.toLowerCase();
  let fallbackReply = "";

  if (p.includes("find") || p.includes("job") || p.includes("opportunity") || p.includes("hire") || p.includes("employer")) {
    const matchingJobs = database.jobs.filter(j => 
      j.skillsRequired.some(s => database.profile.skills.some(us => us.toLowerCase().includes(s.toLowerCase())))
    );
    
    fallbackReply = `### Nexa's Real-Time Job Match Matrix 🔍\n\nI've audited our active listings against your professional capabilities. Since your profile features skills in **${database.profile.skills.join(", ")}**, here are the most aligned roles right now:\n\n`;
    
    database.jobs.forEach((job, index) => {
      const matchScore = job.skillsRequired.filter(s => database.profile.skills.some(us => us.toLowerCase() === s.toLowerCase())).length;
      const isHighlyAligned = matchScore > 0;
      
      fallbackReply += `${index + 1}. **${job.title}** at *${job.company}* (${job.location})\n`;
      fallbackReply += `   - **Compensation:** ${job.salaryRange}\n`;
      fallbackReply += `   - **Core Tech Requirements:** ${job.skillsRequired.join(" • ")}\n`;
      fallbackReply += `   - **Employer Status:** ${job.isVerifiedEmployer ? "🛡️ Verified Recruiter" : "Standard Recruiter"}\n`;
      fallbackReply += `   - **Your Compatibility Match:** ${isHighlyAligned ? `🔥 High Match (${matchScore} skills overlapping)` : "💡 Opportunity for career growth"}\n\n`;
    });
    
    fallbackReply += `You can click **Apply Now** directly inside the **Opportunity Hub** tab to start tracking your applications, simulate follow-up templates, and auto-submit your credentials.`;
  } 
  else if (p.includes("resume") || p.includes("cv") || p.includes("profile") || p.includes("portfolio") || p.includes("optimize")) {
    fallbackReply = `### Resume & Dossier Diagnostic Review 📝\n\nHi **${database.profile.name}**, your headline is currently set as "*${database.profile.headline}*". Here is a tailored review based on your profile statistics:\n\n`;
    fallbackReply += `1. **Work Preference Optimization**: Your preference is set to **${database.profile.workPreference}**. Let's ensure your portfolio showcases clean modular structure to support this.\n`;
    fallbackReply += `2. **Skill Assessment Gaps**: You have **${database.profile.skills.length} skills listed** (**${database.profile.skills.join(", ")}**).\n`;
    
    const matchingEndors = database.profile.skillEndorsements || [];
    const verifiedCount = matchingEndors.filter(e => e.isValidated).length;
    
    if (verifiedCount > 0) {
      fallbackReply += `   - Excellent! You have **${verifiedCount} certified skill(s)** validated by Nexa examinations. This gives you a significant boost in recruiter matching algorithms!\n`;
    } else {
      fallbackReply += `   - *Action Item:* You currently have no certified skills. Take a quick automated test in the **Academy & Rewards** tab to unlock the *Nexa Certified* badge and award yourself +100 XP instantly!\n`;
    }
    
    fallbackReply += `3. **Income Bracket Alignment**: Your target rate is **$${database.profile.expectedIncome}/month**. This is highly competitive. Adding advanced TypeScript modules will ensure you command maximum value.\n\n`;
    fallbackReply += `💡 *Tip:* Use the **Build Resume** button on your **Career Profile** to review and download a polished, exportable PDF document instantly!`;
  } 
  else if (p.includes("interview") || p.includes("practice") || p.includes("mock") || p.includes("drill")) {
    fallbackReply = `### Interactive Interview Practice Drill 🎙️\n\nLet's run an interactive mock session. Here is a high-yield question designed for a candidate with your profile:\n\n**"How do you ensure application performance and state consistency when rendering complex modular layouts under React 19 concurrent features?"**\n\n*Suggested Answer Blueprint:* \n- Mention using standard hooks like \`useTransition\` or \`useActionState\` for non-blocking UI states.\n- Explain how you isolate heavy rendering logic and avoid unnecessary context re-renders.\n- Share a quick experience from one of your projects.\n\n*Practice with me:* Type your draft response in our chat, and I will analyze your phrasing, suggest keywords, and grade your answer!`;
  } 
  else if (p.includes("wi-fi") || p.includes("wifi") || p.includes("internet") || p.includes("connect") || p.includes("signal") || p.includes("hotspot") || p.includes("speed")) {
    const availableHotspots = database.networks.filter(n => n.availability === "Available");
    
    fallbackReply = `### Local Connectivity & Hotspot Intelligence 📶\n\nHaving an ultra-fast, stable connection is critical for remote development work. Based on current geo-location parameters, here are the top free wifi and ethernet connection points near you:\n\n`;
    
    availableHotspots.forEach((net, index) => {
      fallbackReply += `${index + 1}. **${net.name}**\n`;
      fallbackReply += `   - **Location:** ${net.location} (~${net.distance}km away)\n`;
      fallbackReply += `   - **Symmetric Bandwidth:** ${net.estimatedSpeed} Mbps (${net.cost})\n`;
      fallbackReply += `   - **Security Tier:** ${net.securityClassification}\n`;
      fallbackReply += `   - **How to Connect:** ${net.connectionInstructions}\n\n`;
    });
    
    fallbackReply += `Navigate to the **Network Locator** tab to execute a live connection test, check latency jitter, or check out detailed co-working schedules.`;
  } 
  else if (p.includes("gig") || p.includes("freelance") || p.includes("propose") || p.includes("marketplace") || p.includes("bid")) {
    fallbackReply = `### Gig Marketplace - Freelance Opportunities 💼\n\nWe have **${database.gigs.length} high-paying gigs** seeking immediate talent. Here is a selection of active assignments:\n\n`;
    
    database.gigs.forEach((gig, idx) => {
      fallbackReply += `* **${gig.title}** for *${gig.clientName}*\n`;
      fallbackReply += `  - **Budget Escrow:** $${gig.budget} • **Project Duration:** ${gig.duration}\n`;
      fallbackReply += `  - **Required Tech:** ${gig.skillsRequired.join(", ")} • **Proposals Received:** ${gig.proposalsCount}\n\n`;
    });
    
    fallbackReply += `Go to the **Gig Marketplace** tab to write custom bids, pitch proposal statements, and manage automatic client workspace chats.`;
  }
  else if (p.includes("badge") || p.includes("points") || p.includes("xp") || p.includes("rank") || p.includes("rewards") || p.includes("leaderboard") || p.includes("academy") || p.includes("course") || p.includes("learn")) {
    const activeProgress = (database.profile.learningProgress || []);
    
    fallbackReply = `### NexLink Academy & Gamified Milestone Ledger 🏆\n\nYour current engagement stats are synchronized with our rewards program:\n\n- **My Gamification Balance:** **${database.profile.gamificationPoints || 350} XP Points**\n`;
    fallbackReply += `- **Achievements Earned:** ${activeBadgesText || "Profile Architect, Continuous Learner"}\n`;
    fallbackReply += `- **Active Courses:**\n`;
    
    if (activeProgress.length > 0) {
      activeProgress.forEach(prog => {
        fallbackReply += `  * Course ID \`${prog.courseId}\`: Progress **${prog.progress}%** (${prog.isCompleted ? "Completed 🎉" : "In Progress 📚"})\n`;
      });
    } else {
      fallbackReply += `  * *No active courses yet.* Let's start the *Advanced React 19 Patterns* or *TypeScript Masterclass* modules below to acquire certified skills!\n`;
    }
    
    fallbackReply += `\nVisit the **Academy & Rewards** tab to select career pathways, automatically analyze your skill gaps, study interactive lessons, and view your position on the active Leaderboard!`;
  }
  else if (p.includes("contract") || p.includes("earning") || p.includes("invoice") || p.includes("finance") || p.includes("income")) {
    const activeContracts = database.contracts;
    fallbackReply = `### Financial Escrow & Income Analytics 💳\n\nHere is your active financial ledger across freelance milestones and completed assignments:\n\n`;
    
    if (activeContracts.length > 0) {
      fallbackReply += `- **Active Contracts:**\n`;
      activeContracts.forEach(c => {
        fallbackReply += `  * *${c.title}* with **${c.clientName}**: **$${c.amount}** (Status: *${c.status}*, Progress: **${c.progress}%**)\n`;
      });
    } else {
      fallbackReply += `- *No active contracts registered.* Match with employers in our Marketplace or Opportunity Hub to spin up safe escrow contracts.\n`;
    }
    
    const cleared = database.earnings.filter(e => e.status === "Cleared").reduce((acc, c) => acc + c.amount, 0);
    const pending = database.earnings.filter(e => e.status === "Pending").reduce((acc, c) => acc + c.amount, 0);
    
    fallbackReply += `\n- **Cleared Earnings:** **$${cleared}**\n`;
    fallbackReply += `- **Pending Escrow Clearing:** **$${pending}**\n\n`;
    fallbackReply += `You can review details, view payment history ledger rows, and request invoice printouts in the **Financial Dashboard** inside the Gig Marketplace page.`;
  }
  else if (p.includes("scam") || p.includes("safety") || p.includes("scammer") || p.includes("warning") || p.includes("moderation") || p.includes("report")) {
    fallbackReply = `### Platform Trust & Scam Prevention Protocol 🛡️\n\nNEXLINK WORK enforces rigorous safety standards to protect our remote workforce:\n\n`;
    fallbackReply += `1. **Verified Employer Badges**: Look for the *Verified* shield on job listings. These accounts have undergone identity verification.\n`;
    fallbackReply += `2. **Deposit Fee Ban**: *Never* pay an employer any "registration fees", "training fees", or security deposits to get a job. This is a 100% scam indicator.\n`;
    fallbackReply += `3. **Interactive Reporting**: If any job looks suspicious, click the **Report Job** button. Our trust and safety crew audits flagged roles immediately.\n`;
    fallbackReply += `4. **System Moderation**: Flagged listings are automatically hidden from the public feed. You can inspect the real-time reports queue in the **Admin Control** tab.\n\n`;
    fallbackReply += `Stay safe, work securely, and notify support immediately if any employer asks you for off-platform payments or private credentials.`;
  }
  else {
    fallbackReply = `### Hello! I am Nexa, your AI Career & Connectivity Assistant. 🚀\n\nI can answer *any* questions about NexLink and help you manage your career goals:\n\n`;
    fallbackReply += `- 🎯 **Job Match & Career Advice:** *"What remote jobs match my skills?"* or *"How do I optimize my portfolio?"*\n`;
    fallbackReply += `- 📶 **Internet & Connectivity:** *"Where is the fastest free wifi near me?"* or *"Check my speed parameters."*\n`;
    fallbackReply += `- 📚 **Skills & Certifications:** *"Suggest learning courses"* or *"How do I run a Nexa skill exam?"*\n`;
    fallbackReply += `- 🛡️ **Scam Protection & Safety:** *"How do I stay safe from recruitment scams?"*\n`;
    fallbackReply += `- 💼 **Freelance & Earnings:** *"List active freelance gigs"* or *"How much have I earned?"*\n\n`;
    fallbackReply += `Ask me any question in the input field below, or click an option in the **Interactive Quickstart** menu on the right!`;
  }

  res.json({ text: fallbackReply });
});

// Notifications preferences
app.get("/api/notifications", (req, res) => {
  res.json(database.notifications);
});

app.post("/api/notifications/read-all", (req, res) => {
  database.notifications.forEach(n => n.isRead = true);
  res.json({ status: "success", count: database.notifications.length });
});

// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
