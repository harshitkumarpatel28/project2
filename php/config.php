
<?php
require '../../vendor/autoload.php';  // Include Composer's autoloader

use Dotenv\Dotenv;

// Load the .env file
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

	// connection details for MySQL database

	$cd_host = $_ENV['HOST'];
	$cd_port = $_ENV['PORT'];
	$cd_socket =$_ENV['SOCKET'];

	// database name, username and password

	$cd_dbname = $_ENV['DB_NAME'];
	$cd_user = $_ENV['DB_USER'];
	$cd_password = $_ENV['DB_PASSWORD'];
?>
