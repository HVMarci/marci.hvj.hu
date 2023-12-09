function iskolaRegisztracio() {
    // másik oldalra ugrás megelőzése
    event.preventDefault();

    // formdata definiálása
    var fd = new FormData(document.getElementById("register"));

    // lekérés
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
            if (this.responseText != 1234) {
                document.location = "/enaplo";
            }
        }
    }
    xhttp.open("POST", "iskolaRegisztracio.php");
    xhttp.send(fd);
}