import React from "react";
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import {
  Home,
  AccountCircle,
  Nature,
  Camera,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <List>
        <ListItem button onClick={() => handleNavigation("/")}>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Beranda" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Camera />
          </ListItemIcon>
          <ListItemText primary="Galeri" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation("/login")}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="Akun Saya" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Nature />
          </ListItemIcon>
          <ListItemText primary="Lokasi" />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
