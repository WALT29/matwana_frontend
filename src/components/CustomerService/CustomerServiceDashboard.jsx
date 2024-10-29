import React, { useState } from 'react';
import AddParcel from '../Admin/AddParcel';
import AddVehicle from '../Admin/addvehicle';
import VehiclesList from '../Admin/vehiclelist';
import Parcel from '../Admin/parcel';
import AddCustomer from './AddCustomer';
import ManageCustomers from './managerCustomers';


const CustomerService = () => {
  const [activeSection, setActiveSection] = useState('addParcel');

  const renderSection = () => {
    switch (activeSection) {
      case 'addParcel':
        return <AddParcel />;

      case 'parcel':
        return <Parcel />;
      
      case 'addCustomer':
        return <AddCustomer />;
      
      case 'manageCustomers':
        return <ManageCustomers />;

      case 'addVehicle':
        return <AddVehicle/>
      
      case 'vehicles':
        return <VehiclesList/>

      default:
        return <AddParcel />;

    }
  };

  return (
    <div className="customer-service-container">
      <div className="sidebar">
        <h2 className="sidebar-heading">Customer Service</h2>

        <button onClick={() => setActiveSection('addParcel')} className="sidebar-btn">
          Create Parcel
        </button>
        <button onClick={() => setActiveSection('parcel')} className="sidebar-btn">
          Parcels
        </button>
        <button onClick={() => setActiveSection('addCustomer')} className="sidebar-btn">
          Add Customer
        </button>
        <button onClick={() => setActiveSection('manageCustomers')} className="sidebar-btn">
          Customers
        </button>
        <button onClick={() => setActiveSection('addVehicle')} className="sidebar-btn">
          Add Vehicle
        </button>
        <button onClick={() => setActiveSection('vehicles')} className="sidebar-btn">
          Vehicle
        </button> 
      
      </div>

      <div className="content">
        {renderSection()}
      </div>
    </div>
  );
};

export default CustomerService;
