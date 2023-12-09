function oldalbetoltes() {
    event.preventDefault();
    var cuccok = new XMLHttpRequest();
    cuccok.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //alert(this.responseText);
            document.getElementById("ide").innerHTML = this.responseText;
        }
    }
    cuccok.open("GET", "lekeres.php", true);
    cuccok.send();

}

function uzenet_submit() {

    event.preventDefault();
    var fd = new FormData(document.getElementById("uziform"));

    // létrehozzuk az AJAX POST hívást a szerver felé:
    var formSubmitAjax = new XMLHttpRequest();
    formSubmitAjax.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                alert("Sikerült az üzenet elküldése.\n\n" +  this.responseText);
                oldalbetoltes();
            } else {
                alert("HIBA!\nNem sikerült rögzíteni az üzenetet!\n\n" + this.responseText);
            }
        }
    }
    formSubmitAjax.open("POST", "szerver.php");
    formSubmitAjax.send(fd);
}