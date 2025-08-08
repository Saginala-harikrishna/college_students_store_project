import React, { useEffect, useState } from 'react';
import '../../css/inventory.css'; // Reuse same stylesheet

const ProductTable = () => {
  const [products, setProducts] = useState([]);

  // Fetch inventory from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/inventory/list')// adjust if using proxy
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching inventory:', err));
  }, []);

  return (
    <div className="product-table-wrapper">
      <table className="product-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Price (₹)</th>
            <th>Date Added</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>No items found</td>
            </tr>
          ) : (
            products.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.product_name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{new Date(item.date_added).toLocaleDateString()}</td>
                <td>
                  <button className="action-button edit">Edit</button>
                  <button className="action-button delete">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
