import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Alert,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    user_type: 1004, // Default value
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userTypes = [
    { value: 1001, label: "Admin" },
    { value: 1002, label: "Event Organizer" },
    { value: 1003, label: "Photographer" },
    { value: 1004, label: "Runner" },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, fullname, email, phone, password, address, user_type } =
      formData;

    // Simple validation
    if (!username || !fullname || !email || !phone || !password || !address) {
      setError("Please fill all required fields");
      setSuccess("");
      return;
    }

    setError(""); // Clear any previous errors
    setSuccess("Registration successful!");
    console.log("Form Data: ", formData);
    // Perform registration logic here, such as sending data to an API
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          {/* Username */}
          <Grid item xs={12}>
            <InputLabel htmlFor="username">Username</InputLabel>
            <TextField
              required
              fullWidth
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </Grid>

          {/* Full Name */}
          <Grid item xs={12}>
            <InputLabel htmlFor="fullname">Full Name</InputLabel>
            <TextField
              required
              fullWidth
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>

          {/* Phone */}
          <Grid item xs={12}>
            <InputLabel htmlFor="phone">Phone</InputLabel>
            <TextField
              required
              fullWidth
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>

          {/* Password */}
          <Grid item xs={12}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <TextField
              required
              fullWidth
              name="password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <InputLabel htmlFor="address">Address</InputLabel>
            <TextField
              required
              fullWidth
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Grid>

          {/* User Type - Dropdown */}
          <Grid item xs={12}>
            <InputLabel htmlFor="user_type">User Type</InputLabel>
            <TextField
              select
              fullWidth
              id="user_type"
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              helperText="Please select your user type"
            >
              {userTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Register
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={() => navigate("/login")} // Navigate to login page
            >
              Back to Login
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Register;
