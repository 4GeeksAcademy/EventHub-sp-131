from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

class User(db.Model): 
    id: Mapped[int] = mapped_column(primary_key=True) 
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False) 
    password: Mapped[str] = mapped_column(nullable=False) 
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False) 
    
    def serialize(self): return { "id": self.id, "email": self.email, 
# do not serialize the password, its a security breach 
}
    
# // Tabla ADMIN //

class Admin(db.Model):
    __tablename__ = "admin"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False, unique=True)

    user: Mapped["User"] = relationship("User")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.user.email,
            "is_active": self.user.is_active
        }