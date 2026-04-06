from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import users, complaints, agent, analytics

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CampusAI Agent API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(users.router)
app.include_router(complaints.router)
app.include_router(agent.router)
app.include_router(analytics.router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "CampusAI Modular API is running",
        "docs": "/docs"
    }
