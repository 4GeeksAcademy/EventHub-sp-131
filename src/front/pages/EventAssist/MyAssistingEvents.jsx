import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const MyAssistingEvents = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    const getMyEvents = () => {
        const tokenUser = localStorage.getItem("tokenUser");

        if (!tokenUser) {
            navigate("/user/login");
            return;
        }

        fetch(`${backendUrl}/api/user/assisting-events`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + tokenUser
            }
        })
            .then((resp) => resp.json().then((data) => ({ ok: resp.ok, data })))
            .then(({ ok, data }) => {
                if (!ok) {
                    navigate("/user/login");
                    return;
                }

                setEvents(data.events || []);
            })
            .catch(() => {
                alert("Error al cargar tus eventos");
            });
    };

    const handleCancel = (eventId) => {
        const tokenUser = localStorage.getItem("tokenUser");

        fetch(`${backendUrl}/api/events/${eventId}/assist`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + tokenUser
            }
        })
            .then((resp) => {
                if (!resp.ok) throw new Error();
                getMyEvents();
            })
            .catch(() => {
                alert("No se pudo cancelar la asistencia");
            });
    };

    useEffect(() => {
        getMyEvents();
    }, []);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between mb-4">
                <h2>Eventos a los que asistiré</h2>

                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/user/private")}
                >
                    Volver
                </button>
            </div>

            <div className="row">
                {events.length === 0 ? (
                    <p className="text-center p-5">
                        No tienes eventos confirmados
                    </p>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                {event.media && (
                                    <img
                                        src={event.media}
                                        className="card-img-top"
                                        style={{ height: "200px", objectFit: "cover" }}
                                        alt={event.name}
                                    />
                                )}

                                <div className="card-body d-flex flex-column">
                                    <h5>{event.name}</h5>

                                    <p>📍 {event.location}</p>

                                    <p className="small text-muted">
                                        📅 {new Date(event.date_event).toLocaleString()}
                                    </p>

                                    <div className="mt-auto d-flex gap-2">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => navigate(`/events/${event.id}`)}
                                        >
                                            Ver
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleCancel(event.id)}
                                        >
                                            Cancelar
                                        </button>
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