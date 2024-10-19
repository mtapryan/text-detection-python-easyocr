import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import "../styles/MapsStyle.css";

// Custom hook to update the map view
const UpdateMapView = ({ coordinates }) => {
  const map = useMap();
  map.setView(coordinates, 13);
  return null;
};

// Custom icon for the marker using an SVG path
const customIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
      <path d="M480 936q-5 0-10-2.5t-9-7.5q-114-114-171.5-209.5T231 526q0-104 69.5-173T480 284q104 0 173 69.5T722 526q0 68-57.5 163.5T493 926q-4 5-9 7.5t-10 2.5Zm0-370q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Z"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Maps = () => {
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState([51.505, -0.09]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setCoordinates([parseFloat(lat), parseFloat(lon)]);
      } else {
        setError("Location not found");
      }
    } catch (err) {
      setError("Error fetching location");
    }
    setLoading(false);
  };

  return (
    <Box className="maps-container">
      <Box className="search-container">
        <TextField
          label="Search Location"
          variant="outlined"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Search"}
        </Button>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
      <MapContainer center={coordinates} zoom={13} className="map">
        <UpdateMapView coordinates={coordinates} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={coordinates} icon={customIcon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
};

export default Maps;
