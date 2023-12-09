const gameW = 960;
const gameH = 720;
const kepekSzama = 1;
var betoltottKepekSzama = 0;
var ctx, karakterlapCtx;
var a = 0;
var hatter, figura;
var szereploIndex;
var jatekosok = [];
/*var Helper = {
    x: 20,
    y: 20
};*/
var coords = [];
var path, karakterlapPath;
var karakterlapok = [];
var karakterIndex = 0;
var pathIndex = 0;
var jotanacsokSzama = pogacsakSzama = aranyakSzama = sokSzama = 0;
var megyAJatek = false;
var jatekoskorongR = 15, karakterlapR = 30;

function l() {
    if (betoltottKepekSzama == kepekSzama && a == 1) init();
}

function init() {
    fetch('resources/path/path.json').then(r => r.text()).then(t => {
        path = JSON.parse(t);

        var canvas = document.getElementById("nepmeseCanvas");
        ctx = canvas.getContext("2d");

        hatter = document.getElementById("tabla");
        figura = document.getElementById("szereplo");

        canvas.addEventListener("click", (e) => {
            console.log(e.offsetX + ", " + e.offsetY);
            send({
                method: "lepes",
                params: {
                    x: e.offsetX,
                    y: e.offsetY
                }
            });
        });

        /*window.addEventListener("keydown", (e) => {
            if (e.code == "Enter") {
                karakterlapTanitas(Helper.x, Helper.y, "aranyak");
            }
        });*/
        update();
    });
    fetch('resources/path/karakterlap.json').then(r => r.text()).then(t => {
        karakterlapPath = JSON.parse(t);

        var karakterlapCanvas = document.getElementById("karakterlapCanvas");
        karakterlapCtx = karakterlapCanvas.getContext("2d");

        karakterlapCanvas.addEventListener("click", (e) => {
            console.log(e.offsetX + ", " + e.offsetY);
            kUpdate();
        });
    });
}

function start() {
    send({
        method: "start"
    });
}

function torles() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, gameW, gameH);
}

function update() {
    hatterRajzolas();
    szereploRajzolas();
}

function hatterRajzolas() {
    ctx.drawImage(hatter, 0, 0, gameW, gameH);
}

function szereploRajzolas() {
    //ctx.drawImage(figura, Szereplo.x-15, Szereplo.y-15, 30,30);
    /*ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.arc(Szereplo.x, Szereplo.y, 15, 0, 2 * Math.PI);
    ctx.fill();*/
    ctx.filter = "brightness(110%)"
    if (megyAJatek) {
        for (let i = 0; i < jatekosok.length; i++) {
            if (i != szereploIndex) {
                /*ctx.beginPath();
                ctx.fillStyle = getColorFromName(jatekosok[i].karakter);
                ctx.arc(jatekosok[i].x, jatekosok[i].y, 15, 0, 2 * Math.PI);
                ctx.fill();*/
                ctx.drawImage(getImageFromName(jatekosok[i].karakter), jatekosok[i].x - jatekoskorongR, jatekosok[i].y - jatekoskorongR, jatekoskorongR * 2, jatekoskorongR * 2);
            }
        }

        /*ctx.beginPath();
        ctx.fillStyle = getColorFromName(jatekosok[szereploIndex].karakter);
        ctx.arc(jatekosok[szereploIndex].x, jatekosok[szereploIndex].y, 15, 0, 2 * Math.PI);
        ctx.fill();*/
        ctx.drawImage(getImageFromName(jatekosok[szereploIndex].karakter), jatekosok[szereploIndex].x - jatekoskorongR, jatekosok[szereploIndex].y - jatekoskorongR, jatekoskorongR * 2, jatekoskorongR * 2);
    }
    ctx.filter = "none";
}

function dobas() {
    send({
        method: "dobas"
    });
}

function getColorFromName(name) {
    switch (name) {
        case "feherlofia":
            return "yellow";
            break;
        case "azOkosLany":
            return "purple";
            break;

        case "csillagszemuJuhasz":
            return "green";
            break;
        case "fabolFaragottPeter":
            return "brown";
            break;

        case "legkisebbKiralylany":
            return "red";
            break;
        case "tunderszepIlona":
            return "kek";
            break;

        default:
            break;
    }
}

function getImageFromName(name) {
    return document.getElementById(name + "K");
}

