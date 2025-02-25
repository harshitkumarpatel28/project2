<?php
	// ini_set('display_errors', 'On');
	// error_reporting(E_ALL);
	$executionStartTime = microtime(true);
	include("../config.php");
	header('Content-Type: application/json; charset=UTF-8');
	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	try {
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
// change * to col
		$query = 'SELECT d.id, d.name, l.name as location FROM department as d LEFT JOIN location as l ON d.locationID = l.id 
		order by d.name';
		$result = $conn->query($query);
		if (!$result) {
			$output['status']['code'] = "400";
			$output['status']['name'] = "executed";
			$output['status']['description'] = "query failed";	
			$output['data'] = [];
			mysqli_close($conn);
			echo json_encode($output); 
			exit;
		}
	
		$data = [];
		while ($row = mysqli_fetch_assoc($result)) {
			array_push($data, $row);
		}

		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "success";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = $data;
		mysqli_close($conn);
		echo json_encode($output); 
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