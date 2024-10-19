import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  CssBaseline,
  Container,
  createTheme,
  ThemeProvider,
  Box,
} from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./routes/Routes";
import "./styles/App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#ff4081",
    },
    background: {
      default: "#A9A9A9",
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
  const showHeader = location.pathname !== "/";
  const [groupedResults, setGroupedResults] = useState({});

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
