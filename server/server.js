const express = require("express");
const cors = require("cors");

const app = express();

// Routes
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/student");
const inventoryRoutes = require("./routes/inventory");
const transactionRouter = require("./routes/transaction");
const reportRoutes = require("./routes/reports");

// CORS (production-safe)
app.use(cors({
  origin: "*",
  credentials: true
}));


app.use(express.json());

// API routes
app.use("/api", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/transactions", transactionRouter);
app.use("/api/reports", reportRoutes);

// ✅ IMPORTANT: export app (NO app.listen)
module.exports = app;
