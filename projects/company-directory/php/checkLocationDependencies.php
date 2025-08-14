<?php

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

// Enable debugging
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Sanitize and validate input
$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;

if ($id <= 0) {
    echo json_encode([
        'status' => ['code' => '400', 'description' => 'Missing or invalid location ID'],
        'data' => []
    ]);
    exit;
}

// DB connection
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    echo json_encode([
        'status' => ['code' => '300', 'description' => 'database unavailable'],
        'data' => []
    ]);
    exit;
}

// Query: get location name + department count
$query = $conn->prepare("
    SELECT l.name AS locationName, COUNT(d.id) AS departmentCount
    FROM location l
    LEFT JOIN department d ON l.id = d.locationID
    WHERE l.id = ?
    GROUP BY l.id
");

$query->bind_param("i", $id);

if (!$query->execute()) {
    echo json_encode([
        'status' => ['code' => '500', 'description' => 'Execute failed: ' . $query->error],
        'data' => []
    ]);
    exit;
}

$result = $query->get_result();

if ($result && $row = $result->fetch_assoc()) {
    echo json_encode([
        'status' => ['code' => '200', 'description' => 'OK'],
        'data' => [
            'locationName' => $row['locationName'],
            'departmentCount' => $row['departmentCount']
        ]
    ]);
} else {
    echo json_encode([
        'status' => ['code' => '404', 'description' => 'Location not found'],
        'data' => []
    ]);
}

$query->close();
$conn->close();
