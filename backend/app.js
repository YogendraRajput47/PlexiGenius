// src/app.js
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth"); // we'll add these routes next
const leadsRoutes = require("./routes/leads");
const employeesRoutes = require("./routes/employees");
const errorHandler = require("./middlewares/errorHandler");
const path = require("path");

const app = express();

// middlewares
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse form bodies
const allowedOrigins = [
  "http://localhost:5173",
  "https://plexi-genius.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// routes (placeholders for now - files will be added soon)
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/employees", employeesRoutes);

// global error handler
app.use(errorHandler);

module.exports = app;
