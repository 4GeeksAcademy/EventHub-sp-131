from flask import Flask, request, jsonify, url_for, Blueprint
from sqlalchemy import select
from datetime import datetime, timezone
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.routes import api
from api.models import (db, User, Event, Comment, SavedEvent, EventAssistUser,
                        Group, Discussion, Friend, Promotor, Chat, Message, EventPromotor)

api = Blueprint('user', __name__,)


def get_current_user():
    current_user_email = get_jwt_identity()

    user = db.session.execute(
        select(User).where(User.email == current_user_email)
    ).scalar_one_or_none()

    return user


@api.route("/me", methods=["GET"])
@jwt_required()
def get_user_me():
    user = get_current_user()

    if user is None:
        return jsonify({"message": "User no encontrado"}), 404

    return jsonify({
        "user": user.serialize()
    }), 200


@api.route("/user/saved-events", methods=["GET"])
@jwt_required()
def get_my_saved_events():
    user = get_current_user()

    if user is None:
        return jsonify({"message": "User no encontrado"}), 404

    saved_events = db.session.execute(
        select(SavedEvent).where(SavedEvent.user_id == user.id)
    ).scalars().all()

    events = []

    for saved in saved_events:
        event = db.session.get(Event, saved.event_id)

        if event:
            events.append(event.serialize())

    return jsonify({
        "events": events
    }), 200


@api.route("/events/<int:event_id>/save", methods=["POST"])
@jwt_required()
def save_event_user(event_id):
    user = get_current_user()
    event = db.session.get(Event, event_id)

    if event is None:
        return jsonify({"message": "Evento no encontrado"}), 404

    existing = db.session.execute(
        select(SavedEvent).where(
            SavedEvent.user_id == user.id,
            SavedEvent.event_id == event_id
        )
    ).scalar_one_or_none()

    if existing:
        return jsonify({"message": "Este evento ya está guardado"}), 409

    saved_event = SavedEvent(
        user_id=user.id,
        event_id=event_id
    )

    db.session.add(saved_event)
    db.session.commit()

    return jsonify({
        "message": "Evento guardado correctamente"
    }), 201


@api.route("/events/<int:event_id>/save", methods=["DELETE"])
@jwt_required()
def unsave_event_user(event_id):
    user = get_current_user()

    saved_event = db.session.execute(
        select(SavedEvent).where(
            SavedEvent.user_id == user.id,
            SavedEvent.event_id == event_id
        )
    ).scalar_one_or_none()

    if saved_event is None:
        return jsonify({"message": "Evento guardado no encontrado"}), 404

    db.session.delete(saved_event)
    db.session.commit()

    return jsonify({
        "message": "Evento eliminado de guardados"
    }), 200


@api.route("/assisting-events", methods=["GET"])
@jwt_required()
def get_my_assisting_events():
    user = get_current_user()

    assists = db.session.execute(
        select(EventAssistUser).where(EventAssistUser.user_id == user.id)
    ).scalars().all()

    return jsonify({
        "events": [assist.event.serialize() for assist in assists if assist.event]
    }), 200


@api.route("/events/<int:event_id>/assist", methods=["POST"])
@jwt_required()
def assist_event_user(event_id):
    user = get_current_user()
    event = db.session.get(Event, event_id)

    if event is None:
        return jsonify({"message": "Evento no encontrado"}), 404

    existing = db.session.execute(
        select(EventAssistUser).where(
            EventAssistUser.user_id == user.id,
            EventAssistUser.event_id == event_id
        )
    ).scalar_one_or_none()

    if existing:
        return jsonify({"message": "Ya confirmaste asistencia a este evento"}), 409

    assist = EventAssistUser(
        user_id=user.id,
        event_id=event_id
    )

    db.session.add(assist)
    db.session.commit()

    return jsonify({
        "message": "Asistencia confirmada correctamente"
    }), 201


@api.route("/events/<int:event_id>/assist", methods=["DELETE"])
@jwt_required()
def cancel_assist_event_user(event_id):
    user = get_current_user()

    assist = db.session.execute(
        select(EventAssistUser).where(
            EventAssistUser.user_id == user.id,
            EventAssistUser.event_id == event_id
        )
    ).scalar_one_or_none()

    if assist is None:
        return jsonify({"message": "Asistencia no encontrada"}), 404

    db.session.delete(assist)
    db.session.commit()

    return jsonify({
        "message": "Asistencia cancelada correctamente"
    }), 200


@api.route("/events/<int:event_id>/comments", methods=["GET"])
def get_event_comments(event_id):
    event = db.session.get(Event, event_id)

    if event is None:
        return jsonify({"message": "Evento no encontrado"}), 404

    comments = db.session.execute(
        select(Comment).where(Comment.event_id == event_id)
    ).scalars().all()

    return jsonify({
        "comments": [comment.serialize() for comment in comments]
    }), 200


