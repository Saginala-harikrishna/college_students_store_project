import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdminLayout from './components/admin/AdminLayout';
import Inventory from './pages/admin/Inventory';
import BillingPage from './pages/admin/BillingPage';



const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />

        {/* Admin Layout Routes */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
           <Route path="inventory" element={<Inventory />} />
                <Route path="billing" element={<BillingPage />} />
          {/* Later: Add billing, inventory, transactions here */}
        </Route>
      </Routes>
            
    </Router>
    
  );
};

export default App;
