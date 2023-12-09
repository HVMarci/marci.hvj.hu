<?php

// MySQL adatbázis csatlakozás

//$connection = mysqli_connect("db57.webonic.sk", "kutyuido", "SWYfkJvEiu", "kutyuido");
$mysqli = new mysqli(null, "kutyuido", "SWYfkJvEiu", "kutyuido", null, "/tmp/mysql57.sock");

if ($mysqli->connect_errno) {
    header("HTTP/1.0 500 MySQL error");
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . $mysqli->connect_errno() . PHP_EOL;
    echo "Debugging error: " . $mysqli->connect_error() . PHP_EOL;
    exit;
}
// A MySQL szerveren az időneveket magyarra állítom:
if (!($mysqli->query("SET lc_time_names = 'hu_HU';"))) {
    header("HTTP/1.0 500 MySQL error");        
    echo($mysqli->error);
    $mysqli->close();
    exit;
}

// megkeresem az utolsó vasárnapot, onnantól kérem le a listát a következő szombattal bezárólag (felkészülök a későbbi lapozhatóságra)
// ha ma vasárnap van, akkor mától kérem le az adatokat:
if (date("D")=="Sun") {
    $utolso_vas = date("Y-m-d");
    $kovetkezo_vas = date("Y-m-d", strtotime("today")+7*24*3600);
}
else {
    $utolso_vas = date("Y-m-d", strtotime("last Sunday"));
    $kovetkezo_vas = date("Y-m-d", strtotime("last Sunday")+7*24*3600);
}
$osszesites = array();

for ($k = 0; $k < 2; $k++) {
    for ($j = 0; $j < 5; $j++) {
        for ($i = 0; $i < 7; $i++) {
            switch ($j) {
                case 0:
                    $gyermek = "marci";
                break;
                case 1:
                    $gyermek = "dani";
                break;
                case 2:
                    $gyermek = 'bogi';
                break;
                case 3:
                    $gyermek = 'zsofi';
                break;
                case 4:
                    $gyermek = 'mindenki';
                break;
            }
            if ($k == 0) {
                if ($gyermek != 'mindenki') {
                    $sql_select = "SELECT SUM(ido) as osszesites FROM esemenylista WHERE
                    datum=\"".date("Y-m-d", strtotime("last Sunday")+$i*24*3600)."\"
                    AND
                    gyermek='$gyermek'
                    ";
                } else if ($gyermek == 'mindenki') {
                    $sql_select = "SELECT SUM(ido) as osszesites FROM esemenylista WHERE
                    datum=\"".date("Y-m-d", strtotime("last Sunday")+$i*24*3600)."\"
                    ";
                }
            } else if ($k == 1) {
                if ($gyermek != 'mindenki') {
                    $sql_select = "SELECT SUM(ido) as osszesites FROM esemenylista WHERE
                    datum<=\"".date("Y-m-d", strtotime("last Sunday")+$i*24*3600)."\"
                    AND
                    datum>=\"".date("Y-m-d", strtotime("last Sunday"))."\"
                    AND
                    gyermek='$gyermek'
                    ";
                } else if ($gyermek == 'mindenki') {
                    $sql_select = "SELECT SUM(ido) as osszesites FROM esemenylista WHERE
                    datum<=\"".date("Y-m-d", strtotime("last Sunday")+$i*24*3600)."\"
                    AND
                    datum>=\"".date("Y-m-d", strtotime("last Sunday"))."\"
                    ";
                }
            }
            
            if (!($res = $mysqli->query($sql_select))) {
                header("HTTP/1.0 500 MySQL error");
                echo($mysqli->error);
                $mysqli->close();
                exit;
            }
            else {
                if (!($row = $res->fetch_assoc())) {
                    header("HTTP/1.0 500 MySQL error");
                    echo($mysqli->error);
                    $mysqli->close();
                    exit;
                }
                else {
                    if ($row['osszesites'] === NULL) {
                        $row['osszesites'] = 0;
                    }
                    if (is_int($row['osszesites']) == false) {
                        $row['osszesites'] = (int)$row['osszesites'];
                    }
                    $osszesites[$k*35+$i+$j*7] = $row['osszesites'];
                    $res->free();
                }
            }

        }
    }
}
echo json_encode($osszesites);

?>