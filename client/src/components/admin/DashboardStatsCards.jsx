import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/DashboardStatsCards.css';

const DashboardStatsCards = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalBalance: 0,
    todaysSales: 0,
    lowBalanceCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/student/dashboard-stats');

        const data = response.data;

        // ✅ Map backend keys to frontend keys
        setStats({
          totalStudents: data.total_students,
          totalBalance: data.total_spent,
          todaysSales: data.total_transactions,
          lowBalanceCount: data.low_balance_students
        });

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Could not load dashboard stats.');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading dashboard stats...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="stats-container">
      <div className="stat-card">
        <h3>Total Students</h3>
        <p>{stats.totalStudents}</p>
      </div>

      <div className="stat-card">
        <h3>Total Balance</h3>
        <p>₹{stats.totalBalance}</p>
      </div>

      <div className="stat-card">
        <h3>Today's Sales</h3>
        <p>{stats.todaysSales}</p>
      </div>

      <div className="stat-card">
        <h3>Low Balance</h3>
        <p>{stats.lowBalanceCount}</p>
      </div>
    </div>
  );
};

export default DashboardStatsCards;
