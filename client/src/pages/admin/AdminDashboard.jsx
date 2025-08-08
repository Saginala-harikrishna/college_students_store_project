import React from 'react';
import DashboardStatsCards from '../../components/admin/DashboardStatsCards';
import '../../css/AdminDashboard.css';
import DashboardSubNav from '../../components/admin/DashboardSubNav';




const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2> Admin DashBoard</h2>
      <DashboardStatsCards />
      <DashboardSubNav />
    </div>
  );
};

export default AdminDashboard;
