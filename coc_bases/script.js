const canvas = document.getElementById('canvas');
const canvasBackground = document.createElement('canvas');
const canvasGradient = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const ctx_bckg = canvasBackground.getContext('2d');
const ctx_gradient = canvasGradient.getContext('2d');
const gradientData = [];

var width, height;
var setupDone = false;

const scenery = new Image();
scenery.src = 'images/scenery.webp';
scenery.onload = () => {
    canvasBackground.width = scenery.width;
    canvasBackground.height = scenery.height;
};

// TODO: make zoom work with different screen sizes
var cursor = {
    x: 0,
    y: 0,
    zoom: 1
};

var mouse = {
    x: 0,
    y: 0,
    down: false,
    pan: false
};

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

const IMAGES = [];

function loadImage(id, level) {
    if (IMAGES[id] === undefined) {
        IMAGES[id] = [];
    }
    if (IMAGES[id][level] === undefined) {
        IMAGES[id][level] = new Image();
        IMAGES[id][level].src = 'images/' + id + '_' + level + '.png';
        IMAGES[id][level].onload = () => {
            if (setupDone) drawBackground();
        };
    }
    return IMAGES[id][level];
}
loadImage(0, 1); // load tile image

function drawRange(x, y, r1, r2) {
    let x2 = ORIGO[0] + x * MOVE[0] - y * MOVE[0];
    let y2 = ORIGO[1] - x * MOVE[1] - y * MOVE[1];

    if (r1 > 0) {
        ctx_bckg.beginPath();
        ctx_bckg.ellipse(x2, y2, r1 * MOVE[0], r1 * MOVE[1], 0, 0, 2 * Math.PI);
        ctx_bckg.stroke();
    }

    ctx_bckg.beginPath();
    ctx_bckg.ellipse(x2, y2, r2 * MOVE[0], r2 * MOVE[1], 0, 0, 2 * Math.PI);
    ctx_bckg.stroke();
}

function drawTile(x, y) {
    let size = SIZES[0];

    let w = size[0] * MOVE[0] * 2;
    let h = w / IMAGES[0][1].width * IMAGES[0][1].height;
    let x2 = ORIGO[0] + x * MOVE[0] - y * MOVE[0] - w / 2;
    let y2 = ORIGO[1] - x * MOVE[1] - y * MOVE[1] - h;
    x = x2;
    y = y2;

    ctx_bckg.drawImage(IMAGES[0][1], x, y, w, h);
}

function drawBuilding(x, y, id, level) {
    if (id == 0) {
        drawTile(x, y);
        return;
    }

    loadImage(id, level);
    
    let size = SIZES[id];
    
    /*if (HAS_TILES[id]) {
        for (let i = x; i < x + size[0]; i++) {
            for (let j = y; j < y + size[1]; j++) {
                drawTile(i, j);
            }
        }
    }*/
    
    let w = size[0] * MOVE[0] * 2 - 20;
    let h = w / IMAGES[id][level].width * IMAGES[id][level].height - 20;
    let x2 = ORIGO[0] + x * MOVE[0] - y * MOVE[0] - w / 2;
    let y2 = ORIGO[1] - x * MOVE[1] - y * MOVE[1] - h - 10;
    
    ctx_bckg.drawImage(IMAGES[id][level], x2, y2, w, h);

    if (RANGES[id] !== undefined) {
        return {x: x + size[1] / 2, y: y + size[1] / 2, r1: RANGES[id][0][0], r2: RANGES[id][0][1], val: DPS[id] ? DPS[id][0][level] : NaN};
    }
}

function drawGradient() {
    const grd = ctx.createLinearGradient(0,0,MAX_DPS,0);
    grd.addColorStop(0,"rgb(28,224,28)");
    grd.addColorStop(.16, "rgb(227,240,60)");
    grd.addColorStop(.47, "rgb(213,74,74)");
    grd.addColorStop(.67, "rgb(82,14,170)");
    grd.addColorStop(.84, "rgb(49,30,224)");
    grd.addColorStop(1, "rgb(0,212,255)");

    canvasGradient.width = MAX_DPS;
    canvasGradient.height = 1;
    ctx_gradient.fillStyle = grd;
    ctx_gradient.fillRect(0, 0, MAX_DPS, 1);

    let data = ctx_gradient.getImageData(0, 0, MAX_DPS, 1).data;
    for (let i = 0; i < MAX_DPS; i++) {
        gradientData[i] = [data[i*4], data[i*4+1], data[i*4+2]];
    }
}

var map = [];

var selector = {
    selected: 1,
    scroll: 0,
    levels: [],
};

