"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Admin
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


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