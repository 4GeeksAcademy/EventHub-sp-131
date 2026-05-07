from flask_socketio import join_room, leave_room, emit


def register_socket_events(socketio):

    @socketio.on("connect")
    def handle_connect():
        print("Cliente conectado a Socket.IO")

    @socketio.on("disconnect")
    def handle_disconnect():
        print("Cliente desconectado de Socket.IO")

    @socketio.on("join_chat")
    def handle_join_chat(data):
        chat_id = data.get("chat_id")

        if not chat_id:
            return

        room = f"chat_{chat_id}"
        join_room(room)
        print(f"Unido a sala: {room}")

    @socketio.on("leave_chat")
    def handle_leave_chat(data):
        chat_id = data.get("chat_id")

        if not chat_id:
            return

        room = f"chat_{chat_id}"
        leave_room(room)
        print(f"Salió de sala: {room}")

    @socketio.on("send_message")
    def handle_send_message(data):
        chat_id = data.get("chat_id")
        message = data.get("message")

        if not chat_id or not message:
            return

        room = f"chat_{chat_id}"

        emit(
            "new_message",
            message,
            room=room,
            include_self=False
        )

        print(f"Mensaje emitido en {room}: {message}")