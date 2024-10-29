import React, { useState, useEffect } from 'react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import './parcel.css';

const Parcel = () => {
  const [parcels, setParcels] = useState([]);
  const [parcelToEdit, setParcelToEdit] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [senderDetails, setSenderDetails] = useState(null);
  const [recipientDetails, setRecipientDetails] = useState(null);
  const [percelAssignments,setParcelAssignments]=useState([])
  const user_id = localStorage.getItem('id');

  useEffect(() => {
    fetch('http://127.0.0.1:5555/parcels', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setParcels(data)
        console.log("parcel",data);
        
    })
      .catch((error) => console.error('Error fetching parcels:', error));
    
    
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:5555/locations')
      .then((response) => response.json())
      .then((data) => {
        setLocations(data)
        console.log("locations",data);
        
    })
      .catch((error) => console.error('Error fetching locations:', error));
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:5555/vehicles',
        {
            headers:{
                Authorization :`Bearer ${localStorage.getItem('access_token')}`
            }
        }
    )
      .then((response) => response.json())
      .then((data) => {
        setVehicles(data)
        console.log("vehicles",data);
        
    })
      .catch((error) => console.error('Error fetching locations:', error));
  }, []);

  const getLocation=(location_id)=>{
    const location=locations.find((location)=>location.id==location_id)
    return location? `FROM : ${location.origin}  TO : ${location.destination}`:"unknown"
  }

  const getExpectedTime=(vehicle_id)=>{
    const vehicle=vehicles.find((vehicle)=>vehicle.id==vehicle_id)
    return vehicle ? `DEPARTURE-TIME : ${vehicle.departure_time}  EXPECTED-ARRIVAL-TIME : ${vehicle.expected_arrival_time}`:"Pending"
  }

  
  const handleEditParcel = (parcelId) => {
    fetch(`http://127.0.0.1:5555/parcels/${parcelId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setParcelToEdit(data);
        setName(data.name);
        setDescription(data.description);
        setWeight(data.weight);
        setStatus(data.status);
        setTrackingNumber(data.tracking_number);
        setShippingCost(data.shipping_cost);
        setSelectedVehicleId(data.vehicle_id);

        // Fetch sender details
        fetch(`http://127.0.0.1:5555/users/${data.sender_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
          .then((response) => response.json())
          .then((user) => setSenderDetails(user))
          .catch((error) => console.error('Error fetching sender details:', error));

        // Fetch recipient details
        fetch(`http://127.0.0.1:5555/users/${data.recipient_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
          .then((response) => response.json())
          .then((user) => setRecipientDetails(user))
          .catch((error) => console.error('Error fetching recipient details:', error));
      })
      .catch((error) => console.error('Error fetching parcel:', error));
  };

  // Handle parcel update
  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedParcelData = {
      user_id,
      name,
      description,
      weight: parseFloat(weight),
      status,
      shipping_cost: parseFloat(shippingCost),
      vehicle_id: selectedVehicleId || null,
    };

    fetch(`http://127.0.0.1:5555/parcels/${parcelToEdit.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(updatedParcelData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update parcel');
        }
        return response.json();
      })
      .then((data) => {
        Toastify({
          text: 'Parcel updated successfully!',
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: '#4CAF50',
        }).showToast();
        setParcelToEdit(null);
        setSenderDetails(null);
        setRecipientDetails(null);
      })
      .catch((error) => {
        console.error('Error updating parcel:', error);
        setErrorMessage('Failed to update parcel. Please try again.');
      });
  };

  const handleDeleteParcel = (parcelId) => {
    if (window.confirm("Are you sure you want to delete this parcel?")) {
      fetch(`http://127.0.0.1:5555/parcels/${parcelId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete parcel');
          }
          setParcels(parcels.filter(parcel => parcel.id !== parcelId));
          Toastify({
            text: 'Parcel deleted successfully!',
            duration: 3000,
            gravity: 'top',
            position: 'right',
            backgroundColor: '#FF6347',
          }).showToast();
        })
        .catch((error) => console.error('Error deleting parcel:', error));
    }
  };

  const renderParcelList = (status) => (
    <div>
      <h3>{status}</h3>
      {parcels.filter(parcel => parcel.status === status).map(parcel => (
        <div className="parcel-item" key={parcel.id}>
          <p><strong>Name:</strong> {parcel.name}</p>
          <p><strong>Description:</strong> {parcel.description}</p>
          <p><strong>Tracking Number:</strong> {parcel.tracking_number}</p>
          <p><strong>Shipping Cost:</strong> Ksh {parcel.shipping_cost}</p>
          <p><strong>Location:</strong>{getLocation(parcel.location_id)}</p>
          <p><strong>Time:</strong>{getExpectedTime(parcel.vehicle_id)}</p>
          <p><strong>Created At:</strong>{parcel.created_at}</p>





        <div>
            <h4>Sender Details:</h4>
            <p><strong>Name:</strong> {parcel.sender.name}</p>
            <p><strong>Phone:</strong> {parcel.sender.phone_number}</p>
            <p><strong>Email:</strong> {parcel.sender.email}</p>
        </div>
        <div>
            <h4>Recipient Details:</h4>
            <p><strong>Name:</strong> {parcel.recipient.name}</p>
            <p><strong>Phone:</strong> {parcel.recipient.phone_number}</p>
            <p><strong>Email:</strong> {parcel.recipient.email}</p>
        </div>
        

          <button  className='editButton'onClick={() => handleEditParcel(parcel.id)}>Edit Parcel</button>
          <button className='deleteButton' onClick={() => handleDeleteParcel(parcel.id)}>Delete Parcel</button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="parcel-container">
      {!parcelToEdit ? (
        <div className="parcel-list">
          <h2 className="section-title">Parcels</h2>
          {renderParcelList('Pending')}
          {renderParcelList('In Transit')}
          {renderParcelList('Delivered')}
        </div>
      ) : (
        <div>
          <h2 className="section-title">Edit Parcel</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Parcel Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <label htmlFor="weight">Weight (kg)</label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              min="0"
            />

            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>

            <label htmlFor="shippingCost">Shipping Cost</label>
            <input
              type="text"
              id="shippingCost"
              value={`Ksh ${shippingCost}`}
              readOnly
            />

            <button type="submit">Update Parcel</button>
            <button type="button" onClick={() => setParcelToEdit(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Parcel;
