<?php

	// example use from browser (for testing):
	// http://localhost/companydirectory/libs/php/insertPersonnel.php?firstName=John&lastName=Doe&jobTitle=Engineer&email=john.doe@example.com&departmentID=1&locationID=2

	// remove next two lines for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	// this includes the login details
	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);
	if (mysqli_connect_errno()) {
		$output['status']['code']        = "300";
		$output['status']['name']        = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn']  = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data']                  = [];

		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}

	// Read and sanitize — switch to $_POST in production
	$firstName    = isset($_POST['firstName'])    ? trim($_POST['firstName'])    : '';
	$lastName     = isset($_POST['lastName'])     ? trim($_POST['lastName'])     : '';
	$jobTitle     = isset($_POST['jobTitle'])     ? trim($_POST['jobTitle'])     : null;
	$email        = isset($_POST['email'])        ? trim($_POST['email'])        : '';
	$departmentID = isset($_POST['departmentID']) ? (int)$_POST['departmentID']  : 0;

	// Basic validation
	if ($firstName === '' || $lastName === '' || $email === '' || $departmentID <= 0) {
		$output['status']['code']        = "400";
		$output['status']['name']        = "invalid input";
		$output['status']['description'] = "Missing or invalid fields";
		$output['status']['returnedIn']  = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data']                  = [];

		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}

	// Prepare the INSERT statement
	$query = $conn->prepare(
		'INSERT INTO personnel 
		     (firstName, lastName, jobTitle, email, departmentID) 
		 VALUES (?, ?, ?, ?, ?)'
	);
	if (!$query) {
		$output['status']['code']        = "400";
		$output['status']['name']        = "prepare failed";
		$output['status']['description'] = $conn->error;
		$output['status']['returnedIn']  = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data']                  = [];

		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}

	// Bind parameters: s = string, i = integer
	$query->bind_param(
		'sssii',
		$firstName,
		$lastName,
		$jobTitle,
		$email,
		$departmentID
	);

	// Execute the query
	$execResult = $query->execute();
	if (false === $execResult) {
		$output['status']['code']        = "400";
		$output['status']['name']        = "executed";
		$output['status']['description'] = $query->error;
		$output['status']['returnedIn']  = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data']                  = [];

		$query->close();
		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}

	// Success
	$output['status']['code']        = "200";
	$output['status']['name']        = "ok";
	$output['status']['description'] = "insert successful";
	$output['status']['returnedIn']  = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data']                  = [];

	$query->close();
	mysqli_close($conn);
	echo json_encode($output);

?>
