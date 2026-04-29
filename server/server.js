const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const { router: realtimeRouter, realtime } = require("./utils/realtime");

dotenv.config();
connectDB();

const app = express();
app.set("realtime", realtime);

// CORS setup
const configuredOrigins = [
  "http://localhost:5173",
  "https://urbannease.netlify.app",
  "https://urbannease.vercel.app",
  "https://urbanease.vercel.app",
  ...(process.env.CLIENT_URL || process.env.CLIENT_URLS || process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

const normalizeOrigin = (origin) => origin.replace(/\/$/, "");
const allowedOrigins = new Set(configuredOrigins.map(normalizeOrigin));
const isAllowedOrigin = (origin) => {
  const normalizedOrigin = normalizeOrigin(origin);

  return (
    allowedOrigins.has(normalizedOrigin) ||
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(normalizedOrigin)
  );
};

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests from Postman, mobile apps, or same-origin requests
    if (!origin) return callback(null, true);

    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test root route
app.get("/", (req, res) => {
  res.send("UrbanEase backend is running successfully 🚀");
});

// API routes
app.use("/api/realtime", realtimeRouter);
app.use("/api/auth", require("./routes/auth"));
app.use("/auth", require("./routes/auth"));
app.use("/api/services", require("./routes/services"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/members", require("./routes/members"));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "UrbanEase API is running 🚀" });
});

// 404 API route handler
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ success: false, message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
