import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import fotocapLogo from "../assets/fotocap2.png";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <Box
          component="img"
          src={fotocapLogo}
          alt="FotoCap Logo"
          sx={{ height: 50, mr: 2 }}
        />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontSize: isMobile ? 12 : 20 }}
        >
          FotoCap - Capture and upload your amazing moment with us
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
