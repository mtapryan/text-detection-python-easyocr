<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

class GetPostService {
    private $link;
    private $logger;

    public function __construct($link) {
        $this->link = $link;
        $this->logger = new Logger(); // Initialize the logger
    }

    public function getAllPosts() {
        $this->logger->log("Fetching all posts");

        $sql = "SELECT * FROM post";
        if($result = mysqli_query($this->link, $sql)){
            $posts = [];
            while($row = mysqli_fetch_assoc($result)){
                $posts[] = $row;
            }
            return json_encode(["status" => "success", "data" => $posts]);
        } else {
            $this->logger->log("Query failed: " . mysqli_error($this->link));
            return json_encode(["status" => "failed", "message" => "Query failed"]);
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $service = new GetPostService($link);
    echo $service->getAllPosts();
}
?>