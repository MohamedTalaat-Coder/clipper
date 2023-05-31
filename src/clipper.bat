@echo off

cd C:\Users\denti\Vscodeprojects\DEV\clipper

venv/scripts/activate.ps1

cd src

python manage.py runserver 7500

pause