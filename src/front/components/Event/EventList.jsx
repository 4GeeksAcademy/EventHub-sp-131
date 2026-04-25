import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const EventList = (props) => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    const getEvents = async () => {
        const resp = await fetch(`${backendUrl}/api/${props.type}/${props.profile.id}/events`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        });

        if (!resp.ok) {
            throw new Error("Error al obtener eventos");
        }
        const data = await resp.json();
        setEvents(data.events);
    };

    useEffect(() => {
        getEvents(props.profile.id);
    }, []);

    const handleDelete = async (idToDelete) => {
        try {
            const response = await fetch(`${backendUrl}/api/${props.type}/${props.profile.id}/events/${idToDelete}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            });

            if (!response.ok) {
                throw new Error("Error al eliminar");
            }



        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar el evento");
        }
    };

    return (
        <div className="container mt-5">
            {props.profile.name &&
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="mb-0">Eventos creados por {props.profile.name}</h2>
                </div>
            }
            <div className="row">
                {events.map(e => (
                    <div key={e.id} className="col-md-4 mb-4" >
                        <div className="card h-100 shadow-sm">
                            <Link to={`/${props.type}/private/${props.profile.id}/event/${e.id}`}>
                                <button type="button" className="btn btn-outline-primary btn-sm">
                                    Ver evento
                                </button>
                            </Link>
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
                                    <button type="button" className="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editEvent">
                                        Editar
                                    </button>
                                    <div className="modal fade" id="editEvent" tabIndex="-1" aria-labelledby="editEventLabel" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="editEventLabel">Modal title</h1>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    ...
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button type="button" className="btn btn-primary">Save changes</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button type="button" className="btn btn-outline-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteEvent">
                                        Eliminar
                                    </button>

                                    <div className="modal fade" id="deleteEvent" tabIndex="-1" aria-labelledby="deleteEventLabel" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="deleteEventLabel">Modal title</h1>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body text-center">
                                                    <h3 className="mb-3 text-danger">
                                                        ⚠️ Eliminar Evento
                                                    </h3>
                                                    <p className="mb-4">
                                                        ¿Seguro que quieres eliminar este evento?
                                                        <br />
                                                        <strong>Esta acción no se puede deshacer.</strong>
                                                    </p>
                                                    <div className="d-flex justify-content-center gap-3">
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button className="btn btn-secondary" onClick={() => navigate("/events")}>Cancelar</button>
                                                    <button className="btn btn-danger" onClick={() => { handleDelete(e.id) }}>Sí, eliminar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};