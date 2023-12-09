var diagramObjektum = new Object();

function pluszLetiltas() {
    if ($("#minusz").val() != "") {
        $("#plusz").attr("disabled","disabled");
        $("#plusz").addClass("szurke");
    } else {
        $("#plusz").removeAttr("disabled");
        $("#plusz").removeClass("szurke");
    }
}

function minuszLetiltas() {
    if ($("#plusz").val() != "") {
        $("#minusz").attr("disabled","disabled");
        $("#minusz").addClass("szurke");
    } else {
        $("#minusz").removeAttr("disabled");
        $("#minusz").removeClass("szurke");

    }
}

/*
function pluszFeloldas() {
    console.log("pluszFeloldas");
    if ($("#plusz").val() != "") {
        $("#plusz").removeAttr("disabled");
        $("#minusz").val("");
    }
}

function minuszFeloldas() {
    if ($("#minusz").val() != "") {
        $("#minusz").removeAttr("disabled");
        $("#plusz").val("");
    }
}
*/

function felszabaditas() {
    $("#plusz").removeAttr("disabled");
    $("#minusz").removeAttr("disabled");
    $("#plusz").removeClass("szurke");
    $("#minusz").removeClass("szurke");
}

// az éppen kiválasztott gyermeket tároljuk ebben a globális változóban:
var gyermek = "marci";
// az egyes fényképekre kattintva a gyermek kiválasztása, form-ban beállítása
function gyermekvalasztas(nev) {
    document.getElementById(gyermek).className = "";
    gyermek = nev;
    gyermek_input = document.getElementById("gyermek");
    gyermek_input.value=gyermek;
    document.getElementById(gyermek).className = "kivalasztott";
    esemenylista_betoltes();
    diagram_betoltes();
}

function esemenylista_betoltes() {

    // betöltjük az eseménylistát az éppen aktuális gyermeknek

    // létrehozzuk az AJAX GET hívást a szerver felé:
    var esemenylistaGetAjax = new XMLHttpRequest();
    esemenylistaGetAjax.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status != 200) {
                alert("HIBA!\nNem sikerült betölteni az eseménylistát!\n\n" + this.responseText);
            } else {
                var e = document.getElementById("esemenylista");
                e.innerHTML = this.responseText;
            }
        }
    }
    esemenylistaGetAjax.open("GET", "esemenylista.php?gyermek="+gyermek);
    esemenylistaGetAjax.send();

}

function diagram_betoltes() {

    // létrehozzuk az AJAX GET hívást a szerver felé:
    var diagramGetAjax = new XMLHttpRequest();
    diagramGetAjax.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status != 200) {
                alert("HIBA!\nNem sikerült betölteni az diagramot!\n\n" + this.responseText);
            } else {
                var e = document.getElementById("diagramText");
                //e.innerHTML = this.responseText;
                diagramObjektum = JSON.parse(this.responseText);
                diagramLetrehozas();
            }
        }
    }
    diagramGetAjax.open("GET", "diagram.php");
    diagramGetAjax.send();

}

function oldalbetoltes() {

    // indulásnál kiválasztjuk Marcit alapértelmezettnek:
    gyermekvalasztas("marci");

    // cselekvés lista betöltése:
    var cselekves_betoltes = new XMLHttpRequest();
    cselekves_betoltes.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //document.getElementById("cselekves_id").innerHTML = this.responseText;
        }
    }
    cselekves_betoltes.open("GET", "cselekves.php", true);
    cselekves_betoltes.send();

}

function esemenylista_submit() {

    // leállítjuk a böngésző alapértelmezett működését:
    event.preventDefault();
    
    // az űrlap tartalmát FormData object segítségével érjük el:
    var fd = new FormData(document.getElementById("esemenyForm"));

    // létrehozzuk az AJAX POST hívást a szerver felé:
    var formSubmitAjax = new XMLHttpRequest();
    formSubmitAjax.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                alert("Sikerült az űrlap elküldése.\n\n" +  this.responseText);
                esemenylista_betoltes();
            } else if (this.status == 403) {
                alert("Hibás kódot adtál meg!");
            } else {
                alert("HIBA!\nNem sikerült rögzíteni a kütyüidőt!\n\n" + this.responseText);
            }
        }
    }
    formSubmitAjax.open("POST", "esemenylista.php");
    formSubmitAjax.send(fd);
}

