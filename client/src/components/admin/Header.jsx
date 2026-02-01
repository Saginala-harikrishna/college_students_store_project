import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../css/Header.css';

const Header = () => {
  return (
    <header className="admin-header">
      <div className="logo">
        <span role="img" aria-label="canteen"></span> Smart Store Management System
      </div>

      <nav className="nav-links">
        <NavLink to="/admin/dashboard" activeclassname="active">Dashboard</NavLink>
        <NavLink to="/admin/billing" activeclassname="active">Billing</NavLink>
        <NavLink to="/admin/inventory" activeclassname="active">Inventory</NavLink>
        {/* <NavLink to="/admin/transactions" activeclassname="active">Transactions</NavLink> */}
        <NavLink to="/" activeclassname="active" className="logout-link">Logout</NavLink>
      </nav>
    </header>
  );
};

export default Header;
