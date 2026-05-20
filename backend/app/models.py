from sqlalchemy import Column, Integer, String, Float, Text
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)  # Switched to Email
    full_name = Column(String, nullable=True)
    skill = Column(String, nullable=True)
    city = Column(String, nullable=True)
    biography = Column(Text, nullable=True)
    wallet_balance = Column(Float, default=0.0)

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    employer = Column(String)
    details = Column(String)
    distance = Column(String)
    rate = Column(Integer)
    confidence = Column(Float)
    badge = Column(String)
    category = Column(String)
    customer_phone = Column(String, nullable=True)
    customer_email = Column(String, nullable=True)
    customer_name = Column(String, nullable=True)
