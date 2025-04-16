import React from 'react';
import './CloudPopup.css';

function CloudPopup({ message, onClose }) {
  return (
    <div className="cloud-popup-backdrop" onClick={onClose}>
      <div className="cloud-popup">
        <p>{message}</p>
        <button className="cloud-button" onClick={onClose}>Okay</button>
      </div>
    </div>
  );
}

export default CloudPopup;
