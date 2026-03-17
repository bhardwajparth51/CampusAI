from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="CampusAI Agent API")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    content: str
    user_id: str | None = None

class AnalysisResponse(BaseModel):
    category: str
    priority: str
    priority_score: int
    summary: str
    suggested_action: str

@app.get("/")
async def root():
    return {"status": "online", "message": "CampusAI Agent API is running"}

@app.post("/v1/agent/analyze", response_model=AnalysisResponse)
async def analyze_complaint(request: AnalysisRequest):
    """
    Analyzes a student complaint using an AI Agent.
    Space left here for complex Agent reasoning and Groq integration.
    """
    try:
        # TODO: Implement AI Agent logic with Groq
        # This is a placeholder response
        return AnalysisResponse(
            category="general",
            priority="medium",
            priority_score=50,
            summary="Placeholder summary for: " + request.content[:50] + "...",
            suggested_action="Awaiting agent implementation"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