@api.route("/events/<int:event_id>/comments", methods=["POST"])
@jwt_required()
def create_event_comment_user(event_id):
    user = get_current_user()
    event = db.session.get(Event, event_id)
    body = request.get_json(silent=True)

    if event is None:
        return jsonify({"message": "Evento no encontrado"}), 404

    if body is None or not body.get("message"):
        return jsonify({"message": "El comentario es obligatorio"}), 400

    comment = Comment(
        message=body["message"],
        create_date=datetime.now(timezone.utc),
        user_id=user.id,
        event_id=event_id
    )

    db.session.add(comment)
    db.session.commit()

    return jsonify({
        "message": "Comentario creado correctamente",
        "comment": comment.serialize()
    }), 201


@api.route("/<int:friend_id>/add-friend", methods=["POST"])
@jwt_required()
def add_friend_user(friend_id):
    user = get_current_user()

    if user.id == friend_id:
        return jsonify({"message": "No puedes agregarte a ti mismo"}), 400

    friend_user = db.session.get(User, friend_id)

    if friend_user is None:
        return jsonify({"message": "Usuario no encontrado"}), 404

    existing = db.session.execute(
        select(Friend).where(
            Friend.user_id == user.id,
            Friend.friend_id == friend_id
        )
    ).scalar_one_or_none()

    if existing:
        return jsonify({"message": "Este usuario ya es tu amigo"}), 409

    friend = Friend(
        user_id=user.id,
        friend_id=friend_id
    )

    db.session.add(friend)
    db.session.commit()

    return jsonify({
        "message": "Amigo agregado correctamente"
    }), 201


@api.route("/friends", methods=["GET"])
@jwt_required()
def get_my_friends():
    user = get_current_user()

    friends = db.session.execute(
        select(Friend).where(Friend.user_id == user.id)
    ).scalars().all()

    return jsonify({
        "friends": [friend.serialize() for friend in friends]
    }), 200


@api.route("/chats", methods=["POST"])
@jwt_required()
def create_chat():
    current_user = get_current_user()

    if current_user is None:
        return jsonify({"message": "User no encontrado"}), 404

    data = request.get_json()
    promotor_id = data.get("promotor_id")

    if not promotor_id:
        return jsonify({"message": "promotor_id es requerido"}), 400

    promotor = db.session.get(Promotor, promotor_id)

    if promotor is None:
        return jsonify({"message": "Promotor no encontrado"}), 404

    existing_chat = db.session.execute(
        select(Chat).where(
            Chat.user_id == current_user.id,
            Chat.promotor_id == promotor_id
        )
    ).scalar_one_or_none()

    if existing_chat:
        return jsonify(existing_chat.serialize()), 200

    new_chat = Chat(
        user_id=current_user.id,
        promotor_id=promotor_id
    )

    db.session.add(new_chat)
    db.session.commit()

    return jsonify(new_chat.serialize()), 201


@api.route("/chats", methods=["GET"])
@jwt_required()
def get_chats():
    current_user = get_current_user()

    if current_user is None:
        return jsonify({"message": "User no encontrado"}), 404

    chats = db.session.execute(
        select(Chat).where(Chat.user_id == current_user.id)
    ).scalars().all()

    return jsonify([chat.serialize() for chat in chats]), 200


@api.route("/chats/<int:chat_id>/messages", methods=["GET"])
@jwt_required()
def get_chat_messages(chat_id):
    current_user = get_current_user()

    if current_user is None:
        return jsonify({"message": "User no encontrado"}), 404

    chat = db.session.get(Chat, chat_id)

    if chat is None:
        return jsonify({"message": "Chat no encontrado"}), 404

    if chat.user_id != current_user.id:
        return jsonify({"message": "No tienes permiso para este chat"}), 403

    messages = db.session.execute(
        select(Message)
        .where(Message.chat_id == chat.id)
        .order_by(Message.created_at.asc())
    ).scalars().all()

    return jsonify([message.serialize() for message in messages]), 200


@api.route("/chats/<int:chat_id>/messages", methods=["POST"])
@jwt_required()
def create_chat_message(chat_id):
    current_user = get_current_user()

    if current_user is None:
        return jsonify({"message": "User no encontrado"}), 404

    chat = db.session.get(Chat, chat_id)

    if chat is None:
        return jsonify({"message": "Chat no encontrado"}), 404

    if chat.user_id != current_user.id:
        return jsonify({"message": "No tienes permiso para este chat"}), 403

    data = request.get_json()
    text = data.get("text")

    if not text:
        return jsonify({"message": "text es requerido"}), 400

    message = Message(
        chat_id=chat.id,
        sender_type="user",
        sender_id=current_user.id,
        text=text
    )

    db.session.add(message)
    db.session.commit()

    return jsonify(message.serialize()), 201


@api.route("/event/event-promotor/<int:event_id>", methods=["GET"])
def get_event_promotor_by_id(event_id):
    promotor_relations = db.session.execute(
        select(EventPromotor).where(EventPromotor.event_id == event_id)
    ).scalars().all()

    if len(promotor_relations) == 0:
        return jsonify({"message": "No promotor found for this event"}), 404

    return jsonify({
        "relations": [relation.serialize() for relation in promotor_relations]
    }), 200
