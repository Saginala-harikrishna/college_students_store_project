const express = require('express');
const router = express.Router();
const db = require('../db'); // This must be a proper MySQL connection or pool from `mysql2/promise`

// POST /api/inventory - Add new inventory item
router.post('/', async (req, res) => {
  const { product_name, category, quantity, price, description } = req.body;

  const allowedCategories = ['Stationary', 'Food', 'Electronics', 'Services'];
  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  try {
    const query = `
      INSERT INTO inventory_items (product_name, category, quantity, price, description)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      product_name,
      category,
      quantity,
      price,
      description
    ]);
    res.status(200).json({
      message: 'Item added successfully',
      insertedId: result.insertId
    });
  } catch (err) {
    console.error('DB Error while inserting item:', err);
    res.status(500).json({ error: 'Database error occurred' });
  }
});



router.get("/items", async (req, res) => {
  try {
    // Select all columns, but alias product_name as name for frontend compatibility
    const [rows] = await db.query(`
      SELECT 
        id,
        product_name AS name,
        category,
        quantity,
        price,
        description,
        date_added
      FROM inventory_items
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    res.status(500).json({ error: "Failed to fetch inventory items" });
  }
});

// PUT /api/inventory/update/:id - Update item
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { product_name, category, quantity, price, description } = req.body;

  // Input validation
  if (
    !id || !product_name || !category || quantity === undefined || price === undefined
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `
      UPDATE inventory_items
      SET product_name = ?, category = ?, quantity = ?, price = ?, description = ?
      WHERE id = ?
    `;
   const { product_name, category, quantity, price, description } = req.body;

// Replace undefined with null
const safeDescription = description ?? null;

await db.execute(query, [
  product_name,
  category,
  quantity,
  price,
  safeDescription,  
  id
]);

    res.status(200).json({ message: 'Item updated successfully' });
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});


// DELETE a product by ID
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute("DELETE FROM  inventory_items WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});




router.get("/student/:id/balance", async (req, res) => {
  const sql = "SELECT store_amount AS balance FROM student_accounts WHERE id = ?";
  try {
    const [results] = await db.query(sql, [req.params.id]);
    // results is an array of rows
    res.json({ balance: results[0]?.balance || 0 });
  } catch (err) {
    console.error("Error fetching balance:", err);
    res.status(500).json({ error: err.message || err });
  }
});

// Update student balance
router.put("/student/:id/balance", async (req, res) => {
  const { newBalance } = req.body;
  const sql = "UPDATE student_accounts SET store_amount = ? WHERE id = ?";
  try {
    const [result] = await db.query(sql, [newBalance, req.params.id]);
    // You can check result.affectedRows if needed
    res.json({ message: "Balance updated" });
  } catch (err) {
    console.error("Error updating balance:", err);
    res.status(500).json({ error: err.message || err });
  }
});



module.exports = router;
