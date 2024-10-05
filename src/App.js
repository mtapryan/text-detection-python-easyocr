import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Upload from "./components/Upload";
import Results from "./components/Results";
import ResultsMultiple from "./components/ResultsMultiple";

const App = () => {
  const [results, setResults] = useState([]);
  const [groupedResults, setGroupedResults] = useState({});
  const [resultImage, setResultImage] = useState("");

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
      const data = await response.json();
      setGroupedResults(data.grouped_results);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <Router>
      <div className="App">
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
