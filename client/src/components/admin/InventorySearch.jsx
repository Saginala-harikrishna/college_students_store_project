import React, { useState, useEffect } from "react";

function InventorySearch({ onAddToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/inventory/items");
        if (!res.ok) throw new Error("Failed to fetch inventory");
        const data = await res.json();
       
        setInventory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const filteredItems = inventory.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === "" || item.category === category)
  );

  if (loading) return <p>Loading inventory...</p>;
  if (error) return <p>Error: {error}</p>;

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
        <option value="Stationary">Stationary</option>
        <option value="Services">Services</option>
        <option value="Electronics">Electronics</option>
        <option value="Food">Food</option>
        
      </select>

      {filteredItems.length > 0 ? (
        filteredItems.map((item) => (
          <div key={item.id} className="inventory-item">
            <span>
              {item.name} - ₹{item.price}
            </span>
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
