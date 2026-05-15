from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class MerchantCreate(BaseModel):
    wallet_address: str
    company_name: str
    description: str
    website: Optional[str] = ""
    category: str
    contact_email: str


class MerchantOut(BaseModel):
    id: int
    wallet_address: str
    company_name: str
    description: str
    website: str
    category: str
    contact_email: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    merchant_wallet: str
    name: str
    description: str
    price_usdc: float
    category: str
    emoji: str = "🎁"
    tags: List[str] = []
    images: List[str] = []
    delivery_info: str


class ProductOut(BaseModel):
    id: int
    merchant_wallet: str
    merchant_name: str
    name: str
    description: str
    price_usdc: float
    category: str
    emoji: str
    tags: List[str]
    delivery_info: str
    status: str
    rating: float
    review_count: int
    merchant_orders: int
    merchant_success_rate: float
    created_at: datetime

    class Config:
        from_attributes = True