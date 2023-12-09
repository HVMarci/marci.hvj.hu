// szerverről a bejelentkezési állapot lekérése
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        if (this.responseText == 1234) {
            document.location = "valasztas.html";
        } else {
            //alert(this.responseText);
        }
    }
}

// a szándék definiálása
var fd = new FormData();
fd.append("szandek", "ellenorzes");

// küldés
xhttp.open("POST", "login/login.php");
xhttp.send(fd);