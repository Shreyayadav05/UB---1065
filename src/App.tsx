import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  MessageSquare, 
  Video, 
  Calendar, 
  LayoutDashboard, 
  ShieldAlert,
  HeartPulse,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  Pill,
  Bed
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Pages
import Dashboard from "./components/Dashboard";
import RiskEngine from "./components/RiskEngine";
import Chat from "./components/Chat";
import VideoConsult from "./components/VideoConsult";
import Appointments from "./components/Appointments";
import Profile from "./components/Profile";
import Medications from "./components/Medications";
import EmergencyBeds from "./components/EmergencyBeds";
import Login from "./components/Login";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function Sidebar({ onLogout }: { onLogout: () => void }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/assess", label: "Risk Engine", icon: Activity },
    { path: "/chat", label: "AI Assistant", icon: MessageSquare },
    { path: "/video", label: "Tele-Consult", icon: Video },
    { path: "/appointments", label: "Appointments", icon: Calendar },
    { path: "/meds", label: "Medications", icon: Pill },
    { path: "/beds", label: "Emergency Beds", icon: Bed },
    { path: "/profile", label: "Profile", icon: UserIcon },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md lg:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-[#151619] text-white transition-transform duration-300 ease-in-out transform lg:translate-x-0",
        !isOpen && "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-emerald-500 rounded-xl">
              <HeartPulse className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">CareFusion <span className="text-emerald-500">AI</span></h1>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive 
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon size={18} className={cn(isActive ? "text-emerald-500" : "group-hover:text-white")} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <Link to="/profile" className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl mb-4 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-zinc-500 truncate">Patient ID: #8821</p>
              </div>
            </Link>
            <button 
              onClick={onLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-zinc-400 hover:text-white transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuth") === "true";
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuth", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuth");
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#F8F9FA] flex">
        <Sidebar onLogout={handleLogout} />
        <main className="flex-1 lg:ml-64 p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assess" element={<RiskEngine />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/video" element={<VideoConsult />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/meds" element={<Medications />} />
              <Route path="/beds" element={<EmergencyBeds />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}
