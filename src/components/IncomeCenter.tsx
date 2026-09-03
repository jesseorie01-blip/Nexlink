import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Calendar, 
  ArrowRight, 
  Briefcase, 
  Percent,
  RefreshCw,
  Award
} from "lucide-react";
import { EarningRecord, Contract } from "../types";

interface IncomeCenterProps {
  isDarkMode: boolean;
}

export default function IncomeCenter({ isDarkMode }: IncomeCenterProps) {
  const [cleared, setCleared] = useState(450);
  const [pending, setPending] = useState(1110);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [history, setHistory] = useState<EarningRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEarningsData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/earnings");
      const data = await res.json();
      setCleared(data.clearedEarnings);
      setPending(data.pendingEarnings);
      setContracts(data.contracts);
      setHistory(data.history);
    } catch (err) {
      console.error("Failed loading earnings status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, []);

  // Simple static historical income comparison list
  const monthlyProgression = [
    { month: "May", amount: 120 },
    { month: "Jun", amount: 300 },
    { month: "Jul", amount: 280 },
    { month: "Aug", amount: 450 },
    { month: "Sep (Current)", amount: 1110, isCurrent: true }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Income Tracker</h2>
          <p className="text-sm opacity-70 mt-1">Monitor cleared payouts, active contract progress, and forecasted pending sums securely.</p>
        </div>

        <button
          onClick={fetchEarningsData}
          className="flex items-center gap-2 self-start px-4 py-2 border rounded-lg text-xs font-semibold hover:bg-slate-500/10 border-slate-700/30"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Income Status
        </button>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Cleared Earnings */}
        <div className={`p-6 rounded-2xl border flex items-center justify-between
          ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"}`}
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold opacity-50 block uppercase tracking-wider">Cleared Earnings (Payout Ready)</span>
            <span className="text-3xl font-extrabold tracking-tight text-emerald-500">${cleared}</span>
            <span className="text-[10px] opacity-60 block">Transferred directly to bank account.</span>
          </div>
          <div className="p-3.5 bg-emerald-500/10 text-emerald-500 rounded-2xl">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Pending / Escrow Earnings */}
        <div className={`p-6 rounded-2xl border flex items-center justify-between
          ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"}`}
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold opacity-50 block uppercase tracking-wider">Pending/Escrow Forecast</span>
            <span className="text-3xl font-extrabold tracking-tight text-amber-500">${pending}</span>
            <span className="text-[10px] opacity-60 block">Locked in active milestones/bids.</span>
          </div>
          <div className="p-3.5 bg-amber-500/10 text-amber-500 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Total Earned overall */}
        <div className={`p-6 rounded-2xl border flex items-center justify-between
          ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"}`}
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold opacity-50 block uppercase tracking-wider">Overall Projected</span>
            <span className="text-3xl font-extrabold tracking-tight text-blue-500">${cleared + pending}</span>
            <span className="text-[10px] opacity-60 block">All-time earnings combined.</span>
          </div>
          <div className="p-3.5 bg-blue-500/10 text-blue-500 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Income Progress Chart & Active Contracts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG Monthly progression bar chart (5 Cols) */}
        <div className={`lg:col-span-5 p-6 rounded-2xl border flex flex-col justify-between
          ${isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}
        >
          <div>
            <h3 className="font-extrabold text-sm uppercase opacity-60 tracking-wider">Monthly Progression</h3>
            <p className="text-xs opacity-60 mt-0.5">Historical overview of earned income across modern cycles.</p>
          </div>

          {/* Render visual SVG chart layout */}
          <div className="py-6 flex items-end justify-between h-48 px-2 border-b border-slate-700/10">
            {monthlyProgression.map(item => {
              const maxVal = 1200;
              const barHeight = Math.max((item.amount / maxVal) * 100, 10);
              return (
                <div key={item.month} className="flex flex-col items-center gap-2 group flex-1">
                  <span className="text-[9px] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-white px-1 rounded">
                    ${item.amount}
                  </span>
                  
                  <div 
                    className={`w-8 rounded-t-md transition-all duration-500 hover:opacity-80
                      ${item.isCurrent 
                        ? "bg-blue-600 shadow-md shadow-blue-500/20" 
                        : isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-slate-200"}`}
                    style={{ height: `${barHeight}%` }}
                  />
                  <span className="text-[10px] opacity-60 text-center select-none truncate max-w-full">{item.month.split(" ")[0]}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 flex justify-between items-center text-xs opacity-60 leading-tight">
            <span>Estimates do not guarantee direct future payout amounts.</span>
          </div>
        </div>

        {/* Active Contracts and Milestones list (7 Cols) */}
        <div className={`lg:col-span-7 p-6 rounded-2xl border space-y-4
          ${isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}
        >
          <h3 className="font-extrabold text-sm uppercase opacity-60 tracking-wider">Active Contract Milestones ({contracts.length})</h3>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {contracts.map(con => (
              <div 
                key={con.id}
                className={`p-4 rounded-xl border space-y-3
                  ${isDarkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-200"}`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm">{con.title}</h4>
                    <span className="text-[10px] opacity-60 block mt-0.5">Client: {con.clientName}</span>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-sm font-bold block">${con.amount}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase
                      ${con.status === "Active" 
                        ? "bg-blue-500/10 text-blue-500" 
                        : "bg-amber-500/10 text-amber-500"}`}
                    >
                      {con.status}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] opacity-60">
                    <span>Milestone progress</span>
                    <span className="font-mono">{con.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-500/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${con.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {contracts.length === 0 && (
              <div className="text-center py-12 opacity-60 text-xs">
                No active contract or project milestone recorded yet.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Income Clearance logs History */}
      <div className={`p-6 rounded-2xl border space-y-4
        ${isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}
      >
        <h3 className="font-extrabold text-sm uppercase opacity-60 tracking-wider">historic activity Logs</h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700/10 pb-2 opacity-60 font-semibold">
                <th className="py-2">SOURCE ACTIVITY</th>
                <th className="py-2">TYPE</th>
                <th className="py-2">TRANSACTION DATE</th>
                <th className="py-2">STATUS</th>
                <th className="py-2 text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/5">
              {history.map(item => (
                <tr key={item.id} className="hover:bg-slate-500/[0.01]">
                  <td className="py-3 font-semibold">{item.source}</td>
                  <td className="py-3 opacity-70">{item.type}</td>
                  <td className="py-3 opacity-70">{item.date}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase
                      ${item.status === "Cleared" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono font-bold">${item.amount}</td>
                </tr>
              ))}

              {history.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 opacity-60">
                    No clearance payout records registered.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
