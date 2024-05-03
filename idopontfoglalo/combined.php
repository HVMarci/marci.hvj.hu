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


$servername = "localhost";
$username = "root";
$password = "root";
$database = "idopontfoglalo";

$mysqli = new mysqli($servername, $username, $password, $database);

if ($mysqli->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}


// Check if the server request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($_POST['method'])) {
        http_response_code(400);
        die("Please include method in POST data.");
    }

    $method = $_POST['method'];

    if ($method == "book") {
        // Időpont foglalása
        if (!isset($_POST['date']) || !isset($_POST['time']) || !isset($_POST['name']) || !isset($_POST['taj'])) {
            http_response_code(400);
            die("Please include date, time, name and TAJ-number in POST data.");
        }

        $date = new DateTime($_POST['date']);
        $time = $_POST['time'];
        $name = $_POST['name'];
        $taj = $_POST['taj'];

        $szabad_idopontok = getFreeAppointments($mysqli, $date);

        if (!in_array($time, $szabad_idopontok)) {
            http_response_code(400);
            die("The selected time is not available.");
        }

        $sql = "INSERT INTO idopontok (datum, idopont, nev, taj) VALUES (?, ?, ?, ?)";
        $stmt = $mysqli->prepare($sql);
        $formatted_date = $date->format('Y-m-d');
        $stmt->bind_param("sssi", $formatted_date, $time, $name, $taj);
        
        if ($stmt->execute()) {
            echo "Appointment booked successfully.";
        } else {
            http_response_code(500);
            echo "Error booking appointment.";
        }
    } else {
        http_response_code(400);
        echo "Invalid method.";
    }
} else {
    if (!isset($_GET['method'])) {
        http_response_code(400);
        die("Please include method in GET data.");
    }
    
    $method = $_GET['method'];
    if ($method == "opening_hours") {
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
    } else if ($method == "appointments") {
        // Szabad időpontok az adott napra
        if (!isset($_GET['date'])) {
            http_response_code(400);
            die("Please include date in GET data.");
        }
        
        $date = new DateTime($_GET['date']);
        
        $szabad_idopontok = getFreeAppointments($mysqli, $date);
        
        echo json_encode($szabad_idopontok);
    } else {
        http_response_code(400);
        echo "Invalid method.";
    }
}

$mysqli->close();
?>
