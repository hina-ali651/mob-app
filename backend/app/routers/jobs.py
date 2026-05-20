import asyncio
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..agent import ask_gemini
from ..security import get_current_user

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

# Automatic PostgreSQL Seeder for Hackathon Testing
def seed_jobs(db: Session):
    if db.query(models.Job).count() > 0:
        return
    initial_jobs = [
        models.Job(title="Wall Painting - Model Town Colony", employer="Chaudhary Paints Ltd.", details="Exterior building walls, premium weather-sheet coating.", distance="1.4 km", rate=1200, confidence=96.4, badge="Painter", category="painter", customer_name="Ali Chaudhary", customer_email="ali@chaudharypaints.pk", customer_phone="+923001112222"),
        models.Job(title="Room White-washing & Primer", employer="Malik Interiors", details="3 residential bedrooms, water emulsion coatings.", distance="3.2 km", rate=1000, confidence=89.2, badge="Painter", category="painter", customer_name="Usman Malik", customer_email="usman@malikinteriors.pk", customer_phone="+923214445555"),
        models.Job(title="DB Panel Wiring & Breakers", employer="Al-Siddique Electric", details="Install 3-phase distributor boards and safety trip breakers.", distance="0.8 km", rate=1500, confidence=98.1, badge="Electrician", category="electrician", customer_name="Siddique Ahmad", customer_email="info@alsiddique.pk", customer_phone="+923331122334"),
        models.Job(title="Main Gutter Bypass Pipe fitting", employer="Saad Plumbing", details="Lay down 4-inch underground pipeline bypass.", distance="1.7 km", rate=1400, confidence=95.0, badge="Plumber", category="plumber", customer_name="Saad Hussain", customer_email="saad@plumb.pk", customer_phone="+923009988776"),
        models.Job(title="Solid Door Frame Installation", employer="Gujranwala Timber", details="Hang 5 solid deodar wooden doors.", distance="2.8 km", rate=1150, confidence=90.0, badge="Carpenter", category="carpenter", customer_name="Kamran Timber", customer_email="kamran@g-timber.pk", customer_phone="+923451234567"),
    ]
    db.add_all(initial_jobs)
    db.commit()

@router.get("", response_model=list[schemas.JobSchema])
def get_jobs(skill: str = Query(None, description="Filter jobs by worker skill category"), db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Returns live job signals dynamically matching the worker's selected trade category.
    Secured by JWT Session.
    """
    seed_jobs(db)
    if skill:
        return db.query(models.Job).filter(models.Job.category == skill.lower()).all()
    return db.query(models.Job).all()

@router.post("/negotiate")
async def negotiate_job(request: schemas.NegotiateRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Simulates a live multi-stage agentic wage negotiation powered by Gemini AI.
    """
    job = db.query(models.Job).filter(models.Job.id == request.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    premium = int(job.rate * 0.25)
    final_rate = job.rate + premium
    
    # Dynamic prompt utilizing the authenticated worker's name and customer details
    prompt = f"""
    You are an expert labor union representative AI negotiating on behalf of a {job.category} worker named {current_user.full_name or 'the worker'}.
    The worker is taking a job titled: "{job.title}" for customer {job.customer_name}.
    You have successfully negotiated a premium of Rs. {premium} on top of the base rate of Rs. {job.rate}.
    In 2 short, punchy sentences, declare that the negotiation was successful and give a highly realistic, technical reason why this extra premium was demanded (e.g., hazard pay, tool wear, distance).
    Do not use markdown bolding.
    """
    
    fallback_msg = f"Negotiation Successful! Secured an extra Rs. {premium} for {job.category} hazards and travel."
    msg = await ask_gemini(prompt, fallback_msg)

    return {
        "job_id": job.id,
        "base_rate": job.rate,
        "negotiated_rate": final_rate,
        "premium_gained": premium,
        "status": "SUCCESS",
        "message": msg
    }
