import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../App.css";

const Upload = ({ onUpload }) => {
  const [multipleImages, setMultipleImages] = useState([]);
  const [loading, setLoading] = useState(false);
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

  return (
    <div>
      <h1>Upload Images</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          required
          onChange={previewMultipleImages}
        />
        <h2>Multiple Images Preview</h2>
        <div id="multipleImagePreview" className="center">
          {multipleImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`preview-${index}`}
              style={{
                maxWidth: "100px",
                maxHeight: "100px",
                margin: "5px",
                border: "1px solid #fff",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
        <button type="submit">Upload Multiple Images</button>
      </form>
      {loading && (
        <div id="loadingOverlay">
          <div id="loadingText">Loading, please wait...</div>
        </div>
      )}
    </div>
  );
};

export default Upload;
