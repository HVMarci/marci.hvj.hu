function osztas(szam) {
    if (szam == 1) {
        return [];
    }

    szam = Math.abs(szam);
    let tomb = [szam];

    if (isNaN(szam)) {
        console.debug("Ez nem egy szám!");
        return false;
    } else if (szam != Math.round(szam)) {
        console.debug("Ez nem egész szám!");
        return false;
    } else {
        for (let i = Math.round(szam / 2); i > 1; i--) {
            let oszto = szam / i;
            if (oszto == Math.round(oszto)) {
                tomb.push(oszto);
            }
        }
    }

    return tomb;
}