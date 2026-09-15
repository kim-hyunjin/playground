from auth import verify_api_key
from database import get_session
from fastapi import APIRouter, Depends, HTTPException
from models.user import User, UserCreate, UserRead
from sqlmodel import Session, select

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=list[UserRead])
def list_users(
    session: Session = Depends(get_session),
):
    return session.exec(select(User)).all()


@router.post("/", response_model=UserRead)
def register_user(
    user_data: UserCreate,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key),
):
    existing = session.exec(select(User).where(User.email == user_data.email)).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User.model_validate(user_data)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
