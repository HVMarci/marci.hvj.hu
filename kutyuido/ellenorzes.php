<?php
    $mysqli = new mysqli(null, "kutyuido", "SWYfkJvEiu", "kutyuido", null, "/tmp/mysql57.sock");

    if ($mysqli->connect_errno) {
        header("HTTP/1.0 500 MySQL error");
        echo "Error: Unable to connect to MySQL." . PHP_EOL;
        echo "Debugging errno: " . $mysqli->connect_errno() . PHP_EOL;
        echo "Debugging error: " . $mysqli->connect_error() . PHP_EOL;
        exit;
    }

    $mami = "SELECT * FROM `kodok` WHERE ember='Mami';";
    $mami_result = $mysqli->query($mami);
    $papi = "SELECT * FROM `kodok` WHERE ember='Papi';";
    $papi_result = $mysqli->query($papi);
    $titkoskod = ; 
    //587. oldal
    #370. oldal

    if ($mami_result == $titkoskod)
    {
        while ($row = $mami_result->fetch_assoc()) {
            ;
        }
    }
    elseif ($papi_result == $titkoskod)
    {

    }
    else
    {

    }


    $papi_result->close();
    $mami_result->close();

    $mysqli->close();

?>