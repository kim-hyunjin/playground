from pathlib import Path

from sqlmodel import Session, SQLModel, create_engine

DB_PATH = Path(__file__).resolve().parent / "rangmanch.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"
engine = create_engine(DATABASE_URL, echo=True)


def create_table():
    """Create all tables defined by SQLModel classes."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependency that provides a database session per request."""
    with Session(engine) as session:
        yield session
