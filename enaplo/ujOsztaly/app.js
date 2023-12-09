var szovegDobozokSzama = 1;
var formAdat = document.getElementById("nevDiv").innerHTML;
var iskolaNevSelect = document.getElementById("iskolaNev").innerHtml;

function szovegDobozHozzaadasa() {
    szovegDobozokSzama += 1;
    document.getElementById("nevDiv").innerHTML = formAdat + "<br><input type=\"text\" name=\"" + szovegDobozokSzama + "\">";
    formAdat = document.getElementById("nevDiv").innerHTML;
}

function ujratoltes() {
    document.location = "http://marci.hvj.hu/enaplo/ujOsztaly/"
}

function tablazatKeszites() {
    event.preventDefault();

    var fd = new FormData(document.getElementById("nevek"));
    
    fd.append("szovegDobozokSzama", szovegDobozokSzama);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
        }
    }
    xhttp.open("POST", "osztalyKeszites.php");
    xhttp.send(fd);
}

