import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Report.css'; // Import custom CSS for styling

// Custom hook to handle map click and marker position
const LocationMarker = ({ setLocation }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLocation(`${e.latlng.lat},${e.latlng.lng}`);
    },
  });

  return position === null ? null : <Marker position={position} />;
};

const Report = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('description', description);
    formData.append('image', image);
    formData.append('location', location);

    try {
      const response = await axios.post('http://localhost:5000/report', formData, {
        headers: { Authorization: token, 'Content-Type': 'multipart/form-data' },
      });
      console.log('Report submitted:', response.data);
      navigate('/status');
    } catch (error) {
      console.error('There was an error submitting the report!', error);
      alert('Failed to submit report.');
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="container">
        <div className="report-form">
          <h1>Report a Pothole</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Description:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Image:</label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
            </div>
            <div>
              <label>Location:</label>
              <div className="map-container">
                <MapContainer center={[13.0827, 80.2707]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker setLocation={setLocation} />
                </MapContainer>
              </div>
            </div>
            <button type="submit">Submit Report</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Report;
