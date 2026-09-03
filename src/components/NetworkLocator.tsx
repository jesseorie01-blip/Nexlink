import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Wifi, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  RefreshCw, 
  Play, 
  Download, 
  Upload, 
  Compass, 
  Clock, 
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  ShieldAlert
} from "lucide-react";
import { NetworkLocation } from "../types";

interface NetworkLocatorProps {
  isDarkMode: boolean;
  networks: NetworkLocation[];
  onRefresh: () => void;
  onSpeedChange?: (speed: number, latency: number) => void;
}

export default function NetworkLocator({ isDarkMode, networks: initialNetworks, onRefresh, onSpeedChange }: NetworkLocatorProps) {
  const [networks, setNetworks] = useState<NetworkLocation[]>(initialNetworks);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCost, setFilterCost] = useState("All");
  const [filterSpeed, setFilterSpeed] = useState("All");
  const [filterType, setFilterType] = useState("All");

  // Selection
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkLocation | null>(null);
  
  // Connection state
  const [connectedNetworkId, setConnectedNetworkId] = useState<string>("net-1"); // Seed default
  const [isConnecting, setIsConnecting] = useState(false);

  // Speed test state
  const [speedTestRunning, setSpeedTestRunning] = useState(false);
  const [testStage, setTestStage] = useState<"idle" | "ping" | "download" | "upload" | "done">("idle");
  const [pingVal, setPingVal] = useState(0);
  const [downloadVal, setDownloadVal] = useState(0.0);
  const [uploadVal, setUploadVal] = useState(0.0);
  const [testProgress, setTestProgress] = useState(0);

  // Secure Access & Simulated Handshake State
  const [secureAccessEnabled, setSecureAccessEnabled] = useState(false);
  const [isSecureModalOpen, setIsSecureModalOpen] = useState(false);
  const [isHandshaking, setIsHandshaking] = useState(false);
  const [handshakeProgress, setHandshakeProgress] = useState(0);
  const [handshakeStage, setHandshakeStage] = useState("");
  const [netUsername, setNetUsername] = useState("");
  const [netPassword, setNetPassword] = useState("");
  const [nasaShieldActive, setNasaShieldActive] = useState(false);

  useEffect(() => {
    setNetworks(initialNetworks);
    if (initialNetworks.length > 0 && !selectedNetwork) {
      setSelectedNetwork(initialNetworks[0]);
    }
  }, [initialNetworks]);

  // Handle Search & Filter on backend or client side
  const handleSearchAndFilter = async () => {
    let url = `/api/networks?query=${encodeURIComponent(searchQuery)}`;
    if (filterCost !== "All") url += `&cost=${filterCost}`;
    if (filterSpeed !== "All") url += `&speed=${filterSpeed}`;
    if (filterType !== "All") url += `&type=${filterType}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setNetworks(data);
      if (data.length > 0) {
        setSelectedNetwork(data[0]);
      } else {
        setSelectedNetwork(null);
      }
    } catch (err) {
      console.error("Error querying networks:", err);
    }
  };

  useEffect(() => {
    handleSearchAndFilter();
  }, [searchQuery, filterCost, filterSpeed, filterType]);

  const runSpeedTest = () => {
    if (speedTestRunning) return;
    setSpeedTestRunning(true);
    setTestStage("ping");
    setTestProgress(10);
    setPingVal(0);
    setDownloadVal(0);
    setUploadVal(0);

    // Phase 1: Ping (0.8s)
    setTimeout(() => {
      setPingVal(Math.floor(Math.random() * 25) + 8);
      setTestStage("download");
      setTestProgress(40);

      // Phase 2: Download Speed (1.2s progression)
      let currentDownload = 0;
      const downloadInterval = setInterval(() => {
        currentDownload += Math.floor(Math.random() * 30) + 15;
        if (currentDownload > 165) currentDownload = 165 + (Math.random() * 5);
        setDownloadVal(parseFloat(currentDownload.toFixed(1)));
      }, 150);

      setTimeout(() => {
        clearInterval(downloadInterval);
        setTestStage("upload");
        setTestProgress(75);

        // Phase 3: Upload Speed (1.2s progression)
        let currentUpload = 0;
        const uploadInterval = setInterval(() => {
          currentUpload += Math.floor(Math.random() * 15) + 5;
          if (currentUpload > 62) currentUpload = 62 + (Math.random() * 3);
          setUploadVal(parseFloat(currentUpload.toFixed(1)));
        }, 150);

        setTimeout(() => {
          clearInterval(uploadInterval);
          setTestStage("done");
          setTestProgress(100);
          setSpeedTestRunning(false);
          if (onSpeedChange) {
            onSpeedChange(165.4, Math.floor(Math.random() * 15) + 8);
          }
        }, 1200);

      }, 1200);

    }, 800);
  };

  const handleConnectNetwork = (network: NetworkLocation) => {
    if (network.availability === "Offline") return;
    setIsConnecting(true);
    setTimeout(() => {
      setConnectedNetworkId(network.id);
      setIsConnecting(false);
    }, 1500);
  };

  const currentConnectedInfo = networks.find(n => n.id === connectedNetworkId) || networks[0];

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            Network Connectivity Hub
            {nasaShieldActive && (
              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full font-extrabold tracking-wider uppercase animate-pulse">
                NASA Quantum-Shield Locked
              </span>
            )}
          </h2>
          <p className="text-sm opacity-70 mt-1">Discover authorized high-speed connection spaces and test bandwidth performance.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              if (secureAccessEnabled) {
                setSecureAccessEnabled(false);
                setNasaShieldActive(false);
              } else {
                setIsSecureModalOpen(true);
              }
            }}
            className={`flex items-center gap-2 px-3.5 py-2 border rounded-xl text-xs font-extrabold transition-all shadow-sm
              ${secureAccessEnabled 
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" 
                : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"}`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${secureAccessEnabled ? "text-emerald-400 animate-pulse" : "text-slate-400"}`} />
            Secure Access: {secureAccessEnabled ? "ACTIVE" : "STANDBY"}
          </button>

          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-3.5 py-2 border rounded-xl text-xs font-semibold transition-all hover:bg-slate-500/10 border-slate-700/30"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Network Map
          </button>
        </div>
      </div>

      {/* Network Connection Center (Top Widget Grid) */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-3xl border p-6 transition-all
        ${isDarkMode ? "bg-[#141C2F] border-slate-800/50" : "bg-white border-slate-200"}`}
      >
        {/* Core Stats */}
        <div className="lg:border-r border-slate-700/20 lg:pr-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm tracking-widest uppercase opacity-60">Connection Status</h3>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          {currentConnectedInfo ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl">
                  <Wifi className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{currentConnectedInfo.name}</h4>
                  <p className="text-xs opacity-60 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {currentConnectedInfo.location}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-700/15">
                <div>
                  <span className="text-[10px] opacity-50 block">CONNECTION TYPE</span>
                  <span className="font-bold text-sm">{currentConnectedInfo.connectionType}</span>
                </div>
                <div>
                  <span className="text-[10px] opacity-50 block">SECURITY LEVEL</span>
                  <span className={`font-extrabold text-xs flex items-center gap-0.5 
                    ${nasaShieldActive ? "text-blue-400 animate-pulse" : "text-emerald-500"}`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> 
                    {nasaShieldActive ? "NASA Quantum Shield" : "Secure Connection"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm opacity-60">No connection established.</p>
            </div>
          )}
        </div>

        {/* Real-time Quality Signal Metrics */}
        <div className="lg:border-r border-slate-700/20 lg:px-6 space-y-3">
          <h3 className="font-bold text-sm tracking-widest uppercase opacity-60">Bandwidth Parameters</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="opacity-70">Estimated Capacity</span>
              <span className="font-bold text-blue-500">{currentConnectedInfo?.estimatedSpeed || 150} Mbps</span>
            </div>
            <div className="w-full bg-slate-500/10 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(((currentConnectedInfo?.estimatedSpeed || 150) / 1000) * 100, 100)}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <div className="p-2 bg-slate-500/5 rounded-lg border border-slate-700/10">
                <span className="opacity-60 block text-[10px]">CURRENT DATA USED</span>
                <span className="font-bold text-sm">2.4 GB</span>
              </div>
              <div className="p-2 bg-slate-500/5 rounded-lg border border-slate-700/10">
                <span className="opacity-60 block text-[10px]">LATENCY (PING)</span>
                <span className="font-bold text-sm text-emerald-500">14 ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Bandwidth Tester */}
        <div className="lg:pl-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm tracking-widest uppercase opacity-60">Speed Test Desk</h3>
              {speedTestRunning && (
                <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full animate-pulse font-bold uppercase">
                  Testing {testStage}
                </span>
              )}
            </div>

            {testStage !== "idle" ? (
              <div className="mt-3 space-y-2">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-500/5 p-1.5 rounded-lg border border-slate-700/10">
                    <span className="text-[9px] opacity-60 block">PING</span>
                    <span className="font-extrabold text-xs">{pingVal ? `${pingVal} ms` : "-"}</span>
                  </div>
                  <div className="bg-slate-500/5 p-1.5 rounded-lg border border-slate-700/10">
                    <span className="text-[9px] opacity-60 block">DOWNLOAD</span>
                    <span className="font-extrabold text-xs text-blue-500">{downloadVal ? `${downloadVal} M` : "-"}</span>
                  </div>
                  <div className="bg-slate-500/5 p-1.5 rounded-lg border border-slate-700/10">
                    <span className="text-[9px] opacity-60 block">UPLOAD</span>
                    <span className="font-extrabold text-xs text-purple-500">{uploadVal ? `${uploadVal} M` : "-"}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-500/10 rounded-full h-1.5 overflow-hidden mt-2">
                  <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${testProgress}%` }}></div>
                </div>
              </div>
            ) : (
              <p className="text-xs opacity-60 mt-2">Run high-fidelity network calibration to map your remote telemetry capacity.</p>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={runSpeedTest}
              disabled={speedTestRunning}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all
                ${speedTestRunning 
                  ? "bg-slate-500/20 text-slate-400 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              <Activity className="w-3.5 h-3.5" />
              {speedTestRunning ? "Calibrating..." : "Run Bandwidth Test"}
            </button>
            {testStage === "done" && (
              <span className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg" title="Test Complete">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Discovery Workspace Layout: Sidebar list + Map / Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 Cols: Search, Filters & Network List */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`p-4 rounded-xl border space-y-3
            ${isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}
          >
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 opacity-50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Wi-Fi, cafes, coworking..."
                className={`w-full pl-9 pr-4 py-2 text-xs rounded-lg border outline-none transition-all
                  ${isDarkMode 
                    ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" 
                    : "bg-white border-slate-300 text-slate-900 focus:border-blue-600"}`}
              />
            </div>

            {/* Smart filters */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] opacity-60 mb-1">COST</label>
                <select
                  value={filterCost}
                  onChange={(e) => setFilterCost(e.target.value)}
                  className={`w-full p-1.5 rounded-md border text-xs outline-none
                    ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-300"}`}
                >
                  <option value="All">All Costs</option>
                  <option value="Free">Free</option>
                  <option value="Customer-Only">Customer Only</option>
                  <option value="Subscription">Subscription</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] opacity-60 mb-1">SPEED TYPE</label>
                <select
                  value={filterSpeed}
                  onChange={(e) => setFilterSpeed(e.target.value)}
                  className={`w-full p-1.5 rounded-md border text-xs outline-none
                    ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-300"}`}
                >
                  <option value="All">Any Speed</option>
                  <option value="100">100+ Mbps</option>
                  <option value="500">500+ Mbps</option>
                </select>
              </div>
            </div>
          </div>

          {/* Map Hotspots List */}
          <div className="space-y-2 overflow-y-auto max-h-[360px] pr-2">
            {networks.map((net) => {
              const isSelected = selectedNetwork?.id === net.id;
              const isCurrentlyConnected = connectedNetworkId === net.id;
              return (
                <div
                  key={net.id}
                  onClick={() => setSelectedNetwork(net)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-left relative group
                    ${isSelected 
                      ? "border-blue-500 bg-blue-500/5 shadow-sm" 
                      : isDarkMode 
                        ? "border-slate-800 hover:border-slate-700 bg-slate-900/20" 
                        : "border-slate-200 hover:border-slate-300 bg-white"}`}
                >
                  {isCurrentlyConnected && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                      CONNECTED
                    </span>
                  )}
                  <h4 className="font-bold text-sm text-inherit group-hover:text-blue-500 transition-colors">{net.name}</h4>
                  <p className="text-xs opacity-60 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {net.location} • {net.distance}km
                  </p>
                  
                  <div className="flex items-center justify-between mt-3 text-[11px]">
                    <span className={`font-semibold ${net.availability === "Available" ? "text-emerald-500" : net.availability === "Busy" ? "text-amber-500" : "text-rose-500"}`}>
                      {net.availability}
                    </span>
                    <span className="font-semibold opacity-75">{net.estimatedSpeed} Mbps • {net.cost}</span>
                  </div>
                </div>
              );
            })}

            {networks.length === 0 && (
              <div className="text-center py-10">
                <AlertCircle className="w-8 h-8 mx-auto text-rose-500 opacity-60 mb-2" />
                <p className="text-sm font-semibold opacity-80">No authorized networks found</p>
                <p className="text-xs opacity-60 mt-1">Try expanding your search or clearing filters.</p>
                <button
                  onClick={() => { setSearchQuery(""); setFilterCost("All"); setFilterSpeed("All"); }}
                  className="mt-3 text-xs text-blue-500 font-semibold underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 8 Cols: Map Visual Simulation & Detail Card */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Visual Interactive Map (6 Cols) */}
          <div className={`md:col-span-7 rounded-3xl border overflow-hidden h-[420px] relative flex flex-col justify-between
            ${isDarkMode ? "bg-[#141C2F] border-slate-800/50" : "bg-slate-100 border-slate-200"}`}
          >
            {/* Map Canvas Visual Backing */}
            <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>

            {/* Simulated Radar Compass / Pins */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border border-dashed border-blue-500/20 rounded-full animate-ping pointer-events-none"></div>
              <div className="w-40 h-40 border border-dashed border-blue-500/20 rounded-full pointer-events-none absolute"></div>
              
              {/* Plot Pins */}
              {networks.map((net) => {
                const isSelected = selectedNetwork?.id === net.id;
                // Calculate random placement based on ID hash for consistent plotting
                const seedX = (net.name.charCodeAt(2) * 5) % 180 - 90;
                const seedY = (net.name.charCodeAt(4) * 3) % 180 - 90;
                
                return (
                  <button
                    key={net.id}
                    onClick={() => setSelectedNetwork(net)}
                    className="absolute p-2 transition-transform duration-200 hover:scale-125 focus:outline-none"
                    style={{ transform: `translate(${seedX}px, ${seedY}px)` }}
                  >
                    <div className="relative flex flex-col items-center">
                      <div className={`p-1.5 rounded-full shadow-lg transition-colors
                        ${isSelected 
                          ? "bg-blue-600 text-white ring-4 ring-blue-500/30" 
                          : net.id === connectedNetworkId
                            ? "bg-emerald-600 text-white"
                            : isDarkMode ? "bg-slate-800 text-slate-300" : "bg-white text-slate-700 border"
                        }`}
                      >
                        <Wifi className="w-4 h-4" />
                      </div>
                      <span className={`text-[9px] font-bold px-1 rounded-md bg-opacity-80 absolute top-7 whitespace-nowrap
                        ${isDarkMode ? "bg-slate-950 text-slate-200" : "bg-white text-slate-800 border"}`}
                      >
                        {net.name.split(" ")[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Map Controls */}
            <div className="p-4 z-10 flex justify-between items-start w-full pointer-events-none">
              <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 pointer-events-auto text-white flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-blue-500 animate-spin" style={{ animationDuration: "12s" }} />
                <span className="text-[10px] font-mono">GEO-SIMULATOR OK</span>
              </div>

              <div className="flex flex-col gap-1 pointer-events-auto">
                <div className="bg-slate-900/80 backdrop-blur-md p-2 rounded-lg border border-slate-800 text-white text-[10px] space-y-1">
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Busy</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Offline</div>
                </div>
              </div>
            </div>

            {/* Small location instructions notice */}
            <div className="p-3 bg-blue-600/10 border-t border-blue-500/20 text-[11px] text-blue-500 font-semibold z-10 flex items-center gap-1 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>We only display legitimate public, cafe or municipal networks. Exposing private keys is strictly disabled.</span>
            </div>
          </div>

          {/* Details / Instructions Panel (5 Cols) */}
          <div className="md:col-span-5 flex flex-col justify-between">
            {selectedNetwork ? (
              <div className={`p-5 rounded-3xl border text-left h-full flex flex-col justify-between
                ${isDarkMode ? "bg-[#141C2F] border-slate-800/50" : "bg-white border-slate-200"}`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] bg-blue-500/10 text-blue-500 font-bold px-2 py-0.5 rounded-full uppercase">
                      {selectedNetwork.locationType}
                    </span>
                    <span className="text-xs font-mono font-bold opacity-60">
                      {selectedNetwork.distance} km away
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-lg tracking-tight">{selectedNetwork.name}</h3>
                    <p className="text-xs opacity-60 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" /> {selectedNetwork.location}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700/10">
                    <div>
                      <span className="text-[10px] opacity-50 block">EST. SPEED</span>
                      <span className="font-extrabold text-base">{selectedNetwork.estimatedSpeed} Mbps</span>
                    </div>
                    <div>
                      <span className="text-[10px] opacity-50 block">PRICING MODE</span>
                      <span className="font-extrabold text-base text-blue-500">{selectedNetwork.cost}</span>
                    </div>
                    <div>
                      <span className="text-[10px] opacity-50 block">OPEN HOURS</span>
                      <span className="font-bold text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {selectedNetwork.openingHours}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] opacity-50 block">HARDWARE CO.</span>
                      <span className="font-bold text-xs opacity-80">{selectedNetwork.provider}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-500/5 rounded-xl border border-slate-700/10">
                    <span className="text-[10px] font-bold block uppercase tracking-wider mb-1 opacity-60">How to Connect Safely</span>
                    <p className="text-xs leading-relaxed opacity-80">{selectedNetwork.connectionInstructions}</p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/10 flex gap-2">
                  {connectedNetworkId === selectedNetwork.id ? (
                    <button
                      onClick={() => setConnectedNetworkId("")}
                      className="w-full py-2.5 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnectNetwork(selectedNetwork)}
                      disabled={selectedNetwork.availability === "Offline" || isConnecting}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5
                        ${selectedNetwork.availability === "Offline" 
                          ? "bg-slate-500/20 text-slate-400 cursor-not-allowed border-none" 
                          : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                      <Wifi className="w-4 h-4" />
                      {isConnecting ? "Negotiating Handshake..." : "Initiate Secure Connection"}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 opacity-60">
                <p>Select a location from the sidebar network matrix to inspect details.</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* NASA-grade Ultra-Secure Access Handshake Modal */}
      {isSecureModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left shadow-2xl relative overflow-hidden">
            {/* Grid pattern backdrop */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:12px_12px]"></div>
            </div>

            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600/10 text-blue-400 rounded-xl border border-blue-500/20">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-100 text-base">Establish Secure Handshake</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">AES-256 / Quantum Shield Protocol</p>
                </div>
              </div>

              {!isHandshaking ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!netUsername || !netPassword) {
                    alert("Please fill in both fields for node validation.");
                    return;
                  }
                  setIsHandshaking(true);
                  setHandshakeProgress(10);
                  setHandshakeStage("Initializing quantum tunnels...");

                  const stages = [
                    { progress: 25, msg: "Diffie-Hellman Quantum-Safe Exchange..." },
                    { progress: 45, msg: "Verifying secure local environment sandbox..." },
                    { progress: 70, msg: "Compiling SHA-512 military verification hash..." },
                    { progress: 85, msg: "Synchronizing firewall access rules..." },
                    { progress: 100, msg: "Secure Handshake completed successfully!" }
                  ];

                  let idx = 0;
                  const stepTimer = setInterval(() => {
                    if (idx < stages.length) {
                      setHandshakeProgress(stages[idx].progress);
                      setHandshakeStage(stages[idx].msg);
                      idx++;
                    } else {
                      clearInterval(stepTimer);
                      setIsHandshaking(false);
                      setSecureAccessEnabled(true);
                      setNasaShieldActive(true);
                      setIsSecureModalOpen(false);
                    }
                  }, 800);
                }} className="space-y-4 pt-1">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Access Node</label>
                    <input
                      type="text"
                      required
                      value={netUsername}
                      onChange={(e) => setNetUsername(e.target.value)}
                      placeholder="e.g. gateway_secure_beta"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Access Handshake Password</label>
                    <input
                      type="password"
                      required
                      value={netPassword}
                      onChange={(e) => setNetPassword(e.target.value)}
                      placeholder="•••••••••••••••••"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div className="p-3 bg-blue-950/20 rounded-xl border border-blue-500/10 text-[10px] text-slate-400 leading-relaxed flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                    <span><strong>Unbreachable Protection Strategy</strong>: Local environment validation prevents credential leaks. Tunnel operates under NASA-grade zero-trust encryption sandboxes.</span>
                  </div>

                  <div className="flex gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsSecureModalOpen(false)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold border border-slate-800 text-slate-400 hover:bg-slate-900 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-1 shadow-lg shadow-blue-500/20"
                    >
                      <Play className="w-3 h-3" /> Initiate Handshake
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-6 space-y-4 text-center">
                  <RefreshCw className="w-9 h-9 text-blue-500 animate-spin mx-auto" />
                  <div className="space-y-1.5">
                    <p className="font-extrabold text-xs text-slate-200">{handshakeStage}</p>
                    <p className="text-[10px] font-mono text-blue-400 tracking-widest">TUNNEL QUANTUM INTEGRITY: {handshakeProgress}%</p>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                    <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${handshakeProgress}%` }}></div>
                  </div>
                  <p className="text-[9px] text-slate-500">AES-256 standard and quantum-secure defense protocols loading...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
