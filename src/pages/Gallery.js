import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import axios from "axios";
import "../styles/Gallery.css";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .post(
        "https://dev.duniadalamdigital.com/carifoto/php-service/ListFeedService.php",
        {
          filter: "",
          page: 0,
          size: 50,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE3MjkyMjYwNzAsImV4cCI6MTcyOTIyOTY3MCwidXNlcklkIjoiZWU4YzI1NGMtODg0ZS0xMWVmLTk5NjItMDAxNjNjZThjZDVjIn0.JakYU7wdXSF2AM3UE6Tn7aSCM0afxI6iqGEAspcnaPc`,
          },
        }
      )
      .then((response) => {
        setImages(response.data.data.records);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 5 }}>
        <Typography variant="h6" color="error">
          Error fetching images: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="gallery-container">
      <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
        {images.map((image) => (
          <Box key={image.id} className="gallery-item">
            <img
              src={`https://dev.duniadalamdigital.com/carifoto/php-service/${image.image_url}`}
              alt={image.caption}
              className="gallery-image"
            />
            <Typography variant="body2" className="gallery-caption">
              {image.caption}
            </Typography>
          </Box>
        ))}
      </Masonry>
    </Box>
  );
};

export default Gallery;
