"""buyer.py"""
from pydantic import BaseModel
from fastapi import APIRouter, Depends  # Depends add karo agar nahi hai
from sqlalchemy.orm import Session
from app.database import get_db, Product
router = APIRouter()

class AskRequest(BaseModel):
    buyer_wallet: str
    message: str
    chain: str = "sui"

@router.post("/ask")
async def ask(req: AskRequest):
    from app.llm.claude_client import call_claude, SYSTEM_BUYER_ASSISTANT
    reply = call_claude(SYSTEM_BUYER_ASSISTANT, f"Buyer ({req.buyer_wallet}) on {req.chain}: {req.message}")
    return {"reply": reply}


# ── ye imports file ke top mein add karo ──────────────────────────────────────
from app.database import get_db, Product
from sqlalchemy.orm import Session

# ── ye route add karo ─────────────────────────────────────────────────────────
@router.get("/products")
def get_all_products(
    category: str = None,
    db: Session = Depends(get_db)
):
    """Buyer marketplace — sirf approved products"""
    query = db.query(Product).filter(Product.status == "approved")
    if category and category != "All":
        query = query.filter(Product.category == category)
    products = query.order_by(Product.created_at.desc()).all()
    return [
        {
            "id": p.id,
            "merchant_wallet": p.merchant_wallet,
            "merchant_name": p.merchant_name,
            "name": p.name,
            "description": p.description,
            "price_usdc": p.price_usdc,
            "category": p.category,
            "emoji": p.emoji,
            "tags": [t.strip() for t in p.tags.split(",") if t.strip()] if p.tags else [],
            "images": [i.strip() for i in p.images.split(",") if i.strip()] if p.images else [],
            "status": p.status,
            "rating": p.rating,
            "review_count": p.review_count,
            "merchant_orders": p.merchant_orders,
            "merchant_success_rate": p.merchant_success_rate,
        }
        for p in products
    ]