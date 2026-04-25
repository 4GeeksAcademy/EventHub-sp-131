"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Admin, Promotor, Category, Event, Group, PromotorCategory, Friend, SavedEvent, Discussion, GroupCategory, UserCategory, Comment, EventCategory, GroupEvent, EventAssistUser, EventPromotor
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from datetime import datetime, timezone
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)


@api.route("/users", methods=["GET"])
def get_users():
    users = db.session.execute(select(User)).scalars().all()

    return jsonify([user.serialize() for user in users]), 200


@api.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = db.session.get(User, user_id)

    if user is None:
        return jsonify({"message": "User no encontrado"}), 404

    return jsonify({
        "message": "User obtenido correctamente",
        "results": user.serialize()
    }), 200


@api.route("/users", methods=["POST"])
def create_user():
    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    name = body.get("name")
    email = body.get("email")
    password = body.get("password")
    location = body.get("location")
    age = body.get("age")
    description = body.get("description")
    is_active = body.get("is_active", True)

    if not email or not password:
        return jsonify({"message": "Email y password son obligatorios"}), 400

    existing_user = db.session.execute(
        select(User).filter_by(email=email)
    ).scalar_one_or_none()

    if existing_user:
        return jsonify({"message": "Ya existe un usuario con ese email"}), 409

    new_user = User(
        name=name,
        email=email,
        password=password,
        location=location,
        age=age,
        description=description,
        is_active=is_active
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User creado correctamente",
        "results": new_user.serialize()
    }), 201


@api.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    user = db.session.get(User, user_id)

    if user is None:
        return jsonify({"message": "User no encontrado"}), 404

    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    if "email" in body:
        existing_user = db.session.execute(
            select(User).where(
                User.email == body["email"],
                User.id != user.id
            )
        ).scalar_one_or_none()

        if existing_user:
            return jsonify({"message": "Ese email ya está en uso"}), 409

        user.email = body["email"]

    if "password" in body and body["password"]:
        user.password = body["password"]

    if "name" in body:
        user.name = body["name"]

    if "location" in body:
        user.location = body["location"]

    if "age" in body:
        user.age = body["age"]

    if "description" in body:
        user.description = body["description"]

    if "is_active" in body:
        user.is_active = body["is_active"]

    db.session.commit()

    return jsonify({
        "message": "User actualizado correctamente",
        "results": user.serialize()
    }), 200


