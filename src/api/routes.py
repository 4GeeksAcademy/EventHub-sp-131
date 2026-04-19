"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Admin, Promotor, Category, Group, Friend
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from datetime import datetime

api = Blueprint('api', __name__)




@api.route("/users", methods=["GET"])
def get_users():
    users = db.session.execute(select(User)).scalars().all()

    return jsonify({
        "message": "Users obtenidos correctamente",
        "results": [user.serialize() for user in users]
    }), 200


@api.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = db.session.get(User, user_id)

    if user is None:
        return jsonify({"message": "User no encontrado"}), 404

    return jsonify({
        "message": "User obtenido correctamente",
        "results": user.serialize()
    }), 200


@api.route("/users", methods=["POST"])
def create_user():
    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    name = body.get("name")
    email = body.get("email")
    password = body.get("password")
    location = body.get("location")
    age = body.get("age")
    description = body.get("description")
    is_active = body.get("is_active", True)

    if not email or not password:
        return jsonify({"message": "Email y password son obligatorios"}), 400

    existing_user = db.session.execute(
        select(User).filter_by(email=email)
    ).scalar_one_or_none()

    if existing_user:
        return jsonify({"message": "Ya existe un usuario con ese email"}), 409

    new_user = User(
        name=name,
        email=email,
        password=password,
        location=location,
        age=age,
        description=description,
        is_active=is_active
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User creado correctamente",
        "results": new_user.serialize()
    }), 201


@api.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    user = db.session.get(User, user_id)

    if user is None:
        return jsonify({"message": "User no encontrado"}), 404

    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    if "email" in body:
        existing_user = db.session.execute(
            select(User).where(
                User.email == body["email"],
                User.id != user.id
            )
        ).scalar_one_or_none()

        if existing_user:
            return jsonify({"message": "Ese email ya está en uso"}), 409

        user.email = body["email"]

    if "password" in body and body["password"]:
        user.password = body["password"]

    if "name" in body:
        user.name = body["name"]

    if "location" in body:
        user.location = body["location"]

    if "age" in body:
        user.age = body["age"]

    if "description" in body:
        user.description = body["description"]

    if "is_active" in body:
        user.is_active = body["is_active"]

    db.session.commit()

    return jsonify({
        "message": "User actualizado correctamente",
        "results": user.serialize()
    }), 200


