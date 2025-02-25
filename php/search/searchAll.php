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

		$query = '';	
		$searchQuery = '';
		$likeText = "%" . $_REQUEST['search'] . "%";

		if($_REQUEST['searchType'] === '1') {

			$query = 'SELECT `p`.`id`, `p`.`firstName`, `p`.`lastName`, `p`.`email`, `p`.`jobTitle`, `d`.`id` as `departmentID`, 
			`d`.`name` as `departmentName`, `l`.`id` as `locationID`, `l`.`name` as `locationName` FROM `personnel` as `p` 
			LEFT JOIN `department` as `d` ON (`d`.`id` = `p`.`departmentID`) 
			LEFT JOIN `location` as `l` ON (`l`.`id` = `d`.`locationID`) WHERE 1=1 ';

			$query .= ' AND ( `p`.`firstName` LIKE ? OR `p`.`lastName` LIKE ? OR `p`.`email` LIKE ? OR `p`.`jobTitle` LIKE ? ';

			if( (isset($_REQUEST['departmentFilter']) && (int)$_REQUEST['departmentFilter'] !== 0) && 
			(isset($_REQUEST['locationFilter']) && (int)$_REQUEST['locationFilter'] !== 0) ) {
				$query .= ' ) AND ( `p`.`departmentID` = ? ) AND ( `d`.`locationID` = ? ) ';
				$query .= ') ORDER BY `p`.`lastName`, `p`.`firstName`, `d`.`name`, `l`.`name`';
				
				$searchQuery = $conn->prepare($query);
				$searchQuery->bind_param('ssssdd', $likeText, $likeText, $likeText, $likeText, $_REQUEST['departmentFilter'], $_REQUEST['locationFilter']);
				
			} else if(isset($_REQUEST['departmentFilter']) && (int)$_REQUEST['departmentFilter'] !== 0) {
				$query .= ' OR `l`.`name` LIKE ? ) AND ( `p`.`departmentID` = ? ';
				$query .= ') ORDER BY `p`.`lastName`, `p`.`firstName`, `d`.`name`, `l`.`name`';
				
				$searchQuery = $conn->prepare($query);
				$searchQuery->bind_param('sssssd', $likeText, $likeText, $likeText, $likeText, $likeText, $_REQUEST['departmentFilter']);
				
				
			} else if(isset($_REQUEST['locationFilter']) && (int)$_REQUEST['locationFilter'] !== 0) {
				$query .= ' OR `d`.`name` LIKE ? ) AND ( `d`.`locationID` = ? ';
				$query .= ') ORDER BY `p`.`lastName`, `p`.`firstName`, `d`.`name`, `l`.`name`';
				
				$searchQuery = $conn->prepare($query);
				$searchQuery->bind_param('sssssd', $likeText, $likeText, $likeText, $likeText, $likeText, $_REQUEST['locationFilter']);
				
			} else {
				$query .= ' OR `d`.`name` LIKE ? OR `l`.`name` LIKE ? ';
				$query .= ') ORDER BY `p`.`lastName`, `p`.`firstName`, `d`.`name`, `l`.`name`';
				
				$searchQuery = $conn->prepare($query);
				$searchQuery->bind_param('ssssss', $likeText, $likeText, $likeText, $likeText, $likeText, $likeText);
				
			}

		} else if($_REQUEST['searchType'] === '2') {
			$searchQuery = $conn->prepare('SELECT `d`.`id` as `departmentID`, `d`.`name` as `departmentName`, `l`.`id` as 
			`locationID`, `l`.`name` as `locationName` FROM `department` `d` LEFT JOIN `location` `l` ON (`l`.`id` = `d`.`locationID`)
			 WHERE `d`.`name` LIKE ? OR `l`.`name` LIKE ? ORDER BY `d`.`name`, `l`.`name`');
			$searchQuery->bind_param('ss', $likeText, $likeText);
		} else {
			$searchQuery = $conn->prepare('SELECT id, name FROM `location` WHERE `name` LIKE ? ORDER BY `name`');
			$searchQuery->bind_param('s', $likeText);
		}
		
		$searchQuery->execute();
		if (false === $searchQuery) {
			$output['status']['code'] = "400";
			$output['status']['name'] = "executed";
			$output['status']['description'] = "query failed";	
			$output['data'] = [];
			mysqli_close($conn);
			echo json_encode($output); 
			exit;
		}
		
		$result = $searchQuery->get_result();
		$found = [];
		while ($row = mysqli_fetch_assoc($result)) {
			array_push($found, $row);
		}

		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "success";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data']['found'] = $found;
		mysqli_close($conn);
		echo json_encode($output);
	}  catch(Exception $e) {
		$output['status']['code'] = "500";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "internal server error";	
		$output['status']['error'] = $e->getMessage();
		$output['data'] = [];
		mysqli_close($conn);
		echo json_encode($output); 
	} 
?>