var ctx = document.getElementById("canvas").getContext("2d");
ctx.fillRect(5, 250, 30, 100);
ctx.fillRect(570, 0, 30, 600);

var y = 250;
function rajzolj() {
    ctx.clearRect(5, 0, 30, 600);
    ctx.fillRect(5, y, 30, 100);
}

window.addEventListener("keydown", (e) => {
    if (e.code == "ArrowUp") {
        y -= 10;
        rajzolj();
    } else if (e.code == "ArrowDown") {
        y += 10;
        rajzolj();
    }
});