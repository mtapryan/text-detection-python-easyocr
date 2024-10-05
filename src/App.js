import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Upload from "./components/Upload";
import Results from "./components/Results";
import ResultsMultiple from "./components/ResultsMultiple";
import "./App.css"; // Import style CSS

const App = () => {
  const [results, setResults] = useState([]);
  const [groupedResults, setGroupedResults] = useState({});
  const [resultImage, setResultImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      setGroupedResults(data.grouped_results);
      setResults(data.results);
      setResultImage(data.result_image);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsLoading(false); // Hide loading overlay once upload is finished
    }
  };

  return (
    <Router>
      <div className="App">
        {/* Show loading overlay while images are being uploaded */}
        {isLoading && (
          <div id="loadingOverlay" className="loading-overlay">
            <div id="loadingText" className="loading-text">
              Loading, please wait...
            </div>
          </div>
        )}

        <Routes>
          <Route exact path="/" element={<Upload onUpload={handleUpload} />} />
          <Route
            path="/results"
            element={<Results results={results} resultImage={resultImage} />}
          />
          <Route
            path="/results-multiple"
            element={<ResultsMultiple groupedResults={groupedResults} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
