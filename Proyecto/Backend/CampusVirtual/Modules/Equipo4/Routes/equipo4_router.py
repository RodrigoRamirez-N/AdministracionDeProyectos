from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, SQLModel, Field
from typing import List, Optional

from Modules.Equipo4.models.database import get_session_equipo4
from Modules.Equipo4.models.models import (
    FoodStand,
    OpeningHour,
    Food,
    PaymentMethod,
    Order,
    OrderItem,
)

router = APIRouter()


# ----------------------------- Schemas (Create) -----------------------------
class OrderItemIn(SQLModel):
    food_id: int
    quantity: int = Field(default=1, ge=1)


class OrderCreate(SQLModel):
    food_stand_id: int
    payment_method_id: int
    type: Optional[str] = None
    instructions: Optional[str] = None
    status: Optional[str] = "pending"
    items: List[OrderItemIn]


# ----------------------------- Food Stands -----------------------------
@router.get("/food-stands", response_model=list[FoodStand])
def list_food_stands(session: Session = Depends(get_session_equipo4)):
    return session.exec(select(FoodStand)).all()


@router.get("/food-stands/{food_stand_id}", response_model=FoodStand)
def get_food_stand(food_stand_id: int, session: Session = Depends(get_session_equipo4)):
    food_stand = session.get(FoodStand, food_stand_id)
    if not food_stand:
        raise HTTPException(status_code=404, detail="FoodStand no encontrado")
    return food_stand


# ----------------------------- Opening Hours -----------------------------
@router.get("/opening-hours", response_model=list[OpeningHour])
def list_opening_hours(food_stand_id: int | None = None, session: Session = Depends(get_session_equipo4)):
    query = select(OpeningHour)
    if food_stand_id is not None:
        query = query.where(OpeningHour.food_stand_id == food_stand_id)
    return session.exec(query).all()


@router.get("/opening-hours/{opening_hour_id}", response_model=OpeningHour)
def get_opening_hour(opening_hour_id: int, session: Session = Depends(get_session_equipo4)):
    opening_hour = session.get(OpeningHour, opening_hour_id)
    if not opening_hour:
        raise HTTPException(status_code=404, detail="OpeningHour no encontrado")
    return opening_hour


# ----------------------------- Foods -----------------------------
@router.get("/foods", response_model=list[Food])
def list_foods(food_stand_id: int | None = None, session: Session = Depends(get_session_equipo4)):
    query = select(Food)
    if food_stand_id is not None:
        query = query.where(Food.food_stand_id == food_stand_id)
    return session.exec(query).all()


@router.get("/foods/{food_id}", response_model=Food)
def get_food(food_id: int, session: Session = Depends(get_session_equipo4)):
    food = session.get(Food, food_id)
    if not food:
        raise HTTPException(status_code=404, detail="Food no encontrado")
    return food


# ----------------------------- Payment Methods -----------------------------
@router.get("/payment-methods", response_model=list[PaymentMethod])
def list_payment_methods(session: Session = Depends(get_session_equipo4)):
    return session.exec(select(PaymentMethod)).all()


@router.get("/payment-methods/{payment_method_id}", response_model=PaymentMethod)
def get_payment_method(payment_method_id: int, session: Session = Depends(get_session_equipo4)):
    payment_method = session.get(PaymentMethod, payment_method_id)
    if not payment_method:
        raise HTTPException(status_code=404, detail="PaymentMethod no encontrado")
    return payment_method


# ----------------------------- Orders -----------------------------
@router.get("/orders", response_model=list[Order])
def list_orders(food_stand_id: int | None = None, status: str | None = None, session: Session = Depends(get_session_equipo4)):
    query = select(Order)
    if food_stand_id is not None:
        query = query.where(Order.food_stand_id == food_stand_id)
    if status is not None:
        query = query.where(Order.status == status)
    return session.exec(query).all()


@router.get("/orders/{order_id}", response_model=Order)
def get_order(order_id: int, session: Session = Depends(get_session_equipo4)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order no encontrado")
    return order


@router.post("/orders", response_model=Order, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, session: Session = Depends(get_session_equipo4)):
    if not payload.items or len(payload.items) == 0:
        raise HTTPException(status_code=400, detail="Debe incluir al menos un artículo en 'items'.")

    # Validar existencia de FoodStand y PaymentMethod
    food_stand = session.get(FoodStand, payload.food_stand_id)
    if not food_stand:
        raise HTTPException(status_code=404, detail="FoodStand no encontrado")

    payment_method = session.get(PaymentMethod, payload.payment_method_id)
    if not payment_method:
        raise HTTPException(status_code=404, detail="PaymentMethod no encontrado")

    # Validar existencia de foods y que pertenezcan al mismo food_stand
    food_ids = [item.food_id for item in payload.items]
    foods = session.exec(select(Food).where(Food.id.in_(food_ids))).all()
    if len(foods) != len(set(food_ids)):
        raise HTTPException(status_code=404, detail="Uno o más 'food_id' no existen")

    for f in foods:
        if f.food_stand_id != payload.food_stand_id:
            raise HTTPException(status_code=400, detail="Todos los 'food_id' deben pertenecer al mismo 'food_stand_id'.")

    # Crear orden e items sin anidar transacciones; un solo commit al final
    order = Order(
        food_stand_id=payload.food_stand_id,
        payment_method_id=payload.payment_method_id,
        type=payload.type,
        instructions=payload.instructions,
        status=payload.status,
    )
    session.add(order)
    session.flush()  # asegura que order.id esté disponible

    for item in payload.items:
        order_item = OrderItem(
            order_id=order.id,
            food_id=item.food_id,
            quantity=item.quantity if item.quantity is not None else 1,
        )
        session.add(order_item)

    session.commit()
    session.refresh(order)
    return order


# ----------------------------- Order Items -----------------------------
@router.get("/order-items", response_model=list[OrderItem])
def list_order_items(order_id: int | None = None, food_id: int | None = None, session: Session = Depends(get_session_equipo4)):
    query = select(OrderItem)
    if order_id is not None:
        query = query.where(OrderItem.order_id == order_id)
    if food_id is not None:
        query = query.where(OrderItem.food_id == food_id)
    return session.exec(query).all()


@router.get("/order-items/{order_item_id}", response_model=OrderItem)
def get_order_item(order_item_id: int, session: Session = Depends(get_session_equipo4)):
    order_item = session.get(OrderItem, order_item_id)
    if not order_item:
        raise HTTPException(status_code=404, detail="OrderItem no encontrado")
    return order_item
