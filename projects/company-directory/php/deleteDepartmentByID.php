	<?php

		// example use from browser
		// use insertDepartment.php first to create new dummy record and then specify it's id in the command below
		// http://localhost/companydirectory/libs/php/deleteDepartmentByID.php?id=<id>

		// remove next two lines for production
		
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
			$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
			$output['data'] = [];

			mysqli_close($conn);

			echo json_encode($output);

			exit;

		}	

			// Read and sanitize
		$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;

		// Dependency check: count personnel in this department
		$stmt = $conn->prepare(
		'SELECT COUNT(id) as cnt 
			FROM personnel 
			WHERE departmentID = ?'
		);
		$stmt->bind_param('i', $id);
		$stmt->execute();
		$res = $stmt->get_result()->fetch_assoc();
		$stmt->close();

		if ($res['cnt'] > 0) {
			// Cannot delete: there are personnel attached
			echo json_encode([
			'status' => [
				'code'        => "400",
				'name'        => "has_dependents",
				'description' => "{$res['cnt']} personnel still assigned, cannot delete."
			],
			'data' => []
			]);
			$conn->close();
			exit;
		}


		// SQL statement accepts parameters and so is prepared to avoid SQL injection.
		

		$query = $conn->prepare('DELETE FROM department WHERE id = ?');
		
		$query->bind_param("i", $id);

		$query->execute();
		
		if (false === $query) {

			$output['status']['code'] = "400";
			$output['status']['name'] = "executed";
			$output['status']['description'] = "query failed";	
			$output['data'] = [];

			mysqli_close($conn);

			echo json_encode($output); 

			exit;

		}

		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "success";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];
		
		mysqli_close($conn);

		echo json_encode($output); 

	?>