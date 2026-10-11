@echo off
title MasterGreen - Expo Go
cd /d "%~dp0app-mastergreen"
echo MasterGreen - aplicativo atualizado
echo Abra o Expo Go no celular e leia o QR. Use a mesma rede Wi-Fi.
echo Nao precisa apertar A nem instalar o Android SDK.
echo Mantenha esta janela aberta enquanto testa.
call npm start
pause
