from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from datetime import datetime, timezone
from typing import Optional

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    location: Mapped[str] = mapped_column(String(150), nullable=True)
    age: Mapped[int] = mapped_column(Integer, nullable=True)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), default=True, nullable=False)

    discussion: Mapped[list["Discussion"]
        ] = relationship(back_populates="user")

    saved_event: Mapped[list["SavedEvent"]
        ] = relationship(back_populates="user")

    comments: Mapped[list["Comment"]] = relationship("Comment", back_populates="user")

    friends: Mapped[List["Friend"]] = relationship("Friend", foreign_keys=lambda: [
                                                   Friend.user_id], back_populates="user", lazy="selectin")
    friends_owned: Mapped[List["Friend"]] = relationship("Friend", foreign_keys=lambda: [
                                                         Friend.friend_id], back_populates="friend", lazy="selectin")
    
    categories: Mapped[list["UserCategory"]] = relationship(back_populates="user")

    eventAssistUsers: Mapped[List["EventAssistUser"]] = relationship(back_populates="user")

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
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_active": self.is_active
        }


class Promotor(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    location: Mapped[str] = mapped_column(String(160), nullable=False)
    phone: Mapped[int] = mapped_column(unique=True, nullable=True)
    web_page: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    verified_org: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    promotor_categories: Mapped[list["PromotorCategory"]] = relationship(
        back_populates="promotor",
        cascade="all, delete-orphan"
    )
    eventPromotors: Mapped[list["EventPromotor"]] = relationship(back_populates="promotor")
    # Pending relation with EventOwnerdPromotor table

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


class Category(db.Model):
    __tablename__ = "category"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)

    promotor_categories: Mapped[list["PromotorCategory"]] = relationship(
        back_populates="category",
        cascade="all, delete-orphan"
    )

    userCats: Mapped[list["UserCategory"]] = relationship(back_populates="category")
    eventCats: Mapped[list["EventCategory"]] = relationship(back_populates="category")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }


class Event(db.Model):
    __tablename__ = "event"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(120), nullable=False)
    location: Mapped[str] = mapped_column(db.String(120))
    description: Mapped[str] = mapped_column(db.Text)
    date_event: Mapped[datetime] = mapped_column(nullable=False)
    capacity: Mapped[int] = mapped_column()
    media: Mapped[Optional[str]] = mapped_column(db.String(500))
    create_date: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc))

    comments: Mapped[List["Comment"]] = relationship(back_populates="event")
    saved_event: Mapped[list["SavedEvent"]] = relationship(back_populates="event")
    categories: Mapped[list["EventCategory"]] = relationship(back_populates="event")
    eventPromotors: Mapped[list["EventPromotor"]] = relationship(back_populates="event")
    eventAssistUsers: Mapped[List["EventAssistUser"]] = relationship(back_populates="event")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "description": self.description,
            "date_event": self.date_event.isoformat() if self.date_event else None,
            "capacity": self.capacity,
            "media": self.media,
            "create_date": self.create_date.isoformat() if self.create_date else None
        }


class Group(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    media: Mapped[str] = mapped_column(String(500))
    location: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str] = mapped_column(String(260))

    discussion: Mapped[list["Discussion"]
        ] = relationship(back_populates="group")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "media": self.media,
            "location": self.location,
            "description": self.description
        }


class PromotorCategory(db.Model):
    __tablename__ = "promotor_category"
    __table_args__ = (
        UniqueConstraint("promotor_id", "category_id",
                         name="uq_promotor_category"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    promotor_id: Mapped[int] = mapped_column(
        ForeignKey("promotor.id"), nullable=False)
    category_id: Mapped[int] = mapped_column(
        ForeignKey("category.id"), nullable=False)

    promotor: Mapped["Promotor"] = relationship(
        back_populates="promotor_categories")
    category: Mapped["Category"] = relationship(
        back_populates="promotor_categories")

    def serialize(self):
        return {
            "id": self.id,
            "promotor_id": self.promotor_id,
            "category_id": self.category_id,
            "promotor": self.promotor.serialize() if self.promotor else None,
            "category": self.category.serialize() if self.category else None
        }


class Discussion(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    message: Mapped[str] = mapped_column(String(260))
    create_date: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc))
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="discussion")
    group_id: Mapped[int] = mapped_column(ForeignKey("group.id"))
    group: Mapped["Group"] = relationship(back_populates="discussion")

    def serialize(self):
        return {
            "id": self.id,
            "message": self.message,
            "create_date": self.create_date,
            "user_id": self.user_id,
            "group_id": self.group_id,
        }


