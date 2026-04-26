import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const UserEvents = () => {
    const [events, setEvents] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const getEvents = () => {
        fetch(`${backendUrl}/api/events`)
            .then((resp) => resp.json())
            .then((data) => setEvents(data))
            .catch(() => setMessage("No se pudieron cargar los eventos"));
    };

    const handleSave = (eventId) => {
        const tokenUser = localStorage.getItem("tokenUser");

        if (!tokenUser) {
            navigate("/user/login");
            return;
        }

        fetch(`${backendUrl}/api/events/${eventId}/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + tokenUser
            }
        })
            .then((resp) => {
                if (!resp.ok) throw new Error();
                setMessage("Evento guardado correctamente");
            })
            .catch(() => setMessage("Este evento ya está guardado o no se pudo guardar"));
    };

    const handleAssist = (eventId) => {
        const tokenUser = localStorage.getItem("tokenUser");

        if (!tokenUser) {
            navigate("/user/login");
            return;
        }

        fetch(`${backendUrl}/api/events/${eventId}/assist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + tokenUser
            }
        })
            .then((resp) => {
                if (!resp.ok) throw new Error();
                setMessage("Asistencia confirmada correctamente");
            })
            .catch(() => setMessage("Ya confirmaste asistencia o no se pudo procesar"));
    };

    useEffect(() => {
        getEvents();
    }, []);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold mb-1">Eventos disponibles</h1>
                    <p className="text-muted mb-0">
                        Explora eventos, guarda tus favoritos y confirma asistencia.
                    </p>
                </div>

                <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/user/private")}
                >
                    Volver al perfil
                </button>
            </div>

            {message && (
                <div className="alert alert-info shadow-sm">
                    {message}
                </div>
            )}

            <div className="row g-4">
                {events.length === 0 ? (
                    <div className="col-12">
                        <div className="card shadow-sm p-5 text-center">
                            <h4>No hay eventos disponibles</h4>
                            <p className="text-muted mb-0">
                                Cuando se creen eventos, aparecerán aquí.
                            </p>
                        </div>
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="col-md-6 col-lg-4">
                            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                {event.media ? (
                                    <img
                                        src={event.media}
                                        className="card-img-top"
                                        style={{ height: "210px", objectFit: "cover" }}
                                        alt={event.name}
                                    />
                                ) : (
                                    <div
                                        className="bg-light d-flex align-items-center justify-content-center"
                                        style={{ height: "210px" }}
                                    >
                                        <span className="text-muted">Sin imagen</span>
                                    </div>
                                )}

                                <div className="card-body d-flex flex-column p-4">
                                    <h5 className="card-title fw-bold">{event.name}</h5>

                                    <p className="text-muted mb-2">
                                        📍 {event.location || "Ubicación no disponible"}
                                    </p>

                                    <p className="small text-muted mb-2">
                                        📅 {event.date_event
                                            ? new Date(event.date_event).toLocaleString()
                                            : "Fecha no disponible"}
                                    </p>

                                    <p className="card-text">
                                        {event.description || "Sin descripción"}
                                    </p>

                                    <p className="mb-3">
                                        <strong>Capacidad:</strong> {event.capacity || "No definida"}
                                    </p>

                                    <div className="mt-auto d-grid gap-2">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => navigate(`/events/${event.id}`)}
                                        >
                                            Ver detalle
                                        </button>

                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-success w-100"
                                                onClick={() => handleSave(event.id)}
                                            >
                                                Guardar
                                            </button>

                                            <button
                                                className="btn btn-warning w-100"
                                                onClick={() => handleAssist(event.id)}
                                            >
                                                Asistir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};