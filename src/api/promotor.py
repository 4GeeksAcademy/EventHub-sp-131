from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Promotor
from sqlalchemy import select
from datetime import datetime, timezone
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

promotor = Blueprint('promotor', __name__,)

# // Promotor Auth

@promotor.route('promotor/login', methods=['POST'])
def login_promotor():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    promotors = db.session.execute(select(Promotor)).scalars().all()

    if email == None or password == None:
        return jsonify({"msg": "Bad email or password"}), 401
    for promot in promotors:
        print(email in promot.email)
        print(password)
        print(promot.password)
        print(password == promot.password)
        if email in promot.email and password == promot.password:
            access_token = create_access_token(identity=email)
            return jsonify(access_token=access_token), 200

    return jsonify({"msg": "Bad email or password"}), 401

@promotor.route('promotor/private', methods=['GET'])
@jwt_required()
def private_promotor():
    current_user_email = get_jwt_identity()
    promotDb = db.session.execute(select(Promotor).where(Promotor.email == current_user_email)).scalars().all()
    
    promot = db.session.get(Promotor, promotDb[0].id)

    return jsonify({
        "msg": "Token valid",
        "user": promot.serialize()
    }), 200

@promotor.route('/promotor/sign-in', methods=['GET'])
def hello():
    return jsonify({"message": "Bien"}), 200