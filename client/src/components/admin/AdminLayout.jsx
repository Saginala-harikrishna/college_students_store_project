// src/components/admin/AdminLayout.jsx
import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Header />
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
