<?php

// Development only — show PHP errors
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Get search term and prepare LIKE filter
$likeText = '%' . $_GET['txt'] . '%';

// Search department name OR location name
$query = $conn->prepare(
    'SELECT 
        d.id AS id, 
        d.name AS departmentName, 
        l.name AS locationName 
    FROM department d
    LEFT JOIN location l ON l.id = d.locationID
    WHERE d.name LIKE ?
       OR l.name LIKE ?
    ORDER BY d.name, l.name'
);

$query->bind_param("ss", $likeText, $likeText);
$query->execute();

if (!$query) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

$result = $query->get_result();
$found = [];

while ($row = mysqli_fetch_assoc($result)) {
    $found[] = $row;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $found;

$conn->close();
echo json_encode($output);

?>
