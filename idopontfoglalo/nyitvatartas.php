<?php

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $servername = "localhost";
    $username = "root";
    $password = "root";
    $database = "idopontfoglalo";

    $mysqli = new mysqli($servername, $username, $password, $database);

    if ($mysqli->connect_error) {
        die("Database connection failed: " . $conn->connect_error);
    }

    // Nyitvatartási idők visszaküldése
    $sql = "SELECT nap, kezd, veg FROM nyitvatartas;";
    $result = $mysqli->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $napok = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            if ($row['kezd'] != '0:00') {
                echo "{day:'" . $napok[$row['nap']] . "';begin:" . $row['kezd'] . ";end:" . $row['veg'] . "},";
            }
        }
    }

    $mysqli->close();
} else {
    http_response_code(405);
    echo "Method not allowed.";
}
?>
