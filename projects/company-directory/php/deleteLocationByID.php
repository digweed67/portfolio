<?php

// remove next two lines for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

// Connect to MySQL
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);
if (mysqli_connect_errno()) {
    echo json_encode([
        'status' => [
            'code'        => "300",
            'name'        => "failure",
            'description' => "database unavailable",
            'returnedIn'  => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ]);
    exit;
}

// Read and sanitize POST data
$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;

// Dependency check: count departments in this location
$stmt = $conn->prepare(
    'SELECT COUNT(id) AS cnt
       FROM department
      WHERE locationID = ?'
);
$stmt->bind_param('i', $id);
$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();
$stmt->close();

if ($res['cnt'] > 0) {
    echo json_encode([
        'status' => [
            'code'        => "400",
            'name'        => "has_dependents",
            'description' => "{$res['cnt']} departments still assigned, cannot delete.",
            'returnedIn'  => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ]);
    $conn->close();
    exit;
}

// Prepare DELETE statement
$query = $conn->prepare('DELETE FROM location WHERE id = ?');
$query->bind_param('i', $id);
$query->execute();

// Check for execution errors
if (false === $query) {
    echo json_encode([
        'status' => [
            'code'        => "400",
            'name'        => "executed",
            'description' => "query failed",
            'returnedIn'  => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ]);
    $conn->close();
    exit;
}

// Success
echo json_encode([
    'status' => [
        'code'        => "200",
        'name'        => "ok",
        'description' => "delete successful",
        'returnedIn'  => (microtime(true) - $executionStartTime) / 1000 . " ms"
    ],
    'data' => []
]);

$query->close();
$conn->close();
?>
