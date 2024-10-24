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

class UserService {
    private $link;
    private $logger;
    private $secretKey = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2'; // Replace with your actual secret key

    public function __construct($link) {
        $this->link = $link;
        $this->logger = new Logger(); // Initialize the logger
    }

    public function getUsers($token, $filter, $page, $size, $userType = null) {
        $this->logger->log("Starting getUsers process");

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
                    $userTypeFromToken = $row['user_type'];
                    $this->logger->log("Decoded userId: $userId, userType: $userTypeFromToken");
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

        // Check if the user is admin
        if ($userTypeFromToken != 1001) {
            $this->logger->log("Access denied for user ID: $userId");
            return json_encode(["status" => "failed", "message" => "Access denied"]);
        }

        $offset = $page * $size;
        $filter = "%$filter%";

        if ($userType) {
            $sql = "SELECT SQL_CALC_FOUND_ROWS user.* FROM user JOIN login ON user.user_id = login.id WHERE login.user_type = ? AND user.full_name LIKE ? LIMIT ?, ?";
            if($stmt = mysqli_prepare($this->link, $sql)){
                mysqli_stmt_bind_param($stmt, "ssii", $userType, $filter, $offset, $size);
            } else {
                $this->logger->log("Preparation failed: " . mysqli_error($this->link));
                return json_encode(["status" => "failed", "message" => "Preparation failed"]);
            }
        } else {
            $sql = "SELECT SQL_CALC_FOUND_ROWS user.* FROM user JOIN login ON user.user_id = login.id WHERE user.full_name LIKE ? LIMIT ?, ?";
            if($stmt = mysqli_prepare($this->link, $sql)){
                mysqli_stmt_bind_param($stmt, "sii", $filter, $offset, $size);
            } else {
                $this->logger->log("Preparation failed: " . mysqli_error($this->link));
                return json_encode(["status" => "failed", "message" => "Preparation failed"]);
            }
        }

        if(mysqli_stmt_execute($stmt)){
            $result = mysqli_stmt_get_result($stmt);
            $users = [];
            while($row = mysqli_fetch_assoc($result)){
                $users[] = $row;
            }

            // Get total records
            $resultTotal = mysqli_query($this->link, "SELECT FOUND_ROWS() as total");
            $total = mysqli_fetch_assoc($resultTotal)['total'];

            return json_encode(["status" => "success", "data" => ["records" => $users, "total" => $total], "message" => "Users fetched successfully"]);
        } else {
            $this->logger->log("Execution failed: " . mysqli_error($this->link));
            return json_encode(["status" => "failed", "message" => "Execution failed"]);
        }
        mysqli_stmt_close($stmt);
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

    $input = json_decode(file_get_contents('php://input'), true);
    $filter = isset($input['filter']) ? $input['filter'] : '';
    $page = isset($input['page']) ? $input['page'] : 0;
    $size = isset($input['size']) ? $input['size'] : 10;
    $userType = isset($input['user_type']) ? $input['user_type'] : null;

    $service = new UserService($link);
    echo $service->getUsers($jwt, $filter, $page, $size, $userType);
}
?>