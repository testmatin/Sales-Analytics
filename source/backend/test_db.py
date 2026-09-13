from sqlalchemy import text
from app.database.session import engine


try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("DATABASE CONNECTED ✅")
        print(result.fetchone())

except Exception as e:
    print("DATABASE ERROR ❌")
    print(e)