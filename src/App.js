import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  CssBaseline,
  Container,
  createTheme,
  ThemeProvider,
  Box,
} from "@mui/material";
import Upload from "./components/Upload";
import Results from "./components/Results";
import ResultsMultiple from "./components/ResultsMultiple";
import Header from "./components/Header";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Feed from "./components/Feed";
import axios from "axios";
import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#ff4081",
    },
    background: {
      default: "#e3f2fd",
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
  const showSidebar = location.pathname !== "/login";
  const [images, setImages] = useState([]);
  const [groupedResults, setGroupedResults] = useState({});

  useEffect(() => {
    // Fetch images from PHP endpoint
    axios
      .get(
        "https://dev.duniadalamdigital.com/carifoto/php-service/GetImagesService.php"
      )
      .then((response) => {
        console.log(response.data.images); // Log the images data
        setImages(response.data.images);
      })
      .catch((error) => console.error("Error fetching images:", error));
  }, []);

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
      {showSidebar && <Sidebar />}
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {showHeader && <Header />}
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Routes>
            <Route exact path="/" element={<Feed images={images} />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/upload"
              element={<Upload onUpload={handleUpload} />}
            />
            <Route
              path="/results-multiple"
              element={<ResultsMultiple groupedResults={groupedResults} />}
            />
            <Route path="/results" element={<Results />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Container>
        {showHeader && <Footer />}
      </Box>
    </div>
  );
};

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router basename="/carifoto">
      <AppContent />
    </Router>
  </ThemeProvider>
);

export default App;
