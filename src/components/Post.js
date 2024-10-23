import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DownloadIcon from "@mui/icons-material/Download"; // Import DownloadIcon
import "../styles/PostStyles.css";

const Post = ({
  isMobile,
  username,
  location,
  imageUrl,
  caption,
  profileImage,
  love,
  onLoveClick,
  onDownload,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      className="post"
      sx={{
        alignItems: isMobile ? "stretch" : "center",
      }}
    >
      {/* Header Section */}
      <Box
        className="post-header"
        sx={{
          width: isMobile ? "100%" : "800px",
          maxWidth: isMobile ? "100%" : "800px",
          backgroundColor: "#F7F7F7",
        }}
      >
        <Avatar src={profileImage} alt={username} />
        <Box sx={{ ml: 2, flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {username}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {location}
          </Typography>
        </Box>
        <IconButton onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={onDownload}>
            <ListItemIcon>
              <DownloadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Download</ListItemText>
          </MenuItem>
        </Menu>
      </Box>

      {/* Image Section */}
      <CardMedia
        component="img"
        image={imageUrl}
        alt="Post content"
        className="post-image"
        sx={{
          width: isMobile ? "100%" : "800px",
          maxWidth: isMobile ? "100%" : "800px",
        }}
      />

      {/* Action Icons */}
      <Box
        className="post-actions"
        sx={{
          width: isMobile ? "100%" : "800px",
          maxWidth: isMobile ? "100%" : "800px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            backgroundColor: "white",
            paddingRight: 2,
            borderRadius: 5,
          }}
        >
          <IconButton onClick={onLoveClick}>
            <FavoriteIcon color={love ? "error" : "default"} />
          </IconButton>
          <Typography variant="body2">{love}</Typography>
        </Box>
      </Box>

      {/* Caption Section */}
      <CardContent
        sx={{
          paddingTop: 3,
          width: isMobile ? "100%" : "800px",
          maxWidth: isMobile ? "100%" : "800px",
          backgroundColor: "#F7F7F7",
          height: "100%",
        }}
      >
        <Typography variant="body2">
          <strong>{username}</strong> {caption}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Post;
