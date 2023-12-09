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

// előző jegy kitörlése
//$delete_sql = 'DELETE FROM jegy';
// jegy beírása MySQL-be
$sql = 'INSERT INTO jegy (nev,szam) VALUES ("'.$_POST["nev"].'",'.$_POST["jegy"].')';

// Sikerült a törlés?
/*if ($mysqli->query($delete_sql) === TRUE) {
    echo "Előző érték törölve. ";
} else {
    die("Miért nem tudok gépelni?");
}*/

// Sikerült a beírás?
if ($mysqli->query($sql) === TRUE) {
    echo "Sikeres a jegy beírása.";
} else {
    die($mysqli->error);
}

// Kilépés a MySQL-ből
$mysqli->close();
?>