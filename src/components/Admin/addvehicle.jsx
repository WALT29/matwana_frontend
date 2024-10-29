import React, { useState, useEffect } from 'react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import './vehicle.css';

const AddVehicle = () => {
    const [vehicleData, setVehicleData] = useState({
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
        fetchLocations();
    }, []);

    const fetchLocations = () => {
        fetch('http://127.0.0.1:5555/locations', {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicleData({
            ...vehicleData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://127.0.0.1:5555/vehicles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify(vehicleData),
        })
            .then(response => response.json())
            .then(data => {
                showToast('Vehicle added successfully!');
                setVehicleData({
                    number_plate: '',
                    capacity: '',
                    driver_name: '',
                    driver_phone: '',
                    departure_time: '',
                    expected_arrival_time: '',
                    status: 'empty',
                    location_id: '',
                });
            })
            .catch(error => {
                console.error('Error adding vehicle:', error);
                showToast('Error adding vehicle, please try again.', 'error');
            });
    };

    const showToast = (message, type = 'success') => {
        Toastify({
            text: message,
            duration: 3000,
            gravity: 'top',
            position: 'right',
            backgroundColor: type === 'success' ? '#4CAF50' : '#f44336',
            stopOnFocus: true,
        }).showToast();
    };

    return (
        <div className="add-vehicle-container">
            <h2 className="section-title">Add Vehicle</h2>
            <form onSubmit={handleSubmit}>
                <label>Number Plate:</label>
                <input
                    type="text"
                    name="number_plate"
                    value={vehicleData.number_plate}
                    onChange={handleChange}
                    required
                />
                <label>Capacity in KG:</label>
                <input
                    type="number"
                    name="capacity"
                    value={vehicleData.capacity}
                    onChange={handleChange}
                    required
                />
                <label>Driver Name:</label>
                <input
                    type="text"
                    name="driver_name"
                    value={vehicleData.driver_name}
                    onChange={handleChange}
                    required
                />
                <label>Driver Phone:</label>
                <input
                    type="text"
                    name="driver_phone"
                    value={vehicleData.driver_phone}
                    onChange={handleChange}
                    required
                />
                <label>Departure Time (HH:MM AM/PM):</label>
                <input
                    type="text"
                    name="departure_time"
                    value={vehicleData.departure_time}
                    onChange={handleChange}
                    placeholder="e.g. 10:30 AM"
                    required
                />
                <label>Expected Arrival Time (HH:MM AM/PM):</label>
                <input
                    type="text"
                    name="expected_arrival_time"
                    value={vehicleData.expected_arrival_time}
                    onChange={handleChange}
                    placeholder="e.g. 3:45 PM"
                    required
                />
                <label>Status:</label>
                <select name="status" value={vehicleData.status} onChange={handleChange}>
                    <option value="empty">Empty</option>
                    <option value="full">Full</option>
                </select>
                <label>Location:</label>
                <select name="location_id" value={vehicleData.location_id} onChange={handleChange} required>
                    <option value="">Select Location</option>
                    {locations.map(location => (
                        <option key={location.id} value={location.id}>
                            {location.origin} to {location.destination}
                        </option>
                    ))}
                </select>
                <button type="submit">Add Vehicle</button>
            </form>
        </div>
    );
};

export default AddVehicle;
