from fastapi import APIRouter, Query, Depends
from ..agent import ask_gemini
from .. import models
from ..security import get_current_user

router = APIRouter(prefix="/api/economic", tags=["economic"])

@router.get("/dashboard")
async def get_economic_dashboard(skill: str = Query("painter"), current_user: models.User = Depends(get_current_user)):
    """
    Live Agentic Economic Engine powered by Gemini.
    """
    prompt = f"""
    You are an AI Economic Engine. A {skill} worker is asking for an upskilling tutorial.
    Generate a highly realistic 1-sentence description for a 60-second micro-learning video that would teach a {skill} a highly paid modern technique.
    Do not use markdown bolding.
    """
    fallback_desc = f"Quick masterclass on applying modern {skill} techniques for high-end commercial contracts."
    desc = await ask_gemini(prompt, fallback_desc)

    squads = {
        "painter": "Model Town Painting Squad (4 Active Mates)",
        "electrician": "DHA Electrician Grid-7 (6 Active Mates)",
        "plumber": "Lahore Plumbing Union (5 Active Mates)",
        "carpenter": "Cantt Woodworkers Guild (3 Active Mates)",
        "mason": "Haji Concrete Squad-A (8 Active Mates)"
    }
    
    return {
        "tutorial": {
            "video_title": f"Modern {skill.capitalize()} Masterclass",
            "duration": "60 Seconds",
            "rating": 4.9,
            "desc": desc
        },
        "squad_name": squads.get(skill.lower(), squads["painter"]),
        "squad_benefit": "Pool equipment costs and secure higher commercial contracts as a unified crew."
    }
