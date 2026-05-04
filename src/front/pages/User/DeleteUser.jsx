import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useNavigate, useParams, Navigate } from "react-router-dom";

export const DeleteUser = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();
    const navigate = useNavigate();
    const { store } = useGlobalReducer();

    const handleDelete = async () => {
        await fetch(`${backendUrl}/api/users/${id}`, {
            method: "DELETE"
        });

        navigate("/user", {
            state: { message: "Usuario eliminado correctamente" }
        });
    };

    if (!store.adminAuth) {
        return <Navigate to="/admin/login" />;
    }

    return (
        <div className="container py-5">
            <h1>Eliminar Usuario</h1>

            <p>¿Seguro que quieres eliminar este usuario?</p>

            <button className="btn btn-danger me-2" onClick={handleDelete}>
                Eliminar
            </button>

            <button className="btn btn-secondary" onClick={() => navigate("/user")}>
                Cancelar
            </button>
        </div>
    );
};

export default DeleteUser