// TODO: wait for load events
function load() {
    resizeCanvas();

    for (let i = 1; i <= BUILDING_COUNT; i++) {
        selector.levels[i] = 1;
    }
    
    for (let i = 0; i < MAP_SIZE[0]; i++) {
        map[i] = [];
        for (let j = 0; j < MAP_SIZE[1]; j++) {
            map[i][j] = [0, 0];
        }
    }

    //map[20][20] = [18, 10];
    //map[23][23] = [23, 13];

    cursor.x = scenery.width / 2 - width / 2;
    cursor.y = scenery.height / 2 - height / 2;

    drawGradient();
    drawBackground();
    update();

    setupDone = true;
}

// ChatGPT generated
function numberToRGB(number) {
    // Ensure number is within range [0, MAX_DPS)
    number = Math.floor(Math.max(0, Math.min(number, MAX_DPS - 1)));
    
    let [r, g, b] = gradientData[number];
    
    // Scale the RGB values to the range [0, 255] and return the color string
    return [r, g, b];
}

function colorToString(r, g, b) {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function drawBackground() {
    ctx_bckg.drawImage(scenery, 0, 0, scenery.width, scenery.height);

    // draw tiles
    let circles = [];
    for (let i = MAP_SIZE[0] - 1; i >= 0; i--) {
        for (let j = MAP_SIZE[1] - 1; j >= 0; j--) {
            if (map[i][j][1] !== 0) {
                let id = map[i][j][0];
                let size = SIZES[id];
    
                if (HAS_TILES[id]) {
                    for (let x = i; x < i + size[0]; x++) {
                        for (let y = j; y < j + size[1]; y++) {
                            drawTile(x, y);
                        }
                    }
                }
                //let range = drawBuilding(i, j, map[i][j][0], map[i][j][1]);
                //if (range) circles.push(range);
            }
        }
    }
    //const circleImgData = new ImageData(width, height);
    /*for (let circle of circles) {
        drawRange(...circle);
    }*/

    for (let i = MAP_SIZE[0] - 1; i >= 0; i--) {
        for (let j = MAP_SIZE[1] - 1; j >= 0; j--) {
            let id = map[i][j][0];
            let level = map[i][j][1];
            if (level !== 0 && RANGES[id] !== undefined) {
                let size = SIZES[id];
                circles.push({x: i + size[1] / 2, y: j + size[1] / 2, r1: RANGES[id][0][0], r2: RANGES[id][0][1], val: DPS[id] ? DPS[id][0][level] : NaN});
            }
        }
    }

    let ellipses = [];
    for (let ellipse of circles) {
        let xtr = ORIGO[0] + ellipse.x * MOVE[0] - ellipse.y * MOVE[0];
        let ytr = ORIGO[1] - ellipse.x * MOVE[1] - ellipse.y * MOVE[1];
        ellipse.x = xtr;
        ellipse.y = ytr;
        ellipse.rx = ellipse.r2 * MOVE[0];
        ellipse.ry = ellipse.r2 * MOVE[1];

        let d = Math.sqrt(Math.abs(ellipse.rx*ellipse.rx - ellipse.ry*ellipse.ry));
        ellipses.push({x1: ellipse.x + d, y1: ellipse.y, x2: ellipse.x - d, y2: ellipse.y, l: 2 * Math.max(ellipse.rx, ellipse.ry), d, ...ellipse});

        if (ellipse.r1) {
            ellipse.rx = ellipse.r1 * MOVE[0];
            ellipse.ry = ellipse.r1 * MOVE[1];
            d = Math.sqrt(Math.abs(ellipse.rx*ellipse.rx - ellipse.ry*ellipse.ry));
            ellipses.push({x1: ellipse.x + d, y1: ellipse.y, x2: ellipse.x - d, y2: ellipse.y, l: 2 * Math.max(ellipse.rx, ellipse.ry), d, val: -ellipse.val, ...ellipse});
            ellipses[ellipses.length-1].val = -ellipse.val;
        }
    }
    let points = [];
    for (let liney = 0; liney < scenery.height; liney++) {
        points.push([]);
        for (let e of ellipses) {
            //let e = ellipses[3];

            let ldist = liney - e.y;
            let a = 4*e.l*e.l - 16*e.d*e.d;
            let b = 8*e.d*e.l*e.l - 32*e.d*e.d*e.d;
            let c = 4*e.l*e.l*ldist*ldist - e.l*e.l*e.l*e.l - 16*e.d*e.d*e.d*e.d + 8*e.l*e.l*e.d*e.d;

            let x1 = (-b + Math.sqrt(b*b - 4*a*c)) / (2*a);
            let x2 = (-b - Math.sqrt(b*b - 4*a*c)) / (2*a);

            //if (x1) cross(x1+e.x1, liney);
            //if (x2) cross(x2+e.x1, liney);

            if (x1 && x1 != x2) {
                points[liney].push([x2+e.x1, e.val], [x1+e.x1, -e.val]);
            }
        }

        points[liney].sort((a, b) => a[0] - b[0]);
    }


    for (let liney = 0; liney < scenery.height; liney++) {
        let val = 0, prevPos = 0;
        for (let i = 0; i < points[liney].length; i++) {
            if (points[liney][i][0] > 0 && val) {
                ctx_bckg.strokeStyle = colorToString(...numberToRGB(val));
                ctx_bckg.beginPath();
                ctx_bckg.moveTo(prevPos, liney);
                ctx_bckg.lineTo(points[liney][i][0], liney);
                ctx_bckg.stroke();
            }
            val += points[liney][i][1];
            prevPos = Math.max(0, points[liney][i][0]);

            if (points[liney][i][0] >= scenery.width) break;
        }
    }

    for (let e of ellipses) {
        ctx_bckg.strokeStyle = 'black';
        ctx_bckg.beginPath();
        ctx_bckg.ellipse(e.x, e.y, e.rx, e.ry, 0, 0, Math.PI * 2);
        ctx_bckg.stroke();
    }

    // draw buildings
    for (let i = MAP_SIZE[0] - 1; i >= 0; i--) {
        for (let j = MAP_SIZE[1] - 1; j >= 0; j--) {
            if (map[i][j][1] !== 0) {
                drawBuilding(i, j, map[i][j][0], map[i][j][1]);
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    
    ctx.save();
    
    ctx.scale(cursor.zoom, cursor.zoom);
    ctx.translate(-cursor.x, -cursor.y);

    ctx.drawImage(canvasBackground, 0, 0);
    
    ctx.restore();

    // draw building selector
    // height: max(20%, 100px)

    let selectorHeight = Math.max(height * 0.2, 100);
    let selectorWidth = selectorHeight * 0.8;

    ctx.fillStyle = '#eeeeee';
    ctx.beginPath();
    for (let i = 1, x = selector.scroll; i <= BUILDING_COUNT; i++, x += selectorWidth + 10) {
        if (i == selector.selected) {
            ctx.roundRect(x + 10, height - selectorHeight - 10 - 20, selectorWidth, selectorHeight, 10);
        } else {
            ctx.roundRect(x + 10, height - selectorHeight - 10, selectorWidth, selectorHeight, 10);
        }
    }
    ctx.fill();
    
    // draw building's picture
    ctx.font = 'bold 20px Consolas';
    for (let i = 1, x = selector.scroll; i <= BUILDING_COUNT; i++, x += selectorWidth + 10) {
        let add = 0;
        if (i == selector.selected) {
            add = -20;
        }
        loadImage(i, selector.levels[i]);
        ctx.drawImage(IMAGES[i][selector.levels[i]], x + selectorWidth * .15, height - selectorHeight + IMAGES[i][selector.levels[i]].height * .025 + add, selectorWidth * .8, selectorWidth * .8 / IMAGES[i][selector.levels[i]].width * IMAGES[i][selector.levels[i]].height);
        // write 'Level: xx'
        ctx.fillStyle = '#000000';
        ctx.fillText('Level: ' + selector.levels[i], x + selectorWidth * .15, height - selectorHeight * .2 + add);
    }
}

function update() {
    draw();
    requestAnimationFrame(update);
}


window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);
window.addEventListener('load', load);

window.addEventListener('mousedown', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.down = true;
});

window.addEventListener('mousemove', function(e) {
    // pan
    if (mouse.down) {
        mouse.pan = true;

        cursor.x -= (e.clientX - mouse.x) / cursor.zoom;
        cursor.y -= (e.clientY - mouse.y) / cursor.zoom;
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        if (cursor.x < 0) {
            cursor.x = 0;
        } else if (cursor.x > (scenery.width * cursor.zoom - width) / cursor.zoom) {
            cursor.x = (scenery.width * cursor.zoom - width) / cursor.zoom;
        }
    
        if (cursor.y < 0) {
            cursor.y = 0;
        } else if (cursor.y > (scenery.height * cursor.zoom - height) / cursor.zoom) {
            cursor.y = (scenery.height * cursor.zoom - height) / cursor.zoom;
        }
    }
});

window.addEventListener('mouseup', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.down = false;
});

window.addEventListener('click', function(e) {
    if (!mouse.pan) {
        // place building
        let x2 = e.clientX / cursor.zoom + cursor.x;
        let y2 = e.clientY / cursor.zoom + cursor.y;
        
        let x = Math.floor(((ORIGO[1] - y2) / MOVE[1] - (ORIGO[0] - x2) / MOVE[0]) / 2);
        let y = Math.floor(((ORIGO[1] - y2) / MOVE[1] + (ORIGO[0] - x2) / MOVE[0]) / 2);
        
        if (x >= 0 && x < MAP_SIZE[0] && y >= 0 && y < MAP_SIZE[1]) {
            if (map[x][y][0] > 0) {
                for (let i = x + SIZES[map[x][y][0]][0] - 1; i >= x; i--) {
                    for (let j = y + SIZES[map[x][y][0]][1] - 1; j >= y; j--) {
                        map[i][j] = [0, 0];
                    }
                }
            } else if (map[x][y][0] == 0 && x + SIZES[selector.selected][0] < MAP_SIZE[0] && y + SIZES[selector.selected][1] < MAP_SIZE[1]) {
                for (let i = x; i < x + SIZES[selector.selected][0]; i++) {
                    for (let j = y; j < y + SIZES[selector.selected][1]; j++) {
                        map[i][j] = [-1, 0];
                    }
                }
                map[x][y] = [selector.selected, selector.levels[selector.selected]];
            }
        }

        drawBackground();
    }
    mouse.pan = false;
});

window.addEventListener('wheel', function(e) {
    // zooming
    if (cursor.zoom - e.deltaY / 1000 >= 1 && cursor.zoom - e.deltaY / 1000 <= 2.5) {
        // center zoom:
        //cursor.x += width / 2 / cursor.zoom - width / 2 / (cursor.zoom - e.deltaY / 1000);
        //cursor.y += height / 2 / cursor.zoom - height / 2 / (cursor.zoom - e.deltaY / 1000);

        // cursor zoom:
        cursor.x += e.clientX / cursor.zoom - e.clientX / (cursor.zoom - e.deltaY / 1000);
        cursor.y += e.clientY / cursor.zoom - e.clientY / (cursor.zoom - e.deltaY / 1000);

        
        cursor.zoom -= e.deltaY / 1000;
    }

    if (cursor.x < 0) {
        cursor.x = 0;
    } else if (cursor.x > (scenery.width * cursor.zoom - width) / cursor.zoom) {
        cursor.x = (scenery.width * cursor.zoom - width) / cursor.zoom;
    }

    if (cursor.y < 0) {
        cursor.y = 0;
    } else if (cursor.y > (scenery.height * cursor.zoom - height) / cursor.zoom) {
        cursor.y = (scenery.height * cursor.zoom - height) / cursor.zoom;
    }
});

window.addEventListener('keydown', function(e) {
    // handle building selector
    let selectorHeight = Math.max(height * 0.2, 100);
    let selectorWidth = selectorHeight * 0.8;
    if (e.key == 'ArrowLeft') {
        selector.selected--;
        if (selector.selected < 1) {
            selector.selected = 1;
        }

        if (selector.scroll + (selector.selected - 1) * (selectorWidth + 10) <= 0) {
            selector.scroll += selectorWidth + 10;
            if (selector.scroll > 0) {
                selector.scroll = 0;
            }
        }
    } else if (e.key == 'ArrowRight') {
        selector.selected++;
        if (selector.selected > BUILDING_COUNT) {
            selector.selected = BUILDING_COUNT;
        }

        if (selector.scroll + selector.selected * (selectorWidth + 10) > width) {
            selector.scroll -= selectorWidth + 10;
            if (-selector.scroll > BUILDING_COUNT * (selectorWidth + 10) + 10 - width) {
                selector.scroll = width - BUILDING_COUNT * (selectorWidth + 10) - 10;
            }
        }
    } else if (e.key == 'ArrowUp') {
        selector.levels[selector.selected]++;
        if (selector.levels[selector.selected] > MAX_LEVELS[selector.selected]) {
            selector.levels[selector.selected] = MAX_LEVELS[selector.selected];
        }
    } else if (e.key == 'ArrowDown') {
        selector.levels[selector.selected]--;
        if (selector.levels[selector.selected] < 1) {
            selector.levels[selector.selected] = 1;
        }
    }
});

function load_base() {
    let id = prompt('Enter the id of the base you want to load: (type "list" to see all options)');

    let list = JSON.parse(localStorage.getItem('bases'));

    if (list === null) {
        list = [];
    }

    if (id == 'list') {
        alert(list);
        return;
    }
    
    let base_json = localStorage.getItem('base_' + id);
    if (base_json === null) {
        alert('Base not found');
        return;
    }

    let base = JSON.parse(base_json);
    map = base;
}

function save_base() {
    let id = prompt('Enter the id of the base you want to save:');

    let list = JSON.parse(localStorage.getItem('bases'));

    if (list === null) {
        list = [];
    }

    if (!list.includes(id)) {
        list.push(id);
    } else {
        if (!confirm('Base already exists. Overwrite?')) {
            return;
        }
    }

    localStorage.setItem('bases', JSON.stringify(list));
    localStorage.setItem('base_' + id, JSON.stringify(map));
}
