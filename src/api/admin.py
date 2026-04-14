import os
import inspect
from flask_admin import Admin as FlaskAdmin
from flask_admin.contrib.sqla import ModelView
from flask_admin.theme import Bootstrap4Theme
from . import models
from .models import db


def setup_admin(app):
    app.secret_key = os.environ.get("FLASK_APP_KEY", "sample key")

    admin = FlaskAdmin(
        app,
        name="4Geeks Admin",
        theme=Bootstrap4Theme(swatch="cerulean")
    )

    for name, obj in inspect.getmembers(models):
        if inspect.isclass(obj) and issubclass(obj, db.Model) and obj is not db.Model:
            admin.add_view(
                ModelView(
                    obj,
                    db.session,
                    endpoint=f"{obj.__name__.lower()}_model"
                )
            )