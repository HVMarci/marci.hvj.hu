<?php
//########################################################################################################
//
// cselekves.php
// készítette: Horváth-Varga János
// v0.0: 2019. február 16., első sorok, mysqli sikeres kapcsolódása socketen keresztül (máshogy nem ment)
// v0.2: 2019. február 23., az option listát visszaadja egy paraméter nélküli get kérésre
//
//########################################################################################################


//$connection = mysqli_connect("db57.webonic.sk", "kutyuido", "SWYfkJvEiu", "kutyuido");
$mysqli = new mysqli(null, "kutyuido", "SWYfkJvEiu", "kutyuido", null, "/tmp/mysql57.sock");

if ($mysqli->connect_errno) {
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . $mysqli->connect_errno() . PHP_EOL;
    echo "Debugging error: " . $mysqli->connect_error() . PHP_EOL;
    exit;
}

$sql_select = "SELECT * FROM cselekves;";
$sql_result = $mysqli->query($sql_select);

echo("<option value=\"semmi\" selected disabled>---Válassz egy opciót!---</option>");

while ($row = $sql_result->fetch_assoc()) {
    echo "<option value=\"" . $row['id'] . "\">" . $row['leiras'] . "</option>\n";
}
$sql_result->close();

$mysqli->close();
?>