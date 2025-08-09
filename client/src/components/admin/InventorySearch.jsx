import React, { useState } from "react";

const dummyInventory = [
  { id: 1, name: "Notebook", category: "Stationery", price: 50 },
  { id: 2, name: "Pen", category: "Stationery", price: 10 },
  { id: 3, name: "Water Bottle", category: "Accessories", price: 120 },
  { id: 4, name: "Calculator", category: "Electronics", price: 500 },
];

function InventorySearch({ onAddToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filteredItems = dummyInventory.filter(item => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || item.category === category)
    );
  });

  return (
    <div className="card">
      <h3>Inventory</h3>
      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px", padding: "6px", width: "100%" }}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ marginBottom: "15px", padding: "6px", width: "100%" }}
      >
        <option value="">All Categories</option>
        <option value="Stationery">Stationery</option>
        <option value="Accessories">Accessories</option>
        <option value="Electronics">Electronics</option>
      </select>

      {filteredItems.length > 0 ? (
        filteredItems.map(item => (
          <div key={item.id} className="inventory-item">
            <span>{item.name} - ₹{item.price}</span>
            <button onClick={() => onAddToCart(item)}>Add</button>
          </div>
        ))
      ) : (
        <p>No items found</p>
      )}
    </div>
  );
}

export default InventorySearch;
