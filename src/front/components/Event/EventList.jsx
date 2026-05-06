import { useEffect, useState, forwardRef, useImperativeHandle, useCallback } from "react";
import { Link, } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const EventList = forwardRef((props, ref) => {
    const [events, setEvents] = useState([]);

    const getEvents = useCallback(async () => {
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
    }, [props.type, props.profile.id]);

    useImperativeHandle(ref, () => ({
        refreshEvents: getEvents
    }), [getEvents]);

    useEffect(() => {
        getEvents();
    }, [getEvents]);

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
        const modalElement = document.getElementById(`deleteEvent-${idToDelete}`);
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        getEvents();
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {events.map(e => (
                    <div key={e.id} className="col-md-4 mb-4" >
                        <div className="card h-100 shadow-sm">
                            {e.media && (
                                <img
                                    src={e.media}
                                    className="card-img-top"
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                            )}

                            <div className="card-body d-flex flex-column">
                                <div className="d-flex justify-content-between">
                                    <h5 className="card-title">{e.name}</h5>
                                    <Link to={`/${props.type}/private/${props.profile.id}/event/${e.id}`}>
                                        <button type="button" className="btn btn-outline-primary btn-sm">
                                            Ver evento
                                        </button>
                                    </Link>

                                </div>
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
                                    <Link to={`/edit-event/${e.id}`} state={{ from: `/${props.type}/${props.profile.id}/private` }}>
                                        <button type="button" className="btn btn-outline-primary btn-sm" >
                                            Editar
                                        </button>
                                    </Link>

                                    <button type="button" className="btn btn-outline-danger btn-sm" data-bs-toggle="modal" data-bs-target={`#deleteEvent-${e.id}`}>
                                        Eliminar
                                    </button>

                                    <div className="modal fade" id={`deleteEvent-${e.id}`} tabIndex="-1" aria-labelledby="deleteEventLabel" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body text-center">
                                                    <h3 className="mb-3 text-danger">
                                                        ⚠️ Eliminar Evento {e.name}
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
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
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
});