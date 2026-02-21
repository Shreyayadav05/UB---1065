import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  Activity, 
  Brain, 
  Clock, 
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Pill,
  Bell
} from "lucide-react";

interface Assessment {
  id: number;
  mentalScore: number;
  physicalScore: number;
  riskLevel: string;
  recommendation: string;
  timestamp: string;
}

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  taken: number;
}

export default function Dashboard() {
  const [history, setHistory] = useState<Assessment[]>([]);
  const [meds, setMeds] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/history/user_123").then(res => res.json()),
      fetch("/api/medications/user_123").then(res => res.json())
    ]).then(([historyData, medsData]) => {
      setHistory(historyData);
      setMeds(medsData);
      setLoading(false);
    });
  }, []);

  const latest = history[0];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Patient Overview</h2>
          <p className="text-zinc-500">Welcome back, John. Here is your health continuum status.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl shadow-sm border border-zinc-100">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-zinc-700">System Active: Monitoring</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Mental Wellness", value: latest ? `${100 - latest.mentalScore}%` : "92%", icon: Brain, color: "text-purple-500", bg: "bg-purple-50" },
          { label: "Physical Vitals", value: latest ? `${100 - latest.physicalScore}%` : "88%", icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Active Risk", value: latest ? latest.riskLevel : "LOW", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Next Check-in", value: "24h", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100 space-y-4"
          >
            <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
              <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart/Status Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Medication Notification */}
          {meds.some(m => !m.taken) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Bell size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900">Medication Reminder</h4>
                  <p className="text-sm text-emerald-700">You have {meds.filter(m => !m.taken).length} doses pending for today.</p>
                </div>
              </div>
              <button 
                onClick={() => window.location.href = "/meds"}
                className="px-6 py-2 bg-emerald-500 text-zinc-900 font-bold rounded-xl hover:bg-emerald-400 transition-colors"
              >
                View Meds
              </button>
            </motion.div>
          )}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-zinc-100 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-zinc-900">Risk Trend Analysis</h3>
              <select className="bg-zinc-50 border-none rounded-xl text-sm font-medium px-4 py-2 focus:ring-2 focus:ring-emerald-500">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            
            <div className="h-64 flex items-end gap-2 px-4">
              {history.length > 0 ? history.slice().reverse().map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-help">
                  <div className="w-full relative flex flex-col gap-1 items-center">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h.mentalScore}%` }}
                      className="w-full bg-purple-200 rounded-t-lg group-hover:bg-purple-300 transition-colors"
                    />
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h.physicalScore}%` }}
                      className="w-full bg-blue-200 rounded-b-lg group-hover:bg-blue-300 transition-colors"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">{new Date(h.timestamp).toLocaleDateString(undefined, { weekday: 'short' })}</span>
                </div>
              )) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 italic">
                  No assessment data available. Complete a check-up to see trends.
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-zinc-50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full" />
                <span className="text-xs font-medium text-zinc-500">Mental Stress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full" />
                <span className="text-xs font-medium text-zinc-500">Physical Severity</span>
              </div>
            </div>
          </div>

          <div className="bg-[#151619] p-8 rounded-[2rem] text-white overflow-hidden relative">
            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Need Immediate Help?</h3>
                <p className="text-zinc-400 max-w-md">Our AI is standing by to guide you through any health emergency or mental distress.</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-emerald-500 text-zinc-900 font-bold rounded-2xl hover:bg-emerald-400 transition-colors">
                  Start AI Triage
                </button>
                <button className="px-8 py-3 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-colors">
                  Contact Emergency
                </button>
              </div>
            </div>
            <Activity className="absolute -right-12 -bottom-12 text-white/5 w-64 h-64 rotate-12" />
          </div>
        </div>

        {/* Sidebar: Recent History */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-zinc-100 space-y-6">
            <h3 className="text-lg font-bold text-zinc-900">Recent Assessments</h3>
            <div className="space-y-4">
              {history.length > 0 ? history.map((h) => (
                <div key={h.id} className="flex items-start gap-4 p-4 hover:bg-zinc-50 rounded-2xl transition-colors group cursor-pointer">
                  <div className={clsx(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    h.riskLevel === "CRITICAL" ? "bg-red-50 text-red-500" :
                    h.riskLevel === "HIGH" ? "bg-orange-50 text-orange-500" : "bg-emerald-50 text-emerald-500"
                  )}>
                    {h.riskLevel === "LOW" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-zinc-900 truncate">{h.riskLevel} Risk Detected</p>
                    <p className="text-xs text-zinc-500">{new Date(h.timestamp).toLocaleString()}</p>
                  </div>
                  <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                </div>
              )) : (
                <p className="text-sm text-zinc-400 text-center py-8">No history found.</p>
              )}
            </div>
            <button className="w-full py-3 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
              View All History
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-zinc-100 space-y-6">
            <h3 className="text-lg font-bold text-zinc-900">AI Care Tips</h3>
            <div className="space-y-4">
              {[
                "Stay hydrated: Drink at least 3L of water today.",
                "Mindfulness: 5-minute breathing exercise recommended.",
                "Sleep hygiene: Avoid screens 1h before bed."
              ].map((tip, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <p className="text-sm text-zinc-600 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
