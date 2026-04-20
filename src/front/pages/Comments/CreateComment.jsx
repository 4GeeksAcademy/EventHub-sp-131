import { useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const CreateComment = () => {
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);

    const [selectedUser, setSelectedUser] = useState("");
    const [selectedEvent, setSelectedEvent] = useState("");
    const [message, setMessage] = useState("");

    // 🔹 cargar usuarios
    useEffect(() => {
        fetch(`${backendUrl}/api/users`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.log(err));
    }, []);

    // 🔹 cargar eventos
    useEffect(() => {
        fetch(`${backendUrl}/api/events`)
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(err => console.log(err));
    }, []);

    // 🔹 submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedUser || !selectedEvent || !message) {
            alert("Completa todos los campos");
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message,
                    user_id: parseInt(selectedUser),
                    event_id: parseInt(selectedEvent)
                })
            });

            if (response.ok) {
                alert("Comentario creado 🔥");
                setMessage("");
                setSelectedUser("");
                setSelectedEvent("");
            } else {
                alert("Error al crear comentario");
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Crear Comentario</h2>

            <form onSubmit={handleSubmit}>

                {/* 🔹 SELECT USER */}
                <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <select
                        className="form-select"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="">Selecciona un usuario</option>

                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 🔹 SELECT EVENT */}
                <div className="mb-3">
                    <label className="form-label">Evento</label>
                    <select
                        className="form-select"
                        value={selectedEvent}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                    >
                        <option value="">Selecciona un evento</option>

                        {events.map(event => (
                            <option key={event.id} value={event.id}>
                                {event.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 🔹 MENSAJE */}
                <div className="mb-3">
                    <label className="form-label">Comentario</label>
                    <textarea
                        className="form-control"
                        placeholder="Escribe tu comentario..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                {/* 🔹 BOTÓN */}
                <button type="submit" className="btn btn-primary">
                    Crear Comentario
                </button>

            </form>
        </div>
    );
};