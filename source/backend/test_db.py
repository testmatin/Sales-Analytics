from sqlalchemy import create_engine, text


DATABASE_URL = "postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/univercity"


engine = create_engine(
    DATABASE_URL,
    echo=True
)


try:
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT current_database();")
        )

        db_name = result.fetchone()

        print("✅ Connected Successfully")
        print("Database:", db_name[0])


except Exception as e:
    print("❌ Connection Failed")
    print(e)