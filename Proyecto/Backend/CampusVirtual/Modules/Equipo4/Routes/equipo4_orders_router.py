from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from models.database_equipo4 import get_session_equipo4
from models.models_equipo4 import Order
from sqlmodel import select

router = APIRouter(
    prefix="/orders",
    tags=["Equipo 4 - Orders"],
)

# Obtener un pedido por id
@router.get("/{order_id}", response_model=Order)
def get_order(
    order_id: int,
    session: Session = Depends(get_session_equipo4),
):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido no encontrado",
        )
    return order


# PATCH para COMPLETAR un pedido (cambiar status a 'completado')
@router.patch("/{order_id}/complete", response_model=Order)
def complete_order(
    order_id: int,
    session: Session = Depends(get_session_equipo4),
):
    order = session.get(Order, order_id)

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido no encontrado",
        )

    # Si ya está completado, simplemente lo regresamos
    if order.status == "completado":
        return order

    order.status = "completado"  
    session.add(order)
    session.commit()
    session.refresh(order)

    return order


# PATCH genérico para cambiar el status a cualquier valor
from sqlmodel import SQLModel, Field
from typing import Optional


class OrderStatusUpdate(SQLModel):
    status: str = Field(description="Nuevo estado del pedido (pendiente, pagado, entregado, cancelado, etc.)")


@router.patch("/{order_id}/status", response_model=Order)
def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    session: Session = Depends(get_session_equipo4),
):
    order = session.get(Order, order_id)

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido no encontrado",
        )

    order.status = data.status

    session.add(order)
    session.commit()
    session.refresh(order)

    return order
