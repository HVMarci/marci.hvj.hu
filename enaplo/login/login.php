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


// ha a felhasználó bejelentkezni akar
function bejelentkezes($mysqli) {
    // az sql parancs
    $sql = 'SHOW TABLES;';

    // a visszakapott adatok megszerzése a $keszErtek változóba
    $result = $mysqli->query($sql);
    $keszErtek = "\n";
    while($row = $result->fetch_assoc()) {
        $keszErtek = $keszErtek . $row["Tables_in_hvmarciEnaplo"] . "\n";
        //var_dump($keszErtek);
    }
    // Van-e ilyen tábla?
    if (strpos($keszErtek, "\n" . $_POST["osztalynev"] . "\n") != NULL) {
        echo "a loggggin Sikkkkereesssss" . "\n";
        setcookie("felhasznalonev", $_POST["osztalynev"], time() + 86400, "/enaplo");
        echo $keszErtek;
    } else {
        $mysqli->close();
        die("Ez az osztály nem létezik!");
    }
}

// Be van-e lépve a tisztelt felhasználó?
function ellenorzes() {
    if (isset($_COOKIE["felhasznalonev"])) {
        echo "Már be van jelentkezve!";
    } else {
        echo 1234;
    }
}

// Mi a felhasználónév?
function tudakolozas() {
    if (!isset($_COOKIE["felhasznalonev"])) {
        die("Nem vagy bejelentkezve!!!");
    }
    echo $_COOKIE["felhasznalonev"];
}

//var_dump($_POST);
// Most kiderül, hogy a kedves illető mit akar!
if ($_POST["szandek"] == "login") {
    bejelentkezes($mysqli);
} else if ($_POST["szandek"] == "ellenorzes") {
    ellenorzes();
} else if ($_POST["szandek"] == "tudakolozas") {
    tudakolozas();
}

// kilépés mysql-ből
$mysqli->close();
?>