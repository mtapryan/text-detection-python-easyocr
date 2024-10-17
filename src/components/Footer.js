import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      className="footer"
      sx={{
        backgroundColor: "#f5f5f5",
        width: "100%",
        position: "relative",
        bottom: 0,
      }}
    >
      <Card>
        <CardContent>
          <Typography
            variant="body1"
            component="p"
            color="primary"
            gutterBottom
          >
            CariFoto is a user-friendly photo capture and upload platform that
            allows you to instantly share your special moments. Easily upload
            and manage high-quality images with seamless integration, powered by
            Dunia Inovasi Teknologi.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Footer;
