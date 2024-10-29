import React, { useState, useEffect } from 'react';
import '../Admin/parcel.css';
import './styles/customerparcel.css'

const CustomerParcel = () => {
  const [sentParcels, setSentParcels] = useState([]);
  const [receivedParcels, setReceivedParcels] = useState([]);
  const customerId = localStorage.getItem('id'); 
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [vehicle,setVehicle]=useState([])

  const customerIdInt=parseInt(customerId)
  useEffect(() => {
    fetch(`https://matwana-backend-copy.onrender.com/parcels`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const sent=data.filter((parcel)=>parcel.sender_id==customerIdInt)
        setSentParcels(sent)
        
        const received=data.filter((parcel)=>parcel.recipient_id==customerIdInt)
        setReceivedParcels(received)
      })
      .catch((error) => console.error('Error fetching sent parcels:', error));

      fetch('https://matwana-backend-copy.onrender.com/vehicles')
      .then(response=>response.json())
      .then((data)=>{
        setVehicle(data)
        console.log("vehicle",data);
      }  
        
    )
      .catch((error)=>console.error("Error fetching vehicles",error))
  }, [customerId]);

  const handleParcelClick = (parcel) => {
    setSelectedParcel(parcel);
  };

  const handleBackToList = () => {
    setSelectedParcel(null);
  };

  const getParcelStatusClass = (status) => {
    if (status === 'Delivered') return 'parcel-delivered';
    if (status === 'In Transit') return 'parcel-in-transit';
    return 'parcel-default';
  };

  const getvehicleDetails=(vehicleId)=>{
    const found_vehicle=vehicle.find((vehicle)=>vehicle.id===vehicleId)
    return found_vehicle ? found_vehicle :{departure_time:'WAIT',arrival_time:'WAIT'}
  }


  if (selectedParcel) {
    const vehicleDetails=getvehicleDetails(selectedParcel.vehicle_id)
    return (
      <div className="parcel-details-container">
        <h2 className="section-title">Parcel Details</h2>
        <p><strong>Tracking Number:</strong> {selectedParcel.tracking_number}</p>
        <p><strong>Status:</strong> {selectedParcel.status}</p>
        <p><strong>Sender:</strong> {selectedParcel.sender.name}</p>
        <p><strong>Recipient:</strong> {selectedParcel.recipient.name}</p>
        <p><strong>Shipping Cost:</strong> KSH. {selectedParcel.shipping_cost}</p>
        <p><strong>DEPARTURE TIME:</strong>{vehicleDetails.departure_time}</p>
        <p><strong>EXPECTED ARRIVAL TIME:</strong>{vehicleDetails.expected_arrival_time}</p>
        <p><strong>Weight:</strong> {selectedParcel.weight} kg</p>
        <button className="back-button" onClick={handleBackToList}>
          Back to Parcels
        </button>
      </div>
    );
  }

  return (
    <div className="parcels-container">
      <h2 className="section-title">My Parcels</h2>
      <div className="parcels-section">
        <h3>Sent Parcels</h3>
        {sentParcels.length > 0 ? (
          <ul className="parcels-list">
            {sentParcels.map((parcel) => (
              <li 
              key={parcel.id} 
              className={`parcel-item ${getParcelStatusClass(parcel.status)}`} 
              onClick={() => handleParcelClick(parcel)}>
                <p className="parcel-tracking">{parcel.tracking_number}</p>
                <p className="parcel-status">{parcel.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't sent any parcels.</p>
        )}
      </div>

      <div className="parcels-section">
        <h3>Received Parcels</h3>
        {receivedParcels.length > 0 ? (
          <ul className="parcels-list">
            {receivedParcels.map((parcel) => (
              <li 
              key={parcel.id} 
              className={`parcel-items ${getParcelStatusClass(parcel.status)}`} 
              onClick={() => handleParcelClick(parcel)}>
                <span className="parcel-tracking">{parcel.tracking_number}</span>
                <span className="parcel-status">{parcel.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't received any parcels.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerParcel;
