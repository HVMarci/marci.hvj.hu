<?php
//########################################################################################################
//
// esemenylista.php
// készítette: Horváth-Varga János
// v0.0: 2019. február 23. POST-ot eltároljuk az adatbázisban, 200 vagy 500 HTTP code-dal térünk vissza.
// v0.8: 2019. február 24. az eseménylistát visszaadjuk GET-tel, de egyerlőre csak gyerek nevére szűrve az egészet
// v0.8.1: 2019. március 3.:
//         - a POST egy kódot is küld, a POST-ot csak akkor fogadjuk el, ha a kód helyes (kodok SQL tábla)
//         - az eseménylista az aktuális napot megelőző vasárnaptól következő szombatig listáz
//         - összesíti a beírt adatokat
//
//########################################################################################################

if (isset($_POST["plusz"])) {
    $_POST["ido"] = abs($_POST["plusz"]);
}

if (isset($_POST["minusz"])) {
    $_POST["ido"] = abs($_POST["minusz"]) * -1;
}

//=========================================================================================================================================
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

if (isset($_POST["ido"])) {
    //=========================================================================================================================================
    // ha POST üzenetet kaptam, akkor eltárolom a bejegyzést:
        
    //leellenőrizzük először a kod-ot, szerepel-e a kodok táblában?

    //ha a kód mező üres, vagy nem szám van benne, nem is fordulunk az adatbázishoz, rögtön kilépünk!
    if (!is_numeric($_POST["kod"])) {
        header("HTTP/1.0 403 Forbidden - nincs ilyen kód");
        $mysqli->close();
        exit;                
    }

    $kod_sql = "SELECT ember FROM kodok WHERE kod=" . $_POST["kod"] . ";";

    if (!($res = $mysqli->query($kod_sql))) {
        header("HTTP/1.0 500 MySQL error");        
        echo($mysqli->error);
        $mysqli->close();
        exit;
    }
    else {
        if (!($row = $res->fetch_assoc())) {
            //nincs ilyen kód az adatbázisban:
            header("HTTP/1.0 403 Forbidden - nincs ilyen kod");
            $mysqli->close();
            exit;                
        }
        // tudjuk, kinek a kódját adták meg, de nem csinálunk ezzel az infóval egyelőre semmit.
        //echo($row['ember']);
       $res->free();
    }

    $sql_insert = "INSERT INTO
                        esemenylista (
                            gyermek,
                            datum,
                            cselekves,
                            ido
                        )
                    VALUES (
                        '" . $_POST["gyermek"] . "',
                        '" . $_POST["datum"] . "', 
                        '" . $_POST["cselekves"] . "', 
                        '" . $_POST["ido"] . "'
                        );";

    // var_dump($_POST);
    // echo($sql_insert);

    if (!$mysqli->query($sql_insert)) {
        header("HTTP/1.0 500 MySQL error");
        echo($mysqli->error);
        $mysqli->close();
        exit;         
    }

} elseif (isset($_GET["gyermek"])) {

    //=========================================================================================================================================
    // mivel GET-ben gyermek nevet kaptam, visszaadom ennek a gyermeknek
    // az eseménylistáját html-ben kódolva.

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

    // pozitív eredmény kiszámítása

    $sql_select = "SELECT SUM(ido) as pluszeredmeny FROM esemenylista WHERE
                    gyermek=\"". $_GET['gyermek'] . "\"
                    AND
                    datum>=\"$utolso_vas\"
                    AND
                    datum<\"$kovetkezo_vas\"
                    AND
                    ido>0
                    ;";

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
            $pluszeredmeny = $row['pluszeredmeny'];
            $eredmeny = $pluszeredmeny;
            $res->free();
        }
    }

    // negatív eredmény kiszámítása

    $sql_select = "SELECT SUM(ido) as minuszeredmeny FROM esemenylista WHERE
                    gyermek=\"". $_GET['gyermek'] . "\"
                    AND
                    datum>=\"$utolso_vas\"
                    AND
                    datum<\"$kovetkezo_vas\"
                    AND
                    ido<0
                    ;";

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
            $minuszeredmeny = $row['minuszeredmeny'];
            $eredmeny = $eredmeny + $minuszeredmeny;
            $res->free();
        }
    }

    if ($minuszeredmeny === NULL) {
        $minuszeredmeny = 0;
    }

    if ($pluszeredmeny === NULL) {
        $pluszeredmeny = 0;
    }

    echo("<p>Heti kütyüidő egyenleg: $eredmeny perc ($minuszeredmeny + $pluszeredmeny)</p>");
    //echo("<button>&lt;&lt; Vissza egy hét</button><button>Tovább egy héttel &gt;&gt;</button>");

    $sql_select = "SELECT
                        esemenylista.gyermek as gyermek,
                        DATE_FORMAT(esemenylista.datum,\"%M %e. %W\") as datum,
                        esemenylista.ido as ido,
                        esemenylista.cselekves as cselekves
                     FROM
                        esemenylista
                     WHERE
                        gyermek=\"". $_GET['gyermek'] . "\"
                        AND
                        datum>=\"$utolso_vas\"
                        AND
                        datum<\"$kovetkezo_vas\"
                        ;";

    // var_dump($_POST);
    // echo($sql_select);
    // exit;

    if (!($res = $mysqli->query($sql_select))) {
        header("HTTP/1.0 500 MySQL error");
        echo($mysqli->error);
    }
    else {
        while ($row = $res->fetch_assoc()) {
            echo($row['datum']);
            echo(":&nbsp;");
            echo($row['cselekves']);
            echo("&nbsp;");
            echo($row['ido']);
            echo("&nbsp;perc");
            echo("<br>");
        }
        /* free result set */
       $res->free();
    }
} else {
    header("HTTP/1.0 500 Nem kaptam megfelelő hívást.");
}

$mysqli->close();
?>