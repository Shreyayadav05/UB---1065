import express from "express";
import cors from "cors";

const app = express(); // ✅ FIRST define app

app.use(cors());
app.use(express.json());

// ✅ root route
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// ✅ beds API
app.get("/beds", (req, res) => {
  res.json([
    { id: 1, hospital: "Emergency Care Plus", location: "789 Urgent Way", available: 12, total: 20 },
    { id: 2, hospital: "City General Hospital", location: "123 Medical Dr", available: 5, total: 15 },
    { id: 3, hospital: "St. Mary Medical Center", location: "456 Health Ave", available: 0, total: 10 }
  ]);
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});