<?php

// updateLocationByID.php

// Enable error reporting for development (disable in production)
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// Include database connection details
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
$id   = isset($_POST['id'])   ? (int) $_POST['id']   : 0;
$name = isset($_POST['name']) ? trim($_POST['name']) : '';

// Basic validation
if ($id <= 0 || $name === '') {
    echo json_encode([
        'status' => [
            'code'        => "400",
            'name'        => "invalid input",
            'description' => "Missing or invalid id/name",
            'returnedIn'  => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ]);
    $conn->close();
    exit;
}

// Prepare the UPDATE statement
$query = $conn->prepare(
    'UPDATE location 
       SET name = ?
     WHERE id = ?'
);
if (!$query) {
    echo json_encode([
        'status' => [
            'code'        => "400",
            'name'        => "prepare failed",
            'description' => $conn->error,
            'returnedIn'  => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ]);
    $conn->close();
    exit;
}

// Bind parameters: s = string, i = integer
$query->bind_param("si", $name, $id);

// Execute the query
$execResult = $query->execute();
if (false === $execResult) {
    echo json_encode([
        'status' => [
            'code'        => "400",
            'name'        => "executed",
            'description' => $query->error,
            'returnedIn'  => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ]);
    $query->close();
    $conn->close();
    exit;
}

// Success
echo json_encode([
    'status' => [
        'code'        => "200",
        'name'        => "ok",
        'description' => "update successful",
        'returnedIn'  => (microtime(true) - $executionStartTime) / 1000 . " ms"
    ],
    'data' => []
]);

$query->close();
$conn->close();
?>
