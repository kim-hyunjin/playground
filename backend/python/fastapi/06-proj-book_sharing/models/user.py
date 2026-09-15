from sqlmodel import Field, Relationship, SQLModel


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    email: str = Field(unique=True)
    college: str

    books: list["Book"] = Relationship(back_populates="owner")


# request body for creating a new user
class UserCreate(SQLModel):
    name: str
    email: str
    college: str


# response model for returning user data
class UserRead(SQLModel):
    id: int
    name: str
    email: str
    college: str


# avoid circular import issues by importing Book after the User class definition
from models.book import Book

User.model_rebuild()  # Rebuild the model to resolve forward references
