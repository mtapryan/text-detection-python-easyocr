import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import fotocapLogo from "../assets/fotocap2-horizontal.png";
import Menubar from "./Menubar"; // Import Menubar component

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <Box
          component="img"
          src={fotocapLogo}
          alt="FotoCap Logo"
          sx={{ height: 40, mr: 2 }}
          onClick={() => navigate("/")}
        />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontSize: isMobile ? 12 : 20 }}
        ></Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Menubar />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
