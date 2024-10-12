import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import "../App.css";

const Post = ({ username, location, imageUrl, caption }) => {
  return (
    <Card className="post" sx={{ mb: 4 }}>
      <CardContent>
        <Box
          className="post-header"
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Typography variant="h6">{username}</Typography>
          <Typography variant="body2" color="textSecondary">
            {location}
          </Typography>
        </Box>
        <CardMedia
          component="img"
          image={imageUrl}
          alt="Post content"
          className="post-image"
          sx={{ mt: 2, borderRadius: 2 }}
        />
        <Typography variant="body1" className="post-caption" sx={{ mt: 2 }}>
          {caption}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Post;
