<?php

// Kapcsolódás MySQL-hez
$servername = "db57.webonic.sk";
$username = "hvmarciEnaplo";
$password = 'yV$HE5cTjy';

$mysqli = new mysqli(null, $username, $password, $username, null, "/tmp/mysql57.sock");

// ha nem sikerül kapcsolódni
if ($mysqli->connect_error) {
    die("A kapcsolódás sikertelen..." . $mysqli->connect_error);
}

$sql = 'SELECT * FROM jegy';
$result = $mysqli->query($sql);

while($row = $result->fetch_assoc()) {
    echo $row["nev"] . ": " . $row["szam"] . "\n";
}

// Sikerült a lekérdezés?
/*if ($result = $mysqli->query($sql) === TRUE) {
    echo "A jegyek: ";
} else {
    die("Miért nem tudok gépelni?");
}*/

?>