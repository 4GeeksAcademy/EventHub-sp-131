import { useParams, useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const DeleteEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleDelete = async () => {
        await fetch(`${backendUrl}/events/${id}`, {
            method: "DELETE"
        });

        alert("Evento eliminado");
        navigate("/events");
    };

    return (
    <div className="container mt-5">
        <div className="row justify-content-center">
            <div className="col-md-6">

                <div className="card shadow text-center p-4">
                    
                    <h3 className="mb-3 text-danger">
                        ⚠️ Eliminar Evento
                    </h3>

                    <p className="mb-4">
                        ¿Seguro que quieres eliminar este evento?
                        <br />
                        <strong>Esta acción no se puede deshacer.</strong>
                    </p>

                    <div className="d-flex justify-content-center gap-3">
                        <button
                            className="btn btn-danger"
                            onClick={handleDelete}
                        >
                            Sí, eliminar
                        </button>

                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate("/events")}
                        >
                            Cancelar
                        </button>
                    </div>

                </div>

            </div>
        </div>
    </div>
);
};