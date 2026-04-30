from flask_socketio import join_room, leave_room

def register_socket_events(socketio):

    @socketio.on("join_chat")
    def handle_join_chat(data):
        chat_id = data.get("chat_id")
        if chat_id:
            join_room(f"chat_{chat_id}")

    @socketio.on("leave_chat")
    def handle_leave_chat(data):
        chat_id = data.get("chat_id")
        if chat_id:
            leave_room(f"chat_{chat_id}")