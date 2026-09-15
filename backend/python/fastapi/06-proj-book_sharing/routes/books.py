from auth import verify_api_key
from database import get_session
from fastapi import APIRouter, Depends, HTTPException, Query
from models.book import Book, BookCreate, BookRead, BookUpdate
from models.user import User
from sqlmodel import Session, select

router = APIRouter(prefix="/books", tags=["Books"])


@router.get("/", response_model=list[BookRead])
def list_books(
    title: str | None = Query(default=None),
    author: str | None = Query(default=None),
    session: Session = Depends(get_session),
):
    query = select(Book).where(Book.is_sold == False)

    if title:
        query = query.where(Book.title.contains(title))

    if author:
        query = query.where(Book.author.contains(author))

    return session.exec(query).all()


@router.post("/", response_model=BookRead)
def create_book(
    book_data: BookCreate,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key),
):
    owner = session.get(User, book_data.user_id)

    if not owner:
        raise HTTPException(status_code=404, detail="User not found")

    book = Book.model_validate(book_data)
    session.add(book)
    session.commit()
    session.refresh(book)
    return book


@router.patch("/{book_id}", response_model=BookRead)
def update_book(
    book_id: int,
    book_data: BookUpdate,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key),
):
    book = session.get(Book, book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    updates = book_data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(book, field, value)

    session.add(book)
    session.commit()
    session.refresh(book)
    return book
