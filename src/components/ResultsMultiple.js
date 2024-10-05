import React from "react";

const ResultsMultiple = ({ groupedResults }) => {
    console.log(groupedResults);
  return (
    <div>
      <h1>Results</h1>
      <div className="results-container">
        {Object.entries(groupedResults).map(([text, images], index) => (
          <div className="result-group" key={index}>
            <h2>{text}</h2>
            {images.map((imageResult, imgIndex) => (
              <div key={imgIndex} className="image-result">
                <img
                  src={`http://localhost:3000/${imageResult.image_url}`}
                  alt={`Result for ${text}`}
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    margin: "10px",
                    border: "1px solid #fff",
                  }}
                />
                <p>Score: {imageResult.score}</p>
                <p>Bounding Box: {JSON.stringify(imageResult.bbox)}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <a href="/" className="back-button">
        Go Back
      </a>
    </div>
  );
};

// Add the default export here
export default ResultsMultiple;
