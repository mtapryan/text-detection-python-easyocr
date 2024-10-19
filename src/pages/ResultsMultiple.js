import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import "./../styles/App.css";

const ResultsMultiple = ({ groupedResults = {} }) => {
  console.log("Grouped Results in ResultsMultiple:", groupedResults);

  return (
    <Box className="main-content">
      <Typography variant="h4" gutterBottom>
        Results
      </Typography>
      <Grid container spacing={3} className="results-container">
        {Object.entries(groupedResults).map(([text, images], index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h5">{text}</Typography>
                <Grid container spacing={2}>
                  {images.map((imageResult, imgIndex) => (
                    <Grid item key={imgIndex}>
                      <CardMedia
                        component="img"
                        image={`http://localhost:3001${imageResult.image_url}`}
                        alt={`Result for ${text}`}
                        sx={{
                          maxWidth: "200px",
                          maxHeight: "200px",
                          margin: "10px",
                          border: "1px solid #fff",
                        }}
                      />
                      <Typography>Score: {imageResult.score}</Typography>
                      <Typography>
                        Bounding Box: {JSON.stringify(imageResult.bbox)}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button
        href="/carifoto"
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
      >
        Go Back
      </Button>
    </Box>
  );
};

export default ResultsMultiple;