function doboKockaRajzolas(sz, x, y, szin = "white") {
    ctx.fillStyle = szin;
    ctx.fillRect(x - 20, y - 20, 40, 40);
    ctx.fillStyle = "black";
    ctx.beginPath();
    switch (sz) {
        case 0:
            break;
        case 1:
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            break;
        case 2:
            ctx.arc(x - 14, y - 14, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 14, y + 14, 4, 0, Math.PI * 2);
            break;
        case 3:
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x - 14, y - 14, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 14, y + 14, 4, 0, Math.PI * 2);
            break;
        case 4:
            ctx.arc(x - 14, y - 14, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 14, y + 14, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x - 14, y + 14, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 14, y - 14, 4, 0, Math.PI * 2);
            break;
        case 5:
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x - 14, y - 14, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 14, y + 14, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x - 14, y + 14, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 14, y - 14, 4, 0, Math.PI * 2);
            break;
        case 6:
            ctx.arc(x - 14, y - 14, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 14, y + 14, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x - 14, y + 14, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 14, y - 14, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x - 14, y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 14, y, 4, 0, Math.PI * 2);
            break;
        default:
            console.log("ALMA");
            break;
    }

    ctx.fill();
}

function ts(d) {
    var s = {};
    for (let i = 0; i < coords.length; i++) {
        s["n" + (i + d)] = { x: coords[i][0], y: coords[i][1] };
    }
    return JSON.stringify(s);
}

