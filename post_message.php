
<?php
include "db.php";
session_start();

if (!isset($_SESSION['user'])) {
    die("Unauthorized");
}

$club = $_POST['club']; // tech, cultural, sports
$message = $_POST['message'];
$username = $_SESSION['user'];

$user = $conn->query("SELECT fullname, prn, email FROM users WHERE username='$username'")->fetch_assoc();

$table = "club_" . $club;

$stmt = $conn->prepare("INSERT INTO $table(username, fullname, prn, email, message) VALUES (?,?,?,?,?)");
$stmt->bind_param("sssss", $username, $user['fullname'], $user['prn'], $user['email'], $message);

if ($stmt->execute()) {
    echo "Message Posted";
} else {
    echo "Error Posting";
}
?>
