<?php
	// ini_set('display_errors', 'On');
	// error_reporting(E_ALL);
	$executionStartTime = microtime(true);
	include("../config.php");
	header('Content-Type: application/json; charset=UTF-8');
	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	try {
		if(count($_REQUEST) === 0) {
			throw new Exception("Error Processing Request", 1);
		}

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

		$query = $conn->prepare('SELECT COUNT(p.id) as personnelCount, d.name FROM `department` as d LEFT JOIN `personnel` as p ON p.departmentID = d.id WHERE d.id =?');
		$query->bind_param("i", $_REQUEST['id']);
		$query->execute();
		if (false === $query) {
			$output['status']['code'] = "400";
			$output['status']['name'] = "executed";
			$output['status']['description'] = "query failed";	
			$output['data'] = [];
			echo json_encode($output); 
			mysqli_close($conn);
			exit;
		}

        $result = $query->get_result();
		$department = [mysqli_fetch_assoc($result)];

		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "success";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = $department;
		echo json_encode($output); 
		mysqli_close($conn);
	} catch(Exception $e) {
		$output['status']['code'] = "500";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "internal server error";	
		$output['status']['error'] = $e->getMessage();
		$output['data'] = [];
		mysqli_close($conn);
		echo json_encode($output); 
	}

?>