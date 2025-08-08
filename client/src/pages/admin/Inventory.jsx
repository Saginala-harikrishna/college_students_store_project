import React, { useState } from 'react';
import '../../css/inventory.css'; // Link to your CSS file
import ProductTable from '../../components/admin/ProductTable';
import AddProductModal from '../../components/admin/AddProductModal';

const Inventory = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleOpenModal = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h2>Inventory Management</h2>
        <button className="add-button" onClick={handleOpenModal}>
          Add New Item
        </button>
      </div>

   
      <ProductTable />

      {showAddModal && <AddProductModal onClose={handleCloseModal} />}
    </div>
  );
};

export default Inventory;
