const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/auth");
const studentRoutes = require('./routes/student');
const inventoryRoutes = require('./routes/inventory');
const transactionRouter = require("./routes/transaction");




app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api", authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use("/api/transactions", transactionRouter);



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
