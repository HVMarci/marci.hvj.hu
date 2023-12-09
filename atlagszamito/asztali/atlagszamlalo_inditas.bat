@echo off
chcp 65001>nul
set /p atlag="Milyen átlagot kell elérned?"
java -Dfile.encoding=utf-8 -jar atlagszamlalo.jar %atlag%
echo Nyomj meg egy gombot a kilépéshez!
pause>nul