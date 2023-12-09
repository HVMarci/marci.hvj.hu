const div = document.getElementById('container');
const tab = "&nbsp;&nbsp;&nbsp;&nbsp;";
var belekattintva = false;
var szoveg = "";

function szinezes() {
    div.innerText = szoveg;
    div.innerHTML = div.innerHTML.replaceAll("\t", tab);
    div.innerHTML = div.innerHTML.replaceAll(/&lt;([^\s]+)(\s)+?/ig, "<span class=\"kcs\">&lt;</span><span class=\"tag\">$1</span>").replaceAll(/&gt;/ig, "</span><span class=\"kcs\">&gt;</span>");
}

function lenyomas(e) {
    e.preventDefault();

    console.log(e.keyCode);
    if (belekattintva) {
        if (e.key.length == 1) {
            szoveg += e.key;
        } else if (e.keyCode == 13) {
            szoveg += '\n';
        } else if (e.keyCode == 8) {
            szoveg = szoveg.slice(0, szoveg.length - 1);
        } else if (e.keyCode == 9) {
            szoveg += '\t';
        } else {
            console.log(`Key: ${e.key}, KeyCode: ${e.keyCode}`);
        }
        szinezes();
    }
}

function tagCsere(szoveg) {
    return szoveg.replaceAll(/&lt;([^\s]+)/ig, "<span class=\"kcs\">&lt;</span><span class=\"tag\">$1</span>");
}