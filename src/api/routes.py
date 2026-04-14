"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200



#     //   CRUD DE ADMIN   //

#  // LEER UN ADMIN //
@api.route('/admins/<int:admin_id>', methods=['GET'])
def get_admin(admin_id):
    admin = User.query.filter_by(id=admin_id, role="admin").first()

    if admin is None:
        return jsonify({"message": "Admin no encontrado"}), 404

    return jsonify({
        "message": "Admin obtenido correctamente",
        "results": admin.serialize()
    }), 200


#  // CREAR ADMIN //
@api.route('/admins', methods=['POST'])
def create_admin():
    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    email = body.get("email")
    password = body.get("password")
    is_active = body.get("is_active", True)

    if not email or not password:
        return jsonify({"message": "Los campos email y password son obligatorios"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": "Ya existe un usuario con ese email"}), 409

    new_admin = User(
        email=email,
        password=password,
        is_active=is_active,
        role="admin"
    )

    db.session.add(new_admin)
    db.session.commit()

    return jsonify({
        "message": "Admin creado correctamente",
        "results": new_admin.serialize()
    }), 201


#  // EDITAR ADMIN //
@api.route('/admins/<int:admin_id>', methods=['PUT'])
def update_admin(admin_id):
    admin = User.query.filter_by(id=admin_id, role="admin").first()

    if admin is None:
        return jsonify({"message": "Admin no encontrado"}), 404

    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    if "email" in body:
        existing_user = User.query.filter(
            User.email == body["email"],
            User.id != admin_id
        ).first()

        if existing_user:
            return jsonify({"message": "Ese email ya está en uso"}), 409

        admin.email = body["email"]

    if "password" in body:
        admin.password = body["password"]

    if "is_active" in body:
        admin.is_active = body["is_active"]

    db.session.commit()

    return jsonify({
        "message": "Admin actualizado correctamente",
        "results": admin.serialize()
    }), 200


#  // ELIMINAR ADMIN //
@api.route('/admins/<int:admin_id>', methods=['DELETE'])
def delete_admin(admin_id):
    admin = User.query.filter_by(id=admin_id, role="admin").first()

    if admin is None:
        return jsonify({"message": "Admin no encontrado"}), 404

    db.session.delete(admin)
    db.session.commit()

    return jsonify({
        "message": "Admin eliminado correctamente"
    }), 200
