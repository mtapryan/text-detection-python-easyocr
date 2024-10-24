import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  AppBar,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Paper,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("token");
    localStorage.removeItem("info");
  };
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Sample data for transaction history and photo collection
  const transactionHistory = [
    { id: 1, date: "2024-10-10", amount: 50, status: "Completed" },
    { id: 2, date: "2024-09-15", amount: 30, status: "Completed" },
  ];

  const photoCollection = [
    { id: 1, title: "Event Photo 1", imageUrl: "/images/photo1.jpg" },
    { id: 2, title: "Event Photo 2", imageUrl: "/images/photo2.jpg" },
  ];

  return (
    <Box sx={{ padding: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Tabs for navigation */}
      <AppBar position="static" sx={{ bgcolor: "#1976d2" }}>
        <Tabs value={currentTab} onChange={handleTabChange} textColor="inherit">
          <Tab label="Account" />
          <Tab label="Transaction" />
          <Tab label="Photo" />
        </Tabs>
      </AppBar>

      {/* Tab Content */}
      <Box
        sx={{
          marginTop: 2,
          bgcolor: "#fff",
          borderRadius: 2,
          p: 3,
          boxShadow: 1,
        }}
      >
        {currentTab === 0 && (
          <Box>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Account Information
            </Typography>
            <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
              <InputLabel shrink>Name</InputLabel>
              <TextField
                value="John Doe"
                variant="outlined"
                disabled
                label="Name"
                InputLabelProps={{
                  shrink: true, // This keeps the label above when the field is filled
                }}
              />
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
              <InputLabel shrink>Email</InputLabel>
              <TextField
                value="john@example.com"
                variant="outlined"
                disabled
                label="Email"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Member Since</InputLabel>
              <TextField
                value="January 2023"
                variant="outlined"
                disabled
                label="Member Since"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Box>
        )}

        {currentTab === 1 && (
          <Box>
            <Typography variant="h6">Transaction History</Typography>
            {transactionHistory.map((transaction) => (
              <Paper
                key={transaction.id}
                sx={{
                  padding: 2,
                  marginBottom: 1,
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                <Typography variant="body1">{transaction.date}</Typography>
                <Typography variant="body1">${transaction.amount}</Typography>
                <Typography variant="body1" color="green">
                  {transaction.status}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}

        {currentTab === 2 && (
          <Box>
            <Typography variant="h6">Photo Collection</Typography>
            <Grid container spacing={2}>
              {photoCollection.map((photo) => (
                <Grid item xs={12} sm={6} md={4} key={photo.id}>
                  <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={photo.imageUrl}
                      alt={photo.title}
                      sx={{ borderRadius: 2 }}
                    />
                    <CardContent>
                      <Typography variant="h6">{photo.title}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary">
                        Download
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
      <Button
        variant="contained"
        color="error"
        fullWidth
        sx={{ mt: 3 }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );
};

export default ProfilePage;
