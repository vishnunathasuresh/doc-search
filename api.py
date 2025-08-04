import os
from pathlib import Path
import sqlite3 as sql



DB_NAME = "final.db"
os.makedirs(Path(os.getenv("LOCALAPPDATA")) / "DocSearch", exist_ok=True)
DB_PATH = Path(os.getenv("LOCALAPPDATA")) / "DocSearch" / DB_NAME


class API:
    def execute(self, query, args=None):

        try:
            conn = sql.connect(DB_PATH)
            cursor = conn.cursor()

            if args:
                cursor.execute(query, args)
            else:
                cursor.execute(query)

            if query.strip().lower().startswith("select"):
                columns = [desc[0] for desc in cursor.description]
                rows = cursor.fetchall()
                data = [dict(zip(columns, row)) for row in rows]
                print(f"Query result: {len(data)} rows")
                return {"status": "success", "rows": data, "message": "Query executed successfully"}
            else:
                conn.commit()
                print("Query executed successfully")
                return {"status": "success", "rows": [], "message": "Query executed successfully"}
        
        except Exception as e:
            print(f"Database error: {str(e)}")
            return {"status": "error", "message": str(e), "rows": []}
        finally:
            conn.close()
