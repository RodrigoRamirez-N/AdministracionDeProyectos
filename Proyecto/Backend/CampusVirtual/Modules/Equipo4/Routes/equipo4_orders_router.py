from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlmodel import Session

from Modules.Equipo4.models.database import get_session_equipo4
from Modules.Equipo4.models.models import Order
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


# ----------------------------- PUT / PATCH genéricos -----------------------------
class OrderPatch(SQLModel):
    payment_method_id: Optional[int] = None
    type: Optional[str] = None
    instructions: Optional[str] = None
    status: Optional[str] = None


class OrderPut(SQLModel):
    payment_method_id: int
    type: Optional[str] = None
    instructions: Optional[str] = None
    status: Optional[str] = None


@router.patch("/{order_id}", response_model=Order)
def patch_order(
    order_id: int,
    data: OrderPatch = Body(...),
    session: Session = Depends(get_session_equipo4),
):
    """Actualiza parcialmente un pedido. Solo campos enviados serán modificados.

    Endpoint pensado para frontends que hacen PATCH a `/orders/{id}` directamente.
    """
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    updated = False
    if data.payment_method_id is not None:
        order.payment_method_id = data.payment_method_id
        updated = True
    if data.type is not None:
        order.type = data.type
        updated = True
    if data.instructions is not None:
        order.instructions = data.instructions
        updated = True
    if data.status is not None:
        order.status = data.status
        updated = True

    if not updated:
        raise HTTPException(status_code=400, detail="Ningún campo para actualizar")

    session.add(order)
    session.commit()
    session.refresh(order)
    return order


@router.put("/{order_id}", response_model=Order)
def put_order(
    order_id: int,
    data: OrderPut = Body(...),
    session: Session = Depends(get_session_equipo4),
):
    """Reemplaza (upgrade) los campos editables de un pedido.

    Nota: `food_stand_id` no se modifica vía PUT para mantener integridad.
    """
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    order.payment_method_id = data.payment_method_id
    order.type = data.type
    order.instructions = data.instructions
    order.status = data.status

    session.add(order)
    session.commit()
    session.refresh(order)
    return order
