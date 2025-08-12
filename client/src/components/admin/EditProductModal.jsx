import React, { useState } from 'react';
import '../../css/modal.css';

const EditProductModal = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState({
  id: item.id,
  product_name: item.name,
  category: item.category,
  quantity: item.quantity,
  price: item.price,
  description: item.description || ''   // ✅ add this
});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // parent will handle API call and table refresh
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Edit Product</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Product Name:
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Category:
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Price:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </label>
          <label>
  Description:
  <input
    type="text"
    name="description"
    value={formData.description || ''}
    onChange={handleChange}
  />
</label>


          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
