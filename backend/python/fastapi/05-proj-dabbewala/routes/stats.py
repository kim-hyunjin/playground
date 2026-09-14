from datetime import date, datetime

from database import get_session
from fastapi import APIRouter, Depends, Query
from models import Order, OrderStatus
from sqlmodel import func, select

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/daily")
def daily_summary(
    summary_date: date | None = Query(
        default=None,
        description="Date for which to generate the summary (YYYY-MM-DD)",
    ),
    session=Depends(get_session),
):
    summary_date = summary_date or date.today()
    start = datetime.combine(summary_date, datetime.min.time())
    end = datetime.combine(summary_date, datetime.max.time())

    rows = session.exec(
        select(Order.status, func.count(Order.id))
        .where(Order.created_at.between(start, end))
        .group_by(Order.status)
    ).all()
    counts = dict(rows)

    summary = {status.value: counts.get(status, 0) for status in OrderStatus}
    summary["total"] = sum(summary.values())
    return {
        "date": summary_date.isoformat(),
        "summary": summary,
    }