function diagramLetrehozas() {
    document.getElementById("diagram2").innerHTML = "";
    var chart = new CanvasJS.Chart("diagram");
    chart.options.axisY = { suffix: " perc", includeZero: true }
    chart.options.title = { text: "Mikor mennyi kütyüidőt szereztünk?" };
    chart.options.theme = "light1";
    var series1 = {
        type: "line",
        name: "Marci",
        showInLegend: true
    };
    var series2 = {
        type: "line",
        name: "Dani",
        showInLegend: true
    };
    var series3 = {
        type: "line",
        name: "Bogi",
        showInLegend: true
    };
    var series4 = {
        type: "line",
        name: "Zsófi",
        showInLegend: true
    };
    var series4 = {
        type: "line",
        name: "Zsófi",
        showInLegend: true
    };
    var series5 = {
        type: "line",
        name: "Mindenki összesen",
        showInLegend: true
    };

    chart.options.data = [];
    series1.dataPoints = [
        { label: "Vasárnap", y: diagramObjektum[0] },
        { label: "Hétfő", y: diagramObjektum[1] },
        { label: "Kedd", y: diagramObjektum[2] },
        { label: "Szerda", y: diagramObjektum[3] },
        { label: "Csütörtök", y: diagramObjektum[4] },
        { label: "Péntek", y: diagramObjektum[5] },
        { label: "Szombat", y: diagramObjektum[6] }
    ];
    series2.dataPoints = [
        { label: "Vasárnap", y: diagramObjektum[7] },
        { label: "Hétfő", y: diagramObjektum[8] },
        { label: "Kedd", y: diagramObjektum[9] },
        { label: "Szerda", y: diagramObjektum[10] },
        { label: "Csütörtök", y: diagramObjektum[11] },
        { label: "Péntek", y: diagramObjektum[12] },
        { label: "Szombat", y: diagramObjektum[13] }
    ];
    series3.dataPoints = [
        { label: "Vasárnap", y: diagramObjektum[14] },
        { label: "Hétfő", y: diagramObjektum[15] },
        { label: "Kedd", y: diagramObjektum[16] },
        { label: "Szerda", y: diagramObjektum[17] },
        { label: "Csütörtök", y: diagramObjektum[18] },
        { label: "Péntek", y: diagramObjektum[19] },
        { label: "Szombat", y: diagramObjektum[20] }
    ];
    series4.dataPoints = [
        { label: "Vasárnap", y: diagramObjektum[21] },
        { label: "Hétfő", y: diagramObjektum[22] },
        { label: "Kedd", y: diagramObjektum[23] },
        { label: "Szerda", y: diagramObjektum[24] },
        { label: "Csütörtök", y: diagramObjektum[25] },
        { label: "Péntek", y: diagramObjektum[26] },
        { label: "Szombat", y: diagramObjektum[27] }
    ];
    series5.dataPoints = [
        { label: "Vasárnap", y: diagramObjektum[28] },
        { label: "Hétfő", y: diagramObjektum[29] },
        { label: "Kedd", y: diagramObjektum[30] },
        { label: "Szerda", y: diagramObjektum[31] },
        { label: "Csütörtök", y: diagramObjektum[32] },
        { label: "Péntek", y: diagramObjektum[33] },
        { label: "Szombat", y: diagramObjektum[34] }
    ];
    chart.options.data.push(series1);
    chart.options.data.push(series2);
    chart.options.data.push(series3);
    chart.options.data.push(series4);
    chart.options.data.push(series5);

    chart.render();
}
function diagram2Letrehozas() {
    document.getElementById("diagram").innerHTML = "";
    var chart2 = new CanvasJS.Chart("diagram2");
    chart2.options.axisY = { suffix: " perc", includeZero: true }
    chart2.options.title = { text: "Mikor mennyi kütyüidőnk volt összesen?" };
    chart2.options.theme = "light2";
    var series1 = {
        type: "line",
        name: "Marci",
        showInLegend: true
    };
    var series2 = {
        type: "line",
        name: "Dani",
        showInLegend: true
    };
    var series3 = {
        type: "line",
        name: "Bogi",
        showInLegend: true
    };
    var series4 = {
        type: "line",
        name: "Zsófi",
        showInLegend: true
    };
    var series4 = {
        type: "line",
        name: "Zsófi",
        showInLegend: true
    };
    var series5 = {
        type: "line",
        name: "Mindenki összesen",
        showInLegend: true
    };

    chart2.options.data = [];
    series1.dataPoints = [
        { label: "Vasárnap", y: diagramObjektum[35] },
        { label: "Hétfő", y: diagramObjektum[36] },
        { label: "Kedd", y: diagramObjektum[37] },
        { label: "Szerda", y: diagramObjektum[38] },
        { label: "Csütörtök", y: diagramObjektum[39] },
        { label: "Péntek", y: diagramObjektum[40] },
        { label: "Szombat", y: diagramObjektum[41] }
    ];
    series2.dataPoints = [
        { label: "Vasárnap", y: diagramObjektum[42] },
        { label: "Hétfő", y: diagramObjektum[43] },
        { label: "Kedd", y: diagramObjektum[44] },
        { label: "Szerda", y: diagramObjektum[45] },
        { label: "Csütörtök", y: diagramObjektum[46] },
        { label: "Péntek", y: diagramObjektum[47] },
        { label: "Szombat", y: diagramObjektum[48] }
    ];
    series3.dataPoints = [
        { label: "Vasárnap", y: diagramObjektum[49] },
        { label: "Hétfő", y: diagramObjektum[50] },
        { label: "Kedd", y: diagramObjektum[51] },
        { label: "Szerda", y: diagramObjektum[52] },
        { label: "Csütörtök", y: diagramObjektum[53] },
        { label: "Péntek", y: diagramObjektum[54] },
        { label: "Szombat", y: diagramObjektum[55] }
    ];
    series4.dataPoints = [
        { label: "Vasárnap", y: diagramObjektum[56] },
        { label: "Hétfő", y: diagramObjektum[57] },
        { label: "Kedd", y: diagramObjektum[58] },
        { label: "Szerda", y: diagramObjektum[59] },
        { label: "Csütörtök", y: diagramObjektum[60] },
        { label: "Péntek", y: diagramObjektum[61] },
        { label: "Szombat", y: diagramObjektum[62] }
    ];
    series5.dataPoints = [
        { label: "Vasárnap", y: diagramObjektum[63] },
        { label: "Hétfő", y: diagramObjektum[64] },
        { label: "Kedd", y: diagramObjektum[65] },
        { label: "Szerda", y: diagramObjektum[66] },
        { label: "Csütörtök", y: diagramObjektum[67] },
        { label: "Péntek", y: diagramObjektum[68] },
        { label: "Szombat", y: diagramObjektum[69] }
    ];
    chart2.options.data.push(series1);
    chart2.options.data.push(series2);
    chart2.options.data.push(series3);
    chart2.options.data.push(series4);
    chart2.options.data.push(series5);

    chart2.render();
}