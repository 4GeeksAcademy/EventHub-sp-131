import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const CreateEvent = () => {
    const navigate = useNavigate();
    const { store } = useGlobalReducer();

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [date_event, setDateEvent] = useState("");
    const [capacity, setCapacity] = useState("");
    const [media, setMedia] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const resp = await fetch(`${backendUrl}/api/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                location,
                description,
                date_event,
                capacity: Number(capacity),
                media
            })
        });

        if (resp.ok) {
            navigate("/events");
        } else {
            console.error("Error creando evento");
        }
    };

    if (!store.adminAuth) {
            return <Navigate to="/admin/login" />;
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">

                    <h2 className="mb-4 text-center">Crear Evento</h2>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Ubicación</label>
                            <input
                                type="text"
                                className="form-control"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Descripción</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Fecha</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                value={date_event}
                                onChange={(e) => setDateEvent(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Capacidad</label>
                            <input
                                type="number"
                                className="form-control"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Imagen (URL)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={media}
                                onChange={(e) => setMedia(e.target.value)}
                            />
                        </div>

                        {/* Preview */}
                        {media && (
                            <div className="mb-3 text-center">
                                <img
                                    src={media}
                                    alt="preview"
                                    style={{
                                        maxHeight: "200px",
                                        objectFit: "cover",
                                        borderRadius: "10px"
                                    }}
                                />
                            </div>
                        )}

                        <div className="d-flex justify-content-between">
                            <button type="submit" className="btn btn-success">
                                Crear
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/events")}
                            >
                                Cancelar
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};