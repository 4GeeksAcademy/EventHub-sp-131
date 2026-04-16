from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone
from typing import Optional

db = SQLAlchemy()

class Event(db.Model):
    __tablename__ = "event"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(120), nullable=False)
    location: Mapped[str] = mapped_column(db.String(120))
    description: Mapped[str] = mapped_column(db.Text)
    date_event: Mapped[datetime] = mapped_column(nullable=False)
    capacity: Mapped[int] = mapped_column()
    media: Mapped[Optional[str]] = mapped_column(db.String(255))
    create_date: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

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