const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/auth");
const studentRoutes = require('./routes/student');
const inventoryRoutes = require('./routes/inventory');
const transactionRouter = require("./routes/transaction");
const reportRoutes = require("./routes/reports");




app.use(cors({
  origin: "http://localhost:5173",
  credentials: true  
}))

app.use(express.json());

app.use("/api", authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use("/api/transactions", transactionRouter);
app.use("/api/reports", reportRoutes);



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
