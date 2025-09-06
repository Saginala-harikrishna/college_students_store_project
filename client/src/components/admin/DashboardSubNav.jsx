import React, { useState } from 'react';
import '../../css/DashboardSubNav.css';
import StudentListLowBalance from './StudentListLowBalance';
 import TodayTransactionsTable from './TodayTransactionsTable';
 import ReportSection from './ReportSection';

const DashboardSubNav = () => {
  const [activeTab, setActiveTab] = useState('Students');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'Students':
        return <StudentListLowBalance />;
      case 'Transactions':
        return <TodayTransactionsTable />;
      case 'Reports':
        return <ReportSection />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-subnav">
      <div className="subnav-buttons">
        {['Students', 'Transactions', 'Reports'].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="subnav-content">
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default DashboardSubNav;
