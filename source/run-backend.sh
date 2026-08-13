#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/backend"
[ -d .venv ] || python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
[ -f .env ] || cp .env.example .env
alembic upgrade head
python scripts/migrate_json_to_postgres.py
uvicorn app.main:app --reload --port 8000
