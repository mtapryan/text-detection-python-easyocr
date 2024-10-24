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

class DeleteAccountService {
    private $link;
    private $logger;

    public function __construct($link) {
        $this->link = $link;
        $this->logger = new Logger(); // Initialize the logger
    }

    public function deleteAccount($data) {
        $this->logger->log("Starting account deletion process");

        $id = $data['id'];

        $this->logger->log("Data received: " . json_encode($data));

        // Check if user exists by id
        $sqlCheck = "SELECT * FROM login WHERE id = ?";
        if($stmtCheck = mysqli_prepare($this->link, $sqlCheck)){
            mysqli_stmt_bind_param($stmtCheck, "s", $id);
            mysqli_stmt_execute($stmtCheck);
            $resultCheck = mysqli_stmt_get_result($stmtCheck);
            if(mysqli_num_rows($resultCheck) === 0){
                $this->logger->log("User ID does not exist");
                return json_encode(["status" => "failed", "message" => "User ID tidak ditemukan"]);
            }
            mysqli_stmt_close($stmtCheck);
        } else {
            $this->logger->log("Preparation for check query failed: " . mysqli_error($this->link));
            return json_encode(["status" => "failed", "message" => "Preparation for check query failed"]);
        }

        // Delete from login table by id
        $sqlDeleteLogin = "DELETE FROM login WHERE id = ?";
        if($stmtDeleteLogin = mysqli_prepare($this->link, $sqlDeleteLogin)){
            mysqli_stmt_bind_param($stmtDeleteLogin, "s", $id);
            if(!mysqli_stmt_execute($stmtDeleteLogin)){
                $this->logger->log("Delete from login table failed: " . mysqli_error($this->link));
                return json_encode(["status" => "failed", "message" => "Delete from login table failed: " . mysqli_error($this->link)]);
            }
            mysqli_stmt_close($stmtDeleteLogin);
        } else {
            $this->logger->log("Preparation for login table delete failed: " . mysqli_error($this->link));
            return json_encode(["status" => "failed", "message" => "Preparation for login table delete failed"]);
        }

        // Delete from user table by user_id
        $sqlDeleteUser = "DELETE FROM user WHERE user_id = ?";
        if($stmtDeleteUser = mysqli_prepare($this->link, $sqlDeleteUser)){
            mysqli_stmt_bind_param($stmtDeleteUser, "s", $id);
            if(!mysqli_stmt_execute($stmtDeleteUser)){
                $this->logger->log("Delete from user table failed: " . mysqli_error($this->link));
                return json_encode(["status" => "failed", "message" => "Delete from user table failed: " . mysqli_error($this->link)]);
            }
            mysqli_stmt_close($stmtDeleteUser);
        } else {
            $this->logger->log("Preparation for user table delete failed: " . mysqli_error($this->link));
            return json_encode(["status" => "failed", "message" => "Preparation for user table delete failed"]);
        }

        $this->logger->log("Account deletion successful");

        return json_encode(["status" => "success", "message" => "Akun berhasil dihapus"]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    error_log("POST request received");
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(["status" => "failed", "message" => "Invalid JSON"]);
        exit();
    }

    $service = new DeleteAccountService($link);
    echo $service->deleteAccount($data);
}
?>