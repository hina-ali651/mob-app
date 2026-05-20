"""
Agentic System Router
---------------------
Dedicated router for all Gemini-powered agentic endpoints.
Separates pure AI logic from auth/job CRUD concerns.
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from .. import models
from ..agent import ask_gemini
from ..security import get_current_user

router = APIRouter(prefix="/api/agent", tags=["agent"])


# ─── Request / Response Schemas ──────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    skill: str
    city: str

class ChatResponse(BaseModel):
    reply: str
    agent: str = "AI Manager"

class JobAdviceRequest(BaseModel):
    job_title: str
    job_category: str
    base_rate: int
    distance: str

class JobAdviceResponse(BaseModel):
    should_take: bool
    reasoning: str
    tip: str
    risk_level: str  # "low" | "medium" | "high"

class MarketPulseRequest(BaseModel):
    skill: str
    city: str

class MarketPulseResponse(BaseModel):
    demand_level: str        # "high" | "medium" | "low"
    demand_score: int        # 0-100
    avg_daily_rate: int
    insight: str
    upskill_tip: str


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/chat", response_model=ChatResponse)
async def agent_chat(
    request: ChatRequest,
    current_user: models.User = Depends(get_current_user)
):
    """
    General-purpose conversational AI Manager.
    The worker sends a free-text message and gets a context-aware reply.
    """
    worker_name = current_user.full_name or "the worker"
    print("\n" + "═"*60)
    print(f"[AGENT ROUTER] 🤖 /chat endpoint hit by worker '{worker_name}' ({current_user.email})")
    print(f"   - Message: '{request.message}'")
    print(f"   - Skill: '{request.skill}' | City: '{request.city}'")
    
    prompt = f"""
    You are 'AI Manager', an expert career and financial advisor for daily-wage workers in Pakistan.
    You are helping {worker_name}, a {request.skill} worker based in {request.city}.
    
    The worker asks: "{request.message}"
    
    Respond in 2 short, friendly, highly practical sentences.
    Reference their skill and city to make it feel personalised.
    Do not use markdown bolding or asterisks.
    """
    fallback = (
        f"Great question! Based on current demand in {request.city}, "
        f"{request.skill}s are seeing strong opportunities this week."
    )
    reply = await ask_gemini(prompt, fallback)
    print(f"[AGENT ROUTER] 🧠 Chat Response generated: '{reply}'")
    print("═"*60 + "\n")
    return ChatResponse(reply=reply)


@router.post("/job-advice", response_model=JobAdviceResponse)
async def get_job_advice(
    request: JobAdviceRequest,
    current_user: models.User = Depends(get_current_user)
):
    """
    AI evaluates a specific job offer and advises whether to take it,
    providing a concise reason and a pro tip.
    """
    print("\n" + "═"*60)
    print(f"[AGENT ROUTER] 🧠 /job-advice endpoint hit by user '{current_user.email}'")
    print(f"   - Job: '{request.job_title}' ({request.job_category})")
    print(f"   - Offered Rate: Rs. {request.base_rate} | Distance: {request.distance}")

    prompt = f"""
    You are an expert labor market advisor for Pakistani daily-wage workers.
    Evaluate this job offer for a {request.job_category} worker:
    - Job title: "{request.job_title}"
    - Offered rate: Rs. {request.base_rate} per day
    - Distance from worker: {request.distance}

    Assess whether this is a good opportunity. Reply in this exact JSON format with no extra text:
    {{
      "should_take": true,
      "risk_level": "low",
      "reasoning": "One sentence why.",
      "tip": "One short pro tip for doing this job well."
    }}
    """
    fallback_json = (
        '{{"should_take": true, "risk_level": "low", '
        '"reasoning": "The rate is competitive for {cat} work in the current market.", '
        '"tip": "Confirm tool requirements upfront to avoid delays."}}'
    ).format(cat=request.job_category)

    raw = await ask_gemini(prompt, fallback_json)
    print(f"[AGENT ROUTER] 🧠 Raw Gemini advice response: '{raw}'")

    # Safe JSON parse with fallback
    import json, re
    try:
        # Strip any markdown code fences the model might add
        clean = re.sub(r"```[a-z]*", "", raw).strip().strip("`")
        data = json.loads(clean)
        response = JobAdviceResponse(
            should_take=bool(data.get("should_take", True)),
            reasoning=str(data.get("reasoning", "This looks like a solid opportunity.")),
            tip=str(data.get("tip", "Always confirm payment terms before starting.")),
            risk_level=str(data.get("risk_level", "low")),
        )
        print(f"[AGENT ROUTER] ✅ Successfully parsed JSON advice. Risk Level: {response.risk_level}")
        print("═"*60 + "\n")
        return response
    except Exception as e:
        print(f"[AGENT ROUTER] ❌ JSON parsing failed ({str(e)}). Using fallback advice.")
        print("═"*60 + "\n")
        return JobAdviceResponse(
            should_take=True,
            reasoning=f"The rate of Rs. {request.base_rate} is competitive for {request.job_category} work.",
            tip="Always confirm payment terms before starting.",
            risk_level="low",
        )


@router.post("/market-pulse", response_model=MarketPulseResponse)
async def get_market_pulse(
    request: MarketPulseRequest,
    current_user: models.User = Depends(get_current_user)
):
    """
    Returns a live Gemini-powered market intelligence snapshot for a skill+city.
    """
    print("\n" + "═"*60)
    print(f"[AGENT ROUTER] 📈 /market-pulse endpoint hit by user '{current_user.email}'")
    print(f"   - Skill: '{request.skill}' | City: '{request.city}'")

    prompt = f"""
    You are a real-time labor market intelligence engine for Pakistan.
    Analyse current demand for {request.skill} workers in {request.city}.

    Reply in this exact JSON format with no extra text:
    {{
      "demand_level": "high",
      "demand_score": 82,
      "avg_daily_rate": 1400,
      "insight": "One sentence on why demand is this level right now.",
      "upskill_tip": "One actionable sentence on a skill upgrade that would increase their earnings."
    }}
    """
    fallback = (
        f'{{"demand_level": "high", "demand_score": 78, "avg_daily_rate": 1200, '
        f'"insight": "Demand for {request.skill}s in {request.city} is strong this season.", '
        f'"upskill_tip": "Learning modern power tools will increase your rate by 20-30%."}}'
    )
    raw = await ask_gemini(prompt, fallback)
    print(f"[AGENT ROUTER] 🧠 Raw Gemini market-pulse response: '{raw}'")

    import json, re
    try:
        clean = re.sub(r"```[a-z]*", "", raw).strip().strip("`")
        data = json.loads(clean)
        response = MarketPulseResponse(
            demand_level=str(data.get("demand_level", "medium")),
            demand_score=int(data.get("demand_score", 70)),
            avg_daily_rate=int(data.get("avg_daily_rate", 1200)),
            insight=str(data.get("insight", f"Demand for {request.skill}s is steady.")),
            upskill_tip=str(data.get("upskill_tip", "Modern techniques can increase your rate.")),
        )
        print(f"[AGENT ROUTER] ✅ Market Pulse parsed. Level: {response.demand_level}, Score: {response.demand_score}")
        print("═"*60 + "\n")
        return response
    except Exception as e:
        print(f"[AGENT ROUTER] ❌ JSON parsing failed ({str(e)}). Using fallback data.")
        print("═"*60 + "\n")
        return MarketPulseResponse(
            demand_level="medium",
            demand_score=70,
            avg_daily_rate=1200,
            insight=f"Demand for {request.skill}s in {request.city} remains stable.",
            upskill_tip="Modern techniques and tools can increase your daily rate significantly.",
        )


# ─── Agentic Orchestrator ──────────────────────────────────────────────────────

class OrchestrateRequest(BaseModel):
    message: str
    skill: str
    city: str

class OrchestrateResponse(BaseModel):
    reply: str
    agent: str
    intent: str   # "market", "job_advice", "safety", "chat"
    data: Optional[dict] = None

@router.post("/orchestrate", response_model=OrchestrateResponse)
async def orchestrate(
    request: OrchestrateRequest,
    current_user: models.User = Depends(get_current_user)
):
    """
    True Agentic Orchestrator — classifies user intent via Gemini,
    routes to the right specialist sub-agent, and returns a synthesised response.

    Intent routing:
      • "market"     → Market Pulse agent (demand, rate, tips)
      • "safety"     → Safety / scam advisory
      • "job_advice" → Job offer evaluation agent
      • "chat"       → General AI Manager conversation
    """
    import json, re

    worker_name = current_user.full_name or "the worker"
    print("\n" + "═"*60)
    print(f"[ORCHESTRATOR] 🤖 Intent routing for '{worker_name}' → '{request.message}'")

    # ── Step 1: Classify intent ──────────────────────────────────────────────
    classify_prompt = f"""
    Classify the following worker query into exactly ONE category.
    Worker is a {request.skill} in {request.city}.
    Query: "{request.message}"

    Categories:
    - market      (asking about pay rates, demand, market, work availability)
    - safety      (asking about scams, fraud, bad employers, trust, danger)
    - job_advice  (asking if a specific job is worth taking)
    - chat        (anything else — general advice, greetings, motivation)

    Reply with only the category word. No punctuation. No explanation.
    """
    intent_raw = await ask_gemini(classify_prompt, "chat")
    intent = intent_raw.strip().lower().split()[0] if intent_raw else "chat"
    if intent not in ("market", "safety", "job_advice", "chat"):
        intent = "chat"
    print(f"[ORCHESTRATOR] 🎯 Classified intent: '{intent}'")

    # ── Step 2: Route to specialist sub-agent ───────────────────────────────
    reply = ""
    extra_data = {}

    if intent == "market":
        market_prompt = f"""
        You are a real-time labor market intelligence engine for Pakistan.
        A {request.skill} worker in {request.city} asked: "{request.message}".
        Give them a precise 2-sentence market briefing covering today's demand level,
        average daily rate, and the best opportunity this week.
        Do not use markdown. No asterisks.
        """
        fallback_market = f"Demand for {request.skill}s in {request.city} is strong today. Average daily rate is around Rs. 1,200–1,500."
        reply = await ask_gemini(market_prompt, fallback_market)
        extra_data = {"demand_level": "high", "avg_daily_rate": 1300}

    elif intent == "safety":
        safety_prompt = f"""
        You are a safety Guardian AI protecting daily-wage workers in Pakistan.
        A {request.skill} worker in {request.city} asked: "{request.message}".
        Give a clear, protective 2-sentence safety advisory.
        Tell them to always use the Escrow Wallet, never take verbal promises, and verify employers.
        Do not use markdown. No asterisks.
        """
        fallback_safety = "Always verify your employer before starting work. Use the Escrow Wallet to protect your wages."
        reply = await ask_gemini(safety_prompt, fallback_safety)
        extra_data = {"safety_tip": True}

    elif intent == "job_advice":
        advice_prompt = f"""
        You are an expert labor market advisor for Pakistani daily-wage workers.
        A {request.skill} worker in {request.city} is asking about a job: "{request.message}".
        Give concise 2-sentence advice on whether it sounds like a good opportunity.
        Mention typical rates and what to watch out for. No markdown. No asterisks.
        """
        fallback_advice = f"This sounds like a solid opportunity for a {request.skill} in {request.city}. Confirm payment terms upfront before starting."
        reply = await ask_gemini(advice_prompt, fallback_advice)
        extra_data = {"should_take": True}

    else:  # chat
        chat_prompt = f"""
        You are 'AI Manager', a friendly expert advisor for {worker_name}, a {request.skill} in {request.city}.
        They said: "{request.message}".
        Respond in 2 short, friendly, practical sentences. Reference their skill and city.
        Do not use markdown. No asterisks.
        """
        fallback_chat = f"Great question! As a {request.skill} in {request.city}, you have strong opportunities this week."
        reply = await ask_gemini(chat_prompt, fallback_chat)

    print(f"[ORCHESTRATOR] ✅ Sub-agent reply ({intent}): '{reply[:80]}...'")
    print("═"*60 + "\n")

    return OrchestrateResponse(
        reply=reply,
        agent=f"AI Manager ({intent.replace('_', ' ').title()} Agent)",
        intent=intent,
        data=extra_data if extra_data else None,
    )

