import click
import random
from sqlalchemy import select, func
from api.models import db, User, Admin, Promotor, Category, Event, Group, PromotorCategory, Friend, SavedEvent, Discussion, GroupCategory, UserCategory, Comment, EventCategory, GroupEvent, EventAssistUser, EventPromotor

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""


def get_next_id(model):
    """Devuelve el siguiente ID disponible para un modelo dado."""
    max_id = db.session.execute(select(func.max(model.id))).scalar()
    return (max_id or 0) + 1


def relation_exists(model, **kwargs):
    """Comprueba si ya existe una relación con los campos dados."""
    return db.session.execute(select(model).filter_by(**kwargs)).scalar() is not None


def setup_commands(app):

    @app.cli.command("insert-test-users")
    @click.argument("count")
    def insert_test_users(count):
        print("Creating test users")
        start_id = get_next_id(User)
        created = 0
        for x in range(start_id, start_id + int(count)):
            email = f"test_user{x}@test.com"
            if User.query.filter_by(email=email).first():
                print(f"User: {email} already exists, skipping.")
                continue
            try:
                user = User()
                user.name = f"User {x}"
                user.email = email
                user.password = "123456"
                user.is_active = True
                db.session.add(user)
                db.session.commit()
                print(f"User: {user.email} created.")
                created += 1
            except Exception as e:
                db.session.rollback()
                print(f"Error creating user {email}: {e}")
        print(f"Done. {created} test user(s) created.")

    @app.cli.command("insert-test-admins")
    @click.argument("count")
    def insert_test_admin(count):
        print("Creating test admins")
        start_id = get_next_id(Admin)
        created = 0
        for x in range(start_id, start_id + int(count)):
            email = f"test_adm{x}@test.com"
            if Admin.query.filter_by(email=email).first():
                print(f"Admin: {email} already exists, skipping.")
                continue
            try:
                admin = Admin()
                admin.email = email
                admin.password = "123456"
                admin.is_active = True
                db.session.add(admin)
                db.session.commit()
                print(f"Admin: {admin.email} created.")
                created += 1
            except Exception as e:
                db.session.rollback()
                print(f"Error creating admin {email}: {e}")
        print(f"Done. {created} test admin(s) created.")

    @app.cli.command("insert-test-promotors")
    @click.argument("count")
    def insert_test_promotor(count):
        print("Creating test promotors")
        start_id = get_next_id(Promotor)
        created = 0
        for x in range(start_id, start_id + int(count)):
            email = f"test_promotor{x}@test.com"
            if Promotor.query.filter_by(email=email).first():
                print(f"Promotor: {email} already exists, skipping.")
                continue
            try:
                promotor = Promotor()
                promotor.name = f"Promotor {x}"
                promotor.email = email
                promotor.password = "123456"
                promotor.location = "Some Place"
                promotor.web_page = f"www.somePage{x}.com"
                promotor.verified_org = True
                db.session.add(promotor)
                db.session.commit()
                print(f"Promotor: {promotor.email} created.")
                created += 1
            except Exception as e:
                db.session.rollback()
                print(f"Error creating promotor {email}: {e}")
        print(f"Done. {created} test promotor(s) created.")

    @app.cli.command("insert-test-categories")
    @click.argument("count")
    def insert_test_categories(count):
        print("Creating test categories")
        start_id = get_next_id(Category)
        created = 0
        for x in range(start_id, start_id + int(count)):
            name = f"Category {x}"
            if Category.query.filter_by(name=name).first():
                print(f"Category: {name} already exists, skipping.")
                continue
            try:
                category = Category()
                category.name = name
                db.session.add(category)
                db.session.commit()
                print(f"Category: {category.name} created.")
                created += 1
            except Exception as e:
                db.session.rollback()
                print(f"Error creating category {name}: {e}")
        print(f"Done. {created} test categorie(s) created.")

    @app.cli.command("insert-test-events")
    @click.argument("count")
    def insert_test_event(count):
        print("Creating test events")
        start_id = get_next_id(Event)
        created = 0
        for x in range(start_id, start_id + int(count)):
            try:
                event = Event()
                event.name = f"Event {x}"
                event.location = "Some Place"
                event.description = f"Description of Event number {x}"
                event.capacity = 10
                event.date_event = "2026-04-01T13:45:00"
                event.lat = round(random.uniform(-90, 90), 6)
                event.lng = round(random.uniform(-180, 180), 6)
                db.session.add(event)
                db.session.commit()
                print(f"Event: {event.name} created.")
                created += 1
            except Exception as e:
                db.session.rollback()
                print(f"Error creating event {x}: {e}")
        print(f"Done. {created} test event(s) created.")

    @app.cli.command("insert-test-groups")
    @click.argument("count")
    def insert_test_group(count):
        print("Creating test groups")
        start_id = get_next_id(Group)
        created = 0
        for x in range(start_id, start_id + int(count)):
            try:
                group = Group()
                group.name = f"Group {x}"
                group.location = "Some Place"
                group.media = "empty"
                group.description = f"Description of Group number {x}"
                db.session.add(group)
                db.session.commit()
                print(f"Group: {group.name} created.")
                created += 1
            except Exception as e:
                db.session.rollback()
                print(f"Error creating group {x}: {e}")
        print(f"Done. {created} test group(s) created.")

    # ── Relation tables ───────────────────────────────────────────────────────

    @app.cli.command("insert-test-promotor-categories")
    @click.argument("count")
    def insert_test_promotor_categories(count):
        print("Creating test promotor-category relations")
        # Get existing IDs to pair new ones
        promotor_ids = db.session.execute(
            select(Promotor.id).order_by(Promotor.id)).scalars().all()
        category_ids = db.session.execute(
            select(Category.id).order_by(Category.id)).scalars().all()
        created = 0
        for i in range(int(count)):
            if i >= len(promotor_ids) or i >= len(category_ids):
                print(
                    f"Not enough promotors or categories for index {i}, stopping.")
                break
            p_id, c_id = promotor_ids[i], category_ids[i]
            if relation_exists(PromotorCategory, promotor_id=p_id, category_id=c_id):
                print(
                    f"PromotorCategory: Promotor {p_id} - Category {c_id} already exists, skipping.")
                continue
            try:
                prom_cat = PromotorCategory()
                prom_cat.promotor_id = p_id
                prom_cat.category_id = c_id
                db.session.add(prom_cat)
                db.session.commit()
                print(
                    f"PromotorCategory: Promotor {p_id} - Category {c_id} created.")
                created += 1
            except Exception as e:
                db.session.rollback()
                print(f"Error creating PromotorCategory ({p_id}, {c_id}): {e}")
        print(f"Done. {created} promotor-category relation(s) created.")

    @app.cli.command("insert-test-user-categories")
    @click.argument("count")
    def insert_test_user_categories(count):
        print("Creating test user-category relations")
        user_ids = [
            r for r in db.session.execute(select(User.id).order_by(User.id)).scalars().all()
        ]
        category_ids = [
            r for r in db.session.execute(select(Category.id).order_by(Category.id)).scalars().all()
        ]
        created = 0
        for i in range(int(count)):
            if i >= len(user_ids) or i >= len(category_ids):
                print(
                    f"Not enough users or categories for index {i}, stopping.")
                break
            u_id, c_id = user_ids[i], category_ids[i]
            if relation_exists(UserCategory, user_id=u_id, category_id=c_id):
                print(
                    f"UserCategory: User {u_id} - Category {c_id} already exists, skipping.")
                continue
            try:
                uc = UserCategory()
                uc.user_id = u_id
                uc.category_id = c_id
                db.session.add(uc)
                db.session.commit()
                print(f"UserCategory: User {u_id} - Category {c_id} created.")
                created += 1
            except Exception as e:
                db.session.rollback()
                print(f"Error creating UserCategory ({u_id}, {c_id}): {e}")
        print(f"Done. {created} user-category relation(s) created.")

    @app.cli.command("insert-test-event-categories")
    @click.argument("count")
    def insert_test_event_categories(count):
        print("Creating test event-category relations")
        event_ids = [
            r for r in db.session.execute(select(Event.id).order_by(Event.id)).scalars().all()
        ]
        category_ids = [
            r for r in db.session.execute(select(Category.id).order_by(Category.id)).scalars().all()
        ]
        created = 0
        for i in range(int(count)):
            if i >= len(event_ids) or i >= len(category_ids):
                print(
                    f"Not enough events or categories for index {i}, stopping.")
                break
            e_id, c_id = event_ids[i], category_ids[i]
            if relation_exists(EventCategory, event_id=e_id, category_id=c_id):
                print(
                    f"EventCategory: Event {e_id} - Category {c_id} already exists, skipping.")
                continue
            try:
                ec = EventCategory()
                ec.event_id = e_id
                ec.category_id = c_id
                db.session.add(ec)
                db.session.commit()
                print(
                    f"EventCategory: Event {e_id} - Category {c_id} created.")
                created += 1
            except Exception as e:
                db.session.rollback()
                print(f"Error creating EventCategory ({e_id}, {c_id}): {e}")
        print(f"Done. {created} event-category relation(s) created.")

    @app.cli.command("insert-test-group-categories")
    @click.argument("count")
    def insert_test_group_categories(count):
        print("Creating test group-category relations")
        group_ids = [
            r for r in db.session.execute(select(Group.id).order_by(Group.id)).scalars().all()
        ]
        category_ids = [
            r for r in db.session.execute(select(Category.id).order_by(Category.id)).scalars().all()
        ]
        created = 0
        for i in range(int(count)):
            if i >= len(group_ids) or i >= len(category_ids):
                print(
                    f"Not enough groups or categories for index {i}, stopping.")
                break
            g_id, c_id = group_ids[i], category_ids[i]
            if relation_exists(GroupCategory, group_id=g_id, category_id=c_id):
                print(
                    f"GroupCategory: Group {g_id} - Category {c_id} already exists, skipping.")
                continue
            try:
                gc = GroupCategory()
                gc.group_id = g_id
                gc.category_id = c_id
                db.session.add(gc)
                db.session.commit()
                print(
                    f"GroupCategory: Group {g_id} - Category {c_id} created.")
                created += 1
            except Exception as e:
                db.session.rollback()
                print(f"Error creating GroupCategory ({g_id}, {c_id}): {e}")
        print(f"Done. {created} group-category relation(s) created.")

    @app.cli.command("insert-test-group-events")
    @click.argument("count")
    def insert_test_group_events(count):
        print("Creating test group-event relations")
        group_ids = [
            r for r in db.session.execute(select(Group.id).order_by(Group.id)).scalars().all()
        ]
        event_ids = [
            r for r in db.session.execute(select(Event.id).order_by(Event.id)).scalars().all()
        ]
        created = 0
        for i in range(int(count)):
            if i >= len(group_ids) or i >= len(event_ids):
                print(f"Not enough groups or events for index {i}, stopping.")
                break
            g_id, e_id = group_ids[i], event_ids[i]
            if relation_exists(GroupEvent, group_id=g_id, event_id=e_id):
                print(
                    f"GroupEvent: Group {g_id} - Event {e_id} already exists, skipping.")
                continue
            try:
                ge = GroupEvent()
                ge.group_id = g_id
                ge.event_id = e_id
                db.session.add(ge)
                db.session.commit()
                print(f"GroupEvent: Group {g_id} - Event {e_id} created.")
                created += 1
            except Exception as e:
                db.session.rollback()
                print(f"Error creating GroupEvent ({g_id}, {e_id}): {e}")
        print(f"Done. {created} group-event relation(s) created.")

    @app.cli.command("insert-test-saved-events")
    @click.argument("count")
    def insert_test_saved_events(count):
        print("Creating test saved events")
        user_ids = [
            r for r in db.session.execute(select(User.id).order_by(User.id)).scalars().all()
        ]
        event_ids = [
            r for r in db.session.execute(select(Event.id).order_by(Event.id)).scalars().all()
        ]
        created = 0
        for i in range(int(count)):
            if i >= len(user_ids) or i >= len(event_ids):
                print(f"Not enough users or events for index {i}, stopping.")
                break
            u_id, e_id = user_ids[i], event_ids[i]
            if relation_exists(SavedEvent, user_id=u_id, event_id=e_id):
                print(
                    f"SavedEvent: User {u_id} - Event {e_id} already exists, skipping.")
                continue
            try:
                se = SavedEvent()
                se.user_id = u_id
                se.event_id = e_id
                db.session.add(se)
                db.session.commit()
                print(f"SavedEvent: User {u_id} saved Event {e_id}.")
                created += 1
            except Exception as e:
                db.session.rollback()
                print(f"Error creating SavedEvent ({u_id}, {e_id}): {e}")
        print(f"Done. {created} saved event(s) created.")

    @app.cli.command("insert-test-friends")
    @click.argument("count")
    def insert_test_friends(count):
        print("Creating test friendships")
        user_ids = [
            r for r in db.session.execute(select(User.id).order_by(User.id)).scalars().all()
        ]
        if len(user_ids) < 2:
            print("Need at least 2 users to create friendships.")
            return
        base_user = user_ids[0]
        created = 0
        for i in range(1, min(int(count) + 1, len(user_ids))):
            friend_user = user_ids[i]
            if relation_exists(Friend, user_id=base_user, friend_id=friend_user):
                print(
                    f"Friend: User {base_user} <-> User {friend_user} already exists, skipping.")
                continue
            try:
                friend = Friend()
                friend.user_id = base_user
                friend.friend_id = friend_user
                db.session.add(friend)
                db.session.commit()
                print(
                    f"Friend: User {base_user} <-> User {friend_user} created.")
                created += 1
            except Exception as e:
                db.session.rollback()
                print(
                    f"Error creating Friend ({base_user}, {friend_user}): {e}")
        print(f"Done. {created} friendship(s) created.")

    @app.cli.command("insert-test-discussions")
    @click.argument("count")
    def insert_test_discussions(count):
        print("Creating test discussions")
        start_id = get_next_id(Discussion)
        user_ids = [
            r for r in db.session.execute(select(User.id).order_by(User.id)).scalars().all()
        ]
        group_ids = [
            r for r in db.session.execute(select(Group.id).order_by(Group.id)).scalars().all()
        ]
        if not user_ids or not group_ids:
            print("Need at least 1 user and 1 group to create discussions.")
            return
        created = 0
        for x in range(start_id, start_id + int(count)):
            try:
                disc = Discussion()
                disc.message = f"Discussion message number {x}"
                disc.user_id = user_ids[0]
                disc.group_id = group_ids[0]
                db.session.add(disc)
                db.session.commit()
                print(f"Discussion {x} created.")
                created += 1
            except Exception as e:
                db.session.rollback()
                print(f"Error creating discussion {x}: {e}")
        print(f"Done. {created} discussion(s) created.")

    @app.cli.command("insert-test-comments")
    @click.argument("count")
    def insert_test_comments(count):
        print("Creating test comments")
        start_id = get_next_id(Comment)
        user_ids = [
            r for r in db.session.execute(select(User.id).order_by(User.id)).scalars().all()
        ]
        event_ids = [
            r for r in db.session.execute(select(Event.id).order_by(Event.id)).scalars().all()
        ]
        if not user_ids or not event_ids:
            print("Need at least 1 user and 1 event to create comments.")
            return
        created = 0
        for x in range(start_id, start_id + int(count)):
            u_id = user_ids[(x - 1) % len(user_ids)]
            e_id = event_ids[(x - 1) % len(event_ids)]
            try:
                comment = Comment()
                comment.message = f"Comment number {x} on the event"
                comment.user_id = u_id
                comment.event_id = e_id
                db.session.add(comment)
                db.session.commit()
                print(f"Comment: {comment.message}")
                created += 1
            except Exception as e:
                db.session.rollback()
                print(f"Error creating comment {x}: {e}")
        print(f"Done. {created} comment(s) created.")

    @app.cli.command("insert-test-event-promotors")
    @click.argument("count")
    def insert_test_event_promotors(count):
        print("Creating test event-promotor relations")
        promotor_ids = [
            r for r in db.session.execute(select(Promotor.id).order_by(Promotor.id)).scalars().all()
        ]
        event_ids = [
            r for r in db.session.execute(select(Event.id).order_by(Event.id)).scalars().all()
        ]
        created = 0
        for i in range(int(count)):
            if i >= len(promotor_ids) or i >= len(event_ids):
                print(
                    f"Not enough promotors or events for index {i}, stopping.")
                break
            p_id, e_id = promotor_ids[i], event_ids[i]
            if relation_exists(EventPromotor, promotor_id=p_id, event_id=e_id):
                print(
                    f"EventPromotor: Promotor {p_id} - Event {e_id} already exists, skipping.")
                continue
            try:
                ep = EventPromotor()
                ep.promotor_id = p_id
                ep.event_id = e_id
                db.session.add(ep)
                db.session.commit()
                print(
                    f"EventPromotor: Promotor {p_id} - Event {e_id} created.")
                created += 1
            except Exception as e:
                db.session.rollback()
                print(f"Error creating EventPromotor ({p_id}, {e_id}): {e}")
        print(f"Done. {created} event-promotor relation(s) created.")

    @app.cli.command("insert-test-event-assist-users")
    @click.argument("count")
    def insert_test_event_assist_users(count):
        print("Creating test event assist users")
        user_ids = [
            r for r in db.session.execute(select(User.id).order_by(User.id)).scalars().all()
        ]
        event_ids = [
            r for r in db.session.execute(select(Event.id).order_by(Event.id)).scalars().all()
        ]
        created = 0
        for i in range(int(count)):
            if i >= len(user_ids):
                print(f"Not enough users for index {i}, stopping.")
                break
            u_id = user_ids[i]
            e_id = event_ids[i % len(event_ids)]
            if relation_exists(EventAssistUser, user_id=u_id, event_id=e_id):
                print(
                    f"EventAssistUser: User {u_id} - Event {e_id} already exists, skipping.")
                continue
            try:
                assist = EventAssistUser()
                assist.user_id = u_id
                assist.event_id = e_id
                db.session.add(assist)
                db.session.commit()
                print(f"EventAssistUser: User {u_id} assists Event {e_id}.")
                created += 1
            except Exception as e:
                db.session.rollback()
                print(f"Error creating EventAssistUser ({u_id}, {e_id}): {e}")
        print(f"Done. {created} event-assist-user(s) created.")

    # ── Master command ────────────────────────────────────────────────────────

    @app.cli.command("insert-all-test-data")
    @click.argument("count", default=5, type=int)
    def insert_all_test_data(count):
        """Crea datos de prueba completos para toda la base de datos."""
        print(f"Inserting all test data with count = {count}...\n")

        commands_to_run = [
            "insert-test-users",
            "insert-test-admins",
            "insert-test-promotors",
            "insert-test-categories",
            "insert-test-events",
            "insert-test-groups",
            "insert-test-promotor-categories",
            "insert-test-user-categories",
            "insert-test-event-categories",
            "insert-test-group-categories",
            "insert-test-group-events",
            "insert-test-saved-events",
            "insert-test-friends",
            "insert-test-discussions",
            "insert-test-comments",
            "insert-test-event-promotors",
            "insert-test-event-assist-users",
        ]

        ctx = click.get_current_context()
        errors = []

        for cmd_name in commands_to_run:
            print(f"→ Running: {cmd_name} {count}")
            try:
                ctx.invoke(app.cli.get_command(ctx, cmd_name), count=count)
            except Exception as e:
                errors.append((cmd_name, str(e)))
                print(f"⚠️  Command '{cmd_name}' failed: {e}")
            print()

        if errors:
            print("⚠️  Finished with errors in the following commands:")
            for cmd, err in errors:
                print(f"   - {cmd}: {err}")
        else:
            print("✅ All test data inserted successfully!")
