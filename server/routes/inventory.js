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

// GET /api/inventory/list - Fetch all inventory
router.get('/list', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM inventory_items ORDER BY date_added DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching inventory:', err);
    res.status(500).json({ error: 'Failed to fetch inventory items' });
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



module.exports = router;
