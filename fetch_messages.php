
<?php
include "db.php";

$club = $_GET['club']; // tech, cultural, sports
$table = "club_" . $club;

$result = $conn->query("SELECT username, message, created_at FROM $table ORDER BY created_at ASC");

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
