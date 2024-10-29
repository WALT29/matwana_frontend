import React, { useState } from 'react';
import CustomerParcel from './customerParcels';


const CustomerDashboard = () => {
  const [activeSection, setActiveSection] = useState('parcels');

  const renderSection = () => {
    switch (activeSection) {
      case 'customerParcels':
        return <CustomerParcel />;
      default:
        return <CustomerParcel />;
    }
  };

  return (
    <div className="customer-dashboard-container">
      <div className="sidebar">
        <h2 className="sidebar-heading">Customer Dashboard</h2>
        <button onClick={() => setActiveSection('customerParcels')} className="sidebar-btn">Parcels</button>
      </div>
      <div className="content">
        {renderSection()}
      </div>
    </div>
  );
};

export default CustomerDashboard;
