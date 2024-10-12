<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Handle preflight request
    header("HTTP/1.1 200 OK");
    exit();
}

$directory = '../public/storage/';
$images = array_diff(scandir($directory), array('..', '.'));

$imageData = array();
foreach ($images as $image) {
    $imageData[] = array(
        'username' => 'default_user', // You can replace this with actual data
        'location' => 'default_location', // You can replace this with actual data
        'url' => 'http://localhost:3000/carifoto/storage/' . $image, // Ensure the URL is correct
        'caption' => 'default_caption' // You can replace this with actual data
    );
}

echo json_encode(array('images' => $imageData));
?>