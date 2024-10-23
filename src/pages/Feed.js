import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver"; // Import file-saver
import capitalizeEachWord from "../utils/CapitalizeEachWord"; // Import the utility function
import "../styles/PostStyles.css";

const Feed = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .post(
        "https://dev.duniadalamdigital.com/carifoto/php-service/ListFeedService.php",
        {
          filter: "",
          page: 0,
          size: 10,
        }
      )
      .then((response) => {
        setImages(response.data.data.records);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleLoveClick = () => {
    if (!token) {
      toast.error("Anda harus login terlebih dahulu", {
        onClose: () => navigate("/login"),
      });
    } else {
      // Handle the love action here
    }
  };

  const handleDownload = (imageUrl) => {
    const fileName = imageUrl.split("/").pop();
    saveAs(imageUrl, fileName);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 5 }}>
        <Typography variant="h6" color="error">
          Error fetching posts: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="feed">
      <ToastContainer position="top-center" autoClose={3000} />
      {images.map((image) => (
        <Post
          key={image.id}
          isMobile={isMobile}
          username={capitalizeEachWord(image.full_name)} // Capitalize each word
          location={image.location}
          imageUrl={`https://dev.duniadalamdigital.com/carifoto/php-service/${image.image_url}`}
          caption={image.caption}
          profileImage={`https://ui-avatars.com/api/?name=${image.username}`}
          love={image.love} // Pass the love prop
          onLoveClick={handleLoveClick}
          onDownload={() =>
            handleDownload(
              `https://dev.duniadalamdigital.com/carifoto/php-service/${image.image_url}`
            )
          } // Pass the handleDownload function
        />
      ))}
    </Box>
  );
};

export default Feed;
