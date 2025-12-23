
<?php
$host = "YOUR_RDS_ENDPOINT";
$user = "YOUR_DB_USER";
$pass = "YOUR_DB_PASSWORD";
$db   = "communitysphere";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("DB Connection Failed: " . $conn->connect_error);
}
?>
