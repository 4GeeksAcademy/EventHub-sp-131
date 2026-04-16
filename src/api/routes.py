"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Admin, Promotor
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "The promotor has been created correctly",
        "promotor": promotor.serialize()
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


# // LEER TODOS LOS ADMINS //
@api.route("/admins", methods=["GET"])
def get_admins():
    admins = db.session.execute(
        select(Admin)).scalars().all()

    return jsonify({
        "message": "Admins obtenidos correctamente",
        "results": [admin.serialize() for admin in admins]
    }), 200


# // LEER UN ADMIN //
@api.route("/admins/<int:admin_id>", methods=["GET"])
def get_admin(admin_id):
    admin = db.session.get(Admin, admin_id)

    if admin is None:
        return jsonify({"message": "Admin no encontrado"}), 404

    return jsonify({
        "message": "Admin obtenido correctamente",
        "results": admin.serialize()
    }), 200


# // CREAR ADMIN //
@api.route("/admins", methods=["POST"])
def create_admin():
    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    email = body.get("email")
    password = body.get("password")
    is_active = body.get("is_active", True)

    if not email or not password:
        return jsonify({"message": "Los campos email y password son obligatorios"}), 400

    existing_user = db.session.execute(
        select(User).where(User.email == email)).scalar_one_or_none()
    if existing_user:
        return jsonify({"message": "Ya existe un usuario con ese email"}), 409

    new_user = User(
        email=email,
        password=password,
        is_active=is_active
    )

    db.session.add(new_user)
    db.session.commit()

    new_admin = Admin(user_id=new_user.id)

    db.session.add(new_admin)
    db.session.commit()

    return jsonify({
        "message": "Admin creado correctamente",
        "results": new_admin.serialize()
    }), 201


#  // EDITAR ADMIN //
@api.route("/admins/<int:admin_id>", methods=["PUT"])
def update_admin(admin_id):
    admin = db.session.get(Admin, admin_id)

    if admin is None:
        return jsonify({"message": "Admin no encontrado"}), 404

    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    if "email" in body:
        existing_user = User.query.filter(
            User.email == body["email"],
            User.id != admin.user_id
        ).first()

        if existing_user:
            return jsonify({"message": "Ese email ya está en uso"}), 409

        admin.user.email = body["email"]

    if "password" in body and body["password"]:
        admin.user.password = body["password"]

    if "is_active" in body:
        admin.user.is_active = body["is_active"]

    db.session.commit()

    return jsonify({
        "message": "Admin actualizado correctamente",
        "results": admin.serialize()
    }), 200


# // ELIMINAR ADMIN //
@api.route("/admins/<int:admin_id>", methods=["DELETE"])
def delete_admin(admin_id):
    admin = db.session.get(Admin, admin_id)

    if admin is None:
        return jsonify({"message": "Admin no encontrado"}), 404

    user = admin.user

    db.session.delete(admin)
    db.session.delete(user)
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

    if "password" not in body:
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