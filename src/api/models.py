from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    location: Mapped[str] = mapped_column(String(150), nullable=True)
    age: Mapped[int] = mapped_column(Integer, nullable=True)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "location": self.location,
            "age": self.age,
            "description": self.description
        }
    
    # // Tabla ADMIN //

class Admin(db.Model):
    __tablename__ = "admin"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=True)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.user.email,
            "is_active": self.user.is_active
        }

class Promotor(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    location: Mapped[str] = mapped_column(String(160),nullable=False)
    phone: Mapped[int] = mapped_column(unique=True)
    web_page: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    verified_org: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    # Pending relation with EventOwnerdPromotor table
    # Pending relation with PromotorCategory table



    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "location": self.location,
            "phone": self.phone,
            "webPage": self.web_page,
            "verifiedOrg": self.verified_org
        }


##  // TABLA CATEGORY
class Category(db.Model):
    __tablename__ = "category"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }