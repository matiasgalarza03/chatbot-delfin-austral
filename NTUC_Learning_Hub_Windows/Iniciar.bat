@echo off
title NTUC Learning Hub
echo Iniciando el servidor local...
start http://localhost:5000
serve -s dist -l 5000
pause
