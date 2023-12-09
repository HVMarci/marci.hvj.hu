function kesz() {
    var egyFelso = Number($("#1").val());
    var egyAlso = Number($("#3").val());
    var kettoFelso = Number($("#2").val());
    var kettoAlso = Number($("#4").val());
    var ujEgyFelso = egyFelso * kettoAlso;
    var ujEgyAlso = egyAlso * kettoAlso;
    var ujKettoFelso = kettoFelso * egyAlso;
    var ujKettoAlso = kettoAlso * egyAlso;
    $("#1").val(ujEgyFelso);
    $("#2").val(ujKettoFelso);
    $("#3").val(ujEgyAlso);
    $("#4").val(ujKettoAlso);
}