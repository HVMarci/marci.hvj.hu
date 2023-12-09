<?php

$joValasz = 0;
$valaszok = array("3", "1");

for ($x = 0; $x < 2; $x++) {
    if ($_POST[$x+1] == $valaszok[$x]) {
        $joValasz += 1;
    }
}

echo($joValasz . " jó válaszod volt a 2 kérdésből!");

?>