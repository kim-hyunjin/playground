from datetime import datetime
from enum import Enum

from sqlalchemy import JSON, Column
from sqlmodel import Field, SQLModel


class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class Order(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    customer_name: str = Field(index=True)
    delivery_address: str
    items: list[str] = Field(sa_column=Column(JSON))
    status: OrderStatus = Field(default=OrderStatus.PENDING)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class StatusLog(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id", index=True)
    old_status: OrderStatus
    new_status: OrderStatus
    changed_at: datetime = Field(default_factory=datetime.now)


class OrderCreate(SQLModel):
    customer_name: str
    delivery_address: str
    items: list[str]


class OrderStatusUpdate(SQLModel):
    status: OrderStatus
    delivery_address: str | None = None
