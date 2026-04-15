import os
from groq import Groq
import json
from pydantic import BaseModel

class AgentAnalysis(BaseModel):
    category: str
    priority: str
    priority_score: int
    summary: str
    suggested_action: str

SYSTEM_PROMPT = """
You are the CampusAI Agent, an intelligent campus management assistant. 
Your task is to analyze student complaints and provide structured output.

Analyze the complaint for:
1. Category (e.g., maintenance, academic, housing, security, administrative).
2. Priority (low, medium, high, critical).
3. Priority Score (0-100).
4. A concise summary of the issue.
5. A suggested action for the administration.

You must respond ONLY with a valid JSON object matching this structure:
{
  "category": "string",
  "priority": "string",
  "priority_score": integer,
  "summary": "string",
  "suggested_action": "string"
}
"""

def analyze_complaint_with_llm(content: str) -> AgentAnalysis:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        # Fallback for demo if no API key
        return AgentAnalysis(
            category="general",
            priority="medium",
            priority_score=50,
            summary="[DEMO] Analysis pending API key configuration.",
            suggested_action="Configure GROQ_API_KEY in .env"
        )

    client = Groq(api_key=api_key)
    
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": content}
        ],
        response_format={"type": "json_object"}
    )
    
    result = json.loads(completion.choices[0].message.content)
    return AgentAnalysis(**result)
