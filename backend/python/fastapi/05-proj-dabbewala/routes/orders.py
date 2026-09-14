from datetime import datetime

from database import get_session
from fastapi import APIRouter, Depends, HTTPException, Query
from models import Order, OrderCreate, OrderStatus, OrderStatusUpdate, StatusLog
from sqlmodel import Session, select

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/", response_model=Order)
def create_order(order: OrderCreate, session: Session = Depends(get_session)):
    db_order = Order(**order.model_dump())
    session.add(db_order)
    session.commit()
    session.refresh(db_order)
    return db_order


@router.get("/", response_model=list[Order])
def read_orders(
    status: OrderStatus | None = Query(
        default=None, description="Filter orders by status"
    ),
    order_date: str | None = Query(
        default=None, description="Filter orders by creation date (YYYY-MM-DD)"
    ),
    skip: int = Query(default=0, ge=0, description="Number of records to skip"),
    limit: int = Query(
        default=20, ge=1, le=100, description="Maximum number of records to return"
    ),
    session: Session = Depends(get_session),
):
    query = select(Order)
    if status:
        query = query.where(Order.status == status)
    if order_date:
        start = datetime.combine(
            datetime.strptime(order_date, "%Y-%m-%d"), datetime.min.time()
        )
        end = datetime.combine(
            datetime.strptime(order_date, "%Y-%m-%d"), datetime.max.time()
        )
        query = query.where(Order.created_at.between(start, end))
    query = query.offset(skip).limit(limit)
    return session.exec(query).all()


@router.get("/{order_id}", response_model=Order)
def read_order(order_id: int, session: Session = Depends(get_session)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.get("/{order_id}/status-log", response_model=list[StatusLog])
def read_order_status_log(order_id: int, session: Session = Depends(get_session)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    query = select(StatusLog).where(StatusLog.order_id == order_id)
    return session.exec(query).all()


@router.patch("/{order_id}/status", response_model=Order)
def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    session: Session = Depends(get_session),
):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    old_status = order.status
    update_data = status_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(order, key, value)
    order.updated_at = datetime.now()
    session.add(order)

    if status_update.status != old_status:
        session.add(
            StatusLog(
                order_id=order_id,
                old_status=old_status,
                new_status=status_update.status,
            )
        )

    session.commit()
    session.refresh(order)
    return order


@router.delete("/{order_id}")
def delete_order(order_id: int, session: Session = Depends(get_session)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    session.delete(order)
    session.commit()
    return {"message": "Order deleted successfully"}
