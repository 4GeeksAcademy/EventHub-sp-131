from flask import Flask, request, jsonify, url_for, Blueprint

category = Blueprint('category', __name__,)



@category.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Bien"}), 200