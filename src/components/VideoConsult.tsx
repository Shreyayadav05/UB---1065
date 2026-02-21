import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  Users,
  Settings,
  Shield,
  Activity,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VideoConsult() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCallActive, setIsCallActive] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: !isVideoOff, 
          audio: !isMuted 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }

    if (isCallActive) {
      setupCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCallActive, isVideoOff, isMuted]);

  if (!isCallActive) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-400">
            <VideoOff size={40} />
          </div>
          <h3 className="text-2xl font-bold text-zinc-900">Consultation Ended</h3>
          <p className="text-zinc-500">Your summary and prescription will be available in the dashboard.</p>
          <button 
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-[#151619] text-white rounded-2xl font-bold"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6"
    >
      {/* Main Video Area */}
      <div className="flex-1 relative bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* Doctor Video (Simulated) */}
        <img 
          src="https://picsum.photos/seed/doctor/1280/720" 
          className="w-full h-full object-cover opacity-60"
          alt="Doctor"
          referrerPolicy="no-referrer"
        />
        
        {/* User Video (Live Camera) */}
        <div className="absolute top-8 right-8 w-64 h-44 bg-zinc-800 rounded-3xl border-2 border-white/10 overflow-hidden shadow-2xl z-10">
          {!isVideoOff ? (
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500">
              <VideoOff size={32} />
            </div>
          )}
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[10px] text-white font-bold uppercase tracking-widest">
            Live Feed
          </div>
        </div>

        {/* Call Info Overlay */}
        <div className="absolute top-8 left-8 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 bg-black/50 backdrop-blur-md text-white rounded-2xl border border-white/10 hover:bg-black/70 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-white tracking-widest">LIVE</span>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-4 bg-black/50 backdrop-blur-xl rounded-[2.5rem] border border-white/10">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={clsx(
              "p-4 rounded-2xl transition-all",
              isMuted ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <button 
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={clsx(
              "p-4 rounded-2xl transition-all",
              isVideoOff ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
          </button>
          <button className="p-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all">
            <MessageSquare size={24} />
          </button>
          <div className="w-px h-8 bg-white/10 mx-2" />
          <button 
            onClick={() => setIsCallActive(false)}
            className="p-4 bg-red-600 text-white rounded-2xl hover:bg-red-500 transition-all shadow-lg shadow-red-600/20"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>

      {/* Sidebar Info */}
      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-zinc-100 space-y-6">
          <div className="flex items-center gap-4">
            <img 
              src="https://picsum.photos/seed/doc-avatar/100/100" 
              className="w-16 h-16 rounded-2xl object-cover"
              alt="Avatar"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="font-bold text-zinc-900">Dr. Sarah Chen</h4>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Cardiologist</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-zinc-50 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <Activity size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Patient Risk Level</span>
              </div>
              <p className="text-lg font-bold text-orange-500">HIGH RISK</p>
            </div>
            
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Consultation Notes</h5>
              <div className="space-y-2">
                {["Reported chest tightness", "Anxiety levels elevated", "History of hypertension"].map((note, i) => (
                  <div key={i} className="flex gap-2 text-sm text-zinc-600">
                    <div className="w-1 h-1 rounded-full bg-zinc-300 mt-2 shrink-0" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-zinc-100 space-y-4">
          <h4 className="font-bold text-zinc-900">Quick Tools</h4>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-zinc-50 rounded-2xl flex flex-col items-center gap-2 hover:bg-zinc-100 transition-colors">
              <Users size={20} className="text-zinc-400" />
              <span className="text-[10px] font-bold text-zinc-600 uppercase">Invite</span>
            </button>
            <button className="p-4 bg-zinc-50 rounded-2xl flex flex-col items-center gap-2 hover:bg-zinc-100 transition-colors">
              <Settings size={20} className="text-zinc-400" />
              <span className="text-[10px] font-bold text-zinc-600 uppercase">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
