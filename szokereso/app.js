var betuk1 = ["a",  "á", "b", "c", "d", "e", "é", "f", "g", "h", "i", "í", "j", "k", "l", "m", "n", "o", "ó", "ö", "ő", "p", "q", "r", "s", "t", "u", "ú", "ü", "ű", "v", "w", "x", "y", "z"];
var betuk2 = ["a",  "á", "b", "c", "d", "e", "é", "f", "g", "h", "i", "í", "j", "k", "l", "m", "n", "o", "ó", "ö", "ő", "p", "r", "s", "t", "u", "ú", "ü", "ű", "v", "y", "z"];
var betutipus;

function bekuldes() {
    betutipus = document.getElementById("magyarbetuk").checked;
    var szam = $("#soroszlop").val();
    var tablaresz = '<td><input type="text" class="tabla ures" maxlength="1" onchange="ellenorzes(this);"></td>';
    var soktablaresz = tablaresz.repeat(szam);
    var oszlop = '<tr>' + soktablaresz + '</tr>';
    var sokoszlop = oszlop.repeat(szam);
    var tabla = '<table>' + sokoszlop + '</table>';
    $("#tablazat").html(tabla);
    $("#kitoltogomb").html('<button onclick="kitoltes()">Kitöltés</button>');
}

function kitoltes() {
    var inputokszama = $(".ures").length;
    for (i = inputokszama; i > 0; i--) {
        var randomszam1 = Math.floor(Math.random() * 35);
        var randomszam2 = Math.floor(Math.random() * 32);
        if (betutipus == true) {
            //alert(betutipus);
            $(".ures:first").val(betuk1[randomszam1]);
        } else {
            //alert(betutipus);
            $(".ures:first").val(betuk2[randomszam2]);
        }
        $(".ures:first").removeClass("ures");
        //return betuk[randomszam];
    }
}

function ellenorzes(ezazelem) {
    if ($(ezazelem).val() != "") {
        $(ezazelem).removeClass("ures");
    } else {
        $(ezazelem).addClass("ures");
    }
}