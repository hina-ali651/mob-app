import os
import smtplib
import random
from email.message import EmailMessage
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..security import create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

# In-memory OTP storage for blazing fast hackathon checks
OTP_STORE = {}

def send_real_email(to_email: str, otp_code: str):
    """
    Dispatches a real SMTP email. Requires SMTP_USER and SMTP_PASS in .env.
    """
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")

    if not smtp_user or not smtp_pass:
        print(f"[SMTP Mock] Sending OTP {otp_code} to {to_email} (Credentials missing in .env)")
        return

    try:
        msg = EmailMessage()
        msg.set_content(f"Welcome to the Agentic AI App!\n\nYour secure login OTP is: {otp_code}\n\nDo not share this code.")
        msg['Subject'] = "Your Secure Login OTP"
        msg['From'] = smtp_user
        msg['To'] = to_email

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)
        server.quit()
        print(f"[SMTP] Successfully dispatched email to {to_email}")
    except Exception as e:
        print(f"[SMTP Error] {e}")

@router.post("/send-otp")
def send_otp(request: schemas.UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    otp = str(random.randint(1000, 9999))
    OTP_STORE[request.email] = otp
    background_tasks.add_task(send_real_email, request.email, otp)
    return {"message": f"OTP sent via SMTP to {request.email}"}

@router.post("/verify-otp", response_model=schemas.Token)
def verify_otp(request: schemas.VerifyOtpRequest, db: Session = Depends(get_db)):
    # 1. Check if the OTP matches the active code generated for this email
    if OTP_STORE.get(request.email) != request.otp:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP code")
    
    # 2. OTP is correct, destroy it for security
    del OTP_STORE[request.email]

    # 3. Synchronize with Postgres Database
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        user = models.User(email=request.email, wallet_balance=0.0)
        db.add(user)
        db.commit()
        db.refresh(user)

    # 4. Generate JWT Token
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@router.post("/profile", response_model=schemas.UserResponse)
def setup_profile(request: schemas.UserProfileSetup, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    user = db.query(models.User).filter(models.User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.full_name = request.full_name
    user.skill = request.skill
    user.city = request.city
    user.biography = request.biography
    db.commit()
    db.refresh(user)
    return user
