import React, { useState } from "react";
import { Mail, Lock, User, Sparkles, ShieldAlert, CheckCircle2, ChevronRight, Globe } from "lucide-react";
import { 
  auth, 
  googleProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile 
} from "../firebase";

interface AuthProps {
  onAuthSuccess: (user: { name: string; email: string }) => void;
  isDarkMode: boolean;
}

export default function Auth({ onAuthSuccess, isDarkMode }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!email || !password || (isSignUp && !name)) {
      setError("Please fill out all required authentication fields.");
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name && userCredential.user) {
          await updateProfile(userCredential.user, { displayName: name });
        }
        setSuccess("Account created with Firebase! Authenticating...");
        setTimeout(() => {
          onAuthSuccess({
            name: name || userCredential.user.displayName || email.split("@")[0],
            email: userCredential.user.email || email
          });
        }, 800);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setSuccess("Firebase Authentication authorized. Welcome back!");
        setTimeout(() => {
          onAuthSuccess({
            name: userCredential.user.displayName || email.split("@")[0],
            email: userCredential.user.email || email
          });
        }, 800);
      }
    } catch (err: any) {
      console.error("Firebase Auth error:", err);
      let msg = "Authentication failed. Please check your credentials.";
      if (err?.code === "auth/email-already-in-use") {
        msg = "An account with this email address already exists. Try signing in.";
      } else if (err?.code === "auth/wrong-password" || err?.code === "auth/invalid-credential") {
        msg = "Invalid password or credentials. Please try again.";
      } else if (err?.code === "auth/user-not-found") {
        msg = "No account found with this email. Please sign up.";
      } else if (err?.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters long.";
      } else if (err?.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      } else if (err?.message) {
        msg = err.message.replace("Firebase: ", "");
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setSuccess("Successfully authenticated with Google account!");
      setTimeout(() => {
        onAuthSuccess({
          name: user.displayName || user.email?.split("@")[0] || "Google User",
          email: user.email || ""
        });
      }, 800);
    } catch (err: any) {
      console.error("Google Auth error:", err);
      let msg = "Google sign-in failed.";
      if (err?.code === "auth/popup-closed-by-user") {
        msg = "Google Sign-in popup was closed before completing.";
      } else if (err?.code === "auth/popup-blocked") {
        msg = "Sign-in popup was blocked by your browser. Please allow popups.";
      } else if (err?.message) {
        msg = err.message.replace("Firebase: ", "");
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-colors
      ${isDarkMode ? "bg-[#070b16] text-white" : "bg-white text-slate-900"}`}
    >
      {/* Dynamic Security grid bg */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Brand identity */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-500/5 animate-pulse">
            <Sparkles className="w-7 h-7 text-blue-500" />
          </div>
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            NexLink Work Network
          </h1>
          <p className={`text-xs max-w-xs mx-auto ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Authorized portal for gig-matching, speed mapping, and zero-trust career profiles with Firebase Auth.
          </p>
        </div>

        {/* Access Form Card */}
        <div className={`p-6 rounded-3xl shadow-xl space-y-5 border transition-all
          ${isDarkMode ? "bg-slate-900/60 border-slate-800 backdrop-blur-md" : "bg-white border-slate-200 shadow-slate-200/50"}`}
        >
          <div className={`flex border-b pb-1 ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
            <button
              onClick={() => { setIsSignUp(false); setError(""); setSuccess(""); }}
              className={`flex-1 pb-3 text-xs uppercase tracking-widest font-extrabold transition-all
                ${!isSignUp 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsSignUp(true); setError(""); setSuccess(""); }}
              className={`flex-1 pb-3 text-xs uppercase tracking-widest font-extrabold transition-all
                ${isSignUp 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 animate-bounce" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
            {isSignUp && (
              <div className="space-y-1">
                <label className={`font-bold uppercase tracking-widest text-[9px] ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jesse Orie"
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl border transition-colors outline-none focus:border-blue-500
                      ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100 placeholder:opacity-40" : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"}`}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className={`font-bold uppercase tracking-widest text-[9px] ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border transition-colors outline-none focus:border-blue-500
                    ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100 placeholder:opacity-40" : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"}`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={`font-bold uppercase tracking-widest text-[9px] ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••••••••••••"
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border transition-colors outline-none focus:border-blue-500
                    ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100 placeholder:opacity-40" : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"}`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="animate-pulse">Authenticating with Firebase...</span>
              ) : (
                <>
                  <span>{isSignUp ? "Create Firebase Account" : "Sign In with Firebase"}</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className={`flex-grow border-t ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}></div>
            <span className="flex-shrink mx-4 text-[9px] text-slate-400 uppercase font-mono">Or connect with</span>
            <div className={`flex-grow border-t ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`w-full py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50
              ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"}`}
          >
            <Globe className="w-4 h-4 text-blue-500 animate-pulse" />
            <span>Sign In with Google Account</span>
          </button>
        </div>

        {/* Security disclaimer footer */}
        <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-mono">
          🚀 Firebase Protected & Zero-Trust Session Encrypted
        </p>
      </div>
    </div>
  );
}
