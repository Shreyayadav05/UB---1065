import { useState } from "react";
import { motion } from "motion/react";
import { 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Star, 
  MapPin, 
  ChevronRight,
  CheckCircle2,
  Filter,
  Loader2
} from "lucide-react";

const DOCTORS = [
  { id: 1, name: "Dr. Sarah Chen", specialty: "Cardiologist", rating: 4.9, reviews: 124, image: "https://picsum.photos/seed/doc1/200/200", availability: "Today" },
  { id: 2, name: "Dr. Marcus Thorne", specialty: "Neurologist", rating: 4.8, reviews: 89, image: "https://picsum.photos/seed/doc2/200/200", availability: "Tomorrow" },
  { id: 3, name: "Dr. Elena Rodriguez", specialty: "Psychiatrist", rating: 5.0, reviews: 210, image: "https://picsum.photos/seed/doc3/200/200", availability: "Today" },
  { id: 4, name: "Dr. James Wilson", specialty: "General Physician", rating: 4.7, reviews: 156, image: "https://picsum.photos/seed/doc4/200/200", availability: "In 2 days" },
];

export default function Appointments() {
  const [selectedDoc, setSelectedDoc] = useState<typeof DOCTORS[0] | null>(null);
  const [booked, setBooked] = useState(false);
  const [paying, setPaying] = useState(false);

  const handleBook = async () => {
    if (!selectedDoc) return;
    setPaying(true);
    // Simulate payment
    setTimeout(async () => {
      try {
        await fetch("/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientName: "John Doe",
            doctorName: selectedDoc.name,
            specialty: selectedDoc.specialty,
            date: "2024-05-20",
            time: "10:00 AM"
          })
        });
        setBooked(true);
        setPaying(false);
        setTimeout(() => {
          setBooked(false);
          setSelectedDoc(null);
        }, 3000);
      } catch (e) {
        console.error(e);
        setPaying(false);
      }
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Medical Consultations</h2>
          <p className="text-zinc-500">Book a session with our top-rated specialists.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search specialty..." 
              className="pl-12 pr-6 py-3 bg-white border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm w-full md:w-64"
            />
          </div>
          <button className="p-3 bg-white border border-zinc-200 rounded-2xl text-zinc-600 hover:bg-zinc-50 transition-colors shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DOCTORS.map((doc) => (
              <motion.div 
                key={doc.id}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedDoc(doc)}
                className={clsx(
                  "p-6 bg-white rounded-[2rem] shadow-sm border transition-all cursor-pointer group",
                  selectedDoc?.id === doc.id ? "border-emerald-500 ring-4 ring-emerald-500/5" : "border-zinc-100 hover:border-emerald-200"
                )}
              >
                <div className="flex items-start gap-4">
                  <img 
                    src={doc.image} 
                    className="w-20 h-20 rounded-2xl object-cover"
                    alt={doc.name}
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-zinc-900 truncate">{doc.name}</h4>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-bold">{doc.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-500 font-medium mb-3">{doc.specialty}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                        {doc.availability}
                      </span>
                      <span className="px-2 py-1 bg-zinc-50 text-zinc-500 text-[10px] font-bold rounded-md uppercase tracking-wider">
                        Video Call
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-zinc-100 sticky top-8">
            {selectedDoc ? (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-zinc-900">Booking Summary</h3>
                  <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden border-4 border-emerald-500/10">
                    <img src={selectedDoc.image} className="w-full h-full object-cover" alt="Doc" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-zinc-900">{selectedDoc.name}</p>
                    <p className="text-sm text-zinc-500">{selectedDoc.specialty}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-emerald-500" size={20} />
                      <span className="text-sm font-medium text-zinc-700">May 20, 2024</span>
                    </div>
                    <ChevronRight size={16} className="text-zinc-300" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Clock className="text-emerald-500" size={20} />
                      <span className="text-sm font-medium text-zinc-700">10:00 AM</span>
                    </div>
                    <ChevronRight size={16} className="text-zinc-300" />
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">Consultation Fee</span>
                    <span className="font-bold text-zinc-900">$45.00</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">Service Fee</span>
                    <span className="font-bold text-zinc-900">$5.00</span>
                  </div>
                  <div className="h-px bg-zinc-100" />
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span className="text-zinc-900">Total</span>
                    <span className="text-emerald-600">$50.00</span>
                  </div>
                </div>

                <button 
                  onClick={handleBook}
                  disabled={booked || paying}
                  className={clsx(
                    "w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2",
                    booked ? "bg-emerald-500 text-white" : "bg-[#151619] text-white hover:bg-zinc-800"
                  )}
                >
                  {paying ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Processing Payment...</span>
                    </>
                  ) : booked ? (
                    <>
                      <CheckCircle2 size={20} />
                      <span>Booking Confirmed</span>
                    </>
                  ) : (
                    "Pay & Confirm Appointment"
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto text-zinc-300">
                  <User size={32} />
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-zinc-900">No Doctor Selected</p>
                  <p className="text-sm text-zinc-500">Select a specialist from the list to view their availability and book a session.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
