<?php
// enable errors during development
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// start timer
$executionStartTime = microtime(true);

// load DB credentials
include("config.php");

// return JSON
header('Content-Type: application/json; charset=UTF-8');

// connect to MySQL
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);
if (mysqli_connect_errno()) {
    http_response_code(500);
    echo json_encode([
        'status' => [
            'code'        => 300,
            'name'        => 'failure',
            'description' => 'database unavailable',
            'returnedIn'  => (microtime(true) - $executionStartTime) / 1000 . " ms"
        ],
        'data' => []
    ]);
    exit;
}

// select all locations
$query  = 'SELECT id, name FROM location ORDER BY name';
$result = $conn->query($query);
if (!$result) {
    echo json_encode([
        'status' => [
          'code'        => 400,
          'name'        => 'executed',
          'description' => 'query failed'
        ],
        'data' => []
    ]);
    mysqli_close($conn);
    exit;
}

// loop until fetch_assoc is null, and data becomes an array of associative arrays 
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

// return success
echo json_encode([
  'status' => [
    'code'        => 200,
    'name'        => 'ok',
    'description' => 'success',
    'returnedIn'  => (microtime(true) - $executionStartTime) / 1000 . " ms"
  ],
  'data' => $data
]);

mysqli_close($conn);
?>
