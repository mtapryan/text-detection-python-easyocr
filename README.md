## Project Overview

This project consists of a React frontend, a Flask backend, and PHP services for login and image preview functionalities. The React frontend allows users to upload multiple images, preview them, and view the results after processing. The Flask backend handles the image processing and returns the results to the frontend. The PHP services handle user login and image preview functionalities, utilizing a MariaDB database.

## Prerequisites

- Node.js v20.13.1 and npm 10.5.2 (for the React frontend)
- Python 3.12.5 (for the Backend Flask and EasyOCR)
- pip (Python package installer)
- PHP 7.4 or higher (for the PHP services)
- MariaDB 10.5 or higher (for the database)

## Installation

### Backend (Flask)

1. **Navigate to the backend directory** (where `main.py` is located).

2. **Create a virtual environment** (optional but recommended):
    ```bash
    python3 -m venv env
    source env/bin/activate  # On Windows use `env\Scripts\activate`
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
    yarn install
    ```

3. **Run the React development server**:
    ```bash
    yarn start
    ```

### PHP Services

1. **Ensure PHP is installed** on your system. You can check by running:
    ```bash
    php -v
    ```

2. **Place the PHP files** (`LoginService.php`, `GetImagesService.php`, `config.php`) in your web server's root directory (e.g., `htdocs` for XAMPP or `www` for WAMP).

3. **Start your web server** (e.g., XAMPP, WAMP, or any other PHP server).

### Database (MariaDB)

1. **Start the MariaDB database**:
    ```bash
    sudo service mysql start
    atau
    sudo systemctl start mariadb
    ```

2. **Create the database and table**:
    ```sql
    CREATE DATABASE db_service;

    USE db_service;

    CREATE TABLE login (
        id CHAR(36) PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(15),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        login_at TIMESTAMP
    );
    ```

3. **Insert a sample row**:
    ```sql
    INSERT INTO login (id, username, password, email, phone, created_at, login_at)
    VALUES (UUID(), 'sample_user', 'sample_password', 'sample_email@example.com', '1234567890', NOW(), NOW());
    ```

### Setting Up MariaDB in Visual Studio Code Using SQLTools

1. **Install SQLTools Extension**:
    - Open Visual Studio Code.
    - Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
    - Search for `SQLTools` and install it.

2. **Configure SQLTools**:
    - Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
    - Type `SQLTools: New Connection` and select it.
    - Choose `MariaDB/MySQL` as the driver.
    - Fill in the connection details:
        - **Name**: `db_service`
        - **Server/Host**: `localhost`
        - **Port**: `3306`
        - **Database**: `db_service`
        - **Username**: `user` (as per `config.php`)
        - **Password**: `1234` (as per `config.php`)
    - Save the connection.

3. **Connect to the Database**:
    - Open the SQLTools view by clicking on the SQLTools icon in the Activity Bar.
    - Click on the `db_service` connection to connect.
    - You can now run SQL queries directly from Visual Studio Code.

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

### `LoginService.php`

This PHP service handles user login functionality. It includes:

- **Database Connection**: Connects to the MariaDB database using the configuration in `config.php`.
- **Login Validation**: Validates the username and password against the `login` table in the database.

### `GetImagesService.php`

This PHP service handles image preview functionality. It includes:

- **Directory Scanning**: Scans the `public/storage` directory for images.
- **Image Data**: Returns the image data as a JSON response, including default values for username, location, and caption.

### `config.php`

This file contains the database configuration for the PHP services. It includes:

- **Database Connection Details**: Defines the server, username, password, and database name for the MariaDB connection.

## Running the Project

1. **Start the MariaDB database**:
    ```bash
    sudo service mysql start
    atau
    sudo systemctl start mariadb
    ```

2. **Start the Flask backend**:
    ```bash
    python main.py
    ```

3. **Start the React frontend**:
    ```bash
    yarn start
    ```

4. **Start the PHP server** (if using built-in PHP server):
    ```bash
    php -S localhost:8000
    ```

5. **Open your browser** and navigate to `http://localhost:3000` to use the application.