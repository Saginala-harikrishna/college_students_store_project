import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../css/TodayTransactionsTable.css'; // ✅ Import CSS

const TodayTransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/transactions/today");
        setTransactions(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions.");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <p className="loading">Loading transactions...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="transactions-container">
      <h2>Today's Transactions</h2>
      {transactions.length === 0 ? (
        <p className="no-data">No transactions found for today.</p>
      ) : (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Store Number</th>
              <th>Transaction ID</th>
              
              <th>Product</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => (
              <tr key={index}>
                <td>{txn.full_name}</td>
                <td>{txn.store_number}</td>
                <td>{txn.transaction_id}</td>
                
                <td>{txn.product_name}</td>
                <td>{txn.category}</td>
                <td>{txn.quantity}</td>
                <td>₹{txn.price}</td>
                <td>₹{txn.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TodayTransactionsTable;
