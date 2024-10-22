import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CssBaseline,
  Container,
  createTheme,
  ThemeProvider,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./routes/Routes";
import "./styles/App.css";
import {
  AccountCircle,
  Camera,
  Home,
  Nature,
  Search,
  ShoppingCart,
} from "@mui/icons-material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#ff4081",
    },
    background: {
      default: "white",
    },
  },
  typography: {
    h4: {
      color: "#1976d2",
    },
  },
});

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const showHeader = location.pathname !== "/";
  const [groupedResults, setGroupedResults] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleUpload = async (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const response = await fetch("http://localhost:3001/upload_multiple", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const data = await response.json();
      console.log("Upload successful:", data);
      setGroupedResults(data.grouped_results); // Save grouped results to state
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="main-container">
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Header />
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <AppRoutes
            groupedResults={groupedResults}
            handleUpload={handleUpload}
          />
        </Container>

        {showHeader && <Footer />}
        {isMobile && (
          <BottomNavigation
            showLabels
            sx={{
              position: "fixed",
              bottom: 0,
              width: "100%",
              backgroundColor: "white",
            }}
          >
            <BottomNavigationAction
              label="Home"
              icon={<Home />}
              onClick={() => handleNavigation("/")}
            />
            <BottomNavigationAction
              label="Gallery"
              icon={<Camera />}
              onClick={() => handleNavigation("/gallery")}
            />
            <BottomNavigationAction
              label="Cart"
              icon={<ShoppingCart />}
              onClick={() => handleNavigation("/cart")}
            />
            <BottomNavigationAction
              label="Maps"
              icon={<Nature />}
              onClick={() => handleNavigation("/maps")}
            />
            <BottomNavigationAction
              label="Profile"
              icon={<AccountCircle />}
              onClick={() =>
                token ? navigate("/profile") : navigate("/login")
              }
            />
          </BottomNavigation>
        )}
      </Box>
    </div>
  );
};

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AppContent />
  </ThemeProvider>
);

export default App;
