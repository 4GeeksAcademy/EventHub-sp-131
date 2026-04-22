from flask import Flask, request, jsonify, url_for, Blueprint

group = Blueprint('group', __name__,)



@group.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Bien"}), 200