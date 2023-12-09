function dist(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    let dist = Math.sqrt(dx**2 + dy**2);
    return dist;
}