from flask import Flask, request, jsonify, url_for, Blueprint

admins = Blueprint('admins', __name__,)



@admins.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Bien"}), 200