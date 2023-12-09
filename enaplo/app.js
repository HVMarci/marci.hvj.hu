window.onload = function() {

    // létrehozunk egy elküldhető objektumot
    var fd = new FormData();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           alert(this.responseText); 
        }
    }

    // jelezzük a szándékunkat
    fd.append("szandek", "tudakolozas");

    // küldés
    xhttp.open("POST", "login/login.php");
    xhttp.send(fd);
}

function jegyBekuldese() {
    event.preventDefault();

    var fd = new FormData(document.getElementById("beirasForm"));

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //alert(this.responseText);
            document.getElementById("jegyekKiirasiHelye").innerHTML = this.responseText;

            // a kiírt szöveg 2 mp-n belüli törlése
            setTimeout(() => {
                document.getElementById("jegyekKiirasiHelye").innerHTML = "";
            }, 2000);
        }
    }
    xhttp.open("POST", "jegyRogzitese.php");
    xhttp.send(fd);
}


// a visszakapott értékek kiírása
function jegyekKiirasaDivbe() {
    event.preventDefault();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("jegyekKiirasiHelye").innerText = this.responseText;
        }
    }
    xhttp.open("POST", "jegyKuldese.php");
    xhttp.send();
}