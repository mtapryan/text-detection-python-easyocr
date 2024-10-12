<?php
/* // Database localhost
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'user');
define('DB_PASSWORD', '1234');
define('DB_NAME', 'db_service'); 

$link = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

if($link === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
} */

// Database configuration
define('DB_SERVER', 'localhost');
define('DB_PORT', '3306');
define('DB_USERNAME', 'ditek');
define('DB_PASSWORD', 'ditek123456');
define('DB_NAME', 'db_carifoto');

/* Attempt to connect to MariaDB database */
$link = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_PORT);

// Check connection
if($link === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
}

// SSH configuration (if needed for reference)
define('SSH_HOST', '202.157.186.24');
define('SSH_PORT', '8288');
define('SSH_USERNAME', 'root');
define('SSH_PASSWORD', 'nxr0CeO083t34VNKGc');
?>