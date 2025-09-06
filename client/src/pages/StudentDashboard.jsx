import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../css/StudentDashboard.css";

const StudentDashboard = () => {
  const location = useLocation();
  const { userData } = location.state || {};
  const email = userData?.data?.email;

  const [student, setStudent] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (email) {
      const fetchStudent = async () => {
        try {
          // Fetch student details
          const res = await axios.get(
            `http://localhost:5000/api/student/email/${email}`
          );
          setStudent(res.data);

          // Fetch transactions using student id
          if (res.data?.id) {
            const txRes = await axios.get(
              `http://localhost:5000/api/student/transactions/${res.data.id}`
            );
            setTransactions(txRes.data);
          }
        } catch (err) {
          console.error("Error fetching student details:", err);
          setError("Failed to fetch student details");
        } finally {
          setLoading(false);
        }
      };

      fetchStudent();
    } else {
      setError("No email provided. Please login again.");
      setLoading(false);
    }
  }, [email]);

  if (loading) return <p className="loading">Loading student details...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Student Dashboard</h1>

      {student ? (
        <div className="dashboard-card">
          {/* Balance Section */}
          <div className="balance-box">
            <h2>Current Balance</h2>
            <p>₹{student.store_amount}</p>
          </div>

          {/* Student Info */}
          <div className="student-info">
            <div><strong>Name:</strong> {student.full_name}</div>
            <div><strong>Email:</strong> {student.email}</div>
            <div><strong>DOB:</strong> {student.dob}</div>
            <div><strong>Gender:</strong> {student.gender}</div>
            <div><strong>Phone:</strong> {student.phone_number}</div>
            <div><strong>Admission No:</strong> {student.admission_number}</div>
            <div><strong>Branch:</strong> {student.branch}</div>
            <div><strong>Year:</strong> {student.year}</div>
            <div><strong>Course Type:</strong> {student.course_type}</div>
            <div><strong>Store Number:</strong> {student.store_number}</div>
          </div>

          {/* Transaction History */}
          <div className="transaction-history">
            <h2>Transaction History</h2>
            {transactions.length > 0 ? (
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr key={index}>
                      <td>{new Date(tx.transaction_date).toLocaleString()}</td>
                      <td>{tx.product_name}</td>
                      <td>{tx.category}</td>
                      <td>{tx.quantity}</td>
                      <td>₹{tx.price}</td>
                      <td>₹{tx.total_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No transactions found.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="no-data">No student data found.</p>
      )}
    </div>
  );
};

export default StudentDashboard;
