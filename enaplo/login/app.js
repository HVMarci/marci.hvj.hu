// osztálynév szerverre küldése
function bejelentkezes() {
    event.preventDefault();

    var fd = new FormData(document.getElementById("loginForm"))

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
            document.location = "/enaplo";
        }
    }

    fd.append("szandek", "login");

    xhttp.open("POST", "login.php");
    xhttp.send(fd);
}