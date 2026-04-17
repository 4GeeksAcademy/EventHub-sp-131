import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export const DeleteUser = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();
    const navigate = useNavigate();

    const handleDelete = async () => {
        await fetch(`${backendUrl}/api/users/${id}`, {
            method: "DELETE"
        });

        navigate("/user", {
            state: { message: "Usuario eliminado correctamente" }
        });
    };

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