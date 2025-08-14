<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAll.php

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	// Start timer to measure execution time
	$executionStartTime = microtime(true);

	// Include database connection details from config.php.
	include("config.php");

	// Tell client we’re returning JSON.
	header('Content-Type: application/json; charset=UTF-8');

	// Create a new MySQLi connection using credentials from config.php.
	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		// If the connection fails, return a JSON error and exit.
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	$departmentID = isset($_GET['departmentID']) ? (int)$_GET['departmentID'] : 0;
	$locationID   = isset($_GET['locationID'])   ? (int)$_GET['locationID']   : 0;

	$where = [];

	if ($departmentID) {
	$where[] = "p.departmentID = $departmentID";
	}

	if ($locationID) {
	$where[] = "d.locationID = $locationID";
	}

	$whereClause = '';
	if (count($where) > 0) {
	$whereClause = 'WHERE ' . implode(' AND ', $where);
	}


	// SQL does not accept parameters and so is not prepared
	// This query is static (no user input), so we run it directly.
    // It selects each person with their department and location via LEFT JOIN
	$query = "
		SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, p.departmentID, d.name as department, l.name as location 
		FROM personnel p 
		LEFT JOIN department d ON (d.id = p.departmentID) 
		LEFT JOIN location l ON (l.id = d.locationID) 
		$whereClause
		ORDER BY p.lastName, p.firstName, d.name, l.name
		";

	// Execute the query.
	$result = $conn->query($query);
	
	// If the query failed, return a JSON error and exit.
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
   
	// Fetch all rows into a PHP array.
   	$data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}

	// Build the success response.
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	//close database connection
	mysqli_close($conn);

	//Send Json-encoded response back to the client 
	echo json_encode($output); 

?>