function kirajzol() {
    ctx.fillStyle = "green";
    for (let i = 0; i < coords.length; i++) {
        ctx.beginPath();
        ctx.arc(coords[i][0], coords[i][1], 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
}

function draw() {
    fetch('resources/path/path.json').then(r => r.text()).then(t => {
        console.log(t);
        var j = JSON.parse(t);
        var a = Object.keys(j).length;
        ctx.fillStyle = "green";
        for (i = 0; i < a; i++) {
            var h = j["n" + i];
            ctx.beginPath();
            ctx.arc(h.x, h.y, 15, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// szomszédok betanításához szükséges kódrészletek

/*function kovi() {
    if (pathIndex != -1) {
        var tomb = [];
        for (let i = 0; i < coords.length; i++) {
            tomb.push(getKeyByValue(path, coords[i]));
        }
        path["n" + pathIndex].mellette = tomb;
        coords = [];
    }
    pathIndex++;
    if (Object.keys(path).length > pathIndex) {
        Szereplo.x = path["n" + pathIndex].x;
        Szereplo.y = path["n" + pathIndex].y;
        update();
    } else {
        console.log("Kész!");
    }
}*/

function cuccRajzolas() {
    for (let i = 0; i < Object.keys(path).length; i++) {
        if (path["n" + i].t) {
            if (path["n" + i].t == "piros") {
                ctx.fillStyle = "red";
            } else if (path["n" + i].t == "kek") ctx.fillStyle = "blue";
            else if (path["n" + i].t == "pogacsa") ctx.fillStyle = "#663300";
            else if (path["n" + i].t == "jotanacs") ctx.fillStyle = "#99ccff";
            else if (path["n" + i].t == "balszerencse") ctx.fillStyle = "#b3b3b3";
            else if (path["n" + i].t == "arany") ctx.fillStyle = "#ff6600";
            else if (path["n" + i].t == "allat") ctx.fillStyle = "green";
            else if (path["n" + i].t == "targy") ctx.fillStyle = "black";
            else if (path["n" + i].t == "varazstargy") ctx.fillStyle = "purple";
            else if (path["n" + i].t == "megallo") ctx.fillStyle = "#d9b38c";
            else if (path["n" + i].t == "szerencse") ctx.fillStyle = "#66ffff";
            else if (path["n" + i].t == "varazslo") ctx.fillStyle = "#660066";
            else if (path["n" + i].t == "var") ctx.fillStyle = "#333300";
            else if (path["n" + i].t == "palota") ctx.fillStyle = "#ff66ff";
            else if (path["n" + i].t == "start") ctx.fillStyle = "#344567";
            ctx.beginPath();
            ctx.arc(path["n" + i].x, path["n" + i].y, 15, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

/*function typeTanitas(id, type) {
    path[id].t = type;
    //path[id].params = {};
    //path[id].params.type = prompt("Típus");
    //path[id].params.ertek = prompt("Érték");
}*/

function getKeyByValue(object, value) {
    return Object.keys(object).find(key =>
        value[0] == object[key].x && value[1] == object[key].y
    );
}

function getMezoID(x, y) {
    return Object.keys(path).find(key =>
        x == path[key].x && y == path[key].y
    );
}

function kUpdate() {
    kTorles();
    kHatterRajzolas();
    pogacsaRajzolas();
    aranyRajzolas();
    jotanacsRajzolas();
    hatizsakRajzolas();
    lepesModositoRajzolas();
    if (karakterlapok[karakterIndex].id == "legkisebbKiralylany") {
        soRajzolas();
    }
}

function kTorles() {
    karakterlapCtx.fillStyle = "white";
    karakterlapCtx.fillRect(0, 0, 700, 500);
}

function kHatterRajzolas() {
    karakterlapCtx.drawImage(karakterlapok[karakterIndex], 0, 0);
}

/*function helperRajzolas() {
    karakterlapCtx.fillStyle = "yellow";
    karakterlapCtx.beginPath();
    karakterlapCtx.arc(Helper.x, Helper.y, 25, 0, Math.PI * 2);
    karakterlapCtx.fill();
}

function karakterlapTanitas(x, y, type) {
    karakterlapPath[type]["n" + pathIndex] = {};
    karakterlapPath[type]["n" + pathIndex].x = x;
    karakterlapPath[type]["n" + pathIndex].y = y;
    pathIndex++;
}*/

function pogacsaRajzolas() {
    //karakterlapCtx.fillStyle = "brown";
    karakterlapCtx.filter = "brightness(120%)";
    for (let i = 0; i < jatekosok[szereploIndex].pogacsak.length; i++) {
        /*karakterlapCtx.beginPath();
        karakterlapCtx.arc(karakterlapPath.pogacsak["n" + i].x, karakterlapPath.pogacsak["n" + i].y, 25, 0, Math.PI * 2);
        karakterlapCtx.fill();*/
        karakterlapCtx.drawImage(document.getElementById('pogacsa'), karakterlapPath.pogacsak["n" + i].x - karakterlapR, karakterlapPath.pogacsak["n" + i].y - karakterlapR, 2 * karakterlapR, 2 * karakterlapR);
    }
    karakterlapCtx.filter = "none";
}

function aranyRajzolas() {
    //karakterlapCtx.fillStyle = "yellow";
    karakterlapCtx.filter = "brightness(130%)";
    for (let i = 0; i < jatekosok[szereploIndex].aranyak; i++) {
        /*karakterlapCtx.beginPath();
        karakterlapCtx.arc(karakterlapPath.aranyak["n" + i].x, karakterlapPath.aranyak["n" + i].y, 25, 0, Math.PI * 2);
        karakterlapCtx.fill();*/
        karakterlapCtx.drawImage(document.getElementById('arany'), karakterlapPath.aranyak["n" + i].x - karakterlapR, karakterlapPath.aranyak["n" + i].y - karakterlapR, 2 * karakterlapR, 2 * karakterlapR);
    }
    karakterlapCtx.filter = "none";
}

function jotanacsRajzolas() {
    //karakterlapCtx.fillStyle = "#33ccff";
    karakterlapCtx.filter = "brightness(110%)";
    for (let i = 0; i < jatekosok[szereploIndex].jotanacsok; i++) {
        /*karakterlapCtx.beginPath();
        karakterlapCtx.arc(karakterlapPath.jotanacsok["n" + i].x, karakterlapPath.jotanacsok["n" + i].y, 25, 0, Math.PI * 2);
        karakterlapCtx.fill();*/
        karakterlapCtx.drawImage(document.getElementById('jotanacs'), karakterlapPath.jotanacsok["n" + i].x - karakterlapR, karakterlapPath.jotanacsok["n" + i].y - karakterlapR, 2 * karakterlapR, 2 * karakterlapR);
    }
    karakterlapCtx.filter = "none";
}

function soRajzolas() {
    karakterlapCtx.fillStyle = "#fdf0f6";
    for (let i = 0; i < sokSzama; i++) {
        karakterlapCtx.beginPath();
        karakterlapCtx.arc(karakterlapPath.sok["n" + i].x, karakterlapPath.sok["n" + i].y, 20, 0, Math.PI * 2);
        karakterlapCtx.fill();
    }
}

function hatizsakRajzolas() {
    let h = jatekosok[szereploIndex].hatizsak;
    for (let i = 0; i < h.length; i++) {
        karakterlapCtx.drawImage(getImageFromID(h[i]), karakterlapPath.hatizsak["n"+i].x, karakterlapPath.hatizsak["n"+i].y, 110, 110);
    }
}

function getImageFromID(id) {
    return document.getElementById(id);
}

function lepesModositoRajzolas() {
    switch (jatekosok[szereploIndex].lepesModosito) {
        case 1:
            karakterlapCtx.drawImage(getImageFromID("lepesmodosito-1"), karakterlapPath.lepesModosito.x, karakterlapPath.lepesModosito.y, karakterlapR * 2, karakterlapR * 2);
            break;

        case 2:
            karakterlapCtx.drawImage(getImageFromID("lepesmodosito-2"), karakterlapPath.lepesModosito.x, karakterlapPath.lepesModosito.y, karakterlapR *2, karakterlapR*2);
            break;

        default:
            break;
    }
}

document.getElementById("tabla").onload = function () {
    betoltottKepekSzama++;
    l();
};
document.body.onload = function () {
    a = 1;
    l();
};
{
    let kc = document.getElementsByClassName("karakterlap");
    for (let i = 0; i < kc.length; i++) {
        kc.item(i).onload = karakterlapok.push(kc.item(i));
    }
}