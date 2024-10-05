import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  CssBaseline,
  CircularProgress,
  Box,
  Container,
  createTheme,
  ThemeProvider,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import Upload from "./components/Upload";
import Results from "./components/Results";
import ResultsMultiple from "./components/ResultsMultiple";
import Header from "./components/Header";
import "./App.css"; // Import style CSS

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

const App = () => {
  const [results, setResults] = useState([]);
  const [groupedResults, setGroupedResults] = useState({});
  const [resultImage, setResultImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const clearUploads = async () => {
      try {
        await fetch("http://localhost:3001/clear_uploads", {
          method: "POST",
        });
      } catch (error) {
        console.error("Error clearing uploads folder:", error);
      }
    };

    clearUploads();
  }, []);

  const handleUpload = async (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      setIsLoading(true); // Show loading overlay when uploading images
      const response = await fetch("http://localhost:3001/upload_multiple", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      // Log the data received from the backend
      console.log("Data received from backend:", data);

      setGroupedResults(data.grouped_results);
      setResults(data.results);
      setResultImage(data.result_image);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename="/carifoto">
        <Header />
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Box sx={{ my: 4 }}>
            {isLoading && (
              <Box
                id="loadingOverlay"
                sx={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 9999,
                }}
              >
                <CircularProgress color="inherit" />
              </Box>
            )}

            <Routes>
              <Route
                exact
                path="/"
                element={<Upload onUpload={handleUpload} />}
              />
              <Route
                path="/results"
                element={
                  <Results results={results} resultImage={resultImage} />
                }
              />
              <Route
                path="/results-multiple"
                element={<ResultsMultiple groupedResults={groupedResults} />}
              />
            </Routes>
            <Card sx={{ mt: 4, backgroundColor: "#f5f5f5" }}>
              <CardContent>
                <Typography
                  variant="body1"
                  component="p"
                  color="primary"
                  gutterBottom
                >
                  CariFoto is a user-friendly photo capture and upload platform
                  that allows you to instantly share your special moments.
                  Easily upload and manage high-quality images with seamless
                  integration, powered by Dunia Inovasi Teknologi.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;
