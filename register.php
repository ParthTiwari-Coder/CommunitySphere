
<?php
include "db.php";

$username = $_POST['username'];
$fullname = $_POST['fullname'];
$prn = $_POST['prn'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_BCRYPT);

$stmt = $conn->prepare("INSERT INTO users(username, fullname, prn, email, password) VALUES (?,?,?,?,?)");
$stmt->bind_param("sssss", $username, $fullname, $prn, $email, $password);

if ($stmt->execute()) {
    echo "Registration Successful";
} else {
    echo "Error: " . $stmt->error;
}
?>
