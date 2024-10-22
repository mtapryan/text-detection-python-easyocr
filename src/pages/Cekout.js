import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";

const CheckoutPage = () => {
  const [selectedPayment, setSelectedPayment] = useState("creditCard");

  const photoItems = [
    {
      id: 1,
      title: "Event Photo 1",
      price: 20,
      imageUrl: "/images/photo1.jpg",
    },
    {
      id: 2,
      title: "Event Photo 2",
      price: 15,
      imageUrl: "/images/photo2.jpg",
    },
  ];

  const total = photoItems.reduce((sum, item) => sum + item.price, 0);

  const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.value);
  };

  const handleCheckout = () => {
    alert(`Proceeding to checkout with ${selectedPayment}...`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Page Header */}
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      {/* Divider */}
      <Divider sx={{ mb: 3 }} />

      {/* Grid for listing photo items */}
      <Grid container spacing={3}>
        {photoItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={item.imageUrl}
                alt={item.title}
              />
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ${item.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="outlined" color="secondary">
                  Remove
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Order Summary */}
      <Box
        sx={{
          marginTop: 4,
          padding: 2,
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <Typography variant="body1">Total Items:</Typography>
          <Typography variant="body1">{photoItems.length}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <Typography variant="body1">Subtotal:</Typography>
          <Typography variant="body1">${total}</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {/* Selected Payment Method */}
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend">Select Payment Method</FormLabel>
          <RadioGroup value={selectedPayment} onChange={handlePaymentChange}>
            <FormControlLabel
              value="creditCard"
              control={<Radio />}
              label="Credit Card"
            />
            <FormControlLabel
              value="paypal"
              control={<Radio />}
              label="PayPal"
            />
            <FormControlLabel
              value="bankTransfer"
              control={<Radio />}
              label="Bank Transfer"
            />
          </RadioGroup>
        </FormControl>

        {/* Checkout Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCheckout} // Call checkout with selected payment method
        >
          Proceed to Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
