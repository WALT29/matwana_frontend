import React from 'react';
import './styles/video.css';
import videoSrc from '../assets/vid.mp4';
const VideoBackground = () => {
  return (
    <div className="video-background-container">
      <video autoPlay muted loop className="background-video">
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay">
        <div className="overlay-content">
          <h1>Welcome to Matwana Logistics</h1>
          <p>
            Matwana Logistics is a leading parcel and package delivery company in Kenya,
            providing nationwide delivery services From Murima to Kisumu dala and From Dala to Mombasa Raha. We offer competitive prices, reliable
            service, and ensure your parcels reach their destination safely and on time.
          </p>
          <p>
            Whether you are sending parcels across towns or across the country, we are
            here to help you connect. Experience fast, secure, and affordable deliveries
            with Matwana Logistics today.
          </p>

        </div>
      </div>
    </div>
  );
};

export default VideoBackground;
