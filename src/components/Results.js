import React from "react";

const Results = ({ results, resultImage }) => {
  return (
    <div>
      <h1>OCR Results</h1>
      <h2>Detected Text Image</h2>
      <img
        src={resultImage}
        alt="Detected Text"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            <strong>Text:</strong> {result.text} (Score: {result.score})
            <br />
            <strong>Bounding Box:</strong> {result.bbox}
          </li>
        ))}
      </ul>
      <a href="/">Go back</a>
    </div>
  );
};

export default Results;
