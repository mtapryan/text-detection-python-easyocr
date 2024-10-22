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
import Register from "../pages/Register";
import CheckoutPage from "../pages/Cekout";
import PaymentSuccessPage from "../pages/SuccessPayment";
import Cart from "../pages/Cart";

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
    <Route path="/register" element={<Register />} />
    <Route path="/successPayment" element={<PaymentSuccessPage />} />{" "}
    {/* Add Maps route */}
    <Route path="/cart" element={<Cart />} /> {/* Add Maps route */}
    <Route path="/cekout" element={<CheckoutPage />} /> {/* Add Maps route */}
    <Route path="/maps" element={<Maps />} /> {/* Add Maps route */}
  </Routes>
);

export default AppRoutes;