@api.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = db.session.get(User, user_id)

    if user is None:
        return jsonify({"message": "User no encontrado"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({
        "message": "User eliminado correctamente"
    }), 200

#  // CRUD ADMIN //

# LEER TODOS LOS ADMINS


@api.route("/admin-panel/admins", methods=["GET"])
def get_admins():
    admins = db.session.execute(
        select(Admin)
    ).scalars().all()

    return jsonify({
        "message": "Admins obtenidos correctamente",
        "results": [admin.serialize() for admin in admins]
    }), 200


# LEER UN ADMIN
@api.route("/admin-panel/admins/<int:admin_id>", methods=["GET"])
def get_admin(admin_id):
    admin = db.session.get(Admin, admin_id)

    if admin is None:
        return jsonify({"message": "Admin no encontrado"}), 404

    return jsonify({
        "message": "Admin obtenido correctamente",
        "results": admin.serialize()
    }), 200


# CREAR ADMIN
@api.route("/admin-panel/admins", methods=["POST"])
def create_admin():
    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    email = body.get("email")
    password = body.get("password")
    is_active = body.get("is_active", True)

    if not email or not password:
        return jsonify({"message": "Los campos email y password son obligatorios"}), 400

    existing_admin = db.session.execute(
        select(Admin).where(Admin.email == email)
    ).scalar_one_or_none()

    if existing_admin:
        return jsonify({"message": "Ya existe un admin con ese email"}), 409

    new_admin = Admin(
        email=email,
        password=password,
        is_active=is_active
    )

    db.session.add(new_admin)
    db.session.commit()

    return jsonify({
        "message": "Admin creado correctamente",
        "results": new_admin.serialize()
    }), 201


# EDITAR ADMIN
@api.route("/admin-panel/admins/<int:admin_id>", methods=["PUT"])
def update_admin(admin_id):
    admin = db.session.get(Admin, admin_id)

    if admin is None:
        return jsonify({"message": "Admin no encontrado"}), 404

    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    if "email" in body:
        existing_admin = db.session.execute(
            select(Admin).where(
                Admin.email == body["email"],
                Admin.id != admin_id
            )
        ).scalar_one_or_none()

        if existing_admin:
            return jsonify({"message": "Ese email ya está en uso"}), 409

        admin.email = body["email"]

    if "password" in body and body["password"]:
        admin.password = body["password"]

    if "is_active" in body:
        admin.is_active = body["is_active"]

    db.session.commit()

    return jsonify({
        "message": "Admin actualizado correctamente",
        "results": admin.serialize()
    }), 200


# ELIMINAR ADMIN
@api.route("/admin-panel/admins/<int:admin_id>", methods=["DELETE"])
def delete_admin(admin_id):
    admin = db.session.get(Admin, admin_id)

    if admin is None:
        return jsonify({"message": "Admin no encontrado"}), 404

    db.session.delete(admin)
    db.session.commit()

    return jsonify({
        "message": "Admin eliminado correctamente"
    }), 200


# // Promotors

@api.route('/promotor', methods=['GET'])
def get_promotor():
    promotors = db.session.execute(select(Promotor)).scalars().all()

    response_body = list(map(lambda promotor: promotor.serialize(), promotors))

    return jsonify(response_body), 200


@api.route('/promotor/<int:position>', methods=['GET'])
def get_promotor_by_id(position):
    promotor = db.session.get(Promotor, position)

    if promotor == None:
        return jsonify("This person does not exist"), 404

    response_body = promotor.serialize()

    return jsonify(response_body), 200


@api.route('/promotor', methods=['POST'])
def create_promotor():

    body = request.json
    if db.session.execute(select(Promotor).where(Promotor.name == body["name"])).scalar_one_or_none():
        return jsonify("The username is invalid or missing"), 400

    if db.session.execute(select(Promotor).where(Promotor.email == body["email"])).scalar_one_or_none():
        return jsonify("The email is invalid or missing"), 400

    if db.session.execute(select(Promotor).where(Promotor.web_page == body["web_page"])).scalar_one_or_none():
        return jsonify("The web page is invalid or missing"), 400

    if db.session.execute(select(Promotor).where(Promotor.phone == body["phone"])).scalar_one_or_none():
        return jsonify("The phone is invalid or missing"), 400

    if "location" not in body or body["location"] == "":
        return jsonify("Location missing"), 400
    
    if "password" not in body or body["password"] == "":
        return jsonify("Password missing"), 400

    promotor = Promotor(**body, verified_org=False)

    db.session.add(promotor)
    db.session.commit()

    response_body = {
        "message": "The promotor has been created correctly",
        "promotor": promotor.serialize()
    }

    return jsonify(response_body), 200


@api.route('/promotor/<int:position>', methods=['PUT'])
def edit_promotor_by_id(position):

    promotor = db.session.get(Promotor, position)

    body = request.json

    if promotor == None:
        return jsonify("This person does not exist"), 404

    if "name" in body:
        promotor.name = body["name"]
    if "emailpassword" in body:
        promotor.email = body["email"]
    if "password" in body:
        promotor.password = body["password"]
    if "location" in body:
        promotor.location = body["location"]
    if "phone" in body:
        promotor.phone = body["phone"]
    if "web_page" in body:
        promotor.web_page = body["web_page"]

    db.session.commit()

    response_body = promotor.serialize()

    return jsonify(response_body), 200


@api.route('/promotor/<int:position>', methods=['DELETE'])
def delete_promotor_by_id(position):

    promotor = db.session.get(Promotor, position)

    if promotor == None:
        return jsonify("This person does not exist"), 404

    db.session.delete(promotor)
    db.session.commit()

    response_body = {
        "message": "The promotor has been deleted correctly",
        "promotor": promotor.serialize()
    }

    return jsonify(response_body), 200

  #  // CATEGORY CRUD //


@api.route("/categories", methods=["GET"])
def get_categories():
    categories = db.session.execute(select(Category)).scalars().all()
    return jsonify([category.serialize() for category in categories]), 200


@api.route("/categories/<int:category_id>", methods=["GET"])
def get_category(category_id):
    category = db.session.execute(
        select(Category).where(Category.id == category_id)
    ).scalar_one_or_none()

    if category is None:
        return jsonify({"msg": "Category no encontrada"}), 404

    return jsonify(category.serialize()), 200


@api.route("/categories", methods=["POST"])
def create_category():
    body = request.get_json()

    if not body:
        return jsonify({"msg": "Debes enviar datos"}), 400

    name = body.get("name", "").strip()

    if name == "":
        return jsonify({"msg": "El campo name es obligatorio"}), 400

    existing_category = db.session.execute(
        select(Category).where(Category.name == name)
    ).scalar_one_or_none()

    if existing_category:
        return jsonify({"msg": "Ya existe una categoría con ese nombre"}), 400

    new_category = Category(name=name)
    db.session.add(new_category)
    db.session.commit()

    return jsonify({
        "msg": "Category creada correctamente",
        "category": new_category.serialize()
    }), 201


@api.route("/categories/<int:category_id>", methods=["PUT"])
def update_category(category_id):
    body = request.get_json()

    if not body:
        return jsonify({"msg": "Debes enviar datos"}), 400

    category = db.session.execute(
        select(Category).where(Category.id == category_id)
    ).scalar_one_or_none()

    if category is None:
        return jsonify({"msg": "Category no encontrada"}), 404

    name = body.get("name", "").strip()

    if name == "":
        return jsonify({"msg": "El campo name es obligatorio"}), 400

    repeated_category = db.session.execute(
        select(Category).where(Category.name ==
                               name, Category.id != category_id)
    ).scalar_one_or_none()

    if repeated_category:
        return jsonify({"msg": "Ya existe otra categoría con ese nombre"}), 400

    category.name = name
    db.session.commit()

    return jsonify({
        "msg": "Category actualizada correctamente",
        "category": category.serialize()
    }), 200


@api.route("/categories/<int:category_id>", methods=["DELETE"])
def delete_category(category_id):
    category = db.session.execute(
        select(Category).where(Category.id == category_id)
    ).scalar_one_or_none()

    if category is None:
        return jsonify({"msg": "Category no encontrada"}), 404

    db.session.delete(category)
    db.session.commit()

    return jsonify({"msg": "Category eliminada correctamente"}), 200



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

# // GROUPS

@api.route('/group', methods=['GET'])
def get_group():
    groups = db.session.execute(select(Group)).scalars().all()

    response_body = list(map(lambda group: group.serialize(), groups))

    return jsonify(response_body), 200


@api.route('/group/<int:position>', methods=['GET'])
def get_group_by_id(position):
    group = db.session.get(Group, position)

    if group == None:
        return jsonify("This group does not exist"), 404

    response_body = group.serialize()

    return jsonify(response_body), 200


@api.route('/group', methods=['POST'])
def create_group():

    body = request.json
    if db.session.execute(select(Group).where(Group.name == body["name"])).scalar_one_or_none():
        return jsonify("The name is invalid or missing"), 400

    if "location" not in body or body["location"] == "":
        return jsonify("Location missing"), 400

    group = Group(**body)

    db.session.add(group)
    db.session.commit()

    response_body = {
        "message": "The group has been created correctly",
        "group": group.serialize()
    }

    return jsonify(response_body), 200


@api.route('/group/<int:position>', methods=['PUT'])
def edit_group_by_id(position):

    group = db.session.get(Group, position)

    body = request.json

    if group == None:
        return jsonify("This group does not exist"), 404

    if "name" in body:
        group.name = body["name"]
    if "location" in body:
        group.location = body["location"]
    if "media" in body:
        group.media = body["media"]
    if "description" in body:
        group.description = body["description"]

    db.session.commit()

    response_body = group.serialize()

    return jsonify(response_body), 200


@api.route('/group/<int:position>', methods=['DELETE'])
def delete_group_by_id(position):

    group = db.session.get(Group, position)

    if group == None:
        return jsonify("This group does not exist"), 404

    db.session.delete(group)
    db.session.commit()

    response_body = {
        "message": "The group has been deleted correctly",
        "group": group.serialize()
    }

    return jsonify(response_body), 200


# // FRIENDS

@api.route('/friend', methods=['GET'])
def get_friend():
    friends = db.session.execute(select(Friend)).scalars().all()

    response_body = list(map(lambda friend: friend.serialize(), friends))

    return jsonify(response_body), 200


@api.route('/friend/<int:position>', methods=['GET'])
def get_friend_by_id(position):
    friend = db.session.get(Friend, position)

    if friend == None:
        return jsonify("There are no friends entries"), 404

    response_body = friend.serialize()

    return jsonify(response_body), 200


@api.route('/friend', methods=['POST'])
def create_friend():

    body = request.json
    if "user_id" not in body or "friend_id" not in body:
        return jsonify("Please provide a usar ID and a friend ID")
    if body["user_id"] == "" or body["friend_id"] == "":
        return jsonify("Please provide a valid user and a friend ID"), 400
    if body["user_id"] == body["friend_id"]:
        return jsonify("A user cannot be friend with itself!"), 400
    
    if db.session.execute(select(User).where(User.id == body["user_id"])).scalar_one_or_none() == None:
        return jsonify("The user does not exist"), 400
    
    if db.session.execute(select(User).where(User.id == body["friend_id"])).scalar_one_or_none() == None:
        return jsonify("The user you're trying to add as freind does not exist"), 400


    friend = Friend(**body)

    db.session.add(friend)
    db.session.commit()

    response_body = {
        "message": "The friend has been created correctly",
        "friend": friend.serialize()
    }

    return jsonify(response_body), 200


@api.route('/friend/<int:position>', methods=['DELETE'])
def delete_friend_by_id(position):

    friend = db.session.get(Friend, position)

    if friend == None:
        return jsonify("This friend entry does not exist"), 404

    db.session.delete(friend)
    db.session.commit()

    response_body = {
        "message": "The friend entry has been deleted correctly",
        "friend": friend.serialize()
    }

    return jsonify(response_body), 200


