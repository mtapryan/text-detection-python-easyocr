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

  useEffect(() => {
    // Fetch images from PHP endpoint
    fetch("http://localhost:8000/GetImagesService.php")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.images); // Log the images data
        setImages(data.images);
      })
      .catch((error) => console.error("Error fetching images:", error));
  }, []);

  console.log(images);

  return (
    <div className="main-container">
      {showSidebar && <Sidebar />}
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {showHeader && <Header />}
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Routes>
            <Route exact path="/" element={<Feed images={images} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/results" element={<Results />} />
            <Route path="/results-multiple" element={<ResultsMultiple />} />
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
