<?php

$mysqli = new mysqli(null, "kutyuido", "SWYfkJvEiu", "kutyuido", null, "/tmp/mysql57.sock");


if ($mysqli->connect_errno) {
    header("HTTP/1.0 500 MySQL error");
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . $mysqli->connect_errno() . PHP_EOL;
    echo "Debugging error: " . $mysqli->connect_error() . PHP_EOL;
    exit;
}

$sql_select = "SELECT * FROM nemet;";
$sql_result = $mysqli->query($sql_select);



while ($row = $sql_result->fetch_assoc()) {
    echo "<tr><td>". $row['id'] .".</td><td>" . $row['uzenet'] . "</td><td>Válasz neki: ". $row['valasz'] . "</td></tr>";
}
$sql_result->close();

$mysqli->close();
?>