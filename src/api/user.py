from flask import Flask, request, jsonify, url_for, Blueprint
from sqlalchemy import select
from datetime import datetime, timezone
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.routes import api
from api.models import (db, User, Event, Comment, SavedEvent, EventAssistUser, Group, Discussion, Friend)

user = Blueprint('user', __name__,)


@user.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Bien"}), 200

 # -----------------

def get_current_user():
    current_user_email = get_jwt_identity()

    user = db.session.execute(
        select(User).where(User.email == current_user_email)
    ).scalar_one_or_none()

    return user


@api.route("/user/me", methods=["GET"])
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

    saved_events = db.session.execute(
        select(SavedEvent).where(SavedEvent.user_id == user.id)
    ).scalars().all()

    return jsonify({
        "events": [saved.event.serialize() for saved in saved_events if saved.event]
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


@api.route("/user/assisting-events", methods=["GET"])
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


@api.route("/users/<int:friend_id>/add-friend", methods=["POST"])
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


@api.route("/user/friends", methods=["GET"])
@jwt_required()
def get_my_friends():
    user = get_current_user()

    friends = db.session.execute(
        select(Friend).where(Friend.user_id == user.id)
    ).scalars().all()

    return jsonify({
        "friends": [friend.serialize() for friend in friends]
    }), 200