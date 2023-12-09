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

// a mysql parancs
$sql = "INSERT INTO `iskola` (`nev`,`cim`,`honlap`,`jelszo`) VALUES ('" . $_POST["iskolaNev"] . "','" . $_POST["iskolaCim"] . "','" . $_POST["iskolaWeblap"] . "','" . $_POST["iskolaJelszo"] . "')";
echo $sql;

if ($mysqli -> query($sql) === TRUE) {
    echo "A regisztráció megtörtént";
} else {
    echo 1234;
}
?>