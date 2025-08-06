// src/components/admin/DashboardStatsCards.jsx
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

  useEffect(() => {
    // Replace with your actual API endpoint later
    axios.get('/api/admin/stats')
      .then((res) => setStats(res.data))
      .catch((err) => console.error('Error fetching stats:', err));
  }, []);

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
        <p>₹{stats.todaysSales}</p>
      </div>

      <div className="stat-card">
        <h3>Low Balance</h3>
        <p>{stats.lowBalanceCount}</p>
      </div>
    </div>
  );
};

export default DashboardStatsCards;
