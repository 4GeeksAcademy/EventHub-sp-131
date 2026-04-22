from flask import Flask, request, jsonify, url_for, Blueprint

admin = Blueprint('admin', __name__,)



@admin.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Bien"}), 200