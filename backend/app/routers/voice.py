from fastapi import APIRouter, Depends
from .. import schemas, models
from ..agent import ask_gemini
from ..security import get_current_user

router = APIRouter(prefix="/api/agent", tags=["voice_agent"])

@router.post("/voice")
async def process_voice_command(request: schemas.VoiceRequest, current_user: models.User = Depends(get_current_user)):
    """
    Live Agentic Voice Engine powered by Gemini.
    """
    prompt = f"""
    You are 'AI Manager', a highly intelligent career and business manager for a {request.skill} worker in {request.location}.
    The worker just asked you this via voice microphone: "{request.transcript}".
    Generate a short, extremely helpful 2-sentence conversational response. 
    Incorporate real-time context like "Weather is clear" or "Demand is high". 
    Do not use markdown bolding.
    """
    fallback_msg = f"AI Manager: Weather is clear in {request.location}. Today demand for {request.skill}s is up by 18%."
    msg = await ask_gemini(prompt, fallback_msg)
    
    return {"response": msg}

@router.post("/voice_web")
async def process_voice_command_web(request: schemas.VoiceRequest):
    """
    Unauthenticated endpoint for the web browser voice mock.
    """
    prompt = f"""
    You are 'AI Manager', a highly intelligent career and business manager for a {request.skill} worker in {request.location}.
    The worker just asked you this via voice microphone: "{request.transcript}".
    Generate a short, extremely helpful 2-sentence conversational response. 
    Incorporate real-time context like "Weather is clear" or "Demand is high". 
    Do not use markdown bolding.
    """
    fallback_msg = f"AI Manager: Weather is clear in {request.location}. Today demand for {request.skill}s is up by 18%."
    msg = await ask_gemini(prompt, fallback_msg)
    
    return {"response": msg}
