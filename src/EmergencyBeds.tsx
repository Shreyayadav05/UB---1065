import React, { useEffect, useState } from "react";

interface Bed {
  id: number;
  hospital: string;
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

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">
        Emergency Bed Availability
      </h1>

      <div className="grid grid-cols-3 gap-4">
        {beds.map((bed) => (
          <div
            key={bed.id}
            className="bg-black text-white p-4 rounded-xl shadow-lg"
          >
            <h2 className="text-lg font-semibold">{bed.hospital}</h2>
            <p className="text-green-400 text-xl">
              {bed.available} Beds Available
            </p>
            <p>Total: {bed.total}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyBeds;