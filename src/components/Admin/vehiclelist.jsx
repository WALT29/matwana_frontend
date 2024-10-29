import React, { useState, useEffect } from 'react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import './vehicle.css';

const VehiclesList = () => {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [editVehicleData, setEditVehicleData] = useState({
        number_plate: '',
        capacity: '',
        driver_name: '',
        driver_phone: '',
        departure_time: '',
        expected_arrival_time: '',
        status: 'empty',
        location_id: '',
    });
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        fetchVehicles();
        fetchLocations();
    }, []);

    const fetchVehicles = () => {
        fetch('https://matwana-backend-copy-1.onrender.com/vehicles', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setVehicles(data);
            })
            .catch(error => {
                console.error('Error fetching vehicles:', error);
            });
    };

    const fetchLocations = () => {
        fetch('https://matwana-backend-copy-1.onrender.com/locations', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setLocations(data);
            })
            .catch(error => {
                console.error('Error fetching locations:', error);
            });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditVehicleData({
            ...editVehicleData,
            [name]: value,
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        fetch(`https://matwana-backend-copy-1.onrender.com/vehicles/${selectedVehicle.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify(editVehicleData),
        })
            .then(response => response.json())
            .then(data => {
                setVehicles(prevVehicles => prevVehicles.map(vehicle => (vehicle.id === data.id ? data : vehicle)));
                setSelectedVehicle(null);
                showToast('Vehicle updated successfully!');
            })
            .catch(error => {
                console.error('Error updating vehicle:', error);
            });
    };

    const handleDelete = (vehicleId) => {
        fetch(`https://matwana-backend-copy-1.onrender.com/vehicles/${vehicleId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        })
            .then(() => {
                setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
                setSelectedVehicle(null);
                showToast('Vehicle deleted successfully!');
            })
            .catch(error => {
                console.error('Error deleting vehicle:', error);
            });
    };

    const handleVehicleClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setEditVehicleData({
            number_plate: vehicle.number_plate,
            capacity: vehicle.capacity,
            driver_name: vehicle.driver_name,
            driver_phone: vehicle.driver_phone,
            departure_time: vehicle.departure_time,
            expected_arrival_time: vehicle.expected_arrival_time,
            status: vehicle.status,
            location_id: vehicle.location_id,
        });
    };

    const showToast = (message) => {
        Toastify({
            text: message,
            duration: 3000,
            gravity: 'top',
            position: 'right',
            backgroundColor: '#4CAF50',
            stopOnFocus: true,
        }).showToast();
    };

    return (
        <div className="vehicles-list-container">
            <h2 className="section-title">All Vehicles ({vehicles.length})</h2>
            <ul className="vehicles-list">
                {vehicles.map(vehicle => (
                    <li key={vehicle.id} onClick={() => handleVehicleClick(vehicle)}>
                        <span className="vehicle-number">{vehicle.number_plate}</span>
                        <span className="vehicle-driver">{vehicle.driver_name}</span>
                        <span className="vehicle-destination">
                            {vehicle.location ? `${vehicle.location.origin} to ${vehicle.location.destination}` : 'No location'}
                        </span>
                    </li>
                ))}
            </ul>
            {selectedVehicle && (
                <div className="vehicle-details">
                    <h3>Edit Vehicle</h3>
                    <form onSubmit={handleEditSubmit}>
                        <label>Number Plate:</label>
                        <input
                            type="text"
                            name="number_plate"
                            value={editVehicleData.number_plate}
                            onChange={handleEditChange}
                            disabled
                        />
                        <label>Capacity:</label>
                        <input
                            type="number"
                            name="capacity"
                            value={editVehicleData.capacity}
                            onChange={handleEditChange}
                            disabled
                        />
                        <label>Driver Name:</label>
                        <input
                            type="text"
                            name="driver_name"
                            value={editVehicleData.driver_name}
                            onChange={handleEditChange}
                        />
                        <label>Driver Phone:</label>
                        <input
                            type="text"
                            name="driver_phone"
                            value={editVehicleData.driver_phone}
                            onChange={handleEditChange}
                        />
                        <label>Departure Time (AM/PM):</label>
                        <input
                            type="text"
                            name="departure_time"
                            value={editVehicleData.departure_time}
                            onChange={handleEditChange}
                            placeholder="e.g. 10:00 AM"
                        />
                        <label>Expected Arrival Time (AM/PM):</label>
                        <input
                            type="text"
                            name="expected_arrival_time"
                            value={editVehicleData.expected_arrival_time}
                            onChange={handleEditChange}
                            placeholder="e.g. 02:00 PM"
                        />
                        <label>Status:</label>
                        <select name="status" value={editVehicleData.status} onChange={handleEditChange}>
                            <option value="empty">Empty</option>
                            <option value="full">Full</option>
                        </select>
                        <label>Location:</label>
                        <select name="location_id" value={editVehicleData.location_id} onChange={handleEditChange}>
                            <option value="">Select Location</option>
                            {locations.map(location => (
                                <option key={location.id} value={location.id}>
                                    {location.origin} to {location.destination}
                                </option>
                            ))}
                        </select>
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => handleDelete(selectedVehicle.id)}>Delete Vehicle</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default VehiclesList;
