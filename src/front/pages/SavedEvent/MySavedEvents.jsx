import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../components/BackButton";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const MySavedEvents = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    const getMySavedEvents = () => {
        const tokenUser = localStorage.getItem("tokenUser");

        if (!tokenUser) {
            navigate("/user/login");
            return;
        }

        fetch(`${backendUrl}/api/user/saved-events`, {
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
                alert("No se pudieron cargar tus eventos guardados");
            });
    };

    const handleUnsave = (eventId) => {
        const tokenUser = localStorage.getItem("tokenUser");

        fetch(`${backendUrl}/api/events/${eventId}/save`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + tokenUser
            }
        })
            .then((resp) => {
                if (!resp.ok) throw new Error();
                getMySavedEvents();
            })
            .catch(() => {
                alert("No se pudo quitar el evento de guardados");
            });
    };

    useEffect(() => {
        getMySavedEvents();
    }, []);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Mis eventos guardados</h2>

                <BackButton />
            </div>

            <div className="row">
                {events.length === 0 ? (
                    <p className="text-center p-5">No tienes eventos guardados</p>
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
                                    <h5 className="card-title">{event.name}</h5>

                                    <p className="text-muted mb-1">
                                        📍 {event.location}
                                    </p>

                                    <p>
                                        <strong>Descripción:</strong> {event.description}
                                    </p>

                                    <p className="small text-muted">
                                        📅 {new Date(event.date_event).toLocaleString()}
                                    </p>

                                    <p>
                                        <strong>Capacidad:</strong> {event.capacity}
                                    </p>

                                    <div className="mt-auto d-flex gap-2">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => navigate(`/events/${event.id}`)}
                                        >
                                            Ver detalle
                                        </button>

                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleUnsave(event.id)}
                                        >
                                            Quitar
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