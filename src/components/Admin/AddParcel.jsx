import React, { useEffect, useState } from 'react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import './addparcels.css';

const AddParcel = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [status, setStatus] = useState('Pending');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [locations, setLocations] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [senderId, setSenderId] = useState(null);
  const [recipientId, setRecipientId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [vehicles, setVehicles] = useState([]);

  const user_id = localStorage.getItem('id');

  const generateTrackingNumber = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setTrackingNumber(result);
  };

  useEffect(() => {
    generateTrackingNumber();
  }, []);

  useEffect(() => {
    fetch('https://matwana-backend-copy-1.onrender.com/locations')
      .then((response) => response.json())
      .then((data) => {
        setLocations(data);
      })
      .catch((error) => console.error('Error fetching locations:', error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!senderId) {
      alert('Sender not found in the system. Please check the phone number.');
      return;
    }

    if (!recipientId) {
      alert('Recipient not found in the system. Please check the phone number.');
      return;
    }
    
    const parcelData = {
      user_id,
      name,
      description,
      tracking_number: trackingNumber,
      weight: parseFloat(weight),
      status,
      shipping_cost: parseFloat(shippingCost),
      sender_id: senderId,
      recipient_id: recipientId,
      location_id: selectedLocationId,
      vehicle_id: selectedVehicleId || null,
    };

    fetch('https://matwana-backend-copy-1.onrender.com/parcels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(parcelData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create parcel');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Parcel created successfully:', data);
        Toastify({
          text: 'Parcel added successfully!',
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: '#4CAF50',
        }).showToast();
        resetForm();
      })
      .catch((error) => {
        console.error('Error creating parcel:', error);
        setErrorMessage('Failed to create parcel. Please try again.');
      });
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setWeight('');
    setStatus('Pending');
    setSelectedLocationId('');
    setSelectedVehicleId('');
    setSenderPhone('');
    setRecipientPhone('');
    setSenderId(null);
    setRecipientId(null);
    setShippingCost(0);
    setErrorMessage('');
    generateTrackingNumber(); }

  const handleLocationChange = (event) => {
    const locationId = event.target.value;
    const selectedLocation = locations.find((loc) => loc.id === Number(locationId));
    setSelectedLocationId(locationId);
    setVehicles(selectedLocation.vehicles || []);
    const costPerKg = selectedLocation.cost_per_kg;
    calculateShippingCost(weight, costPerKg);
  };

  const handleWeightChange = (event) => {
    const weightValue = event.target.value;
    setWeight(weightValue);
    const costPerKg = locations.find((loc) => loc.id === selectedLocationId)?.cost_per_kg;
    calculateShippingCost(weightValue, costPerKg);
  };

  const calculateShippingCost = (weight, costPerKg) => {
    if (weight && costPerKg) {
      const totalCost = (weight * costPerKg).toFixed(2);
      setShippingCost(totalCost);
    } else {
      setShippingCost(0);
    }
  };

  const findUserByPhone = (phone, setUserId) => {
    if (phone.trim() === '') {
      setUserId(null);
      return;
    }

    
    fetch('https://matwana-backend-copy-1.onrender.com/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const foundUser = data.find((user) => user.phone_number === phone);
        if (foundUser) {
          setUserId(foundUser.id);
        } else {
          setUserId(null);
        }
      })
      .catch((error) => console.error('Error fetching users:', error));
  };

  useEffect(() => {
    findUserByPhone(senderPhone, setSenderId);
  }, [senderPhone]);

  useEffect(() => {
    findUserByPhone(recipientPhone, setRecipientId);
  }, [recipientPhone]);

  return (
    <div className="add-vehicle-container">
      <h2 className="section-title">Add Parcel</h2>
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
          onChange={handleWeightChange}
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

        <label htmlFor="trackingNumber">Tracking Number</label>
        <input
          type="text"
          id="trackingNumber"
          value={trackingNumber}
          readOnly
        />

        <label htmlFor="location">Select Location</label>
        <select
          id="location"
          value={selectedLocationId}
          onChange={handleLocationChange}
          required
        >
          <option value="">Select a location</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.origin} to {location.destination} (Ksh {location.cost_per_kg} per kg)
            </option>
          ))}
        </select>

        <label htmlFor="vehicle">Select Vehicle</label>
        <select
          id="vehicle"
          value={selectedVehicleId}
          onChange={(e) => setSelectedVehicleId(e.target.value)}
          disabled={vehicles.length === 0}
        >
          <option value="">Select a vehicle (if available)</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.number_plate} - Driver: {vehicle.driver_name} {vehicle.departure_time} -
              {vehicle.expected_arrival_time}
            </option>
          ))}
        </select>

        <label htmlFor="senderPhone">Sender Phone Number</label>
        <input
          type="text"
          id="senderPhone"
          value={senderPhone}
          onChange={(e) => setSenderPhone(e.target.value)}
          required
        />

        <label htmlFor="recipientPhone">Recipient Phone Number</label>
        <input
          type="text"
          id="recipientPhone"
          value={recipientPhone}
          onChange={(e) => setRecipientPhone(e.target.value)}
          required
        />

        <label htmlFor="shippingCost">Shipping Cost (Ksh)</label>
        <input
          type="text"
          id="shippingCost"
          value={shippingCost}
          readOnly
        />

        <button type="submit">Add Parcel</button>
      </form>
    </div>
  );
};

export default AddParcel;
