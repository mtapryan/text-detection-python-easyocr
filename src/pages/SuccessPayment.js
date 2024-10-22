import React from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CheckCircleOutline } from "@mui/icons-material";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate("/"); // Redirect to homepage or shopping page
  };

  return (
    <Box
      sx={{
        padding: 4,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Success Icon */}
      <CheckCircleOutline
        sx={{ fontSize: 100, color: "green", marginBottom: 2 }}
      />

      {/* Success Message */}
      <Typography variant="h4" gutterBottom>
        Payment Successful!
      </Typography>

      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        Thank you for your purchase. Your transaction has been completed
        successfully, and a confirmation email has been sent to your email.
      </Typography>

      <Divider sx={{ width: "100%", marginBottom: 3 }} />

      {/* Order Details (Optional) */}
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>

      <Typography variant="body1" gutterBottom>
        Total: $50
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Order ID: 123456789
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Transaction ID: abcdef123456
      </Typography>

      <Divider sx={{ width: "100%", marginY: 3 }} />

      {/* Continue Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleContinueShopping}
        sx={{ width: "200px" }}
      >
        Continue Shopping
      </Button>
    </Box>
  );
};

export default PaymentSuccessPage;
