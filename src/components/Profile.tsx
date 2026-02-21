import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, Mail, Phone, Calendar, Droplets, Save, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState({
    id: "user_123",
    name: "John Doe",
    email: "john@example.com",
    age: 28,
    bloodGroup: "O+",
    phone: "+1 555-0199"
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/users/user_123")
      .then(res => res.json())
      .then(data => {
        if (data.email) setUser(data);
      });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      alert("Profile updated successfully!");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-zinc-900">Your Profile</h2>
          <p className="text-zinc-500">Manage your personal and medical information.</p>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-zinc-100 space-y-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-4xl font-bold border-2 border-emerald-500/20">
              {user.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-md border border-zinc-100 text-zinc-400 group-hover:text-emerald-500 transition-colors cursor-pointer">
              <User size={16} />
            </div>
          </div>
          <div className="text-center md:text-left space-y-1">
            <h3 className="text-2xl font-bold text-zinc-900">{user.name}</h3>
            <p className="text-zinc-500 font-medium">Patient ID: #8821</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                value={user.name}
                onChange={e => setUser({...user, name: e.target.value})}
                className="w-full pl-12 pr-6 py-4 bg-zinc-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="email" 
                value={user.email}
                onChange={e => setUser({...user, email: e.target.value})}
                className="w-full pl-12 pr-6 py-4 bg-zinc-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                value={user.phone}
                onChange={e => setUser({...user, phone: e.target.value})}
                className="w-full pl-12 pr-6 py-4 bg-zinc-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Age</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="number" 
                  value={user.age}
                  onChange={e => setUser({...user, age: parseInt(e.target.value)})}
                  className="w-full pl-12 pr-6 py-4 bg-zinc-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Blood Group</label>
              <div className="relative">
                <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="text" 
                  value={user.bloodGroup}
                  onChange={e => setUser({...user, bloodGroup: e.target.value})}
                  className="w-full pl-12 pr-6 py-4 bg-zinc-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-50 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-3 px-12 py-4 bg-emerald-500 text-zinc-900 font-bold rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
