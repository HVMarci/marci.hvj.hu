function isNegativ(a) {
    if (a != Math.abs(a)) {
        return true;
    } else {
        return false;
    }
}

function kerekites1Tizedesjegyre(x) {
    let tized = "0."+(x+"").split(".")[1];
    let jotized = Math.round(tized * 10) / 10;
    let kerekitett = Math.floor(x) + jotized;
    return kerekitett;
}