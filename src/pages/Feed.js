import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import "../styles/PostStyles.css";

const Feed = () => {
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
          size: 10,
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
          Error fetching posts: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="feed">
      {images.map((image) => (
        <Post
          key={image.id}
          username={image.username}
          location={image.location}
          imageUrl={`https://dev.duniadalamdigital.com/carifoto/php-service/${image.image_url}`}
          caption={image.caption}
          profileImage={`https://ui-avatars.com/api/?name=${image.username}`}
          love={image.love} // Pass the love prop
        />
      ))}
    </Box>
  );
};

export default Feed;
