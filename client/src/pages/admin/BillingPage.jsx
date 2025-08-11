import React, { useState } from 'react';
import StudentSearch from '../../components/admin/StudentSearch';
import InventorySearch from '../../components/admin/InventorySearch';
import Cart from '../../components/admin/Cart';
import '../../css/billingPage.css';

const BillingPage = () => {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  

  const handleStudentFound = (studentData, errorMessage) => {
    if (studentData) {
      setStudent(studentData);
      setSelectedStudentId(studentData.id); // ✅ store real database ID
      setError('');
    } else {
      setStudent(null);
      setSelectedStudentId(null); // reset ID when not found
      setError(errorMessage);
    }
  };


  // Add to cart (called by InventorySearch via onAddToCart)
  const handleAddToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        // increment quantity if already in cart
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // add new with quantity 1
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Increase quantity of an item already in cart
  const handleIncreaseQuantity = (id) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  };

  // Decrease quantity: if reaches 0 remove item
  const handleDecreaseQuantity = (id) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;
      if (item.quantity <= 1) {
        // remove item completely
        return prev.filter(i => i.id !== id);
      }
      return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  // Remove entire product from cart
  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  // Clear cart (used after successful purchase)
  const handleClearCart = () => {
    setCart([]);
  };

  return (
    <div className="billing-grid">
      {/* LEFT COLUMN */}
      <div className="left-column">
        <StudentSearch onStudentFound={handleStudentFound} />
        {error && (
          <div className="student-not-found-message">
            <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>
          </div>
        )}
        {student && (
          <div className="student-details-card">
            <h3>Student Details</h3>
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Admission_Number:</strong> {student.admission_number}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Year:</strong> {student.year}</p>
            <p><strong>Department:</strong> {student.department}</p>
            <p><strong>Store Amount:</strong> ₹{student.store_amount}</p>
          </div>
        )}

      <Cart
    cart={cart}
       onIncrease={handleIncreaseQuantity}
       onDecrease={handleDecreaseQuantity}
       onRemoveFromCart={handleRemoveFromCart}
       onClearCart={handleClearCart}
       studentId={selectedStudentId} 
       studentEmail={student?.email}


    />

      </div>

      {/* RIGHT COLUMN */}
      <div className="right-column">
        <InventorySearch onAddToCart={handleAddToCart} />
      </div>
    </div>
  );
};

export default BillingPage;
