import React, { useState } from 'react';
import UsersList from './ManageUsers';
import AddUsers from './adduser';
import AddVehicle from './addvehicle';
import Locations from './location';
import VehicleList from './vehiclelist';
import AddParcel from './AddParcel';
import Parcel from './parcel';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('users');

  const renderSection = () => {
    switch (activeSection) {
      case 'users':
        return <UsersList />;
      case 'add_users':
        return <AddUsers />;
      case 'addvehicles':
        return <AddVehicle />;
      case 'vehicles':
        return <VehicleList />;
      case 'locations':
        return <Locations />;
      case 'addParcels':
        return <AddParcel />;
      case 'Parcels':
        return <Parcel />;
      default:
        return <UsersList />;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="sidebar">
        <h2 className="sidebar-heading">Admin Dashboard</h2>
        <button onClick={() => setActiveSection('addParcels')} className="sidebar-btn">CREATE PARCEL</button>
        <button onClick={() => setActiveSection('Parcels')} className="sidebar-btn">Parcels</button>
        <button onClick={() => setActiveSection('add_users')} className="sidebar-btn">Add Users</button>
        <button onClick={() => setActiveSection('users')} className="sidebar-btn">All Users</button>
        <button onClick={() => setActiveSection('locations')} className="sidebar-btn">Locations</button>
        <button onClick={() => setActiveSection('addvehicles')} className="sidebar-btn">Add Vehicles</button>
        <button onClick={() => setActiveSection('vehicles')} className="sidebar-btn">Vehicles</button>
      </div>
      <div className="content">
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminDashboard;
