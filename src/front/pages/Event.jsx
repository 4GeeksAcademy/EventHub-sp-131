import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Event = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    const getEvents = async () => {
        const resp = await fetch(`${backendUrl}/api/events`);

        if (!resp.ok) {
            throw new Error("Error al obtener eventos");
}
        const data = await resp.json();
        setEvents(data.results);
    };

    useEffect(() => {
        getEvents();
    }, []);

    return (
    <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Eventos</h2>
            <button
                className="btn btn-primary"
                onClick={() => navigate("/create-event")}
            >
                Crear Evento
            </button>
        </div>

        <div className="row">
            {events.map(e => (
                <div key={e.id} className="col-md-4 mb-4">
                    <div className="card h-100 shadow-sm">
                        {e.media && (
                            <img
                                src={e.media}
                                className="card-img-top"
                                style={{ height: "200px", objectFit: "cover" }}
                            />
                        )}

                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{e.name}</h5>
                            <p className="card-text text-muted mb-1">
                                📍 {e.location}
                            </p>
                            <p><strong>📝 Descripción:</strong> {e.description}</p>

                            <p></p>
                            <p className="card-text small text-muted">
                                📅 {new Date(e.date_event).toLocaleString()}
                            </p>

                            <p><strong>👥 Capacidad:</strong> {e.capacity}</p>

                            <div className="mt-auto d-flex justify-content-between">
                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => navigate(`/edit-event/${e.id}`)}
                                >
                                    Editar
                                </button>

                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => navigate(`/delete-event/${e.id}`)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
};