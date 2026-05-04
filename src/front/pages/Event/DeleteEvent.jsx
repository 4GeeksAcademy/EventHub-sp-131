import { useParams, useNavigate, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const DeleteEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { store } = useGlobalReducer();

    const handleDelete = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/events/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Error al eliminar");
            }

            alert("Evento eliminado");
            navigate("/events");

        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar el evento");
        }
    };

    if (!store.adminAuth) {
        return <Navigate to="/admin/login" />;
    }

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