import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Pill, Clock, Plus, CheckCircle2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  taken: number;
}

export default function Medications() {
  const [meds, setMeds] = useState<Medication[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDosage, setNewDosage] = useState("");
  const [newTime, setNewTime] = useState("");
  const navigate = useNavigate();

  // ✅ Load dummy data (since your API not ready)
  useEffect(() => {
    setMeds([
      { id: 1, name: "Paracetamol", dosage: "500mg", time: "09:00", taken: 0 },
      { id: 2, name: "Vitamin C", dosage: "1000mg", time: "12:00", taken: 1 }
    ]);
  }, []);

  // ✅ SAVE FUNCTION (MAIN FIX)
  const handleSave = () => {
    if (!newName || !newDosage || !newTime) {
      alert("Please fill all fields ❌");
      return;
    }

    const newMed = {
      id: Date.now(),
      name: newName,
      dosage: newDosage,
      time: newTime,
      taken: 0
    };

    setMeds([...meds, newMed]);

    alert("Medication Saved Successfully ✅");

    // reset form
    setShowAdd(false);
    setNewName("");
    setNewDosage("");
    setNewTime("");
  };

  // ✅ Toggle taken
  const toggleTaken = (id: number, current: number) => {
    setMeds(
      meds.map((m) =>
        m.id === id ? { ...m, taken: current ? 0 : 1 } : m
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-zinc-100 rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-bold">Medicine Tracker</h2>
            <p className="text-zinc-500">
              Never miss a dose.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 rounded-2xl"
        >
          <Plus size={20} />
          Add Medicine
        </button>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {meds.map((med) => (
          <div
            key={med.id}
            className={`p-6 rounded-2xl ${
              med.taken ? "bg-green-100" : "bg-white shadow"
            }`}
          >
            <div className="flex justify-between">
              <div className="flex gap-3">
                <Pill />
                <div>
                  <h3>{med.name}</h3>
                  <p>{med.dosage}</p>
                </div>
              </div>

              <button
                onClick={() => toggleTaken(med.id, med.taken)}
              >
                <CheckCircle2
                  color={med.taken ? "green" : "gray"}
                />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <Clock size={16} />
              {med.time}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-2xl w-80 space-y-4">
            <h3 className="text-xl font-bold">
              Add Medication
            </h3>

            <input
              type="text"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <input
              type="text"
              placeholder="Dosage"
              value={newDosage}
              onChange={(e) => setNewDosage(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1"
              >
                Cancel
              </button>

              {/* ✅ SAVE BUTTON FIXED */}
              <button
                onClick={handleSave}
                className="flex-1 bg-green-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}