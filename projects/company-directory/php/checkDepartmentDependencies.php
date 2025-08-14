<?php

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

// Allow debugging
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Sanitize input
$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;

if ($id <= 0) {
    echo json_encode([
        'status' => ['code' => '400', 'description' => 'Missing or invalid department ID'],
        'data' => []
    ]);
    exit;
}

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    echo json_encode([
        'status' => ['code' => '300', 'description' => 'database unavailable'],
        'data' => []
    ]);
    exit;
}

$query = $conn->prepare("
    SELECT d.name AS departmentName, COUNT(p.id) AS personnelCount
    FROM department d
    LEFT JOIN personnel p ON d.id = p.departmentID
    WHERE d.id = ?
    GROUP BY d.id
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
            'departmentName' => $row['departmentName'],
            'personnelCount' => $row['personnelCount']
        ]
    ]);
} else {
    echo json_encode([
        'status' => ['code' => '404', 'description' => 'Department not found'],
        'data' => []
    ]);
}

$query->close();
$conn->close();
