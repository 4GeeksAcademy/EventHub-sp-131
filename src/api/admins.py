from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from sqlalchemy import select
from api.models import db, Admin


admins = Blueprint('admins', __name__)


@admins.route('/admin/login', methods=['POST'])
def login_admin():
    body = request.get_json()

    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"msg": "Email y password requeridos"}), 400

    admin = db.session.execute(
        select(Admin).where(Admin.email == email)
    ).scalar_one_or_none()

    if not admin:
        return jsonify({"msg": "Credenciales inválidas"}), 401

    if admin.password != password:
        return jsonify({"msg": "Credenciales inválidas"}), 401

    token = create_access_token(
    identity=str(admin.id),
    additional_claims={"role": "admin"}
    )

    return jsonify({
        "token": token,
        "admin": admin.serialize()
    }), 200


@admins.route('/admin/private', methods=['GET'])
@jwt_required()
def private_admin():
    admin_id = get_jwt_identity()

    admin = db.session.get(Admin, admin_id)

    if not admin:
        return jsonify({"msg": "Admin no encontrado"}), 404

    return jsonify({
        "msg": "Token válido",
        "admin": admin.serialize()
    }), 200


@admins.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Bien"}), 200