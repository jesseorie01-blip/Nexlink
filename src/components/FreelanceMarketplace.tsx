import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  DollarSign, 
  Star, 
  Clock, 
  Send, 
  Tag, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  UserCheck
} from "lucide-react";
import { FreelanceGig, FreelanceService, UserProfile } from "../types";

interface FreelanceMarketplaceProps {
  isDarkMode: boolean;
  gigs: FreelanceGig[];
  profile: UserProfile;
  onRefresh: () => void;
}

export default function FreelanceMarketplace({
  isDarkMode,
  gigs: initialGigs,
  profile,
  onRefresh
}: FreelanceMarketplaceProps) {
  const [gigs, setGigs] = useState<FreelanceGig[]>(initialGigs);
  const [selectedGig, setSelectedGig] = useState<FreelanceGig | null>(null);
  const [proposalBid, setProposalBid] = useState("");
  const [proposalText, setProposalText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successProposal, setSuccessProposal] = useState(false);

  // Self freelance listing state (create service)
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [serviceTitle, setServiceTitle] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceCategory, setServiceCategory] = useState("Website Development");
  const [serviceDesc, setServiceDesc] = useState("");
  const [myServices, setMyServices] = useState<FreelanceService[]>([
    {
      id: "ser-1",
      providerId: "usr-1",
      providerName: "Jesse Orie",
      providerHeadline: "Junior Full-Stack React & Node Developer",
      serviceTitle: "Modern React SPA building with Tailwind CSS",
      price: 500,
      category: "Website Development",
      description: "Will design and program a highly elegant, completely responsive landing page or admin system with custom React hooks and complete responsive behavior.",
      rating: 5.0
    }
  ]);

  useEffect(() => {
    setGigs(initialGigs);
    if (initialGigs.length > 0 && !selectedGig) {
      setSelectedGig(initialGigs[0]);
    }
  }, [initialGigs]);

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGig) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/gigs/propose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gigId: selectedGig.id,
          bidAmount: parseFloat(proposalBid) || selectedGig.budget,
          proposalText
        })
      });

      if (res.ok) {
        setSuccessProposal(true);
        setTimeout(() => {
          setSuccessProposal(false);
          setSelectedGig(null);
          setProposalBid("");
          setProposalText("");
          onRefresh(); // refresh global states
        }, 2000);
      }
    } catch (err) {
      console.error("Failed submitting proposal:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle || !servicePrice) return;

    const newService: FreelanceService = {
      id: `ser-${myServices.length + 1}`,
      providerId: profile.id,
      providerName: profile.name,
      providerHeadline: profile.headline,
      serviceTitle,
      price: parseFloat(servicePrice),
      category: serviceCategory,
      description: serviceDesc,
      rating: 5.0
    };

    setMyServices([newService, ...myServices]);
    setServiceTitle("");
    setServicePrice("");
    setServiceDesc("");
    setShowCreateListing(false);
    alert("Your Freelance Service listing is now public! Employers searching for contractors will discover your profile.");
  };

  return (
    <div className="space-y-6 text-left">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Gig & Freelance Marketplace</h2>
          <p className="text-sm opacity-70 mt-1">Bid on short-term tasks or list your own specialized service cards to earn immediately.</p>
        </div>

        <button
          onClick={() => setShowCreateListing(!showCreateListing)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-all"
        >
          {showCreateListing ? "Browse Gigs" : "Post a Service Card"}
        </button>
      </div>

      {showCreateListing ? (
        /* SERVICE CARD FORM */
        <div className={`p-6 rounded-3xl border max-w-xl mx-auto space-y-4
          ${isDarkMode ? "bg-[#141C2F] border-slate-800/50" : "bg-white border-slate-200"}`}
        >
          <div className="border-b border-slate-700/10 pb-3">
            <h3 className="font-extrabold text-lg">List Your Professional Service Card</h3>
            <p className="text-xs opacity-60">Create a highly visible card showcasing what you can build for prospective clients.</p>
          </div>

          <form onSubmit={handleCreateService} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold opacity-75">Service Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build clean React responsive landing pages"
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  className={`w-full p-2 rounded-lg border outline-none
                    ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300"}`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold opacity-75">Starting Price ($)</label>
                <input
                  type="number"
                  required
                  placeholder="500"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                  className={`w-full p-2 rounded-lg border outline-none
                    ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300"}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold opacity-75">Category</label>
                <select
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  className={`w-full p-2 rounded-lg border outline-none
                    ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300"}`}
                >
                  <option value="Website Development">Website Development</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Writing & Translation">Writing & Translation</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Technical Tutoring">Technical Tutoring</option>
                </select>
              </div>

              <div className="space-y-1 flex flex-col justify-end">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] flex items-center gap-1">
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span>Your verified skills are automatically linked to your Service cards.</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold opacity-75">Service Description & Scope</label>
              <textarea
                rows={4}
                required
                placeholder="Detail exactly what tasks you will perform, estimated timelines, and final package deliverables..."
                value={serviceDesc}
                onChange={(e) => setServiceDesc(e.target.value)}
                className={`w-full p-3 rounded-lg border outline-none resize-none
                  ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
              />
            </div>

            <div className="flex gap-2 justify-end pt-3">
              <button
                type="button"
                onClick={() => setShowCreateListing(false)}
                className="px-4 py-2 border rounded-lg hover:bg-slate-500/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
              >
                Publish Service Card
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* GIG BIDDING SYSTEM */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Active Services Cards & Active Bids list (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* User Service Cards previews */}
            {myServices.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-extrabold text-sm opacity-60 uppercase tracking-wider">Your Active Service Cards</h3>
                {myServices.map(ser => (
                  <div 
                    key={ser.id}
                    className={`p-4 rounded-xl border border-dashed text-xs
                      ${isDarkMode ? "bg-blue-600/[0.02] border-blue-500/30 text-slate-100" : "bg-blue-50/20 border-blue-500/20 text-slate-800"}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded-full text-[9px] uppercase">
                        {ser.category}
                      </span>
                      <span className="font-bold text-sm text-emerald-500">${ser.price} Starting</span>
                    </div>
                    <h4 className="font-extrabold mt-2 text-sm">{ser.serviceTitle}</h4>
                    <p className="opacity-70 mt-1 leading-relaxed">{ser.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* General Open Bids Matrix */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-sm opacity-60 uppercase tracking-wider">Open Contracts & Gigs ({gigs.length})</h3>
              <div className="space-y-2 overflow-y-auto max-h-[380px] pr-2">
                {gigs.map(gig => {
                  const isSelected = selectedGig?.id === gig.id;
                  return (
                    <div
                      key={gig.id}
                      onClick={() => setSelectedGig(gig)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all text-left relative group
                        ${isSelected 
                          ? "border-blue-500 bg-blue-500/5 shadow-sm" 
                          : isDarkMode 
                            ? "border-slate-800 hover:border-slate-700 bg-slate-900/20" 
                            : "border-slate-200 hover:border-slate-300 bg-white"}`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-extrabold text-sm group-hover:text-blue-500 transition-colors leading-snug">{gig.title}</h4>
                        <span className="font-mono font-bold text-sm text-emerald-500 shrink-0 ml-2">${gig.budget}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-2 text-[11px] opacity-60">
                        <span>Client: {gig.clientName}</span>
                        <span className="flex items-center text-amber-500"><Star className="w-3 h-3 fill-current" /> {gig.clientRating}</span>
                      </div>

                      <div className="flex items-center justify-between mt-3 text-[10px] opacity-70">
                        <span className="flex items-center gap-1 font-mono"><Clock className="w-3 h-3 text-blue-500" /> {gig.duration}</span>
                        <span className="font-semibold bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">{gig.proposalsCount} Proposals submitted</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Detailed Proposal Drawer (7 Cols) */}
          <div className="lg:col-span-7">
            {selectedGig ? (
              <div className={`p-6 rounded-3xl border text-left flex flex-col justify-between h-full min-h-[480px]
                ${isDarkMode ? "bg-[#141C2F] border-slate-800/50" : "bg-white border-slate-200"}`}
              >
                {successProposal ? (
                  <div className="text-center py-20 space-y-4">
                    <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 animate-bounce" />
                    </div>
                    <h3 className="text-xl font-bold">Proposal Sent Successfully!</h3>
                    <p className="text-xs opacity-60">An active proposal contract has been drafted and a real-time messaging thread is open with {selectedGig.clientName}.</p>
                  </div>
                ) : (
                  <form onSubmit={handleProposalSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-500 font-bold px-2 py-0.5 rounded-full uppercase">
                          Open Gig Post
                        </span>
                        <span className="text-xs font-mono font-semibold opacity-50">Posted {selectedGig.postedDate}</span>
                      </div>
                      
                      <h3 className="font-extrabold text-xl leading-tight tracking-tight">{selectedGig.title}</h3>
                      <div className="flex items-center gap-2 text-xs opacity-70 mt-1">
                        <span>Client: <strong>{selectedGig.clientName}</strong></span>
                        <span className="flex items-center text-amber-500"><Star className="w-3 h-3 fill-current" /> {selectedGig.clientRating}</span>
                      </div>
                    </div>

                    {/* Gig description details */}
                    <div className="p-4 bg-slate-500/5 rounded-xl border border-slate-700/10">
                      <span className="text-[10px] font-bold block uppercase tracking-wider mb-1 opacity-50">Task Scope</span>
                      <p className="text-xs leading-relaxed opacity-80">{selectedGig.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                      <div className="space-y-1">
                        <span className="opacity-50 block">SKILLS REQUIRED</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedGig.skillsRequired.map(s => (
                            <span key={s} className="bg-slate-500/10 text-xs px-2 py-0.5 rounded-md font-semibold">{s}</span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="opacity-50 block">EXPECTED MILESTONE</span>
                        <span className="font-bold text-sm block mt-0.5">{selectedGig.duration}</span>
                      </div>
                    </div>

                    {/* Submit Bid Controls */}
                    <div className="space-y-3 pt-4 border-t border-slate-700/15">
                      <h4 className="font-bold text-sm">Submit Project Bid Proposal</h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1 md:col-span-1">
                          <label className="text-[10px] opacity-60 font-semibold block uppercase">Your Bid Amount ($)</label>
                          <div className="relative">
                            <DollarSign className="w-3.5 h-3.5 absolute left-2.5 top-2.5 opacity-50" />
                            <input
                              type="number"
                              placeholder={selectedGig.budget.toString()}
                              value={proposalBid}
                              onChange={(e) => setProposalBid(e.target.value)}
                              className={`w-full pl-7 pr-3 py-1.5 text-xs rounded-lg border outline-none
                                ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                            />
                          </div>
                        </div>

                        <div className="space-y-1 md:col-span-2 flex flex-col justify-end">
                          <span className="text-[9px] opacity-50 block leading-tight">
                            Clients appreciate accurate bids. Average proposal is based on scope details. Recommended bid: **${selectedGig.budget}**.
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] opacity-60 font-semibold block uppercase">Proposal Message & Approach</label>
                        <textarea
                          rows={4}
                          required
                          value={proposalText}
                          onChange={(e) => setProposalText(e.target.value)}
                          placeholder="Briefly state your development or design approach, your availability to connect and initiate immediate tasks..."
                          className={`w-full p-3 text-xs rounded-xl border outline-none resize-none
                            ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-700/10 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {isSubmitting ? "Routing bid..." : "Submit Bid Proposal"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="text-center py-24 opacity-60">
                <p>Select a freelance gig from the contracts feed to analyze requirements and submit proposals.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
