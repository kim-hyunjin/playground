from sqlmodel import Field, Relationship, SQLModel


class Book(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    author: str
    price: int
    is_sold: bool = Field(default=False)

    # foreign key to the User table
    user_id: int = Field(foreign_key="user.id")
    owner: "User" | None = Relationship(back_populates="books")


# request body for creating a book
class BookCreate(SQLModel):
    title: str
    author: str
    price: int
    user_id: int


# response body
class BookRead(SQLModel):
    id: int
    title: str
    author: str
    price: int
    is_sold: bool
    user_id: int


class BookUpdate(SQLModel):
    price: int | None = None
    is_sold: bool | None = None


from models.user import User

Book.model_rebuild()
