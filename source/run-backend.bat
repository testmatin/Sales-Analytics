@echo off
cd /d %~dp0backend
if not exist .venv python -m venv .venv
call .venv\Scripts\activate
pip install -r requirements.txt
if not exist .env copy .env.example .env
alembic upgrade head
python scripts\migrate_json_to_postgres.py
uvicorn app.main:app --reload --port 8000
