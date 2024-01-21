const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var width;
var height;

const scenery = new Image();
scenery.src = 'images/scenery.webp';

// TODO: make zoom work with different screen sizes
var cursor = {
    x: 0,
    y: 0,
    zoom: 1
};

var mouse = {
    x: 0,
    y: 0,
    down: false
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
    }
    return IMAGES[id][level];
}

function drawRange(x, y, r1, r2) {
    let x2 = ORIGO[0] + x * MOVE[0] - y * MOVE[0];
    let y2 = ORIGO[1] - x * MOVE[1] - y * MOVE[1];

    if (r1 > 0) {
        ctx.beginPath();
        ctx.ellipse(x2, y2, r1 * MOVE[0], r1 * MOVE[1], 0, 0, 2 * Math.PI);
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.ellipse(x2, y2, r2 * MOVE[0], r2 * MOVE[1], 0, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawTile(x, y) {
    loadImage(0, 1);
    
    let size = SIZES[0];

    let w = size[0] * MOVE[0] * 2;
    let h = w / IMAGES[0][1].width * IMAGES[0][1].height;
    let x2 = ORIGO[0] + x * MOVE[0] - y * MOVE[0] - w / 2;
    let y2 = ORIGO[1] - x * MOVE[1] - y * MOVE[1] - h;
    x = x2;
    y = y2;

    ctx.drawImage(IMAGES[0][1], x, y, w, h);
}

function drawBuilding(x, y, id, level) {
    if (id == 0) {
        drawTile(x, y);
        return;
    }

    loadImage(id, level);
    
    let size = SIZES[id];
    
    if (HAS_TILES[id]) {
        for (let i = x; i < x + size[0]; i++) {
            for (let j = y; j < y + size[1]; j++) {
                drawTile(i, j);
            }
        }
    }
    
    let w = size[0] * MOVE[0] * 2 - 20;
    let h = w / IMAGES[id][level].width * IMAGES[id][level].height - 20;
    let x2 = ORIGO[0] + x * MOVE[0] - y * MOVE[0] - w / 2;
    let y2 = ORIGO[1] - x * MOVE[1] - y * MOVE[1] - h - 10;
    
    ctx.drawImage(IMAGES[id][level], x2, y2, w, h);

    if (RANGES[id] !== undefined) {
        drawRange(x + size[1] / 2, y + size[1] / 2, RANGES[id][0][0], RANGES[id][0][1]);
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

    cursor.x = scenery.width / 2 - width / 2;
    cursor.y = scenery.height / 2 - height / 2;

    update();
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    
    ctx.save();
    
    ctx.scale(cursor.zoom, cursor.zoom);
    ctx.translate(-cursor.x, -cursor.y);
    
    // draw background image (images/scenery.webp)
    //ctx.drawImage(scenery, cursor.x, cursor.y, scenery.width * cursor.zoom, scenery.height * cursor.zoom, 0, 0, width, height);
    ctx.drawImage(scenery, 0, 0, scenery.width, scenery.height);

    // draw buildings
    for (let i = 0; i < MAP_SIZE[0]; i++) {
        for (let j = 0; j < MAP_SIZE[1]; j++) {
            if (map[i][j][1] !== 0) drawBuilding(i, j, map[i][j][0], map[i][j][1]);
        }
    }
    
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
            console.log(map[x][y]);
        }
    }
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
