import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Box,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogContent,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import "./../App.css";

const Upload = ({ onUpload }) => {
  const [multipleImages, setMultipleImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const previewMultipleImages = (event) => {
    const files = event.target.files;
    const previewImages = [];
    for (let i = 0; i < files.length; i++) {
      previewImages.push(URL.createObjectURL(files[i]));
    }
    setMultipleImages(previewImages);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const files = event.target.elements.images.files;
    try {
      await onUpload(files);
      navigate("/results-multiple");
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = (src) => {
    setSelectedImage(src);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  return (
    <Box sx={{ textAlign: "center", mt: 15 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Upload Images
      </Typography>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          required
          onChange={previewMultipleImages}
          style={{ display: "none" }}
          id="upload-input"
        />
        <label htmlFor="upload-input">
          <Button variant="contained" color="primary" component="span">
            Choose Images
          </Button>
        </label>
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" component="h2">
            Images Preview
          </Typography>
          <Box
            id="multipleImagePreview"
            className="center"
            sx={{
              display: "flex",
              flexWrap: "nowrap",
              overflowX: "auto",
              justifyContent: "center",
              mt: 2,
            }}
          >
            {multipleImages.length === 0 ? (
              <Card
                sx={{
                  minWidth: 275,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                }}
              >
                <CardContent>
                  <ImageIcon sx={{ fontSize: 50, color: "#ccc" }} />
                  <Typography variant="body2" color="textSecondary">
                    No images to preview
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              multipleImages.map((src, index) => (
                <Card
                  key={index}
                  sx={{
                    minWidth: 150,
                    maxWidth: 150,
                    margin: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CardContent>
                    <img
                      src={src}
                      alt={`preview-${index}`}
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => handleClickOpen(src)}
                    />
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Upload Images"}
        </Button>
      </form>
      {loading && (
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
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogContent>
          <img
            src={selectedImage}
            alt="Selected"
            style={{ width: "100%", height: "auto" }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Upload;
