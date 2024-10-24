<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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
require_once 'PHPExcel.php'; // Include PhpSpreadsheet library

use PhpOffice\PhpSpreadsheet\IOFactory;

class UploadExcelRunnerService {
    private $link;
    private $logger;
    private $secretKey = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2'; // Replace with your actual secret key

    public function __construct($link) {
        $this->link = $link;
        $this->logger = new Logger(); // Initialize the logger
    }

    public function uploadExcel($token, $eventId, $file) {
        $this->logger->log("Starting uploadExcel process");

        $decoded = $this->decodeToken($token);
        if (!$decoded) {
            $this->logger->log("Invalid token");
            return json_encode(["status" => "failed", "message" => "Invalid token"]);
        }

        $userId = $decoded['userId'];
        $userType = $this->getUserType($userId);
        if ($userType != '1001' && $userType != '1002') {
            $this->logger->log("Unauthorized user type: " . $userType);
            return json_encode(["status" => "failed", "message" => "Unauthorized user type"]);
        }

        // Save the uploaded file to the "excels" folder with a timestamp
        $uploadDir = 'excels/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $timestamp = time();
        $filePath = $uploadDir . 'file_upload_excel_' . $timestamp . '.xlsx';
        if (!move_uploaded_file($file['tmp_name'], $filePath)) {
            $this->logger->log("Failed to save the uploaded file");
            return json_encode(["status" => "failed", "message" => "Failed to save the uploaded file"]);
        }

        try {
            $spreadsheet = IOFactory::load($filePath);
            $sheet = $spreadsheet->getActiveSheet();
            $highestRow = $sheet->getHighestRow();
            $highestColumn = $sheet->getHighestColumn();

            $createdAt = date('Y-m-d H:i:s');
            $modifyAt = date('Y-m-d H:i:s');

            for ($row = 2; $row <= $highestRow; $row++) {
                $runnerNumber = $sheet->getCell('A' . $row)->getValue();
                $runnerName = $sheet->getCell('B' . $row)->getValue();

                // Check for duplicate runner_number within the same event_id
                $checkSql = "SELECT COUNT(*) as count FROM runner WHERE event_id = ? AND runner_number = ?";
                if($checkStmt = mysqli_prepare($this->link, $checkSql)){
                    mysqli_stmt_bind_param($checkStmt, "ss", $eventId, $runnerNumber);
                    mysqli_stmt_execute($checkStmt);
                    $result = mysqli_stmt_get_result($checkStmt);
                    $count = mysqli_fetch_assoc($result)['count'];
                    mysqli_stmt_close($checkStmt);

                    if ($count > 0) {
                        $this->logger->log("Duplicate runner_number found: " . $runnerNumber);
                        return json_encode(["status" => "failed", "message" => "Duplicate runner_number found: " . $runnerNumber]);
                    }
                } else {
                    $error = mysqli_error($this->link);
                    $this->logger->log("Preparation failed: " . $error);
                    return json_encode(["status" => "failed", "message" => "Preparation failed", "error" => $error]);
                }

                $sql = "INSERT INTO runner (event_id, runner_number, runner_name, created_at, modify_at, path_excel) 
                        VALUES (?, ?, ?, ?, ?, ?)";
                if($stmt = mysqli_prepare($this->link, $sql)){
                    mysqli_stmt_bind_param($stmt, "ssssss", $eventId, $runnerNumber, $runnerName, $createdAt, $modifyAt, $filePath);
                    if(!mysqli_stmt_execute($stmt)){
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

            return json_encode(["status" => "success", "message" => "Runners uploaded successfully"]);
        } catch (Exception $e) {
            $this->logger->log("Error processing file: " . $e->getMessage());
            return json_encode(["status" => "failed", "message" => "Error processing file", "error" => $e->getMessage()]);
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

    private function getUserType($userId) {
        $sql = "SELECT user_type FROM login WHERE id = ?";
        if($stmt = mysqli_prepare($this->link, $sql)){
            mysqli_stmt_bind_param($stmt, "s", $userId);
            if(mysqli_stmt_execute($stmt)){
                $result = mysqli_stmt_get_result($stmt);
                if($row = mysqli_fetch_assoc($result)){
                    return $row['user_type'];
                } else {
                    $this->logger->log("User not found");
                    return false;
                }
            } else {
                $error = mysqli_error($this->link);
                $this->logger->log("Execution failed: " . $error);
                return false;
            }
            mysqli_stmt_close($stmt);
        } else {
            $error = mysqli_error($this->link);
            $this->logger->log("Preparation failed: " . $error);
            return false;
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

    $eventId = $_POST['event_id'];
    $file = $_FILES['event_excel_upload'];

    $service = new UploadExcelRunnerService($link);
    echo $service->uploadExcel($jwt, $eventId, $file);
}
?>