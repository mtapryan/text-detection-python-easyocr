import React from "react";
import { Box, Button, Typography, Container, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import profilePic from "../assets/profile-pic.jpg"; // Add your profile picture here

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          alt="Profile Picture"
          src={profilePic}
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        <Typography component="h1" variant="h5">
          Admin
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;