class SavedEvent(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="saved_event")
    event_id: Mapped[int] = mapped_column(ForeignKey("event.id"))
    event: Mapped["Event"] = relationship(back_populates="saved_event")

    def serialize(self):
        return {
        "id": self.id,
        "user_id": self.user_id,
        "event_id": self.event_id
        }


class Friend(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped[List["User"]] = relationship(
        "User", foreign_keys=[user_id], back_populates="friends")
    friend_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    friend: Mapped[List["User"]] = relationship(
        "User", foreign_keys=[friend_id], back_populates="friends_owned")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "friend_id": self.friend_id
        }

class UserCategory(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="categories")
    category_id: Mapped[int] = mapped_column(ForeignKey("category.id"))
    category: Mapped["Category"] = relationship(back_populates="userCats")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "category_id": self.category_id
        }

class GroupCategory(db.Model):
    __tablename__ = "group_category"

    id: Mapped[int] = mapped_column(primary_key=True)
    group_id: Mapped[int] = mapped_column(ForeignKey("group.id"), nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("category.id"), nullable=False)

    __table_args__ = (
        UniqueConstraint("group_id", "category_id", name="uq_group_category"),
    )

    group: Mapped["Group"] = relationship("Group")
    category: Mapped["Category"] = relationship("Category")

class GroupEvent(db.Model):
    __tablename__ = "group_event"

    __table_args__ = (
        UniqueConstraint("group_id", "event_id", name="uq_group_event"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    group_id: Mapped[int] = mapped_column(ForeignKey("group.id"), nullable=False)
    event_id: Mapped[int] = mapped_column(ForeignKey("event.id"), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "group_id": self.group_id,
            "event_id": self.event_id
        }
    
class EventCategory(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("event.id"))
    event: Mapped["Event"] = relationship(back_populates="categories")
    category_id: Mapped[int] = mapped_column(ForeignKey("category.id"))
    category: Mapped["Category"] = relationship(back_populates="eventCats")

    def serialize(self):
        return {
            "id": self.id,
            "event_id": self.event_id,
            "category_id": self.category_id,
            "category_name": self.category.name if self.category else None
        }

class Comment(db.Model):
    __tablename__ = "comment"

    id: Mapped[int] = mapped_column(primary_key=True)
    message: Mapped[str] = mapped_column(db.String(255), nullable=False)
    create_date: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc)
    )

    user_id: Mapped[int] = mapped_column(db.ForeignKey("user.id"), nullable=False)
    event_id: Mapped[int] = mapped_column(db.ForeignKey("event.id"), nullable=False)

    user = relationship("User", back_populates="comments")
    event = relationship("Event", back_populates="comments")

    def serialize(self):
        return {
            "id": self.id,
            "message": self.message,
            "create_date": self.create_date.isoformat(),

            "user": {
                "id": self.user.id,
                "name": self.user.name
            } if self.user else None,

            "event": {
                "id": self.event.id,
                "name": self.event.name
            } if self.event else None
        }


class EventPromotor(db.Model):
    __tablename__ = 'event_promotor'

    id: Mapped[int] = mapped_column(primary_key=True)

    promotor_id: Mapped[int] = mapped_column(ForeignKey('promotor.id'), nullable=False)
    promotor: Mapped["Promotor"] = relationship(back_populates="eventPromotors")

    event_id: Mapped[int] = mapped_column(ForeignKey('event.id'), nullable=False)
    event: Mapped["Event"] = relationship(back_populates="eventPromotors")

    __table_args__ = (
        db.UniqueConstraint('promotor_id', 'event_id', name='unique_event_promotor'),
    )

    def serialize(self):
        return {
            "id": self.id,
            "promotor_id": self.promotor_id,
            "event_id": self.event_id,
            "promotor_name": self.promotor.name if self.promotor else None,
            "event_name": self.event.name if self.event else None
        }
    
class EventAssistUser(db.Model):
    __tablename__ = "event_assist_users"

    __table_args__ = (
        UniqueConstraint("user_id", "event_id", name="uq_user_event"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="eventAssistUsers")
    
    event_id: Mapped[int] = mapped_column(ForeignKey("event.id"))
    event: Mapped["Event"] = relationship(back_populates="eventAssistUsers")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "event_id": self.event_id,
            "user_name": self.user.name if self.user else None,
            "event_name": self.event.name if self.event else None
        }
