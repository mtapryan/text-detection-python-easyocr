<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'config.php'; // Include the database configuration file

class LoginService {
    private $link;

    public function __construct($link) {
        $this->link = $link;
    }

    public function login($username, $password) {
        $sql = "SELECT * FROM login WHERE username = ? AND password = ?";
        if($stmt = mysqli_prepare($this->link, $sql)){
            mysqli_stmt_bind_param($stmt, "ss", $username, $password);
            if(mysqli_stmt_execute($stmt)){
                $result = mysqli_stmt_get_result($stmt);
                if(mysqli_num_rows($result) == 1){
                    return json_encode(["success" => true]);
                } else {
                    return json_encode(["success" => false]);
                }
            } else {
                return json_encode(["success" => false, "error" => "Execution failed"]);
            }
            mysqli_stmt_close($stmt);
        } else {
            return json_encode(["success" => false, "error" => "Preparation failed"]);
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'];
    $password = $data['password'];

    $service = new LoginService($link);
    echo $service->login($username, $password);
}
?>