<?php

//echo $_POST["1"].$_POST["2"].$_POST["3"].$_POST["4"].$_POST["szovegDobozokSzama"].$_POST;

//var_dump($_POST);

// Kapcsolódás MySQL-hez
$servername = "db57.webonic.sk";
$username = "hvmarciEnaplo";
$password = 'yV$HE5cTjy';

$mysqli = new mysqli(null, $username, $password, $username, null, "/tmp/mysql57.sock");

// ha nem sikerül kapcsolódni
if ($mysqli->connect_error) {
    die("A kapcsolódás sikertelen..." . $mysqli->connect_error);
}

// eredeti megoldás
// adatok sorbarakása
/*$sqlAdatok = "";
$x = (int)$_POST["szovegDobozokSzama"];
for (; $x > 0; $x--) {
    $sqlAdatok = $sqlAdatok . $_POST[$x] . " TEXT";
    if ($x != 1) {
        $sqlAdatok = $sqlAdatok . ",\n";
        //var_dump($sqlAdatok);
    }
}

// tábla létrehozása

$sql = "CREATE TABLE " . $_POST["osztalynev"] . " (\n" . $sqlAdatok . ")";
echo $sql;

// Sikerült a táblázat készítése?
if ($mysqli->query($sql) === TRUE) {
    echo "Az osztály létrehozása sikeres";
} else {
    die($mysqli->error);
}*/

//

// Kilépés MySQL-ből
$mysqli->close();

?>