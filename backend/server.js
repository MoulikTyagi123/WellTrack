const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const ritualRoutes = require("./routes/ritualRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const sleepRoutes = require("./routes/sleepRoutes");
const mentalWellnessRoutes = require("./routes/mentalWellnessRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const passport = require("./config/passport");

const app = express();

// 🔒 SECURITY
app.use(helmet());

// ✅ CORS FIX (IMPORTANT)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend
      "https://wellness-tracker-frontend.vercel.app", // ⚠️ baad me replace karna apne real frontend URL se
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// 🚦 RATE LIMITER
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// BODY PARSER
app.use(express.json());

// PASSPORT
app.use(passport.initialize());

// DATABASE (⚠️ later Atlas use karna)
mongoose
  .connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/wellness-tracker",
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// SWAGGER
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ROUTES
app.use("/api/ritual", ritualRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/sleep", sleepRoutes);
app.use("/api/mental", mentalWellnessRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
