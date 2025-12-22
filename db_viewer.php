<?php
// db_viewer.php
// Pre-configured for your Community Project

$servername = "terraform-20251222031631011500000004.c1uy86oaiqum.ap-south-1.rds.amazonaws.com";
$username   = "admin";
$password   = "password1234";
$dbname     = "communitydb";

// Connect
$conn = new mysqli($servername, $username, $password, $dbname);

// Style
echo "<style>
    body { font-family: sans-serif; padding: 20px; background: #f4f4f9; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 30px; background: white; }
    th, td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
    th { background-color: #007bff; color: white; }
    h2 { color: #333; border-left: 5px solid #007bff; padding-left: 10px; }
</style>";

echo "<h1>📊 Admin Data Viewer</h1>";

if ($conn->connect_error) {
    die("<h3 style='color:red'>Connection Failed: " . $conn->connect_error . "</h3>");
}

// Get Tables
$tables = [];
$result = $conn->query("SHOW TABLES");
while($row = $result->fetch_array()) { $tables[] = $row[0]; }

if (empty($tables)) {
    echo "<h3>⚠️ Connected, but Database is Empty.</h3>";
    echo "<p>No tables found. (Did you run your SQL creation script?)</p>";
}

// Show Data
foreach ($tables as $table) {
    echo "<h2>Table: $table</h2>";
    $data = $conn->query("SELECT * FROM $table");
    
    if ($data->num_rows > 0) {
        echo "<table><thead><tr>";
        $fields = $data->fetch_fields();
        foreach ($fields as $field) { echo "<th>" . $field->name . "</th>"; }
        echo "</tr></thead><tbody>";
        
        while($row = $data->fetch_assoc()) {
            echo "<tr>";
            foreach ($row as $value) { echo "<td>" . htmlspecialchars($value) . "</td>"; }
            echo "</tr>";
        }
        echo "</tbody></table>";
    } else {
        echo "<p>Table is empty.</p>";
    }
}
$conn->close();
?>
