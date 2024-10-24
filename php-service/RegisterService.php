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

class RegisterService {
    private $link;
    private $logger;

    public function __construct($link) {
        $this->link = $link;
        $this->logger = new Logger(); // Initialize the logger
    }

    public function register($data) {
        $this->logger->log("Starting registration process");

        $userId = $this->generateUUID();
        $username = $data['username'];
        $fullname = $data['fullname'];
        $email = $data['email'];
        $phone = $data['phone'];
        $password = $data['password']; // Use the password directly
        $address = $data['address'];
        $userType = isset($data['user_type']) ? $data['user_type'] : '1004'; // Default to 1004 if not provided

        $this->logger->log("Data received: " . json_encode($data));

        // Check if username, email, or phone already exists
        $sqlCheck = "SELECT * FROM login WHERE username = ? OR email = ? OR phone = ?";
        if($stmtCheck = mysqli_prepare($this->link, $sqlCheck)){
            mysqli_stmt_bind_param($stmtCheck, "sss", $username, $email, $phone);
            mysqli_stmt_execute($stmtCheck);
            $resultCheck = mysqli_stmt_get_result($stmtCheck);
            if(mysqli_num_rows($resultCheck) > 0){
                $this->logger->log("Username, email, or phone already exists");
                return json_encode(["status" => "failed", "message" => "Username atau Email atau Nomor Handphone Anda sudah terdaftar"]);
            }
            mysqli_stmt_close($stmtCheck);
        } else {
            $this->logger->log("Preparation for check query failed: " . mysqli_error($this->link));
            return json_encode(["status" => "failed", "message" => "Preparation for check query failed"]);
        }

        // Insert into user table
        $sqlUser = "INSERT INTO user (user_id, full_name, email, phone, address) 
                    VALUES (?, ?, ?, ?, ?)";
        if($stmtUser = mysqli_prepare($this->link, $sqlUser)){
            mysqli_stmt_bind_param($stmtUser, "sssss", $userId, $fullname, $email, $phone, $address);
            if (!mysqli_stmt_execute($stmtUser)) {
                $this->logger->log("Insert into user table failed: " . mysqli_error($this->link));
                return json_encode(["status" => "failed", "message" => "Insert into user table failed: " . mysqli_error($this->link)]);
            }
            mysqli_stmt_close($stmtUser);
        } else {
            $this->logger->log("Preparation for user table failed: " . mysqli_error($this->link));
            return json_encode(["status" => "failed", "message" => "Preparation for user table failed"]);
        }

        $this->logger->log("User table insertion successful");

        // Insert into login table
        $sqlLogin = "INSERT INTO login (id, username, password, email, phone, user_type, created_at, login_at) 
                     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())";
        if($stmtLogin = mysqli_prepare($this->link, $sqlLogin)){
            mysqli_stmt_bind_param($stmtLogin, "ssssss", $userId, $username, $password, $email, $phone, $userType);
            if(!mysqli_stmt_execute($stmtLogin)){
                $this->logger->log("Insert into login table failed: " . mysqli_error($this->link));
                return json_encode(["status" => "failed", "message" => "Insert into login table failed: " . mysqli_error($this->link)]);
            }
            mysqli_stmt_close($stmtLogin);
        } else {
            $this->logger->log("Preparation for login table failed: " . mysqli_error($this->link));
            return json_encode(["status" => "failed", "message" => "Preparation for login table failed"]);
        }

        $this->logger->log("Login table insertion successful");

        return json_encode(["status" => "success", "message" => "Pendaftaran berhasil, silakan login"]);
    }

    private function generateUUID() {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    error_log("POST request received");
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(["status" => "failed", "message" => "Invalid JSON"]);
        exit();
    }

    $service = new RegisterService($link);
    echo $service->register($data);
}
?>