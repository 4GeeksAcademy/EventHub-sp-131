"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from api.models import db, Event
from flask_cors import CORS
from sqlalchemy import select
from datetime import datetime

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/events", methods=["GET"])
def get_events():
    events = db.session.execute(select(Event)).scalars().all()

    return jsonify({
        "message": "Eventos obtenidos correctamente",
        "results": [event.serialize() for event in events]
    }), 200


@api.route("/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    event = db.session.get(Event, event_id)

    if event is None:
        return jsonify({"message": "Evento no encontrado"}), 404

    return jsonify({
        "message": "Evento obtenido correctamente",
        "results": event.serialize()
    }), 200


@api.route("/events", methods=["POST"])
def create_event():
    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    name = body.get("name")
    location = body.get("location")
    description = body.get("description")
    date_event_str = body.get("date_event")
    capacity = body.get("capacity")
    media = body.get("media")

    # VALIDACIONES
    if not name or not date_event_str:
        return jsonify({"message": "Name y date_event son obligatorios"}), 400

    # Validar fecha
    try:
        date_event = datetime.fromisoformat(date_event_str)
    except:
        return jsonify({"message": "Formato de fecha inválido"}), 400

    # Validar media
    if media and not media.startswith("http"):
        return jsonify({"message": "Media debe ser una URL válida"}), 400

    new_event = Event(
        name=name,
        location=location,
        description=description,
        date_event=date_event,
        capacity=capacity,
        media=media
    )

    db.session.add(new_event)
    db.session.commit()

    return jsonify({
        "message": "Evento creado correctamente",
        "results": new_event.serialize()
    }), 201


@api.route("/events/<int:event_id>", methods=["PUT"])
def update_event(event_id):
    event = db.session.get(Event, event_id)

    if event is None:
        return jsonify({"message": "Evento no encontrado"}), 404

    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    # CAMPOS NORMALES
    if "name" in body:
        event.name = body["name"]

    if "location" in body:
        event.location = body["location"]

    if "description" in body:
        event.description = body["description"]

    if "capacity" in body:
        event.capacity = body["capacity"]

    # FECHA
    if "date_event" in body:
        try:
            event.date_event = datetime.fromisoformat(body["date_event"])
        except:
            return jsonify({"message": "Formato de fecha inválido"}), 400

    # MEDIA
    if "media" in body:
        if body["media"] == "":
            event.media = None
        elif body["media"].startswith("http"):
            event.media = body["media"]
        else:
            return jsonify({"message": "Media debe ser una URL válida"}), 400

    db.session.commit()

    return jsonify({
        "message": "Evento actualizado correctamente",
        "results": event.serialize()
    }), 200


@api.route("/events/<int:event_id>", methods=["DELETE"])
def delete_event(event_id):
    event = db.session.get(Event, event_id)

    if event is None:
        return jsonify({"message": "Evento no encontrado"}), 404

    db.session.delete(event)
    db.session.commit()

    return jsonify({
        "message": "Evento eliminado correctamente"
    }), 200