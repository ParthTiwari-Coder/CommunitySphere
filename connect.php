<?php
// connect.php
// This script runs on the EC2 instance to test the connection to RDS

// =================================================================
// ⚠️ IMPORTANT: REPLACE THIS VALUE AFTER RUNNING TERRAFORM
// =================================================================
// You will get this URL from the Terraform output: "rds_endpoint"
$servername = "$servername = "terraform-20251222031631011500000004.c1uy86oaiqum.ap-south-1.rds.amazonaws.com";"; 

// =================================================================
// CREDENTIALS (Must match the values in your main.tf file)
// =================================================================
$username = "admin";
$password = "password1234"; 
$dbname   = "communitydb";

// 1. Create Connection
$conn = new mysqli($servername, $username, $password, $dbname);

// 2. CSS Styling for the Output Page
echo "
<style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
    .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center; max-width: 500px; width: 100%; }
    h1 { margin-bottom: 10px; }
    .success { color: #28a745; }
    .error { color: #dc3545; }
    .details { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: left; font-size: 14px; color: #333; border: 1px solid #e9ecef; }
    .btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
    .btn:hover { background-color: #0056b3; }
</style>
<div class='container'>
";

// 3. Check Connection Logic
if ($conn->connect_error) {
    // FAILED
    echo "<h1 class='error'>❌ Connection Failed</h1>";
    echo "<p>The Web Server (EC2) could not reach the Database (RDS).</p>";
    echo "<div class='details'>";
    echo "<strong>Error Message:</strong> " . $conn->connect_error . "<br><br>";
    echo "<em>Tip: Did you update the \$servername variable in connect.php?</em>";
    echo "</div>";
} else {
    // SUCCESS
    echo "<h1 class='success'>✅ Success!</h1>";
    echo "<p>Your 3-Tier Architecture is working correctly.</p>";
    echo "<div class='details'>";
    echo "<strong>Database Host:</strong> " . $servername . "<br>";
    echo "<strong>Database Name:</strong> " . $dbname . "<br>";
    echo "<strong>User:</strong> " . $username . "<br>";
    echo "<strong>Status:</strong> Connected via Private Network<br>";
    echo "</div>";
    echo "<a href='index.html' class='btn'>Go to Home Page</a>";
}

echo "</div>";

// 4. Close Connection
$conn->close();
?>