@api.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = db.session.get(User, user_id)

    if user is None:
        return jsonify({"message": "User no encontrado"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({
        "message": "User eliminado correctamente"
    }), 200

#  // CRUD ADMIN //

# LEER TODOS LOS ADMINS


@api.route("/admin-panel/admins", methods=["GET"])
def get_admins():
    admins = db.session.execute(
        select(Admin)
    ).scalars().all()

    return jsonify({
        "message": "Admins obtenidos correctamente",
        "results": [admin.serialize() for admin in admins]
    }), 200


# LEER UN ADMIN
@api.route("/admin-panel/admins/<int:admin_id>", methods=["GET"])
def get_admin(admin_id):
    admin = db.session.get(Admin, admin_id)

    if admin is None:
        return jsonify({"message": "Admin no encontrado"}), 404

    return jsonify({
        "message": "Admin obtenido correctamente",
        "results": admin.serialize()
    }), 200


# CREAR ADMIN
@api.route("/admin-panel/admins", methods=["POST"])
def create_admin():
    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    email = body.get("email")
    password = body.get("password")
    is_active = body.get("is_active", True)

    if not email or not password:
        return jsonify({"message": "Los campos email y password son obligatorios"}), 400

    existing_admin = db.session.execute(
        select(Admin).where(Admin.email == email)
    ).scalar_one_or_none()

    if existing_admin:
        return jsonify({"message": "Ya existe un admin con ese email"}), 409

    new_admin = Admin(
        email=email,
        password=password,
        is_active=is_active
    )

    db.session.add(new_admin)
    db.session.commit()

    return jsonify({
        "message": "Admin creado correctamente",
        "results": new_admin.serialize()
    }), 201


# EDITAR ADMIN
@api.route("/admin-panel/admins/<int:admin_id>", methods=["PUT"])
def update_admin(admin_id):
    admin = db.session.get(Admin, admin_id)

    if admin is None:
        return jsonify({"message": "Admin no encontrado"}), 404

    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    if "email" in body:
        existing_admin = db.session.execute(
            select(Admin).where(
                Admin.email == body["email"],
                Admin.id != admin_id
            )
        ).scalar_one_or_none()

        if existing_admin:
            return jsonify({"message": "Ese email ya está en uso"}), 409

        admin.email = body["email"]

    if "password" in body and body["password"]:
        admin.password = body["password"]

    if "is_active" in body:
        admin.is_active = body["is_active"]

    db.session.commit()

    return jsonify({
        "message": "Admin actualizado correctamente",
        "results": admin.serialize()
    }), 200


# ELIMINAR ADMIN
@api.route("/admin-panel/admins/<int:admin_id>", methods=["DELETE"])
def delete_admin(admin_id):
    admin = db.session.get(Admin, admin_id)

    if admin is None:
        return jsonify({"message": "Admin no encontrado"}), 404

    db.session.delete(admin)
    db.session.commit()

    return jsonify({
        "message": "Admin eliminado correctamente"
    }), 200


# // Promotors

@api.route('/promotor', methods=['GET'])
def get_promotor():
    promotors = db.session.execute(select(Promotor)).scalars().all()

    response_body = list(map(lambda promotor: promotor.serialize(), promotors))

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
        return jsonify("The username is invalid or missing"), 400

    if db.session.execute(select(Promotor).where(Promotor.email == body["email"])).scalar_one_or_none():
        return jsonify("The email is invalid or missing"), 400

    if db.session.execute(select(Promotor).where(Promotor.web_page == body["web_page"])).scalar_one_or_none():
        return jsonify("The web page is invalid or missing"), 400

    if db.session.execute(select(Promotor).where(Promotor.phone == body["phone"])).scalar_one_or_none():
        return jsonify("The phone is invalid or missing"), 400

    if "location" not in body or body["location"] == "":
        return jsonify("Location missing"), 400

    if "password" not in body or body["password"] == "":
        return jsonify("Password missing"), 400

    promotor = Promotor(**body, verified_org=False)

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

  #  // CATEGORY CRUD //


@api.route("/categories", methods=["GET"])
def get_categories():
    categories = db.session.execute(select(Category)).scalars().all()
    return jsonify([category.serialize() for category in categories]), 200


@api.route("/categories/<int:category_id>", methods=["GET"])
def get_category(category_id):
    category = db.session.execute(
        select(Category).where(Category.id == category_id)
    ).scalar_one_or_none()

    if category is None:
        return jsonify({"msg": "Category no encontrada"}), 404

    return jsonify(category.serialize()), 200


@api.route("/categories", methods=["POST"])
def create_category():
    body = request.get_json()

    if not body:
        return jsonify({"msg": "Debes enviar datos"}), 400

    name = body.get("name", "").strip()

    if name == "":
        return jsonify({"msg": "El campo name es obligatorio"}), 400

    existing_category = db.session.execute(
        select(Category).where(Category.name == name)
    ).scalar_one_or_none()

    if existing_category:
        return jsonify({"msg": "Ya existe una categoría con ese nombre"}), 400

    new_category = Category(name=name)
    db.session.add(new_category)
    db.session.commit()

    return jsonify({
        "msg": "Category creada correctamente",
        "category": new_category.serialize()
    }), 201


@api.route("/categories/<int:category_id>", methods=["PUT"])
def update_category(category_id):
    body = request.get_json()

    if not body:
        return jsonify({"msg": "Debes enviar datos"}), 400

    category = db.session.execute(
        select(Category).where(Category.id == category_id)
    ).scalar_one_or_none()

    if category is None:
        return jsonify({"msg": "Category no encontrada"}), 404

    name = body.get("name", "").strip()

    if name == "":
        return jsonify({"msg": "El campo name es obligatorio"}), 400

    repeated_category = db.session.execute(
        select(Category).where(Category.name ==
                               name, Category.id != category_id)
    ).scalar_one_or_none()

    if repeated_category:
        return jsonify({"msg": "Ya existe otra categoría con ese nombre"}), 400

    category.name = name
    db.session.commit()

    return jsonify({
        "msg": "Category actualizada correctamente",
        "category": category.serialize()
    }), 200


@api.route("/categories/<int:category_id>", methods=["DELETE"])
def delete_category(category_id):
    category = db.session.execute(
        select(Category).where(Category.id == category_id)
    ).scalar_one_or_none()

    if category is None:
        return jsonify({"msg": "Category no encontrada"}), 404

    db.session.delete(category)
    db.session.commit()

    return jsonify({"msg": "Category eliminada correctamente"}), 200


@api.route("/events", methods=["GET"])
def get_events():
    events = db.session.execute(select(Event)).scalars().all()

    return jsonify([event.serialize() for event in events]), 200


@api.route("/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    event = db.session.get(Event, event_id)

    if event is None:
        return jsonify({"message": "Evento no encontrado"}), 404

    return jsonify(event.serialize()), 200


@api.route("/events", methods=["POST"])
def create_event():
    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    name = body.get("name")
    location = body.get("location")
    description = body.get("description")
    date_event_str = body.get("date_event")
    capacity = body.get("capacity")
    media = body.get("media")

    # VALIDACIONES
    if not name or not date_event_str:
        return jsonify({"message": "Name y date_event son obligatorios"}), 400

    # Validar fecha
    try:
        date_event = datetime.fromisoformat(date_event_str)
    except:
        return jsonify({"message": "Formato de fecha inválido"}), 400

    # Validar media
    if media and not media.startswith("http"):
        return jsonify({"message": "Media debe ser una URL válida"}), 400

    new_event = Event(
        name=name,
        location=location,
        description=description,
        date_event=date_event,
        capacity=capacity,
        media=media
    )

    db.session.add(new_event)
    db.session.commit()

    return jsonify({
        "message": "Evento creado correctamente",
        "results": new_event.serialize()
    }), 201


@api.route("/events/<int:event_id>", methods=["PUT"])
def update_event(event_id):
    event = db.session.get(Event, event_id)

    if event is None:
        return jsonify({"message": "Evento no encontrado"}), 404

    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    # CAMPOS NORMALES
    if "name" in body:
        event.name = body["name"]

    if "location" in body:
        event.location = body["location"]

    if "description" in body:
        event.description = body["description"]

    if "capacity" in body:
        event.capacity = body["capacity"]

    # FECHA
    if "date_event" in body:
        try:
            event.date_event = datetime.fromisoformat(body["date_event"])
        except:
            return jsonify({"message": "Formato de fecha inválido"}), 400

    # MEDIA
    if "media" in body:
        if body["media"] == "":
            event.media = None
        elif body["media"].startswith("http"):
            event.media = body["media"]
        else:
            return jsonify({"message": "Media debe ser una URL válida"}), 400

    db.session.commit()

    return jsonify({
        "message": "Evento actualizado correctamente",
        "results": event.serialize()
    }), 200


@api.route("/events/<int:event_id>", methods=["DELETE"])
def delete_event(event_id):
    event = db.session.get(Event, event_id)

    if event is None:
        return jsonify({"message": "Evento no encontrado"}), 404

    db.session.delete(event)
    db.session.commit()

    return jsonify({
        "message": "Evento eliminado correctamente"
    }), 200

# // GROUPS


@api.route('/group', methods=['GET'])
def get_group():
    groups = db.session.execute(select(Group)).scalars().all()

    response_body = list(map(lambda group: group.serialize(), groups))

    return jsonify(response_body), 200


@api.route('/group/<int:position>', methods=['GET'])
def get_group_by_id(position):
    group = db.session.get(Group, position)

    if group == None:
        return jsonify("This group does not exist"), 404

    response_body = group.serialize()

    return jsonify(response_body), 200


@api.route('/group', methods=['POST'])
def create_group():

    body = request.json
    if db.session.execute(select(Group).where(Group.name == body["name"])).scalar_one_or_none():
        return jsonify("The name is invalid or missing"), 400

    if "location" not in body or body["location"] == "":
        return jsonify("Location missing"), 400

    group = Group(**body)

    db.session.add(group)
    db.session.commit()

    response_body = {
        "message": "The group has been created correctly",
        "group": group.serialize()
    }

    return jsonify(response_body), 200


@api.route('/group/<int:position>', methods=['PUT'])
def edit_group_by_id(position):

    group = db.session.get(Group, position)

    body = request.json

    if group == None:
        return jsonify("This group does not exist"), 404

    if "name" in body:
        group.name = body["name"]
    if "location" in body:
        group.location = body["location"]
    if "media" in body:
        group.media = body["media"]
    if "description" in body:
        group.description = body["description"]

    db.session.commit()

    response_body = group.serialize()

    return jsonify(response_body), 200


@api.route('/group/<int:position>', methods=['DELETE'])
def delete_group_by_id(position):

    group = db.session.get(Group, position)

    if group == None:
        return jsonify("This group does not exist"), 404

    db.session.delete(group)
    db.session.commit()

    response_body = {
        "message": "The group has been deleted correctly",
        "group": group.serialize()
    }

    return jsonify(response_body), 200

# // Comments

@api.route('/comments', methods=['GET'])
def get_comments():
    result = db.session.execute(db.select(Comment))
    comments = result.scalars().all()

    return jsonify([c.serialize() for c in comments]), 200

@api.route('/comments/<int:id>', methods=['GET'])
def get_comment(id):
    comment = db.session.get(Comment, id)

    if comment is None:
        return jsonify({"msg": "Comment not found"}), 404

    return jsonify(comment.serialize()), 200

@api.route('/comments', methods=['POST'])
def create_comment():
    body = request.json

    user = db.session.get(User, body.get("user_id"))
    event = db.session.get(Event, body.get("event_id"))

    if not user or not event:
        return jsonify({"msg": "Invalid user or event"}), 400

    new_comment = Comment(
        message=body["message"],
        create_date=datetime.now(timezone.utc),
        user_id=body["user_id"],
        event_id=body["event_id"]
    )

    db.session.add(new_comment)
    db.session.commit()

    return jsonify(new_comment.serialize()), 201

@api.route('/comments/<int:id>', methods=['PUT'])
def update_comment(id):
    comment = db.session.get(Comment, id)

    if comment is None:
        return jsonify({"msg": "Comment not found"}), 404

    body = request.json

    comment.message = body.get("message", comment.message)

    db.session.commit()

    return jsonify(comment.serialize()), 200

@api.route('/comments/<int:id>', methods=['DELETE'])
def delete_comment(id):
    comment = db.session.get(Comment, id)

    if comment is None:
        return jsonify({"msg": "Comment not found"}), 404

    db.session.delete(comment)
    db.session.commit()

    return jsonify({"msg": "Deleted"}), 200
# // FRIENDS

@api.route('/friend', methods=['GET'])
def get_friend():
    friends = db.session.execute(select(Friend)).scalars().all()

    response_body = list(map(lambda friend: friend.serialize(), friends))

    return jsonify(response_body), 200


@api.route('/friend/<int:position>', methods=['GET'])
def get_friend_by_id(position):
    friend = db.session.get(Friend, position)

    if friend == None:
        return jsonify("There are no friends entries"), 404

    response_body = friend.serialize()

    return jsonify(response_body), 200


@api.route('/friend', methods=['POST'])
def create_friend():

    body = request.json
    if "user_id" not in body or "friend_id" not in body:
        return jsonify("Please provide a usar ID and a friend ID")
    if body["user_id"] == "" or body["friend_id"] == "":
        return jsonify("Please provide a valid user and a friend ID"), 400
    if body["user_id"] == body["friend_id"]:
        return jsonify("A user cannot be friend with itself!"), 400
    
    if db.session.execute(select(User).where(User.id == body["user_id"])).scalar_one_or_none() == None:
        return jsonify("The user does not exist"), 400
    
    if db.session.execute(select(User).where(User.id == body["friend_id"])).scalar_one_or_none() == None:
        return jsonify("The user you're trying to add as freind does not exist"), 400


    friend = Friend(**body)

    db.session.add(friend)
    db.session.commit()

    response_body = {
        "message": "The friend has been created correctly",
        "friend": friend.serialize()
    }

    return jsonify(response_body), 200


@api.route('/friend/<int:position>', methods=['DELETE'])
def delete_friend_by_id(position):

    friend = db.session.get(Friend, position)

    if friend == None:
        return jsonify("This friend entry does not exist"), 404

    db.session.delete(friend)
    db.session.commit()

    response_body = {
        "message": "The friend entry has been deleted correctly",
        "friend": friend.serialize()
    }

    return jsonify(response_body), 200


    ## // Promotor-Category CRUD //

@api.route('/promotors', methods=['GET'])
def get_promotors():
    stmt = select(Promotor).order_by(Promotor.id)
    promotors = db.session.execute(stmt).scalars().all()
    return jsonify([promotor.serialize() for promotor in promotors]), 200


@api.route('/categories', methods=['GET'])
def get_all_categories():
    stmt = select(Category).order_by(Category.id)
    categories = db.session.execute(stmt).scalars().all()
    return jsonify([category.serialize() for category in categories]), 200


@api.route('/promotor-categories', methods=['GET'])
def get_promotor_categories():
    stmt = select(PromotorCategory).order_by(PromotorCategory.id)
    relations = db.session.execute(stmt).scalars().all()
    return jsonify([relation.serialize() for relation in relations]), 200


@api.route('/promotor-categories/<int:relation_id>', methods=['GET'])
def get_single_promotor_category(relation_id):
    relation = db.session.get(PromotorCategory, relation_id)

    if relation is None:
        return jsonify({"msg": "Relación no encontrada"}), 404

    return jsonify(relation.serialize()), 200


@api.route('/promotor-categories', methods=['POST'])
def create_promotor_category():
    body = request.get_json(silent=True)

    if not body:
        return jsonify({"msg": "Faltan datos"}), 400

    promotor_id = body.get("promotor_id")
    category_id = body.get("category_id")

    if promotor_id is None or category_id is None:
        return jsonify({"msg": "promotor_id y category_id son obligatorios"}), 400

    promotor = db.session.get(Promotor, promotor_id)
    category = db.session.get(Category, category_id)

    if promotor is None:
        return jsonify({"msg": "Promotor no encontrado"}), 404

    if category is None:
        return jsonify({"msg": "Categoría no encontrada"}), 404

    duplicate_stmt = select(PromotorCategory).where(
        PromotorCategory.promotor_id == promotor_id,
        PromotorCategory.category_id == category_id
    )
    duplicate_relation = db.session.execute(
        duplicate_stmt).scalar_one_or_none()

    if duplicate_relation is not None:
        return jsonify({"msg": "Esta relación ya existe"}), 400

    new_relation = PromotorCategory(
        promotor_id=promotor_id,
        category_id=category_id
    )

    db.session.add(new_relation)
    db.session.commit()
    db.session.refresh(new_relation)

    return jsonify(new_relation.serialize()), 201


@api.route('/promotor-categories/<int:relation_id>', methods=['PUT'])
def update_promotor_category(relation_id):
    relation = db.session.get(PromotorCategory, relation_id)

    if relation is None:
        return jsonify({"msg": "Relación no encontrada"}), 404

    body = request.get_json(silent=True)

    if not body:
        return jsonify({"msg": "Faltan datos"}), 400

    promotor_id = body.get("promotor_id")
    category_id = body.get("category_id")

    if promotor_id is None or category_id is None:
        return jsonify({"msg": "promotor_id y category_id son obligatorios"}), 400

    promotor = db.session.get(Promotor, promotor_id)
    category = db.session.get(Category, category_id)

    if promotor is None:
        return jsonify({"msg": "Promotor no encontrado"}), 404

    if category is None:
        return jsonify({"msg": "Categoría no encontrada"}), 404

    duplicate_stmt = select(PromotorCategory).where(
        PromotorCategory.promotor_id == promotor_id,
        PromotorCategory.category_id == category_id,
        PromotorCategory.id != relation_id
    )
    duplicate_relation = db.session.execute(
        duplicate_stmt).scalar_one_or_none()

    if duplicate_relation is not None:
        return jsonify({"msg": "Ya existe otra relación con esos datos"}), 400

    relation.promotor_id = promotor_id
    relation.category_id = category_id

    db.session.commit()
    db.session.refresh(relation)

    return jsonify(relation.serialize()), 200


@api.route('/promotor-categories/<int:relation_id>', methods=['DELETE'])
def delete_promotor_category(relation_id):
    relation = db.session.get(PromotorCategory, relation_id)

    if relation is None:
        return jsonify({"msg": "Relación no encontrada"}), 404

    db.session.delete(relation)
    db.session.commit()

    return jsonify({"msg": "Relación eliminada correctamente"}), 200

    
    # // DISCUSSIONS

@api.route('/discussion', methods=['GET'])
def get_discussion():
    discussions = db.session.execute(select(Discussion)).scalars().all()

    response_body = list(
        map(lambda discussion: discussion.serialize(), discussions))

    return jsonify(response_body), 200


@api.route('/discussion/<int:position>', methods=['GET'])
def get_discussion_by_id(position):
    discussion = db.session.get(Discussion, position)

    if discussion == None:
        return jsonify("There are no discussions entries"), 404

    response_body = discussion.serialize()

    return jsonify(response_body), 200


@api.route('/discussion', methods=['POST'])
def create_discussion():

    body = request.json
    if "user_id" not in body or "group_id" not in body:
        return jsonify("Please provide a user ID and a group ID")
    if body["user_id"] == "" or body["group_id"] == "":
        return jsonify("Please provide a valid user and a group ID"), 400

    if db.session.execute(select(User).where(User.id == body["user_id"])).scalar_one_or_none() == None:
        return jsonify("The user does not exist"), 400

    if db.session.execute(select(Group).where(Group.id == body["group_id"])).scalar_one_or_none() == None:
        return jsonify("The group does not exist"), 400

    discussion = Discussion(**body)

    db.session.add(discussion)
    db.session.commit()

    response_body = {
        "message": "The discussion has been created correctly",
        "discussion": discussion.serialize()
    }

    return jsonify(response_body), 200


@api.route('/discussion/<int:position>', methods=['DELETE'])
def delete_discussion_by_id(position):

    discussion = db.session.get(Discussion, position)

    if discussion == None:
        return jsonify("This discussion does not exist"), 404

    db.session.delete(discussion)
    db.session.commit()

    response_body = {
        "message": "The discussion entry has been deleted correctly",
        "discussion": discussion.serialize()
    }

    return jsonify(response_body), 200

# // SavedEvent


@api.route('/saved_event', methods=['GET'])
def get_saved_event():
    saved_event = db.session.execute(select(SavedEvent)).scalars().all()

    response_body = list(
        map(lambda discussion: discussion.serialize(), saved_event))

    return jsonify(response_body), 200


@api.route('/saved_event/<int:position>', methods=['GET'])
def get_saved_event_by_id(position):
    saved_event = db.session.get(SavedEvent, position)

    if saved_event == None:
        return jsonify("There are no saved_event entries"), 404

    response_body = saved_event.serialize()

    return jsonify(response_body), 200


@api.route('/saved_event', methods=['POST'])
def create_saved_event():

    body = request.json
    if "user_id" not in body or "event_id" not in body:
        return jsonify("Please provide a user ID and a event ID")
    if body["user_id"] == "" or body["event_id"] == "":
        return jsonify("Please provide a valid user and a event ID"), 400

    if db.session.execute(select(User).where(User.id == body["user_id"])).scalar_one_or_none() == None:
        return jsonify("The user does not exist"), 400

    if db.session.execute(select(Event).where(Event.id == body["event_id"])).scalar_one_or_none() == None:
        return jsonify("The event does not exist"), 400

    saved_event = SavedEvent(**body)

    db.session.add(saved_event)
    db.session.commit()

    response_body = {
        "message": "The saved event has been created correctly",
        "saved_event": saved_event.serialize()
    }

    return jsonify(response_body), 200


@api.route('/saved_event/<int:position>', methods=['DELETE'])
def delete_saved_event_by_id(position):

    saved_event = db.session.get(SavedEvent, position)

    if saved_event == None:
        return jsonify("This saved event does not exist"), 404

    db.session.delete(saved_event)
    db.session.commit()

    response_body = {
        "message": "The saved event entry has been deleted correctly",
        "saved_event": saved_event.serialize()
    }

    return jsonify(response_body), 200


# // UserCategory

@api.route('/user_category', methods=['GET'])
def get_user_category():
    user_categories = db.session.execute(select(UserCategory)).scalars().all()

    response_body = list(
        map(lambda user_category: user_category.serialize(), user_categories))

    return jsonify(response_body), 200


@api.route('/user_category/<int:position>', methods=['GET'])
def get_user_category_by_id(position):
    user_category = db.session.get(UserCategory, position)

    if user_category == None:
        return jsonify("There are no user categories entries"), 404

    response_body = user_category.serialize()

    return jsonify(response_body), 200


@api.route('/user_category', methods=['POST'])
def create_user_category():

    body = request.json
    if "user_id" not in body or "category_id" not in body:
        return jsonify("Please provide a user ID and a category ID"), 400
    
    if body["user_id"] == "" or body["category_id"] == "":
        return jsonify("Please provide a valid user and a category ID"), 400

    if db.session.execute(select(User).where(User.id == body["user_id"])).scalar_one_or_none() == None:
        return jsonify("The user does not exist"), 400

    if db.session.execute(select(Category).where(Category.id == body["category_id"])).scalar_one_or_none() == None:
        return jsonify("The category does not exist"), 400

    user_category = UserCategory(**body)

    db.session.add(user_category)
    db.session.commit()

    response_body = {
        "message": "The user category has been created correctly",
        "user_category": user_category.serialize()
    }

    return jsonify(response_body), 200


@api.route('/user_category/<int:position>', methods=['DELETE'])
def delete_user_category_by_id(position):

    user_category = db.session.get(UserCategory, position)

    if user_category == None:
        return jsonify("This saved event does not exist"), 404

    db.session.delete(user_category)
    db.session.commit()

    response_body = {
        "message": "The saved event entry has been deleted correctly",
        "user_category": user_category.serialize()
    }

    return jsonify(response_body), 200

# // GROUP-CATEGORY //

@api.route('/group-categories', methods=['GET'])
def get_group_categories():
    stmt = select(GroupCategory)
    result = db.session.execute(stmt).scalars().all()

    return jsonify([item.serialize() for item in result]), 200

@api.route('/group-categories/<int:id>', methods=['GET'])
def get_one_group_category(id):
    stmt = select(GroupCategory).where(GroupCategory.id == id)
    result = db.session.execute(stmt).scalar_one_or_none()

    if result is None:
        return jsonify({"message": "Relación no encontrada"}), 404

    return jsonify(result.serialize()), 200

@api.route('/group-categories', methods=['POST'])
def create_group_category():
    body = request.get_json()

    if body is None:
        return jsonify({"message": "Debes enviar un body"}), 400

    group_id = body.get("group_id")
    category_id = body.get("category_id")

    if group_id is None or category_id is None:
        return jsonify({"message": "group_id y category_id son obligatorios"}), 400

    stmt_group = select(Group).where(Group.id == group_id)
    group = db.session.execute(stmt_group).scalar_one_or_none()

    if group is None:
        return jsonify({"message": "El grupo no existe"}), 404

    
    stmt_category = select(Category).where(Category.id == category_id)
    category = db.session.execute(stmt_category).scalar_one_or_none()

    if category is None:
        return jsonify({"message": "La categoría no existe"}), 404

    
    stmt = select(GroupCategory).where(
        GroupCategory.group_id == group_id,
        GroupCategory.category_id == category_id
    )
    existing = db.session.execute(stmt).scalar_one_or_none()

    if existing:
        return jsonify({"message": "Esa relación ya existe"}), 409

    new_relation = GroupCategory(
        group_id=group_id,
        category_id=category_id
    )

    db.session.add(new_relation)
    db.session.commit()

    return jsonify({
        "message": "Relación creada",
        "data": new_relation.serialize()
    }), 201

@api.route('/group-categories/<int:id>', methods=['PUT'])
def update_group_category(id):
    stmt = select(GroupCategory).where(GroupCategory.id == id)
    relation = db.session.execute(stmt).scalar_one_or_none()

    if relation is None:
        return jsonify({"message": "Relación no encontrada"}), 404

    body = request.get_json()

    if body is None:
        return jsonify({"message": "Debes enviar un body"}), 400

    group_id = body.get("group_id")
    category_id = body.get("category_id")

    if group_id is None or category_id is None:
        return jsonify({"message": "group_id y category_id son obligatorios"}), 400

    
    stmt_group = select(Group).where(Group.id == group_id)
    group = db.session.execute(stmt_group).scalar_one_or_none()

    if group is None:
        return jsonify({"message": "El grupo no existe"}), 404

    
    stmt_category = select(Category).where(Category.id == category_id)
    category = db.session.execute(stmt_category).scalar_one_or_none()

    if category is None:
        return jsonify({"message": "La categoría no existe"}), 404

    
    stmt = select(GroupCategory).where(
        GroupCategory.group_id == group_id,
        GroupCategory.category_id == category_id,
        GroupCategory.id != id
    )
    existing = db.session.execute(stmt).scalar_one_or_none()

    if existing:
        return jsonify({"message": "Ya existe esa relación"}), 409

    relation.group_id = group_id
    relation.category_id = category_id

    db.session.commit()

    return jsonify({
        "message": "Relación actualizada",
        "data": relation.serialize()
    }), 200

@api.route('/group-categories/<int:id>', methods=['DELETE'])
def delete_group_category(id):
    stmt = select(GroupCategory).where(GroupCategory.id == id)
    relation = db.session.execute(stmt).scalar_one_or_none()

    if relation is None:
        return jsonify({"message": "Relación no encontrada"}), 404

    db.session.delete(relation)
    db.session.commit()

    return jsonify({"message": "Relación eliminada"}), 200

#  // Group-event //
@api.route("/group-event", methods=["GET"])
def get_all_group_event():
    stmt = select(GroupEvent)
    group_events = db.session.execute(stmt).scalars().all()
    return jsonify([item.serialize() for item in group_events]), 200

@api.route("/group-event/<int:id>", methods=["GET"])
def get_one_group_event(id):
    stmt = select(GroupEvent).where(GroupEvent.id == id)
    group_event = db.session.execute(stmt).scalar_one_or_none()

    if group_event is None:
        return jsonify({"msg": "Relacion no encontrada"}), 404

    return jsonify(group_event.serialize()), 200

@api.route("/group-event", methods=["POST"])
def create_group_event():
    body = request.get_json()

    if not body:
        return jsonify({"msg": "Debes enviar datos"}), 400

    group_id = body.get("group_id")
    event_id = body.get("event_id")

    if group_id is None or event_id is None:
        return jsonify({"msg": "group_id y event_id son obligatorios"}), 400

    stmt_duplicate = select(GroupEvent).where(
        GroupEvent.group_id == group_id,
        GroupEvent.event_id == event_id
    )
    duplicate = db.session.execute(stmt_duplicate).scalar_one_or_none()

    if duplicate:
        return jsonify({"msg": "Esta relacion ya existe"}), 409

    new_group_event = GroupEvent(
        group_id=group_id,
        event_id=event_id
    )

    db.session.add(new_group_event)
    db.session.commit()

    return jsonify(new_group_event.serialize()), 201

@api.route("/group-event/<int:id>", methods=["PUT"])
def update_group_event(id):
    stmt = select(GroupEvent).where(GroupEvent.id == id)
    group_event = db.session.execute(stmt).scalar_one_or_none()

    if group_event is None:
        return jsonify({"msg": "Relacion no encontrada"}), 404

    body = request.get_json()

    if not body:
        return jsonify({"msg": "Debes enviar datos"}), 400

    group_id = body.get("group_id")
    event_id = body.get("event_id")

    if group_id is None or event_id is None:
        return jsonify({"msg": "group_id y event_id son obligatorios"}), 400

    stmt_duplicate = select(GroupEvent).where(
        GroupEvent.group_id == group_id,
        GroupEvent.event_id == event_id,
        GroupEvent.id != id
    )
    duplicate = db.session.execute(stmt_duplicate).scalar_one_or_none()

    if duplicate:
        return jsonify({"msg": "Ya existe otra relacion con esos datos"}), 409

    group_event.group_id = group_id
    group_event.event_id = event_id

    db.session.commit()

    return jsonify(group_event.serialize()), 200

@api.route("/group-event/<int:id>", methods=["DELETE"])
def delete_group_event(id):
    stmt = select(GroupEvent).where(GroupEvent.id == id)
    group_event = db.session.execute(stmt).scalar_one_or_none()

    if group_event is None:
        return jsonify({"msg": "Relacion no encontrada"}), 404

    db.session.delete(group_event)
    db.session.commit()

    return jsonify({"msg": "Relacion eliminada correctamente"}), 200
# // EventCategory

@api.route('/event_category', methods=['GET'])
def get_event_category():
    event_categories = db.session.execute(select(EventCategory)).scalars().all()

    response_body = list(
        map(lambda event_category: event_category.serialize(), event_categories))

    return jsonify(response_body), 200


@api.route('/event_category/<int:position>', methods=['GET'])
def get_event_category_by_id(position):
    event_category = db.session.get(EventCategory, position)

    if event_category == None:
        return jsonify("There are no event categories entries"), 404

    response_body = event_category.serialize()

    return jsonify(response_body), 200


@api.route('/event_category', methods=['POST'])
def create_event_category():

    body = request.json
    if "event_id" not in body or "category_id" not in body:
        return jsonify("Please provide a event ID and a category ID"), 400
    
    if body["event_id"] == "" or body["category_id"] == "":
        return jsonify("Please provide a valid event and a category ID"), 400

    if db.session.execute(select(Event).where(Event.id == body["event_id"])).scalar_one_or_none() == None:
        return jsonify("The event does not exist"), 400

    if db.session.execute(select(Category).where(Category.id == body["category_id"])).scalar_one_or_none() == None:
        return jsonify("The category does not exist"), 400

    event_category = EventCategory(**body)

    db.session.add(event_category)
    db.session.commit()

    response_body = {
        "message": "The event category has been created correctly",
        "event_category": event_category.serialize()
    }

    return jsonify(response_body), 200


@api.route('/event_category/<int:position>', methods=['DELETE'])
def delete_event_category_by_id(position):

    event_category = db.session.get(EventCategory, position)

    if event_category == None:
        return jsonify("This event category does not exist"), 404

    db.session.delete(event_category)
    db.session.commit()

    response_body = {
        "message": "The event category has been deleted correctly",
        "event_category": event_category.serialize()
    }

    return jsonify(response_body), 200


# // CRUD EventPromotor

@api.route("/event-promotor", methods=["GET"])
def get_event_promotors():
    relations = db.session.execute(select(EventPromotor)).scalars().all()

    return jsonify([r.serialize() for r in relations]), 200

@api.route("/event-promotor/<int:id>", methods=["GET"])
def get_event_promotor(id):
    relation = db.session.get(EventPromotor, id)

    if relation is None:
        return jsonify({"message": "Relación no encontrada"}), 404

    return jsonify({
        "message": "Relación obtenida correctamente",
        "results": relation.serialize()
    }), 200

@api.route("/event-promotor", methods=["POST"])
def create_event_promotor():
    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    promotor_id = body.get("promotor_id")
    event_id = body.get("event_id")

    if not promotor_id or not event_id:
        return jsonify({"message": "promotor_id y event_id son obligatorios"}), 400

    # validar existencia
    promotor = db.session.get(Promotor, promotor_id)
    event = db.session.get(Event, event_id)

    if not promotor or not event:
        return jsonify({"message": "Promotor o Event no existen"}), 404

    # evitar duplicados
    existing = db.session.execute(
        select(EventPromotor).where(
            EventPromotor.promotor_id == promotor_id,
            EventPromotor.event_id == event_id
        )
    ).scalar_one_or_none()

    if existing:
        return jsonify({"message": "La relación ya existe"}), 409

    new_relation = EventPromotor(
        promotor_id=promotor_id,
        event_id=event_id
    )

    db.session.add(new_relation)
    db.session.commit()

    return jsonify({
        "message": "Relación creada correctamente",
        "results": new_relation.serialize()
    }), 201

@api.route("/event-promotor/<int:id>", methods=["PUT"])
def update_event_promotor(id):
    relation = db.session.get(EventPromotor, id)

    if relation is None:
        return jsonify({"message": "Relación no encontrada"}), 404

    body = request.get_json(silent=True)

    if body is None:
        return jsonify({"message": "Debes enviar un JSON válido"}), 400

    if "promotor_id" in body:
        promotor = db.session.get(Promotor, body["promotor_id"])
        if not promotor:
            return jsonify({"message": "Promotor no válido"}), 404
        relation.promotor_id = body["promotor_id"]

    if "event_id" in body:
        event = db.session.get(Event, body["event_id"])
        if not event:
            return jsonify({"message": "Event no válido"}), 404
        relation.event_id = body["event_id"]

    db.session.commit()

    return jsonify({
        "message": "Relación actualizada correctamente",
        "results": relation.serialize()
    }), 200

@api.route("/event-promotor/<int:id>", methods=["DELETE"])
def delete_event_promotor(id):
    relation = db.session.get(EventPromotor, id)

    if relation is None:
        return jsonify({"message": "Relación no encontrada"}), 404

    db.session.delete(relation)
    db.session.commit()

    return jsonify({
        "message": "Relación eliminada correctamente"
    }), 200

  # // USER -LOGIN //

@api.route('user/login', methods=['POST'])
def login_user():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    users = db.session.execute(select(User)).scalars().all()

    if email is None or password is None:
        return jsonify({"msg": "Bad email or password"}), 401

    for user in users:
        print(email == user.email)
        print(password)
        print(user.password)
        print(password == user.password)

        if email == user.email and password == user.password:
            access_token = create_access_token(identity=email)
            return jsonify({
                "token": access_token,
                "user": user.serialize()
            }), 200

    return jsonify({"msg": "Bad email or password"}), 401

@api.route('user/private', methods=['GET'])
@jwt_required()
def private_user():
    current_user_email = get_jwt_identity()

    userDb = db.session.execute(
        select(User).where(User.email == current_user_email)
    ).scalars().all()

    user = db.session.get(User, userDb[0].id)

    return jsonify({
        "msg": "Token valid",
        "user": user.serialize()
    }), 200


# // EventAssisUser

@api.route("/event-assists", methods=["GET"])
def get_event_assists():
    stmt = select(EventAssistUser)
    assists = db.session.execute(stmt).scalars().all()

    return jsonify([
        {
            "id": a.id,
            "user_id": a.user_id,
            "event_id": a.event_id,
            "user_name": a.user.name if a.user else None,
            "event_name": a.event.name if a.event else None
        }
        for a in assists
    ]), 200

@api.route("/event-assists/<int:assist_id>", methods=["GET"])
def get_event_assist(assist_id):
    stmt = select(EventAssistUser).where(EventAssistUser.id == assist_id)
    assist = db.session.execute(stmt).scalar_one_or_none()

    if not assist:
        return jsonify({"error": "Assist not found"}), 404

    return jsonify({
        "id": assist.id,
        "user_name": assist.user.name if assist.user else None,
        "event_name": assist.event.name if assist.event else None
    }), 200

@api.route("/event-assists", methods=["POST"])
def create_event_assist():
    data = request.get_json()

    user_id = data.get("user_id")
    event_id = data.get("event_id")

    # validar existencia
    user = db.session.get(User, user_id)
    event = db.session.get(Event, event_id)

    if not user or not event:
        return jsonify({"error": "User or Event not found"}), 404

    # evitar duplicados
    stmt = select(EventAssistUser).where(
        EventAssistUser.user_id == user_id,
        EventAssistUser.event_id == event_id
    )
    existing = db.session.execute(stmt).scalar_one_or_none()

    if existing:
        return jsonify({"error": "User already assigned to this event"}), 400

    assist = EventAssistUser(
        user_id=user_id,
        event_id=event_id
    )

    db.session.add(assist)
    db.session.commit()

    return jsonify({
        "id": assist.id,
        "user_name": user.name,
        "event_name": event.name
    }), 201

@api.route("/event-assists/<int:assist_id>", methods=["DELETE"])
def delete_event_assist(assist_id):
    assist = db.session.get(EventAssistUser, assist_id)

    if not assist:
        return jsonify({"error": "Assist not found"}), 404

    db.session.delete(assist)
    db.session.commit()

    return jsonify({"message": "Deleted successfully"}), 200

