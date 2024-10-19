import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import "../styles/PostStyles.css";

const Post = ({
  username,
  location,
  imageUrl,
  caption,
  profileImage,
  love,
}) => {
  return (
    <Card className="post">
      {/* Header Section */}
      <Box className="post-header">
        <Avatar src={profileImage} alt={username} />
        <Box sx={{ ml: 2, flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {username}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {location}
          </Typography>
        </Box>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Box>

      {/* Image Section */}
      <CardMedia
        component="img"
        image={imageUrl}
        alt="Post content"
        className="post-image"
      />

      {/* Action Icons */}
      <Box className="post-actions">
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton>
            <FavoriteBorderIcon />
          </IconButton>
          <Typography variant="body2">{love}</Typography>
          <IconButton>
            <ChatBubbleOutlineIcon />
          </IconButton>
          <IconButton>
            <SendIcon />
          </IconButton>
        </Box>
        <IconButton>
          <BookmarkBorderIcon />
        </IconButton>
      </Box>

      {/* Caption Section */}
      <CardContent sx={{ paddingTop: 0 }}>
        <Typography variant="body2">
          <strong>{username}</strong> {caption}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Post;
