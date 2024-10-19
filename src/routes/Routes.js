import React from "react";
import { Route, Routes } from "react-router-dom";
import Feed from "../pages/Feed";
import Login from "../pages/Login";
import Upload from "../pages/Upload";
import Results from "../pages/Results";
import ResultsMultiple from "../pages/ResultsMultiple";
import Profile from "../pages/Profile";
import Gallery from "../pages/Gallery";
import Maps from "../pages/Maps"; // Import Maps component

const AppRoutes = ({ images, groupedResults, handleUpload }) => (
  <Routes>
    <Route exact path="/" element={<Feed images={images} />} />
    <Route path="/login" element={<Login />} />
    <Route path="/upload" element={<Upload onUpload={handleUpload} />} />
    <Route
      path="/results-multiple"
      element={<ResultsMultiple groupedResults={groupedResults} />}
    />
    <Route path="/results" element={<Results />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/gallery" element={<Gallery />} />
    <Route path="/maps" element={<Maps />} /> {/* Add Maps route */}
  </Routes>
);

export default AppRoutes;
