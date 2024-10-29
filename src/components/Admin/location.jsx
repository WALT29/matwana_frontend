import React, { useState, useEffect } from 'react';
import Toastify from 'toastify-js'; 
import 'toastify-js/src/toastify.css'; 
import './location.css';

const LocationsList = () => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({
    origin: '',
    destination: '',
    cost_per_kg: ''
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = () => {
    fetch('https://matwana-backend-copy.onrender.com/locations', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        return response.json();
      })
      .then((data) => {
        setLocations(data);
      })
      .catch((error) => {
        Toastify({
          text: error.message,
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: 'linear-gradient(to right, #FF5F6D, #FFC371)',
        }).showToast();
      });
  };

  const handleNewLocationChange = (e) => {
    const { name, value } = e.target;
    setNewLocation({
      ...newLocation,
      [name]: value,
    });
  };

  const handleAddLocation = (e) => {
    e.preventDefault();
    fetch('https://matwana-backend-copy.onrender.com/locations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(newLocation),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add location');
        }
        return response.json();
      })
      .then((data) => {
        setLocations((prev) => [...prev, data]);
        Toastify({
          text: 'Location added successfully!',
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: 'linear-gradient(to right, #4CAF50, #8BC34A)',
        }).showToast();
        setNewLocation({ origin: '', destination: '', cost_per_kg: '' });
      })
      .catch((error) => {
        Toastify({
          text: error.message,
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: 'linear-gradient(to right, #FF5F6D, #FFC371)',
        }).showToast();
      });
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setIsEditing(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedLocation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`https://matwana-backend-copy.onrender.com/locations/${selectedLocation.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(selectedLocation),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update location');
        }
        return response.json();
      })
      .then((data) => {
        setLocations((prev) =>
          prev.map((loc) => (loc.id === data.id ? data : loc))
        );
        Toastify({
          text: 'Location updated successfully!',
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: 'linear-gradient(to right, #4CAF50, #8BC34A)',
        }).showToast();
        setSelectedLocation(null);
      })
      .catch((error) => {
        Toastify({
          text: error.message,
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: 'linear-gradient(to right, #FF5F6D, #FFC371)',
        }).showToast();
      });
  };

  const handleDelete = (id) => {
    fetch(`https://matwana-backend-copy.onrender.com/locations/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete location');
        }
        setLocations((prev) => prev.filter((loc) => loc.id !== id));
        Toastify({
          text: 'Location deleted successfully!',
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: 'linear-gradient(to right, #4CAF50, #8BC34A)',
        }).showToast();
        setSelectedLocation(null);
      })
      .catch((error) => {
        Toastify({
          text: error.message,
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: 'linear-gradient(to right, #FF5F6D, #FFC371)',
        }).showToast();
      });
  };

  return (
    <div className="locations-list-container">
      <h2 className="section-title">All Locations</h2>
      <p>Total Locations: {locations.length}</p>

      <form onSubmit={handleAddLocation}>
        <h3>Add New Location</h3>
        <input
          type="text"
          name="origin"
          placeholder="Origin"
          value={newLocation.origin}
          onChange={handleNewLocationChange}
          required
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={newLocation.destination}
          onChange={handleNewLocationChange}
          required
        />
        <input
          type="number"
          name="cost_per_kg"
          placeholder="Cost per KG"
          value={newLocation.cost_per_kg}
          onChange={handleNewLocationChange}
          required
        />
        <button type="submit">Add Location</button>
      </form>

      <ul className="locations-list">
        {locations.map((location) => (
          <li key={location.id} onClick={() => handleLocationClick(location)}>
            <span>{location.origin} to {location.destination}</span>
            <span>Cost: {location.cost_per_kg} Ksh/kg</span>
          </li>
        ))}
      </ul>

      {selectedLocation && (
        <div className="location-details">
          <h3>Location Details</h3>
          {isEditing ? (
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="origin"
                value={selectedLocation.origin}
                onChange={handleEditChange}
                required
              />
              <input
                type="text"
                name="destination"
                value={selectedLocation.destination}
                onChange={handleEditChange}
                required
              />
              <input
                type="number"
                name="cost_per_kg"
                value={selectedLocation.cost_per_kg}
                onChange={handleEditChange}
                required
              />
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <div>
              <p><strong>Origin:</strong> {selectedLocation.origin}</p>
              <p><strong>Destination:</strong> {selectedLocation.destination}</p>
              <p><strong>Cost per KG:</strong> {selectedLocation.cost_per_kg} Ksh/kg</p>
              <button onClick={() => setIsEditing(true)}>Edit Location</button>
              <button onClick={() => handleDelete(selectedLocation.id)}>Delete Location</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationsList;
