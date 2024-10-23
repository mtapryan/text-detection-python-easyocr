import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import axios from "axios";
import "../styles/Gallery.css";
import {
  CheckCircle,
  Close,
} from "@mui/icons-material";

const Gallery = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile view
  const handleClickOpen = (image) => {
    setSelectedImage(image); // Set image data yang diklik
    setOpen(true); // Buka dialog
  };

  const handleClose = () => {
    setOpen(false); // Tutup dialog
    setSelectedImage(null); // Hapus image yang dipilih
  };

  const handleAddToCart = () => {};

  const handleSearch = () => {};
  const handleSearchClick = () => {};

  // Fungsi untuk handle upload gambar
  const handleUploadClick = () => {};

  useEffect(() => {
    axios
      .post(
        "https://dev.duniadalamdigital.com/carifoto/php-service/ListGalleryService.php",
        {
          filter: "",
          page: 0,
          size: 50,
        }
        // {
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE3MjkyMjYwNzAsImV4cCI6MTcyOTIyOTY3MCwidXNlcklkIjoiZWU4YzI1NGMtODg0ZS0xMWVmLTk5NjItMDAxNjNjZThjZDVjIn0.JakYU7wdXSF2AM3UE6Tn7aSCM0afxI6iqGEAspcnaPc`,
        //   },
        // }
      )
      .then((response) => {
        console.log("🚀 ~ .then ~ response:", response);
        setData(response.data.data.records);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

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
          Error fetching data: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="gallery-container">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column", // Stack vertically for smaller devices
          gap: 2,
          marginBottom: 2,
        }}
      >
        {/* Search Area */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row", // Column on mobile, row on desktop
            justifyContent: "space-between",
            alignItems: isMobile ? "stretch" : "center", // Stretch to full width on mobile
            gap: 2,
          }}
        >
          <TextField
            sx={{ flexGrow: 1 }} // Full width for TextField
            placeholder="Search By BIB Number, Location, Event Name..."
            variant="outlined"
            size="small"
            onChange={(e) => handleSearch(e.target.value)} // Search function
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchClick} // Search button function
          >
            Cari
          </Button>

          {/* Upload button only beside the search button on desktop */}
          {!isMobile && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleUploadClick} // Upload button function
            >
              Upload
            </Button>
          )}
        </Box>

        {/* Upload button below on mobile */}
        {isMobile && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUploadClick} // Upload button function
          >
            Upload
          </Button>
        )}
      </Box>

      <Masonry
        columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
        sx={{ margin: 0 }}
        spacing={2}
      >
        {data.map((image) => (
          <Box key={image.id} className="gallery-item">
            <img
              src={`https://dev.duniadalamdigital.com/carifoto/php-service/${image.image_watermark}`}
              alt={image.caption}
              className="gallery-image"
              onClick={() => handleClickOpen(image)} //
            />
            <Typography variant="body2" className="gallery-caption">
              {image.caption}
            </Typography>
          </Box>
        ))}
      </Masonry>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            style={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>

          {selectedImage && (
            <Grid container spacing={2} sx={{ marginTop: 3 }}>
              {/* Grid untuk gambar */}
              <Grid item xs={12} md={6}>
                <img
                  src={`https://dev.duniadalamdigital.com/carifoto/php-service/${selectedImage.image_watermark}`}
                  alt={selectedImage.caption}
                  style={{ width: "100%", height: "auto" }} // Gambar responsif
                />
              </Grid>

              {/* Grid untuk teks */}
              <Grid
                item
                xs={12}
                md={6}
                style={{
                  display: "flex",
                  alignItems: "start",
                  flexDirection: "column",
                  overflowWrap: "break-word", // Untuk pembungkusan kata
                  wordBreak: "break-word", // Memecah kata panjang jika perlu
                }}
              >
                <Card sx={{ width: "100%", padding: 2 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    <Avatar
                      src={selectedImage.profilePicture} // Ganti dengan path foto profil
                      alt={selectedImage.username}
                      style={{ marginRight: "8px" }} // Jarak antara foto profil dan nama pengguna
                    />
                    <div>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ textAlign: "left" }}
                      >
                        {selectedImage.username}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{
                          textAlign: "left",
                          overflowWrap: "break-word",
                        }} // Tambahkan gaya untuk pembungkusan
                      >
                        {selectedImage.location}
                        {" - "}
                        {selectedImage.event}
                      </Typography>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: 10,
                    }}
                  >
                    <Typography variant="h6" color="warning" fontWeight="bold">
                      10.000 Point
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: 3 }}>
                      Kelebihan:
                      <Box
                        component="ul"
                        sx={{
                          paddingLeft: 2,
                          marginTop: 2,
                          listStyleType: "none",
                        }}
                      >
                        <li>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <CheckCircle
                              fontSize="small"
                              color="info"
                              style={{ marginRight: 8 }}
                            />
                            Resolusi tinggi
                          </div>
                        </li>
                        <li>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <CheckCircle
                              fontSize="small"
                              color="info"
                              style={{ marginRight: 8 }}
                            />
                            Tidak ada watermark
                          </div>
                        </li>
                        <li>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <CheckCircle
                              fontSize="small"
                              color="info"
                              style={{ marginRight: 8 }}
                            />
                            Lisensi komersial
                          </div>
                        </li>
                      </Box>
                    </Typography>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddToCart(selectedImage)} // Tambahkan logika fungsi handleAddToCart
                    style={{ marginTop: "20px" }}
                  >
                    Add to Cart
                  </Button>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Gallery;
