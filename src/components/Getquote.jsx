import React, { useState, useEffect } from 'react';
import './getquote.css'


const GetQuote = () => {
  const [quoteDetails, setQuoteDetails] = useState({
    locationId: '',
    weight: '',
  });
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState('');
  const [price, setPrice] = useState(0);

  useEffect(() => {
    fetch('https://matwana-backend-copy-1.onrender.com/locations')
      .then((response) => response.json())
      .then((data) => {
        if(Array.isArray(data)){
          setLocations(data)
        }
        else{
          setLocations([])
        }
      })
      .catch((error) => console.error('Error fetching locations:', error));
  }, []);

  
  const handleInputChange = (e) => {
    if (e.target.name === 'weight' && e.target.value < 0 ) {
      setError('Weight cannot be negative');
      return;
    } 
    
    setQuoteDetails({
      ...quoteDetails,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'weight' && e.target.value > 100) {
      setError('Weight cannot exceed 100kg');
    } else {
      setError('');
    }
  };

  useEffect(() => {
    const selectedLocation = locations.find(
      (location) => location.id === parseInt(quoteDetails.locationId)
    );
    if (selectedLocation && quoteDetails.weight) {
      const calculatedPrice = selectedLocation.cost_per_kg * quoteDetails.weight;
      setPrice(calculatedPrice);
    } else {
      setPrice(0);
    }
  }, [quoteDetails, locations]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quoteDetails.weight > 100) {
      setError('Weight must be 100kg or less');
      return;
    }

    console.log('Quote request submitted:', quoteDetails);
  };

  return (
    <div className="quote-container">
      <h2 className='quote-heading'>Get a Quote</h2>
      {locations.length ===0 ?
      (
        <p className="no-locations-message">No locations available at the moment. Please try again later.</p>
      ):(
        <form onSubmit={handleSubmit} className="quote-form">
        <div className="form-group">
          <label htmlFor="locationId">Location</label>
          <select
            name="locationId"
            id="locationId"
            value={quoteDetails.locationId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.origin} to {location.destination} (Ksh {location.cost_per_kg}/kg)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="weight">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            id="weight"
            placeholder="Enter parcel weight"
            value={quoteDetails.weight}
            onChange={handleInputChange}
            min="0"
            max="100"
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <p>Total Price: Ksh {price}</p>
        </div>

        <button type="submit" className="quote-btn" disabled={error}>
          Submit
        </button>
      </form>

      )} 
    </div>
  );
};

export default GetQuote;
