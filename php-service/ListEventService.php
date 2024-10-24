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

class ListEventService {
    private $link;
    private $logger;

    public function __construct($link) {
        $this->link = $link;
        $this->logger = new Logger(); // Initialize the logger
    }

    public function getAllEvents($filter, $page, $size) {
        $this->logger->log("Fetching all events");

        $offset = $page * $size;
        $filter = "%$filter%";

        $sql = "SELECT SQL_CALC_FOUND_ROWS e.*, u.full_name, u.email, u.phone, u.address 
                FROM event e 
                LEFT JOIN user u ON e.user_id = u.user_id 
                WHERE e.event_name LIKE ? 
                LIMIT ?, ?";
        if($stmt = mysqli_prepare($this->link, $sql)){
            mysqli_stmt_bind_param($stmt, "sii", $filter, $offset, $size);
            if(mysqli_stmt_execute($stmt)){
                $result = mysqli_stmt_get_result($stmt);
                $events = [];
                while($row = mysqli_fetch_assoc($result)){
                    $row['user_name'] = $row['full_name'];
                    $row['user_email'] = $row['email'];
                    $row['user_phone'] = $row['phone'];
                    $row['user_address'] = $row['address'];
                    unset($row['full_name'], $row['email'], $row['phone'], $row['address']);
                    $events[] = $row;
                }

                // Get total records
                $resultTotal = mysqli_query($this->link, "SELECT FOUND_ROWS() as total");
                $total = mysqli_fetch_assoc($resultTotal)['total'];

                return json_encode(["status" => "success", "data" => ["records" => $events, "total" => $total], "message" => "Events fetched successfully"]);
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
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $filter = isset($input['filter']) ? $input['filter'] : '';
    $page = isset($input['page']) ? $input['page'] : 0;
    $size = isset($input['size']) ? $input['size'] : 10;

    $service = new ListEventService($link);
    echo $service->getAllEvents($filter, $page, $size);
}
?>