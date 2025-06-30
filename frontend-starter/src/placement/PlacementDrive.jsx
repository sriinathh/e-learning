import React from 'react';
import { Link } from 'react-router-dom';
import './PlacementDrive.css';  // You can add your custom styles here
import PlacementHub from './PlacementHub';  // Import the PlacementHub component

const PlacementDrive = () => {
  return (
    <div className="placement-drive">
      <h1 className="heading">Placement Drive</h1>
      
      <div className="intro-section">
        <p>Welcome to the CampusConnect Placement Drive! Your one-stop platform to prepare for job opportunities, enhance your skills, and receive placement support.</p>
        
        <Link to="/placement-hub" className="go-to-hub-button">
          Go to Placement Hub
        </Link>
      </div>
      
      {/* Adding the PlacementHub Component for integration */}
      <PlacementHub />
    </div>
  );
};

export default PlacementDrive;
