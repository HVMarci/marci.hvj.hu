// websocket initialization
let ws_host = '192.168.2.20';
let ws_port = '3000';
const rws = new WebSocket('ws://' + ws_host + ':' + ws_port + '/ws');
rws.timeout = 1000;

rws.addEventListener('open', () => {
    console.log('[Client] Connection to WebSocket server was opened.');
    //var name = prompt("Írd be a neved!");
    var name = "HVMarci";
    rws.send(JSON.stringify({
        method: "name",
        params: {
            type: "first",
            newname: name
        }
    }));
});

rws.addEventListener('message', (e) => {
    try {
        let m = JSON.parse(e.data);
        handleMessage(m);
    } catch (err) {
        console.log('[Client] Message is not parseable to JSON.');
        console.error(err);
    }
});

rws.addEventListener('close', () => {
    console.log('[Client] Connection closed.');
});

rws.onerror = (err) => {
    if (err.code == 'EHOSTDOWN') {
        console.log('[Client] Error: server down.');
    }
};

function send(m) {
    if (rws.readyState == rws.OPEN) {
        rws.send(JSON.stringify(m));
    }
}

// handlers

let handlers = {
    "message": function (m) {
        console.log('[Client] Message received: ' + m.params.message);
        var chat = document.getElementById('chat');
        var c = chat.innerHTML;
        c += "<br>";
        if (m.params.type == "bold") { c += "<b>" }
        c += m.params.message;
        if (m.params.type == "bold") { c += "</b>" }
        chat.innerHTML = c;
        console.log(m.params.type);
    },
    "broadcast": function (m) {
        console.log('[Server] ' + m.params.message);
        var chat = document.getElementById('chat');
        var c = chat.innerHTML;
        c += "<br><i><big>" + m.params.message + "</big></i>";
        chat.innerHTML = c;
    },
    /*"draw": function (m) {
        ctx.beginPath();
        ctx.strokeStyle = m.params.color;
        console.log(m.params.color);
        ctx.moveTo(parseInt(m.params.x1), parseInt(m.params.y1))
        ctx.lineTo(parseInt(m.params.x2), parseInt(m.params.y2));
        ctx.stroke();
    },
    "player": function (m) {
        enemies[m.params.index] = m.params.player;
    },*/
    "disconnect": function (m) {
        //enemies.splice(m.params.id, 1);
        var chat = document.getElementById("chat");
        var c = chat.innerHTML;
        c += "<br><i>" + m.params.name + " lecsatlakozott a szerverről.</i>";
        chat.innerHTML = c;
    },
    "connect": function (m) {
        var chat = document.getElementById("chat");
        var c = chat.innerHTML;
        c += "<br><i>" + m.params.name + " felcsatlakozott a szerverre.</i>";
        chat.innerHTML = c;
    },
    "dobas": function (m) {
        update();
        doboKockaRajzolas(m.params.szam, 20, 20);
    },
    "rossz": function (m) {
        var chat = document.getElementById("chat");
        var c = chat.innerHTML;
        c += "<br><span class=\"red\">";
        c += "[Szerver] "
        c += m.params.message;
        c += "</span>";
        chat.innerHTML = c;
    },
    "koron": function (m) {
        /*var chat = document.getElementById("chat");
        var c = chat.innerHTML;
        c += "<br>";
        c += m.params.name;
        c += " következik!"
        chat.innerHTML = c;*/
    },
    "lepes": function (m) {
        if (megyAJatek) {
            jatekosok[m.params.index].x = m.params.x;
            jatekosok[m.params.index].y = m.params.y;
        }
        update();
    },
    "mezok": function (m) {
        console.log("mezők:");
        console.log(m);
        console.log("vége");
        for (let i = 0; i < m.params.mezok.length; i++) {
            console.log(m.params.mezok[i]);
            ctx.fillStyle = "green";
            ctx.beginPath();
            ctx.arc(m.params.mezok[i].x, m.params.mezok[i].y, 10, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    "karakter": function (m) {
        console.log(m.params.karakter);
        var index = -1;
        for (let i = 0; i < karakterlapok.length; i++) {
            if (m.params.karakter == karakterlapok[i].id) {
                index = i;
                break;
            }
        }

        if (index == -1) {
            console.error("Valami nem jól működik! " + index + ", " + m.params.karakter);
            console.error(m);
            return;
        }

        karakterIndex = index;
    },
    "start": function (m) {
        jatekosok = [];

        for (let i = 0; i < m.params.jatekosok.length; i++) {
            jatekosok[m.params.jatekosok[i].index] = m.params.jatekosok[i];
        }

        szereploIndex = m.params.index;
        megyAJatek = true;
        update();
        kUpdate();
        console.log(m);
    },
    "jotanacs": function (m) {
        jatekosok[m.params.index].jotanacsok = m.params.jotanacsok;
        kUpdate();
    },
    "pogacsa": function (m) {
        jatekosok[m.params.index].pogacsak = m.params.pogacsak;
        console.log(m);
        kUpdate();
    },
    "arany": function (m) {
        jatekosok[m.params.index].aranyak = m.params.aranyak;
        kUpdate();
    },
    "hatizsak": function (m) {
        jatekosok[m.params.index].hatizsak = m.params.hatizsak;
        kUpdate();
    },
    "lepesModosito": function (m) {
        jatekosok[m.params.index].lepesModosito = m.params.lepesModosito;
        kUpdate();
    }
};

function handleMessage(m) {

    if (m.method == undefined) {
        return;
    }

    let method = m.method;

    if (method) {

        if (handlers[method]) {
            let handler = handlers[method];
            handler(m);
        } else {
            console.log('[Client] No handler defined for method ' + method + '.');
        }

    }

}

/*var ctx, gameCtx;
var Player = {
    x: 0,
    y: 0,
    sebesseg: 2,
    size: 20,
    color: "red"
};
var coords = [[-10, -10], [10, -10], [10, 10], [-10, 10]];
var imgPath = '2019-07-27_16.08.30.png';
var jobb = bal = fel = le = false;
const w = 400;
const h = 400;
var origo = {
    x: w / 2,
    y: h / 2
};
var hatter = {};
var enemies = [];*/


//var x, y, isDrawing = false;
// init a canvashoz
/*function init() {
    const canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.addEventListener('mousedown', e => {
        x = e.offsetX;
        y = e.offsetY;
        isDrawing = true;
    });

    canvas.addEventListener('mousemove', e => {
        if (isDrawing === true) {
            vonalKuldes(x, y, e.offsetX, e.offsetY);
            x = e.offsetX;
            y = e.offsetY;
        }
    });

    window.addEventListener('mouseup', e => {
        if (isDrawing === true) {
            vonalKuldes(x, y, e.offsetX, e.offsetY);
            x = 0;
            y = 0;
            isDrawing = false;
        }
    });

    // játék

    const gameCanvas = document.getElementById("gameCanvas");
    gameCtx = gameCanvas.getContext("2d");
    hatter = {
        w: img.width,
        h: img.height,
        x: img.width / 2,
        y: img.height / 2
    };

    Player.color = randomColor();

    setInterval(() => { gameUpdate() }, 20);

    window.addEventListener('keydown', e => {
        switch (e.code) {
            case "ArrowDown":
            case "KeyS":
                le = true;
                break;
            case "ArrowUp":
            case "KeyW":
                fel = true;
                break;
            case "ArrowRight":
            case "KeyD":
                jobb = true;
                break;
            case "ArrowLeft":
            case "KeyA":
                bal = true;
                break;
            default:
                break;
        }
    });

    window.addEventListener('keyup', e => {
        switch (e.code) {
            case "ArrowDown":
            case "KeyS":
                le = false;
                break;
            case "ArrowUp":
            case "KeyW":
                fel = false;
                break;
            case "ArrowRight":
            case "KeyD":
                jobb = false;
                break;
            case "ArrowLeft":
            case "KeyA":
                bal = false;
                break;
            default:
                break;
        }
    });

}*/

/*function gameUpdate() {
    torles();
    frissites();
    drawHatter();
    drawEnemies();
    drawPlayer();
}

function drawPlayer() {
    gameCtx.beginPath();
    gameCtx.fillStyle = Player.color;
    gameCtx.moveTo(coords[0][0] + origo.x, coords[0][1] + origo.y);
    gameCtx.lineTo(coords[1][0] + origo.x, coords[1][1] + origo.y);
    gameCtx.lineTo(coords[2][0] + origo.x, coords[2][1] + origo.y);
    gameCtx.lineTo(coords[3][0] + origo.x, coords[3][1] + origo.y);
    gameCtx.lineTo(coords[0][0] + origo.x, coords[0][1] + origo.y);
    gameCtx.fill();
}

function drawEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i]) {
            if (enemies[i].x < Player.x+(w/2)+(enemies[i].size/2) && enemies[i].x > Player.x-(w/2)-(enemies[i].size/2)) {
                if (enemies[i].y < Player.y+(h/2)+(enemies[i].size/2) && enemies[i].y > Player.y-(h/2)-(enemies[i].size/2)) {
                    var e = enemies[i];
                    console.log(e.color);
                    gameCtx.beginPath();
                    gameCtx.fillStyle = e.color;
                    gameCtx.moveTo(((e.x-Player.x)+coords[0][0])+origo.x, ((e.y-Player.y)+coords[0][1])+origo.y);
                    gameCtx.lineTo(((e.x-Player.x)+coords[1][0])+origo.x, ((e.y-Player.y)+coords[1][1])+origo.y);
                    gameCtx.lineTo(((e.x-Player.x)+coords[2][0])+origo.x, ((e.y-Player.y)+coords[2][1])+origo.y);
                    gameCtx.lineTo(((e.x-Player.x)+coords[3][0])+origo.x, ((e.y-Player.y)+coords[3][1])+origo.y);
                    gameCtx.lineTo(((e.x-Player.x)+coords[0][0])+origo.x, ((e.y-Player.y)+coords[0][1])+origo.y);
                    gameCtx.fill();
                }
            }
        }
    }
}*/



function uzikuldes() {
    var txtarea = document.getElementById('txt');
    var m = txtarea.value;
    txtarea.value = '';
    if (rws.readyState == rws.OPEN) {
        rws.send(JSON.stringify({
            method: 'message',
            params: {
                message: m
            }
        }));
    }
}

/*function vonalKuldes(x1, y1, x2, y2) {
    var c = randomColor();
    if (rws.readyState == rws.OPEN) {
        rws.send(JSON.stringify({
            method: 'draw',
            params: {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                color: c
            }
        }));
    }
}

function torles() {
    gameCtx.fillStyle = "white";
    gameCtx.fillRect(0, 0, w, h);
}

function frissites() {
    if (le) Player.y += Player.sebesseg;
    if (fel) Player.y -= Player.sebesseg;
    if (jobb) Player.x += Player.sebesseg;
    if (bal) Player.x -= Player.sebesseg;
    if (Player.x>hatter.x-origo.x) Player.x = hatter.x-origo.x;
    if (Player.x<origo.x-hatter.x) Player.x = origo.x-hatter.x;
    if (Player.y>hatter.y-origo.y) Player.y = hatter.y-origo.y;
    if (Player.y<origo.y-hatter.y) Player.y = origo.y-hatter.y;
    playerKuldes();
}

function drawHatter() {
    gameCtx.drawImage(img, Player.x + hatter.x - origo.x, Player.y + hatter.y - origo.y, 400, 400, 0, 0, 400, 400);
}

function randomColor() {
    var r = Math.floor(Math.random() * 255), g = Math.floor(Math.random() * 255), b = Math.floor(Math.random() * 255);
    var c = 'rgb(' + r + ',' + g + ',' + b + ')';
    return c;
}

function playerKuldes() {
    if (rws.readyState == rws.OPEN) {
        rws.send(JSON.stringify({
            method: "player",
            params: {
                player: Player
            }
        }));
    }
}

var img = document.getElementById("kep");
img.onload = init();*/