<?php

    // example use from browser:
    // http://localhost/companydirectory/php/deletePersonnelByID.php?id=<id>

    // remove next two lines for production
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    // Start timer to measure execution time
    $executionStartTime = microtime(true);

    // Include database connection details
    include("config.php");

    // Tell client we’re returning JSON
    header('Content-Type: application/json; charset=UTF-8');

    // Create MySQLi connection
    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if (mysqli_connect_errno()) {
        $output['status']['code'] = "300";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "database unavailable";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];
        mysqli_close($conn);
        echo json_encode($output);
        exit;
    }

    // Validate input
    if (!isset($_POST['id']) || !is_numeric($_POST['id'])) {
        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "invalid or missing id";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];
        mysqli_close($conn);
        echo json_encode($output);
        exit;
    }

    
    // bind_param() fills those holes with typed data safely.
    // execute() runs the deletion with the bound value
    $query = $conn->prepare('DELETE FROM personnel WHERE id = ?');
    $query->bind_param("i", $_POST['id']);

    $success = $query->execute();

    if (!$success) {
        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "delete failed";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];
    } else {
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "deleted successfully";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];
    }

    // Close connection and return JSON
    $query->close();
    mysqli_close($conn);
    echo json_encode($output);

?>
