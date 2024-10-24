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

class DashboardService {
    private $link;
    private $logger;
    private $secretKey = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2'; // Replace with your actual secret key

    public function __construct($link) {
        $this->link = $link;
        $this->logger = new Logger(); // Initialize the logger
    }

    public function getSummary($token) {
    $this->logger->log("Starting getSummary process");

    $decoded = $this->decodeToken($token);
    if (!$decoded) {
        $this->logger->log("Invalid token");
        return json_encode(["status" => "failed", "message" => "Invalid token"]);
    }

    $userId = $decoded['userId'];

    // Fetch user_type from login table
    $sqlUserType = "SELECT user_type FROM login WHERE id = ?";
    if($stmtUserType = mysqli_prepare($this->link, $sqlUserType)){
        mysqli_stmt_bind_param($stmtUserType, "s", $userId);
        if(mysqli_stmt_execute($stmtUserType)){
            $resultUserType = mysqli_stmt_get_result($stmtUserType);
            if($resultUserType && mysqli_num_rows($resultUserType) == 1){
                $row = mysqli_fetch_assoc($resultUserType);
                $userType = $row['user_type'];
                $this->logger->log("Decoded userId: $userId, userType: $userType");
            } else {
                $this->logger->log("User not found for user ID: $userId");
                return json_encode(["status" => "failed", "message" => "User not found"]);
            }
        } else {
            $this->logger->log("Execution failed: " . mysqli_error($this->link));
            return json_encode(["status" => "failed", "message" => "Execution failed"]);
        }
        mysqli_stmt_close($stmtUserType);
    } else {
        $this->logger->log("Preparation failed: " . mysqli_error($this->link));
        return json_encode(["status" => "failed", "message" => "Preparation failed"]);
    }

    if ($userType == 1001) { // Admin
        $sql = "SELECT 
                    SUM(user.total_upload) as total_upload, 
                    SUM(user.total_download) as total_download, 
                    SUM(user.total_post) as total_post, 
                    SUM(user.total_income) as total_income,
                    (SELECT COUNT(*) FROM login WHERE user_type = 1004) as total_runner,
                    (SELECT COUNT(*) FROM login WHERE user_type = 1003) as total_photographer,
                    (SELECT COUNT(*) FROM login WHERE user_type = 1002) as total_publisher,
                    (SELECT COUNT(*) FROM login WHERE user_type = 1001) as total_controller
                FROM user
                JOIN login ON user.user_id = login.id";
    } else { // Other roles
        $sql = "SELECT 
                    SUM(user.total_upload) as total_upload, 
                    SUM(user.total_download) as total_download, 
                    SUM(user.total_post) as total_post, 
                    SUM(user.total_income) as total_income,
                    (SELECT COUNT(*) FROM login WHERE user_type = 1004) as total_runner,
                    (SELECT COUNT(*) FROM login WHERE user_type = 1003) as total_photographer,
                    (SELECT COUNT(*) FROM login WHERE user_type = 1002) as total_publisher,
                    (SELECT COUNT(*) FROM login WHERE user_type = 1001) as total_controller
                FROM user 
                JOIN login ON user.user_id = login.id
                WHERE user.user_id = ?";
    }

    if($stmt = mysqli_prepare($this->link, $sql)){
        if ($userType != 1001) {
            mysqli_stmt_bind_param($stmt, "s", $userId);
        }
        if(mysqli_stmt_execute($stmt)){
            $result = mysqli_stmt_get_result($stmt);
            if($result){
                $summary = mysqli_fetch_assoc($result);
                return json_encode(["status" => "success", "data" => $summary]);
            } else {
                $this->logger->log("No data found for user ID: $userId");
                return json_encode(["status" => "failed", "message" => "No data found"]);
            }
        } else {
            $this->logger->log("Execution failed: " . mysqli_error($this->link));
            return json_encode(["status" => "failed", "message" => "Execution failed"]);
        }
        mysqli_stmt_close($stmt);
    } else {
        $this->logger->log("Preparation failed: " . mysqli_error($this->link));
        return json_encode(["status" => "failed", "message" => "Preparation failed"]);
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
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
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

    $service = new DashboardService($link);
    echo $service->getSummary($jwt);
}
?>