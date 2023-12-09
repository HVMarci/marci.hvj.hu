function kviz_submit() {

    // leállítjuk a böngésző alapértelmezett működését:
    event.preventDefault();
    
    // az űrlap tartalmát FormData object segítségével érjük el:
    var fd = new FormData(document.getElementById("kvizForm"));

    // létrehozzuk az AJAX POST hívást a szerver felé:
    var formSubmitAjax = new XMLHttpRequest();
    formSubmitAjax.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                //alert("Sikerült az kvíz elküldése.\n\n" +  this.responseText);
                document.getElementById("visszateres").innerHTML = this.responseText;
            } else if (this.status == 403) {
                alert("403 hiba");
            } else {
                alert("HIBA!\nNem sikerült elküldeni az űrlapot!\n\n" + this.responseText);
            }
        }
    }
    formSubmitAjax.open("POST", "ellenorzes.php");
    formSubmitAjax.send(fd);
    //VISSZARAKNI!!!
    //#########################################################

    $(".radio").attr("disabled","disabled");

    //#########################################################
    //VISSZARAKNI!!!
    
}

function login() {
    document.getElementById("login").innerHTML = this.responseText;
}