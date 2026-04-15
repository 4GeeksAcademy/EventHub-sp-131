import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export const AdminDetails = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();

    const [admin, setAdmin] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch(`${backendUrl}/api/admins/${id}`)
            .then(async (resp) => {
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(data.message || "Error al cargar admin");
                }

                return data;
            })
            .then((data) => {
                setAdmin(data.results);
            })
            .catch((error) => {
                setMessage(error.message);
            });
    }, [backendUrl, id]);

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold">Detalle del Administrador</h1>

                <Link to="/admin" className="btn btn-outline-dark">
                    Volver
                </Link>
            </div>

            {message && <div className="alert alert-danger">{message}</div>}

            {!admin ? (
                <div className="alert alert-secondary">Cargando administrador...</div>
            ) : (
                <div className="card shadow-sm border-0">
                    <div className="card-body p-4">
                        <h3 className="mb-4">{admin.email}</h3>
                        <p><strong>ID:</strong> {admin.id}</p>
                        <p><strong>User ID:</strong> {admin.user_id}</p>
                        <p><strong>Estado:</strong> {admin.is_active ? "Activo" : "Inactivo"}</p>

                        <Link
                            to={`/admin/edit/${admin.id}`}
                            className="btn btn-warning mt-3"
                        >
                            Editar
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};