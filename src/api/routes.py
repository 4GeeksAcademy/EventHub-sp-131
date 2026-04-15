"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Promotor
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/promotor', methods=['GET'])
def get_promotor():
    promotors = db.session.execute(select(Promotor)).scalars().all()

    response_body = list(map(lambda promotor: promotor.serialize(),promotors))

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
        return jsonify("The username is invalid or missing"),400
    
    if db.session.execute(select(Promotor).where(Promotor.email == body["email"])).scalar_one_or_none():
        return jsonify("The email is invalid or missing"),400
    
    if db.session.execute(select(Promotor).where(Promotor.web_page == body["web_page"])).scalar_one_or_none():
        return jsonify("The web page is invalid or missing"),400
    
    if db.session.execute(select(Promotor).where(Promotor.phone == body["phone"])).scalar_one_or_none():
        return jsonify("The phone is invalid or missing"),400
            
    if "password" not in body:
        return jsonify("Password missing"),400

    promotor = Promotor(**body, verified_org = False)

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