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

class GetExcelRunnerService {
    private $link;
    private $logger;
    private $secretKey = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2'; // Replace with your actual secret key

    public function __construct($link) {
        $this->link = $link;
        $this->logger = new Logger(); // Initialize the logger
    }

    public function getRunners($token, $eventId) {
        $this->logger->log("Starting getRunners process");

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

        $sql = "SELECT * FROM runner WHERE event_id = ?";
        if($stmt = mysqli_prepare($this->link, $sql)){
            mysqli_stmt_bind_param($stmt, "s", $eventId);
            if(mysqli_stmt_execute($stmt)){
                $result = mysqli_stmt_get_result($stmt);
                $runners = [];
                while($row = mysqli_fetch_assoc($result)){
                    $runners[] = $row;
                }
                mysqli_stmt_close($stmt);
                return json_encode(["status" => "success", "data" => $runners]);
            } else {
                $error = mysqli_error($this->link);
                $this->logger->log("Execution failed: " . $error);
                return json_encode(["status" => "failed", "message" => "Execution failed", "error" => $error]);
            }
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

    if (!isset($_GET['event_id'])) {
        echo json_encode(["status" => "failed", "message" => "event_id parameter missing"]);
        exit();
    }

    $eventId = $_GET['event_id'];

    $service = new GetExcelRunnerService($link);
    echo $service->getRunners($jwt, $eventId);
}
?>