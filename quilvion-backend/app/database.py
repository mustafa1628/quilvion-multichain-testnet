import os
from sqlalchemy import (
    create_engine, Column, Integer, String,
    Float, Boolean, Text, DateTime
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable not set!")

# psycopg2 ke liye URL fix (Neon/Railway sometimes send postgres://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,       # connection drop hone par auto-reconnect
    pool_size=5,
    max_overflow=10,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ── Models ─────────────────────────────────────────────────────────────────────

class Merchant(Base):
    __tablename__ = "merchants"

    id              = Column(Integer, primary_key=True, index=True)
    wallet_address  = Column(String(100), unique=True, index=True, nullable=False)
    company_name    = Column(String(200), nullable=False)
    description     = Column(Text, nullable=False)
    website         = Column(String(300), default="")
    category        = Column(String(100), nullable=False)
    contact_email   = Column(String(200), nullable=False)
    status          = Column(String(20), default="pending")   # pending | approved | rejected
    created_at      = Column(DateTime, default=datetime.datetime.utcnow)


class Product(Base):
    __tablename__ = "products"

    id                    = Column(Integer, primary_key=True, index=True)
    merchant_wallet       = Column(String(100), nullable=False, index=True)
    merchant_name         = Column(String(200), nullable=False)
    name                  = Column(String(300), nullable=False)
    description           = Column(Text, nullable=False)
    price_usdc            = Column(Float, nullable=False)
    category              = Column(String(100), nullable=False)
    emoji                 = Column(String(10), default="🎁")
    tags                  = Column(Text, default="")          # comma-separated
    images                = Column(Text, default="")
    delivery_info         = Column(Text, default="")
    status                = Column(String(20), default="pending")  # pending | approved | rejected
    rating                = Column(Float, default=0.0)
    review_count          = Column(Integer, default=0)
    merchant_orders       = Column(Integer, default=0)
    merchant_success_rate = Column(Float, default=1.0)
    created_at            = Column(DateTime, default=datetime.datetime.utcnow)


# ── Helpers ────────────────────────────────────────────────────────────────────

def get_db():
    """FastAPI dependency — DB session per request"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)
    # images column manually add karo agar table pehle se exist karta hai
    try:
        with engine.connect() as conn:
            conn.execute(__import__('sqlalchemy').text(
                "ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT DEFAULT ''"
            ))
            conn.commit()
    except Exception:
        pass
    print("✅ PostgreSQL tables ready")