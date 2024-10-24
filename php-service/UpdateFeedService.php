<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Handle preflight request
    header("HTTP/1.1 200 OK");
    exit();
}

require_once 'config.php'; // Include the database configuration file
require_once 'Logger.php'; // Include the Logger class

class UpdateFeedService {
    private $link;
    private $logger;
    private $secretKey = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2'; // Replace with your actual secret key

    public function __construct($link) {
        $this->link = $link;
        $this->logger = new Logger(); // Initialize the logger
    }

    public function updatePost($token, $data, $file) {
        $this->logger->log("Starting updatePost process");

        $decoded = $this->decodeToken($token);
        if (!$decoded) {
            $this->logger->log("Invalid token");
            return json_encode(["status" => "failed", "message" => "Invalid token"]);
        }

        $userId = $decoded['userId'];
        $photographerId = $this->getPhotographerId($userId);
        if (!$photographerId) {
            $this->logger->log("Photographer ID not found");
            return json_encode(["status" => "failed", "message" => "Photographer ID not found"]);
        }

        $postId = $data['post_id'];
        $location = $data['location'];
        $event = $data['event'];
        $caption = $data['caption'];

        $imageUrl = $this->getImageUrl($postId);
        if (!$imageUrl) {
            $this->logger->log("Image URL not found");
            return json_encode(["status" => "failed", "message" => "Image URL not found"]);
        }

        if ($file) {
            $newImageUrl = $this->uploadImage($file, $userId);
            if (!$newImageUrl) {
                $this->logger->log("Image upload failed");
                return json_encode(["status" => "failed", "message" => "Image upload failed"]);
            }
            $this->deleteImage($imageUrl);
            $imageUrl = $newImageUrl;
        }

        $sql = "UPDATE post SET location = ?, event = ?, caption = ?, image_url = ? WHERE id = ? AND user_id = ?";
        if($stmt = mysqli_prepare($this->link, $sql)){
            mysqli_stmt_bind_param($stmt, "ssssss", $location, $event, $caption, $imageUrl, $postId, $userId);
            if(mysqli_stmt_execute($stmt)){
                return json_encode(["status" => "success", "message" => "Post updated successfully"]);
            } else {
                $error = mysqli_error($this->link);
                $this->logger->log("Execution failed: " . $error);
                return json_encode(["status" => "failed", "message" => "Execution failed", "error" => $error]);
            }
            mysqli_stmt_close($stmt);
        } else {
            $error = mysqli_error($this->link);
            $this->logger->log("Preparation failed: " . $error);
            return json_encode(["status" => "failed", "message" => "Preparation failed", "error" => $error]);
        }
    }

    private function decodeToken($token) {
        $this->logger->log("Decoding token");

        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            $this->logger->log("Invalid token format");
            return false;
        }

        $header = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[0])), true);
        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
        $signatureProvided = $parts[2];

        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($header)));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($payload)));
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $this->secretKey, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        if ($base64UrlSignature !== $signatureProvided) {
            $this->logger->log("Invalid token signature");
            return false;
        }

        return $payload;
    }

    private function getPhotographerId($userId) {
        $sql = "SELECT username FROM login WHERE id = ?";
        if($stmt = mysqli_prepare($this->link, $sql)){
            mysqli_stmt_bind_param($stmt, "s", $userId);
            if(mysqli_stmt_execute($stmt)){
                $result = mysqli_stmt_get_result($stmt);
                if($row = mysqli_fetch_assoc($result)){
                    return $row['username'];
                }
            }
            mysqli_stmt_close($stmt);
        }
        return false;
    }

    private function getImageUrl($postId) {
        $sql = "SELECT image_url FROM post WHERE id = ?";
        if($stmt = mysqli_prepare($this->link, $sql)){
            mysqli_stmt_bind_param($stmt, "s", $postId);
            if(mysqli_stmt_execute($stmt)){
                $result = mysqli_stmt_get_result($stmt);
                if($row = mysqli_fetch_assoc($result)){
                    return $row['image_url'];
                }
            }
            mysqli_stmt_close($stmt);
        }
        return false;
    }

    private function uploadImage($file, $userId) {
        $timestamp = time();
        $targetDir = "uploads/";
        $targetFile = $targetDir . $userId . "_" . $timestamp . "." . strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
        $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

        // Check if image file is a actual image or fake image
        $check = getimagesize($file["tmp_name"]);
        if($check === false) {
            $this->logger->log("File is not an image");
            return false;
        }

        // Check file size
        if ($file["size"] > 5000000) { // 5MB limit
            $this->logger->log("File is too large");
            return false;
        }

        // Allow certain file formats
        if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
            $this->logger->log("Invalid file format");
            return false;
        }

        if (move_uploaded_file($file["tmp_name"], $targetFile)) {
            return $targetFile;
        } else {
            $this->logger->log("Failed to move uploaded file");
            return false;
        }
    }

    private function deleteImage($imageUrl) {
        if (file_exists($imageUrl)) {
            unlink($imageUrl);
            $directory = dirname($imageUrl);
            if (is_dir($directory) && count(glob("$directory/*")) === 0) {
                rmdir($directory);
            }
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        echo json_encode(["status" => "failed", "message" => "Authorization header missing"]);
        exit();
    }

    $authHeader = $headers['Authorization'];
    if (stripos($authHeader, 'Bearer ') !== 0) {
        echo json_encode(["status" => "failed", "message" => "Invalid Authorization header format"]);
        exit();
    }

    $jwt = substr($authHeader, 7);

    if (!$jwt) {
        echo json_encode(["status" => "failed", "message" => "Invalid Authorization header format"]);
        exit();
    }

    $data = $_POST;
    $file = isset($_FILES['image']) ? $_FILES['image'] : null;

    $service = new UpdateFeedService($link);
    echo $service->updatePost($jwt, $data, $file);
}
?>