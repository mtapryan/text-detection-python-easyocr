import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid,
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
  const [events, setEvents] = useState([]); // State for events data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState([-6.3744575, 106.3146732]); // Default coordinates
  const [searchName, setSearchName] = useState(""); // State for event name search

  // Function to fetch events from the API based on search name
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "https://dev.duniadalamdigital.com/carifoto/php-service/ListEventService.php",
        {
          filter: searchName, // Use the search name as filter
          page: 0,
          size: 50,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE3MjkyMjYwNzAsImV4cCI6MTcyOTIyOTY3MCwidXNlcklkIjoiZWU4YzI1NGMtODg0ZS0xMWVmLTk5NjItMDAxNjNjZThjZDVjIn0.JakYU7wdXSF2AM3UE6Tn7aSCM0afxI6iqGEAspcnaPc`,
          },
        }
      );
      const res = response?.data?.data;
      console.log("🚀 ~ fetchEvents ~ res:", res);

      if (res?.records) {
        setEvents(res?.records); // Set the events data
        // Extract the coordinates from the first event (if available)
        const firstEvent = res?.records[0];
        if (firstEvent && firstEvent.event_lat && firstEvent.event_lang) {
          setCoordinates([
            parseFloat(firstEvent.event_lat),
            parseFloat(firstEvent.event_lang),
          ]);
        }
      } else {
        setError("No events found");
      }
    } catch (err) {
      setError("Error fetching events");
    }
    setLoading(false);
  };

  const fetchEventsResset = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "https://dev.duniadalamdigital.com/carifoto/php-service/ListEventService.php",
        {
          filter: "", // Use the search name as filter
          page: 0,
          size: 50,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE3MjkyMjYwNzAsImV4cCI6MTcyOTIyOTY3MCwidXNlcklkIjoiZWU4YzI1NGMtODg0ZS0xMWVmLTk5NjItMDAxNjNjZThjZDVjIn0.JakYU7wdXSF2AM3UE6Tn7aSCM0afxI6iqGEAspcnaPc`,
          },
        }
      );
      const res = response?.data?.data;
      console.log("🚀 ~ fetchEvents ~ res:", res);

      if (res?.records) {
        setEvents(res?.records); // Set the events data
        // Extract the coordinates from the first event (if available)
        const firstEvent = res?.records[0];
        if (firstEvent && firstEvent.event_lat && firstEvent.event_lang) {
          setCoordinates([
            parseFloat(firstEvent.event_lat),
            parseFloat(firstEvent.event_lang),
          ]);
        }
      } else {
        setError("No events found");
      }
    } catch (err) {
      setError("Error fetching events");
    }
    setLoading(false);
  };

  // Fetch events when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Function to reset the search
  const resetSearch = () => {
    setSearchName(""); // Clear the search input
    fetchEventsResset(); // Fetch the original list of events
  };

  return (
    <Box className="maps-container">
      <Box sx={{ width: "100%", paddingBottom: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              placeholder="Search Event Name"
              variant="outlined"
              size="small"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchEvents}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : "Search Event"}
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={resetSearch}
              disabled={loading}
              fullWidth
            >
              Reset Search
            </Button>
          </Grid>
        </Grid>
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
        {events.map(
          (event, index) =>
            // Assuming the event object has lat and lng properties
            event.event_lat &&
            event.event_lang && (
              <Marker
                key={index}
                position={[
                  parseFloat(event.event_lat),
                  parseFloat(event.event_lang),
                ]}
                icon={customIcon}
              >
                <Popup>
                  <div>
                    {event.event_image && (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <img
                          src={`https://dev.duniadalamdigital.com/carifoto/php-service/${event.event_image}`}
                          alt={event.event_desc || "Event Image"}
                          style={{
                            width: "200px",
                            height: "auto",
                            maxHeight: "450px",
                          }} // Adjust as needed
                        />
                      </div>
                    )}
                    <Typography variant="body2">
                      {event.event_name || "No description available."}
                    </Typography>
                    <Typography variant="body2">
                      {event.event_desc || "No description available."}
                    </Typography>
                  </div>
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>
    </Box>
  );
};

export default Maps;
