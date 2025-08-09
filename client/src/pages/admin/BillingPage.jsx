import React, { useState } from 'react';
import StudentSearch from '../../components/admin/StudentSearch';
import InventorySearch from '../../components/admin/InventorySearch';
import Cart from '../../components/admin/Cart';
import '../../css/billingPage.css';

const BillingPage = () => {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);

  const handleStudentFound = (studentData, errorMessage) => {
    if (studentData) {
      setStudent(studentData);
      setError('');
    } else {
      setStudent(null);
      setError(errorMessage);
    }
  };

  const handleAddToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
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
        <Cart cart={cart} onRemoveFromCart={handleRemoveFromCart} />
      </div>

      {/* RIGHT COLUMN */}
      <div className="right-column">
        <InventorySearch onAddToCart={handleAddToCart} />
      </div>
    </div>
  );
};

export default BillingPage;
