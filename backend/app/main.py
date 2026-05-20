from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from . import models
from .routers import auth, jobs, trust, economic, voice, escrow, agent_router

# Initialize SQLite database tables
Base.metadata.create_all(bind=engine)

# Try to alter the jobs table to add the link column if it does not exist (for existing PostgreSQL setups)
try:
    from sqlalchemy import text
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS link VARCHAR;"))
except Exception as e:
    print(f"[Database Startup] Could not add link column: {e}")

app = FastAPI(
    title="Daily Wage Workers API",
    description="Production-Ready Agentic Backend with SQLite Database and Modular Routers",
    version="2.0.0"
)

# CORS configuration for Native app connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register functional modules
app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(trust.router)
app.include_router(economic.router)
app.include_router(voice.router)
app.include_router(escrow.router)
app.include_router(agent_router.router)

@app.get("/")
def read_root():
    return {"status": "ONLINE", "project": "Production SQLite Backend Active"}

