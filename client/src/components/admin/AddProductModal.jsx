import React, { useState } from 'react';
import '../../css/inventory.css'; // Ensure path is correct

const AddProductModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    category: 'Stationary',
    quantity: '',
    price: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.product_name || !formData.category || !formData.quantity || !formData.price) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      const response =  await fetch('http://localhost:5000/api/inventory', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        alert('Product added successfully!');
        onClose();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (err) {
      console.error('Add product error:', err);
      alert('Something went wrong');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add New Product</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>Item Name:</label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            required
          />

          <label>Category:</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Stationary">Stationary</option>
            <option value="Food">Food</option>
            <option value="Electronics">Electronics</option>
            <option value="Services">Services</option>
          </select>

          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <label>Price (₹):</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <label>Description (optional):</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />

          <div className="modal-buttons">
            <button type="submit" className="action-button submit">Add Product</button>
            <button type="button" className="action-button cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
