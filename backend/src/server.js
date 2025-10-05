require("dotenv").config();
const express = require("express");
const cors = require("cors"); //อนุญาตให้โดเมนอื่น สามารถเรียกapi เข้ามาได้ เช่นเวลา frontend เรียก
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT;
console.log(PORT);
app.listen(PORT, () => {
  console.log("server runninggg");
});
