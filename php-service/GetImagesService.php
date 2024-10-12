<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

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