from flask import Flask, request, jsonify, url_for, Blueprint

user = Blueprint('user', __name__,)



@user.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Bien"}), 200