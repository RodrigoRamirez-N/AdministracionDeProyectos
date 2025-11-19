# models/models_equipo4.py
from __future__ import annotations

from typing import Optional
from datetime import time, datetime
from decimal import Decimal

from sqlmodel import SQLModel, Field, Relationship


class FoodStand(SQLModel, table=True):
    __tablename__ = "food_stands"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: Optional[str] = Field(default=None, max_length=255)
    description: Optional[str] = None
    telephone: Optional[str] = Field(default=None, max_length=50)
    available: bool = True

    # Relaciones
    foods: list["Food"] = Relationship(back_populates="food_stand")
    opening_hours: list["OpeningHour"] = Relationship(back_populates="food_stand")
    orders: list["Order"] = Relationship(back_populates="food_stand")


class OpeningHour(SQLModel, table=True):
    __tablename__ = "opening_hours"

    id: Optional[int] = Field(default=None, primary_key=True)
    food_stand_id: int = Field(foreign_key="food_stands.id")
    opening_time: Optional[time] = None
    closing_time: Optional[time] = None
    available_days: Optional[str] = Field(default=None, max_length=255)

    food_stand: Optional[FoodStand] = Relationship(back_populates="opening_hours")


class Food(SQLModel, table=True):
    __tablename__ = "foods"

    id: Optional[int] = Field(default=None, primary_key=True)
    food_stand_id: int = Field(foreign_key="food_stands.id")
    name: Optional[str] = Field(default=None, max_length=255)
    description: Optional[str] = None
    price: Optional[Decimal] = None
    rating: Optional[float] = None
    image_url: Optional[str] = None

    food_stand: Optional[FoodStand] = Relationship(back_populates="foods")
    order_items: list["OrderItem"] = Relationship(back_populates="food")


class PaymentMethod(SQLModel, table=True):
    __tablename__ = "payment_methods"

    id: Optional[int] = Field(default=None, primary_key=True)
    method: str

    orders: list["Order"] = Relationship(back_populates="payment_method")


class Order(SQLModel, table=True):
    __tablename__ = "orders"

    id: Optional[int] = Field(default=None, primary_key=True)
    food_stand_id: int = Field(foreign_key="food_stands.id")
    payment_method_id: int = Field(foreign_key="payment_methods.id")

    # para llevar, en sitio, etc.
    type: Optional[str] = Field(default=None, max_length=50)
    instructions: Optional[str] = None
    # pendiente, pagado, entregado, etc.
    status: Optional[str] = Field(default=None, max_length=50)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    food_stand: Optional[FoodStand] = Relationship(back_populates="orders")
    payment_method: Optional[PaymentMethod] = Relationship(back_populates="orders")
    items: list["OrderItem"] = Relationship(back_populates="order")


class OrderItem(SQLModel, table=True):
    __tablename__ = "order_items"

    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="orders.id")
    food_id: int = Field(foreign_key="foods.id")
    quantity: int = 1

    order: Optional[Order] = Relationship(back_populates="items")
    food: Optional[Food] = Relationship(back_populates="order_items")
