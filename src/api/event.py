from flask import Flask, request, jsonify, url_for, Blueprint

event = Blueprint('event', __name__,)



@event.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Bien"}), 200