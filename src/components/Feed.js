import React from "react";
import Post from "./Post";
import { Box } from "@mui/material";
import "../App.css";

const Feed = ({ images }) => {
  return (
    <Box className="feed" sx={{ mt: 2 }}>
      {images.map((image, index) => (
        <Post
          key={index}
          username={image.username}
          location={image.location}
          imageUrl={image.url}
          caption={image.caption}
        />
      ))}
    </Box>
  );
};

export default Feed;
