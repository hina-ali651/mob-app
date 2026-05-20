# Backwards-compatibility wrapper. 
# This simply imports the modularized FastAPI app from the /app/ directory.
# You can continue to run: uvicorn main:app --reload --host 0.0.0.0 --port 8000
from app.main import app
