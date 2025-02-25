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

		$query = 'SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location 
		FROM `personnel` as p  LEFT JOIN `department` as d ON (d.id = p.departmentID) 
		LEFT JOIN `location` as l ON (l.id = d.locationID) WHERE 1=1 ';
		
		if( isset($_REQUEST['searchValue']) && (strlen($_REQUEST['searchValue']) >= 3 && $_REQUEST['searchValue'] !== '') ) {
			$query .= ' AND ( `p`.`firstName` LIKE ? OR `p`.`lastName` LIKE ? OR `p`.`email` LIKE ? OR `p`.`jobTitle` LIKE ? ';
		}

		$searchQuery = '';
		$likeText = "%" . $_REQUEST['searchValue'] . "%";

		if(isset($_REQUEST['departmentFilter']) && (int)$_REQUEST['departmentFilter'] !== 0) {
			if( isset($_REQUEST['searchValue']) && (strlen($_REQUEST['searchValue']) >= 3 && $_REQUEST['searchValue'] !== '') ) {
				$query .= ' OR `l`.`name` LIKE ? ) AND ( `p`.`departmentID` = ? ';	
			} else {
				$query .= ' AND ( `p`.`departmentID` = ? ';
			}
			$query .= ') ORDER BY `p`.`lastName`, `p`.`firstName`, `d`.`name`, `l`.`name`';
			
			$searchQuery = $conn->prepare($query);
			if( isset($_REQUEST['searchValue']) && (strlen($_REQUEST['searchValue']) >= 3 && $_REQUEST['searchValue'] !== '') ) {
				$searchQuery->bind_param('sssssd', $likeText, $likeText, $likeText, $likeText, $likeText, $_REQUEST['departmentFilter']);
			} else {
				$searchQuery->bind_param('d', $_REQUEST['departmentFilter']);
			}
			
		} else if(isset($_REQUEST['locationFilter']) && (int)$_REQUEST['locationFilter'] !== 0) {
			if( isset($_REQUEST['searchValue']) && (strlen($_REQUEST['searchValue']) >= 3 && $_REQUEST['searchValue'] !== '') ) {
				$query .= ' OR `d`.`name` LIKE ? ) AND ( `d`.`locationID` = ? ';
			} else {
				$query .= ' AND ( `d`.`locationID` = ? ';
			}
			$query .= ') ORDER BY `p`.`lastName`, `p`.`firstName`, `d`.`name`, `l`.`name`';
			
			$searchQuery = $conn->prepare($query);
			if( isset($_REQUEST['searchValue']) && (strlen($_REQUEST['searchValue']) >= 3 && $_REQUEST['searchValue'] !== '') ) {
				$searchQuery->bind_param('sssssd', $likeText, $likeText, $likeText, $likeText, $likeText, $_REQUEST['locationFilter']);
			} else {
				$searchQuery->bind_param('d', $_REQUEST['locationFilter']);
			}
			
		} else {
			if( isset($_REQUEST['searchValue']) && (strlen($_REQUEST['searchValue']) >= 3 && $_REQUEST['searchValue'] !== '') ) {
				$query .= ' ) ORDER BY `p`.`lastName`, `p`.`firstName`, `d`.`name`, `l`.`name`';
			} else {
				$query .= ' ORDER BY `p`.`lastName`, `p`.`firstName`, `d`.`name`, `l`.`name`';
			}
			
			
			$searchQuery = $conn->prepare($query);
			if( isset($_REQUEST['searchValue']) && (strlen($_REQUEST['searchValue']) >= 3 && $_REQUEST['searchValue'] !== '') ) {
				$searchQuery->bind_param('ssssss', $likeText, $likeText, $likeText, $likeText, $likeText, $likeText);
			}
			
			
		}

		$searchQuery->execute();
		$result = $searchQuery->get_result();

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
		while ($row = $result->fetch_assoc()) {
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