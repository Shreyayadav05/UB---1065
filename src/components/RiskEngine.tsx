import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Activity, Brain, ShieldAlert, CheckCircle2, Loader2, ArrowLeft, AlertTriangle, ArrowRight } from "lucide-react";
import { analyzeHealthRisk } from "../services/geminiService";
import { AssessmentResult, RiskLevel, CareRoute } from "../types";

export default function RiskEngine() {
  const [mentalInput, setMentalInput] = useState("");
  const [physicalInput, setPhysicalInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!mentalInput || !physicalInput) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeHealthRisk(mentalInput, physicalInput);
      setResult(data);
      // Save to DB
      await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user_123",
          ...data,
          recommendation: data.recommendations.join(", ")
        })
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Health Risk Orchestrator</h2>
          <p className="text-zinc-500">Describe your symptoms and emotional state for an autonomous care routing decision.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
          <AlertTriangle size={20} />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {!result ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 space-y-6">
            <div className="flex items-center gap-3 text-emerald-600">
              <Brain size={24} />
              <h3 className="font-semibold text-lg">Mental & Emotional State</h3>
            </div>
            <textarea
              value={mentalInput}
              onChange={(e) => setMentalInput(e.target.value)}
              placeholder="How are you feeling emotionally? Any stress, anxiety, or mood changes?"
              className="w-full h-40 p-4 bg-zinc-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 resize-none transition-all"
            />
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 space-y-6">
            <div className="flex items-center gap-3 text-blue-600">
              <Activity size={24} />
              <h3 className="font-semibold text-lg">Physical Symptoms</h3>
            </div>
            <textarea
              value={physicalInput}
              onChange={(e) => setPhysicalInput(e.target.value)}
              placeholder="Describe any physical symptoms, pain, or discomfort you are experiencing."
              className="w-full h-40 p-4 bg-zinc-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
            />
          </div>

          <div className="md:col-span-2 flex justify-center pt-4">
            <button
              onClick={handleAnalyze}
              disabled={loading || !mentalInput || !physicalInput}
              className="group relative flex items-center gap-3 px-12 py-4 bg-[#151619] text-white rounded-2xl font-semibold hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Analyze Health Risk</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2rem] shadow-xl border border-zinc-100 overflow-hidden"
        >
          <div className={clsx(
            "p-8 text-white flex items-center justify-between",
            result.level === RiskLevel.CRITICAL ? "bg-red-600" :
            result.level === RiskLevel.HIGH ? "bg-orange-500" :
            result.level === RiskLevel.MEDIUM ? "bg-amber-500" : "bg-emerald-500"
          )}>
            <div className="space-y-1">
              <p className="text-sm font-medium opacity-80 uppercase tracking-widest">Risk Assessment Complete</p>
              <h3 className="text-4xl font-bold">{result.level} RISK</h3>
            </div>
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
              <ShieldAlert size={40} />
            </div>
          </div>

          <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">AI Reasoning</h4>
                <p className="text-xl text-zinc-800 leading-relaxed font-medium">{result.reasoning}</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Recommended Actions</h4>
                <div className="grid grid-cols-1 gap-3">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                      <span className="text-zinc-700 font-medium">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="p-8 bg-zinc-900 rounded-3xl text-white space-y-6">
                <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Orchestration Route</h4>
                <div className="space-y-2">
                  <p className="text-xs text-zinc-400">The system has routed you to:</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {result.route.replace("_", " ")}
                  </p>
                </div>
                <button 
                  onClick={() => window.location.href = result.route === CareRoute.EMERGENCY ? "tel:911" : result.route === CareRoute.TELECONSULTATION ? "/video" : "/chat"}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-bold rounded-2xl transition-colors"
                >
                  Proceed to Care
                </button>
              </div>

              <button 
                onClick={() => setResult(null)}
                className="w-full py-4 text-zinc-500 hover:text-zinc-800 font-medium transition-colors"
              >
                Start New Assessment
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
