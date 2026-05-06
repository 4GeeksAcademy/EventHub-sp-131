from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select
from api.models import db, User, UserEventPreference, Event, EventCategory

event = Blueprint('event', __name__)

from collections import Counter


# Helper para obtener usuario actual
def get_current_user():
    user_email = get_jwt_identity()

    return db.session.execute(
        select(User).where(User.email == user_email)
    ).scalar_one_or_none()


@event.route("/events", methods=["GET"])
@jwt_required()
def get_events():

    user = get_current_user()

    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    user_id = user.id

    # eventos ya swipeados
    seen_events = db.session.execute(
        select(UserEventPreference.event_id).where(
            UserEventPreference.user_id == user_id
        )
    ).scalars().all()

    # eventos liked
    liked_events = db.session.execute(
        select(UserEventPreference.event_id).where(
            UserEventPreference.user_id == user_id,
            UserEventPreference.liked == True
        )
    ).scalars().all()

    # categorías liked
    liked_categories = db.session.execute(
        select(EventCategory.category_id).where(
            EventCategory.event_id.in_(liked_events)
        )
    ).scalars().all()

    category_counts = Counter(liked_categories)

    # query base
    query = select(Event)

    if category_counts:
        favorite_categories = [
            cat for cat, _ in category_counts.most_common()
        ]

        query = (
            select(Event)
            .join(EventCategory)
            .where(
                EventCategory.category_id.in_(favorite_categories)
            )
        )

    # excluir vistos
    if seen_events:
        query = query.where(~Event.id.in_(seen_events))

    events = db.session.execute(query).scalars().all()

    return jsonify([event.serialize() for event in events]), 200


@event.route("/swipe", methods=["POST"])
@jwt_required()
def swipe_event():

    user = get_current_user()

    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    user_id = user.id

    data = request.get_json()

    event_id = data.get("event_id")
    liked = data.get("liked")

    if event_id is None or liked is None:
        return jsonify({"message": "Datos incompletos"}), 400

    # evitar duplicados
    existing = db.session.execute(
        select(UserEventPreference).where(
            UserEventPreference.user_id == user_id,
            UserEventPreference.event_id == event_id
        )
    ).scalar_one_or_none()

    if existing:
        existing.liked = liked
    else:
        new_pref = UserEventPreference(
            user_id=user_id,
            event_id=event_id,
            liked=liked
        )

        db.session.add(new_pref)

    db.session.commit()

    return jsonify({"message": "Swipe guardado"}), 200