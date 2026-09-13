from database import get_session
from fastapi import APIRouter, Depends, HTTPException, Query
from models import Review, ReviewCreate, ReviewRead, ReviewUpdate
from sqlmodel import Session, func, select

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("/", response_model=ReviewRead)
def create_review(review: ReviewCreate, session: Session = Depends(get_session)):
    db_review = Review(**review.model_dump())
    session.add(db_review)
    session.commit()
    session.refresh(db_review)
    return db_review


@router.get("/", response_model=list[ReviewRead])
def read_reviews(
    play_name: str | None = Query(
        default=None, description="Filter reviews by play name"
    ),
    skip: int = Query(default=0, ge=0, description="Number of records to skip"),
    limit: int = Query(
        default=10, ge=1, le=100, description="Maximum number of records to return"
    ),
    session: Session = Depends(get_session),
):
    query = select(Review)
    if play_name:
        query = query.where(Review.play_name == play_name)
    query = query.offset(skip).limit(limit)
    return session.exec(query).all()


@router.get("/average/{play_name}")
def get_average_rating(play_name: str, session: Session = Depends(get_session)):
    query = select(func.avg(Review.rating), func.count(Review.id)).where(
        Review.play_name == play_name
    )
    result = session.exec(query).first()

    avg_rating, count = result if result else (None, 0)

    if count == 0:
        raise HTTPException(
            status_code=404, detail=f"No reviews found for play '{play_name}'"
        )

    return {
        "play_name": play_name,
        "average_rating": round(avg_rating, 2),
        "review_count": count,
    }


@router.get("/{review_id}", response_model=ReviewRead)
def read_review(review_id: int, session: Session = Depends(get_session)):
    review = session.get(Review, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


@router.patch("/{review_id}", response_model=ReviewRead)
def update_review(
    review_id: int, review_update: ReviewUpdate, session: Session = Depends(get_session)
):
    review = session.get(Review, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    update_data = review_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(review, key, value)

    session.commit()
    session.refresh(review)
    return review


@router.delete("/{review_id}")
def delete_review(review_id: int, session: Session = Depends(get_session)):
    review = session.get(Review, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    session.delete(review)
    session.commit()
    return {"message": "Review deleted successfully"}
