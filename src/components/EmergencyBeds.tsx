import React, { useEffect, useState } from "react";

interface Bed {
  id: number;
  hospital: string;
  location: string;
  available: number;
  total: number;
}

const EmergencyBeds = () => {
  const [beds, setBeds] = useState<Bed[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/beds")
      .then((res) => res.json())
      .then((data) => setBeds(data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ DISPATCH FUNCTION (MAIN LOGIC)
  const handleDispatch = (bed: Bed) => {
    const phone1 = "108"; // Ambulance
    const phone2 = "9876543210"; // Family / Emergency contact

    if (bed.available > 0) {
      alert(
        `🚑 Dispatching Ambulance to ${bed.hospital}\n\nCalling:\n1. Ambulance: ${phone1}\n2. Emergency Contact: ${phone2}`
      );

      // Open dialer (works on mobile)
      window.open(`tel:${phone1}`);

      setTimeout(() => {
        window.open(`tel:${phone2}`);
      }, 2000);
    } else {
      alert(`❌ No beds available at ${bed.hospital}`);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Emergency Bed Availability
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {beds.map((bed) => (
          <div
            key={bed.id}
            className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between"
          >
            {/* Hospital Info */}
            <div>
              <h2 className="text-xl font-semibold">
                {bed.hospital}
              </h2>
              <p className="text-gray-500">{bed.location}</p>
            </div>

            {/* Bed Count */}
            <div className="bg-black text-green-400 text-center py-4 rounded-xl my-4">
              <p className="text-sm">AVAILABLE BEDS</p>
              <p className="text-2xl font-bold">
                {bed.available}
              </p>
            </div>

            {/* ✅ DISPATCH BUTTON */}
            <button
              onClick={() => handleDispatch(bed)}
              className="bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition"
            >
              Dispatch Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyBeds;