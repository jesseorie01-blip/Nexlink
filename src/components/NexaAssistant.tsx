import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Send, 
  Brain, 
  Trash2, 
  ArrowRight, 
  HelpCircle, 
  ShieldAlert,
  Bot,
  User,
  Zap,
  MessageSquare,
  HelpCircle as QuestionIcon,
  Play
} from "lucide-react";

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

interface NexaAssistantProps {
  isDarkMode: boolean;
}

export default function NexaAssistant({ isDarkMode }: NexaAssistantProps) {
  const [activeMode, setActiveMode] = useState<"ask_ai" | "ai_ask_user">("ask_ai");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      content: `### Hello! I am Nexa, your AI Career & Connectivity Assistant. 🚀\n\nI can answer any questions you have, or I can actively interview and ask YOU screening & technical questions!\n\nSwitch modes above or try these:\n- ❓ *"What remote jobs match my skills?"*\n- ❓ *"Review my profile details and suggest optimizations."*\n- 🎙️ *"Ask me 3 React technical interview questions one by one!"*`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/nexa/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          chatHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        const modelMsg: ChatMessage = { role: "model", content: data.text };
        setMessages(prev => [...prev, modelMsg]);
      } else {
        const errorMsg: ChatMessage = { 
          role: "model", 
          content: "### System Synchronizer Error ⚠️\n\nI was unable to complete the request. Please check your connectivity state and try querying again shortly." 
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (err) {
      console.error("Nexa Chat Error:", err);
      const errorMsg: ChatMessage = { 
        role: "model", 
        content: "### Connection Offline ⚠️\n\nFailed to establish backend AI pipeline. Check that your local dev server is running." 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAiInterview = (topic: string) => {
    setActiveMode("ai_ask_user");
    const initialPrompt = `Please act as an expert technical recruiter and interviewer. I want you to ask me 5 screening & technical questions one by one about: "${topic}". Ask me Question 1 now and wait for my answer before asking Question 2.`;
    handleSendMessage(initialPrompt);
  };

  const handleClearChat = () => {
    if (confirm("Reset chat history with Nexa?")) {
      setMessages([
        {
          role: "model",
          content: `### Nexa Reset Complete 🚀\n\nHow else can I help supercharge your job matching, resume builders, or interview drills?`
        }
      ]);
    }
  };

  // Safe micro-markdown parser
  const parseMarkdown = (text: string) => {
    let html = text;
    // Headers
    html = html.replace(/^### (.*?)$/gm, '<h4 class="font-extrabold text-sm md:text-base text-blue-500 mt-3 mb-1.5">$1</h4>');
    html = html.replace(/^## (.*?)$/gm, '<h3 class="font-extrabold text-base md:text-lg text-blue-500 mt-4 mb-2">$1</h3>');
    // Strong bolding
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-blue-600 dark:text-blue-400">$1</strong>');
    // Italics
    html = html.replace(/\*(.*?)\*/g, '<em class="italic opacity-90">$1</em>');
    // Bullet lists
    html = html.replace(/^- (.*?)$/gm, '<li class="ml-4 list-disc mb-1">$1</li>');
    html = html.replace(/^\* (.*?)$/gm, '<li class="ml-4 list-disc mb-1">$1</li>');
    // Numbered lists
    html = html.replace(/^\d+\.\s+(.*?)$/gm, '<li class="ml-4 list-decimal mb-1">$1</li>');
    
    return <div dangerouslySetInnerHTML={{ __html: html }} className="space-y-1.5 leading-relaxed text-xs" />;
  };

  const userQuestionSuggestions = [
    "What remote React jobs are currently open?",
    "How can I improve my candidate profile?",
    "Where is the nearest fast WiFi spot?",
    "How do I prevent online recruitment scams?"
  ];

  const aiQuestionTopics = [
    "Frontend React & TypeScript Interview",
    "Node.js & Express System Design",
    "Full-Stack Web Development Screening",
    "Behavioral & Career Goals Assessment"
  ];

  return (
    <div className="space-y-4 text-left flex flex-col h-[620px]">
      
      {/* Header and Mode Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Nexa Interactive AI Assistant</h2>
          <p className="text-sm opacity-70 mt-1">Ask any question or let Nexa ask you screening & technical interview questions.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="px-3.5 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" /> Reset History
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex bg-slate-900/60 p-1.5 border border-slate-800 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveMode("ask_ai")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all
            ${activeMode === "ask_ai" 
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
              : "text-slate-400 hover:text-slate-200"}`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Ask AI Questions</span>
        </button>
        <button
          onClick={() => setActiveMode("ai_ask_user")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all
            ${activeMode === "ai_ask_user" 
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" 
              : "text-slate-400 hover:text-slate-200"}`}
        >
          <QuestionIcon className="w-3.5 h-3.5" />
          <span>AI Ask Me Questions</span>
        </button>
      </div>

      {/* Main chat layout */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0`}>
        
        {/* Left column: scroll chat feed (8 Cols) */}
        <div className={`lg:col-span-8 flex flex-col h-full rounded-2xl border min-h-0 overflow-hidden
          ${isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}
        >
          {/* Active messages window */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, index) => {
              const isModel = msg.role === "model";
              return (
                <div 
                  key={index}
                  className={`flex gap-3 items-start ${isModel ? "justify-start" : "justify-end"}`}
                >
                  {isModel && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`p-4 rounded-2xl max-w-[85%] text-xs border
                    ${isModel 
                      ? isDarkMode 
                        ? "bg-slate-950 border-slate-850 text-slate-100" 
                        : "bg-slate-50 border-slate-200 text-slate-900"
                      : "bg-blue-600 text-white border-blue-600 rounded-tr-none"}`}
                  >
                    {isModel ? (
                      parseMarkdown(msg.content)
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>

                  {!isModel && (
                    <div className="w-8 h-8 rounded-lg bg-slate-500/10 text-slate-500 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 items-start justify-start">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 animate-bounce">
                  <Bot className="w-4 h-4" />
                </div>
                <div className={`p-4 rounded-2xl border text-xs italic opacity-60 flex items-center gap-2
                  ${isDarkMode ? "bg-slate-950 border-slate-850 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                >
                  <Brain className="w-4 h-4 animate-spin text-blue-500" />
                  Nexa is formulating response & question telemetry...
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Chat input form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
            className="p-4 border-t border-slate-700/10 flex gap-2"
          >
            <input
              type="text"
              required
              disabled={isLoading}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                activeMode === "ask_ai" 
                  ? "Type your question here for AI..." 
                  : "Type your answer to AI's question here..."
              }
              className={`flex-1 px-4 py-2.5 text-xs rounded-xl border outline-none
                ${isDarkMode 
                  ? "bg-slate-950 border-slate-850 text-slate-100 focus:border-blue-500" 
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600"}`}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`px-4.5 py-2.5 ${activeMode === "ask_ai" ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"} text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-all
                ${isLoading ? "opacity-50 cursor-not-allowed" : "shadow-sm"}`}
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
        </div>

        {/* Right column: Interactive Quickstart suggestions (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div className={`p-5 rounded-2xl border space-y-4 h-full flex flex-col justify-between
            ${isDarkMode ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200"}`}
          >
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm flex items-center gap-1.5 text-blue-500">
                <Zap className="w-4 h-4 text-blue-500" /> 
                {activeMode === "ask_ai" ? "Type or Pick a Question" : "Start AI Interview Drills"}
              </h4>
              <p className="text-xs opacity-70 leading-relaxed">
                {activeMode === "ask_ai" 
                  ? "Type any custom question in the input or click below to ask Nexa." 
                  : "Select a topic below and Nexa will ask you questions one by one!"}
              </p>

              <div className="flex flex-col gap-2 pt-2">
                {activeMode === "ask_ai" ? (
                  userQuestionSuggestions.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSendMessage(s)}
                      disabled={isLoading}
                      className={`p-3 text-left rounded-xl text-xs font-semibold border flex items-center justify-between group transition-all hover:border-blue-500
                        ${isDarkMode 
                          ? "bg-slate-950/60 border-slate-850 hover:bg-blue-600/[0.02]" 
                          : "bg-slate-50 border-slate-200 hover:bg-blue-50/[0.02]"}`}
                    >
                      <span className="truncate pr-2">{s}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-blue-500 shrink-0" />
                    </button>
                  ))
                ) : (
                  aiQuestionTopics.map(topic => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleStartAiInterview(topic)}
                      disabled={isLoading}
                      className={`p-3 text-left rounded-xl text-xs font-semibold border flex items-center justify-between group transition-all hover:border-emerald-500
                        ${isDarkMode 
                          ? "bg-slate-950/60 border-slate-850 hover:bg-emerald-600/[0.02]" 
                          : "bg-slate-50 border-slate-200 hover:bg-emerald-50/[0.02]"}`}
                    >
                      <span className="truncate pr-2">{topic}</span>
                      <Play className="w-3.5 h-3.5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Anti-recruitment scam warning */}
            <div className="bg-amber-500/10 border border-amber-500/20 text-xs p-3 rounded-xl flex items-start gap-2 text-amber-600 dark:text-amber-400 mt-6">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>
                <strong>Zero-Trust Protected:</strong> Nexa reviews questions and profile telemetry against active honeypot filters. Never share passwords or deposit fees.
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
