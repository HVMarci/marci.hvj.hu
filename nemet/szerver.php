<?php

$mysqli = new mysqli(null, "kutyuido", "SWYfkJvEiu", "kutyuido", null, "/tmp/mysql57.sock");


if ($mysqli->connect_errno) {
    header("HTTP/1.0 500 MySQL error");
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . $mysqli->connect_errno() . PHP_EOL;
    echo "Debugging error: " . $mysqli->connect_error() . PHP_EOL;
    exit;
}

$sql_insert = "INSERT INTO
                        nemet (
                            uzenet,
                            kuldo,
                            valasz
                        )
                    VALUES (
                        '" . $_POST["uzi"] . "',
                        '" . $_POST["nev"] . "',
                        '" . $_POST["valasz"] . "'
                        );";

    // var_dump($_POST);
    // echo($sql_insert);

if (!$mysqli->query($sql_insert)) {
    header("HTTP/1.0 500 MySQL error");
    echo($mysqli->error);
    $mysqli->close();
    exit;         
}
?>