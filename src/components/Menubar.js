import React from "react";
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { Home, AccountCircle, Nature, Camera } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "../styles/MenubarStyle.css"; // Updated import

const Menubar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  console.log(token);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <List
      className="menubar"
      style={{ display: "flex", flexDirection: "row", padding: 0 }}
    >
      <ListItem button onClick={() => handleNavigation("/")}>
        <ListItemIcon>
          <Home />
        </ListItemIcon>
        <ListItemText primary="Beranda" />
      </ListItem>
      <ListItem button onClick={() => handleNavigation("/gallery")}>
        <ListItemIcon>
          <Camera />
        </ListItemIcon>
        <ListItemText primary="Galeri" />
      </ListItem>
      <ListItem button onClick={() => handleNavigation("/maps")}>
        <ListItemIcon>
          <Nature />
        </ListItemIcon>
        <ListItemText primary="Lokasi" />
      </ListItem>
      <ListItem button onClick={() => token ? navigate("/profile") : navigate("/login")}>
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        <ListItemText primary={token ? "Akun" : "Login"} />
      </ListItem>
    </List>
  );
};

export default Menubar;
