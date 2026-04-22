from flask import Flask, request, jsonify, url_for, Blueprint

promotor = Blueprint('promotor', __name__,)



@promotor.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Bien"}), 200