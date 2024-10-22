import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Grid,
  Divider,
} from "@mui/material";

const Cart = () => {
  // Sample cart items data including image URLs
  const cartItems = [
    {
      id: 1,
      name: "Photo Print 1",
      price: 10,
      quantity: 2,
      imageUrl: "/images/photo1.jpg", // Adjust the path as needed
    },
    {
      id: 2,
      name: "Photo Print 2",
      price: 15,
      quantity: 1,
      imageUrl: "/images/photo2.jpg", // Adjust the path as needed
    },
    {
      id: 3,
      name: "Photo Print 3",
      price: 8,
      quantity: 3,
      imageUrl: "/images/photo3.jpg", // Adjust the path as needed
    },
  ];

  // Calculate total
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleRemove = (id) => {
    // Logic to remove item from cart
    console.log(`Remove item with id: ${id}`);
  };

  const handleCheckout = () => {
    // Logic for checkout
    console.log("Proceed to checkout");
  };

  return (
    <Box sx={{ padding: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        Shopping Cart
      </Typography>
      <Grid container spacing={2}>
        {cartItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
              <CardMedia
                component="img"
                height="140"
                image={item.imageUrl}
                alt={item.name}
                sx={{ borderTopLeftRadius: 2, borderTopRightRadius: 2 }}
              />
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body1">Price: ${item.price}</Typography>
                <Typography variant="body1">
                  Quantity: {item.quantity}
                </Typography>
                <Typography variant="body1">
                  Total: ${item.price * item.quantity}
                </Typography>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: "space-between", padding: 2 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          marginTop: 3,
          padding: 2,
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="h5">Total Amount: ${total}</Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCheckout}
          sx={{ marginTop: 2 }}
        >
          Proceed to Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default Cart;
