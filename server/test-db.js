const pool = require("./db");

async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("✅ Connected to Aiven MySQL successfully");
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

testConnection();
