<!doctype html>
<html>
<head>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<script type="text/javascript" src="urlap.js"></script>
<link rel="stylesheet" type="text/css" href="urlap.css">
<title>Egy űrlap</title>
<meta charset="utf-8">
</head>
<body>
<form id="felhasznaloiUrlap" method="POST" action="urlapot-feldolgoz.php">
<div>
    <fieldset>
    <legend>Felhasználói információk</legend>
    <div id="hibaDiv"></div>
    <label for="nev">Név:* </label>
    <input type="text" id="nev" name="nev">
    <span class="hibaVisszajelzes hibaSzakasz" id="nevHiba">Név megadása kötelező</span>
    <br />
    <label for="megye">Megye: </label>
    <select name="megye" id="megye">
    <option></option>
    <option>Bács-Kiskun</option>
    <option>Baranya</option>
    <option>Békés</option>
    <option>Borsod-Abaúj-Zemplén</option>
    <option>Csongrád</option>
    <option>Fejér</option>
    <option>Győr-Moson-Sopron</option>
    <option>Hajdú-Bihar</option>
    <option>Heves</option>
    <option>Jász-Nagykun-Szolnok</option>
    <option>Komárom-Esztergom</option>
    <option>Nógrád</option>
    <option>Pest</option>
    <option>Somogy</option>
    <option>Szabolcs-Szatmár-Bereg</option>
    <option>Tolna</option>
    <option>Vas</option>
    <option>Veszprém</option>
    <option>Zala</option>
    </select>
    <br />
    <label for="iranyitoszam">Irányítószám: </label>
    <input type="text" id="iranyitoszam" name="iranyitoszam">
    <br />
    <label for="email">E-mail cím:* </label>
    <input type="text" id="email" name="email">
    <span class="hibaVisszajelzes hibaSzakasz" id="emailHiba">E-mail cím megadása kötelező</span>
    <br />
    <label for="telefon">Telefonszám: </label>
    <input type="text" id="telefon" name="telefon">
    <span class="hibaVisszajelzes hibaSzakasz" id="telefonHiba">Formátum: xx-xxx-xxx vagy x-xxx-xxxx</span>
    <br />
    <label for="munka">Telefonszám típusa: </label>
    <input class="radioButton" type="radio" name="telefontipus" id="munka" value="munka">
    <label class="radioButton" for="munka">Munkahelyi</label>
    <input class="radioButton" type="radio" name="telefontipus" id="otthoni" value="otthoni">
    <label class="radioButton" for="otthoni">Otthoni</label>
    <span class="hibaVisszajelzes telefontipusHiba" id="telefontipusHiba">Kérjük válasszon ki egy opciót</span>
    <br />
    <label for="jelszo1">Jelszó:* </label>
    <input type="password" id="jelszo1" name="jelszo1">
    <span class="hibaVisszajelzes hibaSzakasz" id="jelszo1Hiba">Jelszó megadása kötelező</span>
    <br />
    <label for="jelszo2">Jelszó megerősítése:* </label>
    <input type="password" id="jelszo2" name="jelszo2">
    <span class="hibaVisszajelzes hibaSzakasz" id="jelszo2Hiba">A két jelszó nem egyezik</span>
    <br />
    <input type="submit" id="elkuld" name="elkuld">
    </fieldset>
</div>
</form>
</body>
</html>