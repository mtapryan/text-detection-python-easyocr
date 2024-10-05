# Text Detection with Python and EasyOCR

## Project Overview

This project consists of a React frontend and a Flask backend. The React frontend allows users to upload multiple images, preview them, and view the results after processing. The Flask backend handles the image processing and returns the results to the frontend.

## Prerequisites

- Node.js and npm (for the React frontend)
- Python 3.x (for the Flask backend)
- pip (Python package installer)

## Installation

### Backend (Flask)

1. **Navigate to the backend directory** (where `main.py` is located).

2. **Create a virtual environment** (optional but recommended):
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install the required Python packages**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Run the Flask server**:
    ```bash
    python main.py
    ```

### Frontend (React)

1. **Navigate to the frontend directory** (where `package.json` is located).

2. **Install the required npm packages**:
    ```bash
    npm install
    ```

3. **Run the React development server**:
    ```bash
    npm start
    ```

## File Descriptions

### `main.py`

This is the main file for the Flask backend. It handles the following:

- **Image Upload**: Receives multiple image files, saves them, and processes them using EasyOCR.
- **Image Processing**: Uses EasyOCR to detect text in the images and groups the results based on the detected text.
- **Serve Images**: Serves the processed images from the `public/uploads` directory.
- **Clear Uploads**: Provides an endpoint to clear the uploads directory.

### `App.js`

This is the main file for the React frontend. It handles the following:

- **Routing**: Uses `react-router-dom` to define routes for the upload page and the results page.
- **State Management**: Manages the state for the uploaded images and the results using React's `useState` hook.
- **Upload Handling**: Defines the `handleUpload` function to send the uploaded images to the Flask backend.

### `Upload.js`

This component handles the image upload functionality. It includes:

- **Image Preview**: Allows users to preview the selected images before uploading.
- **Form Submission**: Handles the form submission to upload the images to the backend.
- **Loading Indicator**: Displays a loading indicator while the images are being uploaded.

### `ResultsMultiple.js`

This component displays the results of the image processing. It includes:

- **Results Display**: Displays the grouped results returned by the backend, including the detected text, bounding boxes, and scores.
- **Back Button**: Provides a button to navigate back to the upload page.

## Running the Project

1. **Start the Flask backend**:
    ```bash
    python main.py
    ```

2. **Start the React frontend**:
    ```bash
    npm start
    ```

3. **Open your browser** and navigate to `http://localhost:3000` to use the application.