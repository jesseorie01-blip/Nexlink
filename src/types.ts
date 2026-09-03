export interface UserBadge {
  id: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon lookup string
  dateEarned: string;
}

export interface SkillEndorsement {
  endorserName: string;
  isSystem: boolean; // true if Nexa AI Verified
  date: string;
}

export interface UserSkill {
  name: string;
  endorsements: SkillEndorsement[];
  isValidated: boolean; // assessed by system
}

export interface UserCourseProgress {
  courseId: string;
  progress: number; // 0 - 100
  isCompleted: boolean;
  startDate: string;
  lastActive: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  headline: string;
  phone?: string;
  gender?: string;
  age?: number;
  stateOfOrigin?: string;
  skills: string[];
  experience: {
    id: string;
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  education: {
    id: string;
    school: string;
    degree: string;
    year: string;
  }[];
  certifications: string[];
  portfolioUrls: string[];
  languages: string[];
  workPreference: "Remote" | "On-site" | "Hybrid";
  expectedIncome: number; // monthly
  availability: "Immediate" | "1-2 weeks" | "1 month" | "Part-time";
  isPremium: boolean;
  gamificationPoints?: number;
  badges?: UserBadge[];
  skillEndorsements?: UserSkill[];
  learningProgress?: UserCourseProgress[];
  careerGoal?: string; // selected career goal
}

export interface NetworkLocation {
  id: string;
  name: string;
  location: string;
  distance: number; // in km
  latitude: number;
  longitude: number;
  availability: "Available" | "Busy" | "Offline" | "Unknown";
  connectionType: "Wi-Fi" | "Fiber" | "5G Hotspot" | "Community Mesh" | "Symmetric Ethernet";
  estimatedSpeed: number; // in Mbps
  provider: string;
  openingHours: string;
  rating: number;
  securityClassification: "Secure (WPA3)" | "Open (Captive Portal)" | "Encrypted Public" | "Medium Risk (WPA2)";
  connectionInstructions: string;
  cost: "Free" | "Subscription" | "Hourly Paid" | "Customer-Only";
  locationType: "Library" | "Coworking" | "Cafe" | "Community Center" | "Public Park";
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: "Full-time" | "Part-time" | "Remote" | "Freelance" | "Contract" | "Internship" | "Apprenticeship" | "Gig";
  salaryRange: string;
  salaryMin: number;
  skillsRequired: string[];
  experienceLevel: "Entry-level" | "Mid-level" | "Senior";
  postedDate: string;
  deadline: string;
  matchScore?: number;
  matchExplanation?: string;
  isVerifiedEmployer: boolean;
  isSuspicious?: boolean;
}

export interface FreelanceGig {
  id: string;
  title: string;
  clientName: string;
  clientRating: number;
  budget: number;
  description: string;
  skillsRequired: string[];
  duration: string;
  proposalsCount: number;
  postedDate: string;
}

export interface FreelanceService {
  id: string;
  providerId: string;
  providerName: string;
  providerHeadline: string;
  serviceTitle: string;
  price: number;
  category: string;
  description: string;
  rating: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: "Saved" | "Applied" | "Screening" | "Interview" | "Offer" | "Accepted" | "Rejected";
  notes?: string;
  interviewDate?: string;
  followUpDate?: string;
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
  candidateGender?: string;
  candidateAge?: number;
  candidateState?: string;
  candidateSkills?: string[];
  candidateProfession?: string;
  candidateExperience?: string;
  isUnderage?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  attachmentUrl?: string;
  jobId?: string; // linked context
}

export interface Conversation {
  id: string;
  participantName: string;
  participantRole: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
}

export interface Notification {
  id: string;
  type: "job" | "application" | "interview" | "message" | "network" | "security";
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
}

export interface Contract {
  id: string;
  gigId: string;
  title: string;
  clientName: string;
  amount: number;
  status: "Active" | "Completed" | "Pending Approval";
  progress: number;
  startDate: string;
  endDate?: string;
}

export interface EarningRecord {
  id: string;
  source: string;
  amount: number;
  date: string;
  status: "Cleared" | "Pending";
  type: "Gig" | "Contract" | "Freelance" | "Refund";
}

export interface UserReport {
  id: string;
  reportedId: string;
  reportedType: "Job" | "Employer" | "Network";
  reportedName: string;
  reporterName: string;
  reason: string;
  details: string;
  date: string;
  status: "Pending" | "Reviewed" | "Resolved";
}

export interface SystemHealth {
  cpuUsage: number;
  memoryUsage: number;
  apiLatency: number;
  activeConnections: number;
}
