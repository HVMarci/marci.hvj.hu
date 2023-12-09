function vankozoselem(a, b) {
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            if (a[i] == b[j]) {
                return true;
            }
        }
    }

    return false;
}

function kozoselemek(a, b) {
    let tomb = [];

    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            if (a[i] == b[j]) {
                tomb.push(a[i]);
            }
        }
    }

    return tomb;
}

function tombforditas(a) {
    let tomb = [];

    for (let i = a.length - 1; i >= 0; i--) {
        tomb.push(a[i]);
    }

    return tomb;
}