import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import {
  Home,
  AccountCircle,
  Nature,
  Camera,
  ShoppingCart,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "../styles/MenubarStyle.css"; // Updated import

const Menubar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle opening the popover
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing the popover
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "cart-popover" : undefined;

  const cartItems = [
    { name: "Item 1", price: 10 },
    { name: "Item 2", price: 15 },
    { name: "Item 3", price: 8 },
  ];

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const menuList = (
    <List style={{ padding: 0 }}>
      <ListItem className="icon" button onClick={() => handleNavigation("/")}>
        <ListItemIcon className="icon-width">
          <Home className="icon" />
        </ListItemIcon>
        <ListItemText primary="Beranda" />
      </ListItem>
      <ListItem
        className="icon"
        button
        onClick={() => handleNavigation("/gallery")}
      >
        <ListItemIcon className="icon-width">
          <Camera className="icon" />
        </ListItemIcon>
        <ListItemText primary="Galeri" />
      </ListItem>
      <ListItem
        className="icon"
        button
        onClick={() => handleNavigation("/maps")}
      >
        <ListItemIcon className="icon-width">
          <Nature className="icon" />
        </ListItemIcon>
        <ListItemText primary="Lokasi" />
      </ListItem>
      <IconButton
        aria-describedby={id}
        className="icon"
        onClick={handleClick}
        sx={{ position: "relative" }}
      >
        <Badge badgeContent={4} color="warning">
          <ShoppingCart sx={{ color: "white" }} />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box p={2} width={300} sx={{ backgroundColor: "#f9f9f9" }}>
          {/* Header */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            Your Cart
          </Typography>
          <Divider sx={{ mb: 1 }} />

          {/* Item List */}
          <Box sx={{ maxHeight: "200px", overflowY: "auto", mb: 2 }}>
            {cartItems.map((item, index) => (
              <Typography key={index} variant="body2">
                {item.name} - ${item.price}
              </Typography>
            ))}
          </Box>
          <Divider sx={{ mb: 1 }} />

          {/* Total */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body1">Total:</Typography>
            <Typography variant="body1">${total}</Typography>
          </Box>

          {/* Checkout Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              handleClose(); // Close popover on checkout
              // Add checkout logic here
            }}
          >
            Checkout
          </Button>
        </Box>
      </Popover>
      <ListItem
        button
        className="icon"
        onClick={() => (token ? navigate("/profile") : navigate("/login"))}
      >
        <ListItemIcon className="icon-width">
          <AccountCircle className="icon" />
        </ListItemIcon>
        <ListItemText primary={token ? "Akun" : "Login"} />
      </ListItem>
    </List>
  );

  return (
    <>
      {isMobile ? (
        <></>
      ) : (
        <List
          className="menubar"
          style={{ display: "flex", flexDirection: "row", padding: 0 }}
        >
          {menuList}
        </List>
      )}
    </>
  );
};

export default Menubar;
