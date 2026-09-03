import React, { useState, useEffect } from "react";
import { 
  Send, 
  Paperclip, 
  Search, 
  MessageSquare, 
  Clock, 
  CheckCheck, 
  UserCheck, 
  AlertCircle,
  Briefcase
} from "lucide-react";
import { Conversation, Message } from "../types";

interface MessagingCenterProps {
  isDarkMode: boolean;
  conversations: Conversation[];
  onRefreshConversations: () => void;
}

export default function MessagingCenter({ isDarkMode, conversations, onRefreshConversations }: MessagingCenterProps) {
  const [activeConvId, setActiveConvId] = useState<string>("conv-1");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Fetch messages for active conversation
  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/messages/${convId}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed loading messages thread:", err);
    }
  };

  useEffect(() => {
    if (activeConvId) {
      fetchMessages(activeConvId);
    }
  }, [activeConvId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    setIsSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConvId,
          text: inputText
        })
      });

      if (res.ok) {
        setInputText("");
        fetchMessages(activeConvId);
        onRefreshConversations(); // refresh unread counters
      }
    } catch (err) {
      console.error("Failed sending message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  const filteredConversations = conversations.filter(c =>
    (c.participantName || "").toLowerCase().includes((searchQuery || "").toLowerCase()) ||
    (c.participantRole || "").toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  return (
    <div className="space-y-4 text-left">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Communication Portal</h2>
        <p className="text-sm opacity-70 mt-1">Engage securely in real-time with verified employers, freelance clients, and recruiters.</p>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 rounded-2xl border overflow-hidden h-[540px]
        ${isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}
      >
        {/* Left 4 Cols: Conversation list */}
        <div className="md:col-span-4 border-r border-slate-700/10 flex flex-col h-full bg-slate-500/[0.01]">
          {/* List Search bar */}
          <div className="p-4 border-b border-slate-700/10 relative">
            <Search className="absolute left-7 top-6.5 w-4 h-4 opacity-50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats, roles..."
              className={`w-full pl-9 pr-4 py-2 text-xs rounded-lg border outline-none
                ${isDarkMode 
                  ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" 
                  : "bg-white border-slate-300 text-slate-900 focus:border-blue-600"}`}
            />
          </div>

          {/* List scroll */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-700/5">
            {filteredConversations.map(conv => {
              const isSelected = activeConvId === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-4 cursor-pointer text-left transition-colors relative
                    ${isSelected 
                      ? isDarkMode ? "bg-slate-800/40" : "bg-slate-50" 
                      : "hover:bg-slate-500/[0.01]"}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs truncate">{conv.participantName}</h4>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0
                          ${conv.participantRole === "Employer" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"}`}
                        >
                          {conv.participantRole}
                        </span>
                      </div>
                      <p className="text-[10px] opacity-60 truncate mt-1">{conv.lastMessage}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[9px] opacity-40 font-mono block">{conv.lastTimestamp}</span>
                      {conv.unreadCount > 0 && (
                        <span className="inline-block w-2.5 h-2.5 bg-blue-600 rounded-full mt-1.5 animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredConversations.length === 0 && (
              <div className="text-center py-10 opacity-50 text-xs">
                No conversations found.
              </div>
            )}
          </div>
        </div>

        {/* Right 8 Cols: Thread Message details */}
        <div className="md:col-span-8 flex flex-col h-full justify-between">
          {activeConv ? (
            <>
              {/* Active Conversation Header */}
              <div className="p-4 border-b border-slate-700/10 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm">{activeConv.participantName}</h3>
                  <p className="text-[10px] opacity-50 flex items-center gap-1 mt-0.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-500" /> Secure Encryption Active
                  </p>
                </div>
                
                <span className="text-[9px] bg-slate-500/15 opacity-70 px-2 py-1 rounded-lg">
                  Channel ID: {activeConv.id}
                </span>
              </div>

              {/* Chat messages scroll section */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-500/[0.01]">
                {messages.map(msg => {
                  const isMe = msg.senderId === "usr-1";
                  return (
                    <div 
                      key={msg.id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed text-left
                        ${isMe 
                          ? "bg-blue-600 text-white rounded-tr-none" 
                          : isDarkMode ? "bg-slate-850 text-slate-100 rounded-tl-none border border-slate-800" : "bg-slate-100 text-slate-800 rounded-tl-none border"}`}
                      >
                        {/* If message is a proposal, render formatted */}
                        {msg.text.startsWith("PROPOSAL") ? (
                          <div className="space-y-2">
                            <strong className="block border-b border-white/20 pb-1 flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5" /> Proposal Details
                            </strong>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        )}
                      </div>
                      
                      <span className="text-[8px] opacity-40 font-mono mt-1 px-1 flex items-center gap-1">
                        {msg.timestamp} {isMe && <CheckCheck className="w-3 h-3 text-blue-500 inline" />}
                      </span>
                    </div>
                  );
                })}

                {messages.length === 0 && (
                  <div className="text-center py-20 opacity-60 text-xs">
                    Establishing synchronization channel... Write a message below to start chatting.
                  </div>
                )}
              </div>

              {/* Message reply box form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700/10 flex gap-2">
                <button
                  type="button"
                  onClick={() => alert("Select a local file or PDF to attach securely as an application asset.")}
                  className={`p-2 rounded-lg border transition-colors
                    ${isDarkMode ? "border-slate-800 hover:bg-slate-800 text-slate-400" : "border-slate-200 hover:bg-slate-100 text-slate-500"}`}
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  required
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a secure, professional message..."
                  className={`flex-1 px-4 py-2 text-xs rounded-lg border outline-none
                    ${isDarkMode 
                      ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" 
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600"}`}
                />

                <button
                  type="submit"
                  disabled={isSending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-40 opacity-60 text-sm">
              <MessageSquare className="w-12 h-12 mx-auto text-slate-500 mb-2 opacity-50" />
              <p>Select an inbox thread from the sidebar list to inspect details and respond.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
