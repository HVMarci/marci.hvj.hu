<?php
function getFreeAppointments($mysqli, $date) {
    $sql = "SELECT kezd, veg FROM nyitvatartas WHERE nap=?";
    $nap_index = $date->format('N') - 1;
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("i", $nap_index);
    $stmt->execute();

    $stmt->bind_result($kezd, $veg);
    $stmt->fetch();
    $stmt->close();

    $sql = "SELECT idopont FROM idopontok WHERE datum=?";
    $stmt = $mysqli->prepare($sql);
    $formatted_date = $date->format('Y-m-d');
    $stmt->bind_param("s", $formatted_date);
    $stmt->execute();

    $stmt->bind_result($idopont);
    $idopontok = [];
    while ($stmt->fetch()) {
        $idopontok[] = $idopont;
    }
    $stmt->close();

    $szabad_idopontok = [];
    $kezd = new DateTime($kezd);
    $veg = new DateTime($veg);
    $veg->sub(new DateInterval('PT30M'));
    while ($kezd <= $veg) {
        $idopont = $kezd->format('H:i');
        if (!in_array($idopont, $idopontok)) {
            $szabad_idopontok[] = $idopont;
        }
        $kezd->add(new DateInterval('PT30M'));
    }

    return $szabad_idopontok;
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $servername = "localhost";
    $username = "root";
    $password = "root";
    $database = "idopontfoglalo";

    $mysqli = new mysqli($servername, $username, $password, $database);

    if ($mysqli->connect_error) {
        die("Database connection failed: " . $conn->connect_error);
    }

    // Szabad időpontok az adott napra
    if (!isset($_GET['date'])) {
        http_response_code(400);
        die("Please include date in GET data.");
    }

    $date = new DateTime($_GET['date']);

    $szabad_idopontok = getFreeAppointments($mysqli, $date);

    echo json_encode($szabad_idopontok);

    $mysqli->close();
} else  {
    http_response_code(405);
    die("Method not allowed.");
}
?>
