import React, { useEffect, useState } from 'react';
import '../../css/inventory.css';
import EditProductModal from './EditProductModal';
import axios from 'axios';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/inventory/items');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (item) => {
    setEditingItem(item);
  };

  const handleModalClose = () => {
    setEditingItem(null);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/inventory/delete/${id}`);
      alert("Product deleted!");
      fetchProducts(); // Refresh the table
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const handleSaveProduct = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/inventory/update/${updatedData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert('Product updated successfully!');
        setEditingItem(null); // close modal
        fetchProducts();       // refresh table
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="product-table-wrapper">
      <table className="product-table">
        <thead>
          <tr>
            <th>S.NO</th>
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
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{new Date(item.date_added).toLocaleDateString()}</td>
                <td>
                  <button className="action-button edit" onClick={() => handleEditClick(item)}>Edit</button>
                  <button className="action-button delete" onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editingItem && (
        <EditProductModal
          item={editingItem}
          onClose={handleModalClose}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

export default ProductTable;
