
import click
from api.models import db, User, Admin, Promotor, Category, Event, Group, PromotorCategory, Friend, SavedEvent, Discussion, GroupCategory, UserCategory, Comment, EventCategory, GroupEvent, EventAssistUser, EventPromotor

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""


def setup_commands(app):
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users")  # name of our command
    @click.argument("count")  # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.name = "User " + str(x)
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-admins")  # name of our command
    @click.argument("count")  # argument of out command
    def insert_test_admin(count):
        print("Creating test admins")
        for x in range(1, int(count) + 1):
            admin = Admin()
            admin.email = "test_adm" + str(x) + "@test.com"
            admin.password = "123456"
            admin.is_active = True
            db.session.add(admin)
            db.session.commit()
            print("Admin: ", admin.email, " created.")

        print("All test admins created")

    @app.cli.command("insert-test-promotors")  # name of our command
    @click.argument("count")  # argument of out command
    def insert_test_promotor(count):
        print("Creating test promotors")
        for x in range(1, int(count) + 1):
            promotors = Promotor()
            promotors.name = "Promotor " + str(x)
            promotors.email = "test_promotor" + str(x) + "@test.com"
            promotors.password = "123456"
            promotors.location = "Some Place"
            promotors.web_page = "www.somePage" + str(x) + ".com"
            promotors.verified_org = True
            db.session.add(promotors)
            db.session.commit()
            print("Admin: ", promotors.email, " created.")

        print("All test promotors created")

    @app.cli.command("insert-test-categories")  # name of our command
    @click.argument("count")  # argument of out command
    def insert_test_categories(count):
        print("Creating test categories")
        for x in range(1, int(count) + 1):
            categories = Category()
            categories.name = "Category " + str(x)
            db.session.add(categories)
            db.session.commit()
            print("Admin: ", categories.name, " created.")

        print("All test categories created")

    @app.cli.command("insert-test-events")  # name of our command
    @click.argument("count")  # argument of out command
    def insert_test_event(count):
        print("Creating test event")
        for x in range(1, int(count) + 1):
            event = Event()
            event.name = "Event " + str(x)
            event.location = "Some Place"
            event.description = "Description of Event number " + str(x)
            event.capacity = 10
            event.date_event = "2026-04-01T13:45:00"
            db.session.add(event)
            db.session.commit()
            print("Admin: ", event.name, " created.")

        print("All test event created")

    @app.cli.command("insert-test-groups")  # name of our command
    @click.argument("count")  # argument of out command
    def insert_test_group(count):
        print("Creating test group")
        for x in range(1, int(count) + 1):
            group = Group()
            group.name = "Group " + str(x)
            group.location = "Some Place"
            group.media = "empty"
            group.description = f"Description of Group number {x}"
            db.session.add(group)
            db.session.commit()
            print("Admin: ", group.name, " created.")

        print("All test group created")

    @app.cli.command("insert-test-promotor-categories")
    @click.argument("count")
    def insert_test_promotor_categories(count):
        """Asocia los primeros 'count' promotors con las primeras 'count' categorías"""
        print("Creating test promotor-category relations")
        for x in range(1, int(count) + 1):
            prom_cat = PromotorCategory()
            # Asume que ya existen IDs 1,2,3...
            prom_cat.promotor_id = x
            prom_cat.category_id = x
            db.session.add(prom_cat)
            db.session.commit()
            print(f"PromotorCategory: Promotor {x} - Category {x} created.")
        print("All test promotor-category relations created")
    @app.cli.command("insert-test-user-categories")
    @click.argument("count")
    def insert_test_user_categories(count):
        print("Creating test user-category relations")
        for x in range(1, int(count) + 1):
            uc = UserCategory()
            uc.user_id = x
            uc.category_id = x
            db.session.add(uc)
            db.session.commit()
            print(f"UserCategory: User {x} - Category {x} created.")
        print("All test user-category relations created")

    @app.cli.command("insert-test-event-categories")
    @click.argument("count")
    def insert_test_event_categories(count):
        print("Creating test event-category relations")
        for x in range(1, int(count) + 1):
            ec = EventCategory()
            ec.event_id = x
            ec.category_id = x
            db.session.add(ec)
            db.session.commit()
            print(f"EventCategory: Event {x} - Category {x} created.")
        print("All test event-category relations created")

    @app.cli.command("insert-test-group-categories")
    @click.argument("count")
    def insert_test_group_categories(count):
        print("Creating test group-category relations")
        for x in range(1, int(count) + 1):
            gc = GroupCategory()
            gc.group_id = x
            gc.category_id = x
            db.session.add(gc)
            db.session.commit()
            print(f"GroupCategory: Group {x} - Category {x} created.")
        print("All test group-category relations created")
    
    @app.cli.command("insert-test-group-events")
    @click.argument("count")
    def insert_test_group_events(count):
        print("Creating test group-event relations")
        for x in range(1, int(count) + 1):
            ge = GroupEvent()
            ge.group_id = x
            ge.event_id = x
            db.session.add(ge)
            db.session.commit()
            print(f"GroupEvent: Group {x} - Event {x} created.")
        print("All test group-event relations created")

    @app.cli.command("insert-test-saved-events")
    @click.argument("count")
    def insert_test_saved_events(count):
        print("Creating test saved events")
        for x in range(1, int(count) + 1):
            se = SavedEvent()
            se.user_id = x
            se.event_id = x
            db.session.add(se)
            db.session.commit()
            print(f"SavedEvent: User {x} saved Event {x}")
        print("All test saved events created")

    @app.cli.command("insert-test-friends")
    @click.argument("count")
    def insert_test_friends(count):
        print("Creating test friendships")
        for x in range(1, int(count) + 1):
            friend = Friend()
            friend.user_id = 1          # Usuario 1 es amigo de los demás
            friend.friend_id = x + 1 if x < int(count) else 2
            db.session.add(friend)
            db.session.commit()
            print(f"Friend: User 1 <-> User {friend.friend_id}")
        print("All test friends created")

    @app.cli.command("insert-test-discussions")
    @click.argument("count")
    def insert_test_discussions(count):
        print("Creating test discussions")
        for x in range(1, int(count) + 1):
            disc = Discussion()
            disc.message = f"Discussion message number {x}"
            disc.user_id = 1
            disc.group_id = 1
            db.session.add(disc)
            db.session.commit()
            print(f"Discussion {x} created.")
        print("All test discussions created")

    @app.cli.command("insert-test-comments")
    @click.argument("count")
    def insert_test_comments(count):
        print("Creating test comments")
        for x in range(1, int(count) + 1):
            comment = Comment()
            comment.message = f"Comment number {x} on the event"
            comment.user_id = x if x <= 5 else 1   # reutiliza usuarios
            comment.event_id = x if x <= 5 else 1
            db.session.add(comment)
            db.session.commit()
            print(f"Comment: {comment.message}")
        print("All test comments created")
    
    @app.cli.command("insert-test-event-promotors")
    @click.argument("count")
    def insert_test_event_promotors(count):
        print("Creating test event-promotor relations")
        for x in range(1, int(count) + 1):
            ep = EventPromotor()
            ep.promotor_id = x
            ep.event_id = x
            db.session.add(ep)
            db.session.commit()
            print(f"EventPromotor: Promotor {x} - Event {x}")
        print("All test event-promotor relations created")

    @app.cli.command("insert-test-event-assist-users")
    @click.argument("count")
    def insert_test_event_assist_users(count):
        print("Creating test event assist users")
        for x in range(1, int(count) + 1):
            assist = EventAssistUser()
            assist.user_id = x
            assist.event_id = x if x <= 5 else 1
            db.session.add(assist)
            db.session.commit()
            print(f"EventAssistUser: User {x} assists Event {assist.event_id}")
        print("All test event assist users created")

    @app.cli.command("insert-all-test-data")
    @click.argument("count", default=5, type=int)
    def insert_all_test_data(count):
        """Crea datos de prueba completos para toda la base de datos"""
        print(f"Inserting all test data with count = {count}...\n")

        try:
            # Llamamos directamente a los comandos existentes usando el CLI de Flask
            ctx = click.get_current_context()

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

            for cmd_name in commands_to_run:
                print(f"→ Running: {cmd_name} {count}")
                # Invocamos el comando pasando el count como argumento
                ctx.invoke(app.cli.get_command(ctx, cmd_name), count=count)
                print()  # línea en blanco para separar

            print("✅ All test data inserted successfully!")

        except Exception as e:
            db.session.rollback()
            print(f"❌ Error while inserting test data: {e}")
            raise