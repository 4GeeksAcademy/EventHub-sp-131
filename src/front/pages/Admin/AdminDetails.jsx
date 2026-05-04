import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const AdminDetails = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();
    const { store } = useGlobalReducer();

    const [admin, setAdmin] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch(`${backendUrl}/api/admin-panel/admins/${id}`)
            .then(async (resp) => {
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(data.message || "Error al cargar administrador");
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

    if (!store.adminAuth) {
        return <Navigate to="/admin/login" />;
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="fw-bold mb-1">Detalle del Administrador</h1>
                            <p className="text-muted mb-0">Información del administrador seleccionado</p>
                        </div>

                        <Link to="/admin" className="btn btn-outline-dark">
                            Volver
                        </Link>
                    </div>

                    {message && (
                        <div className="alert alert-danger">
                            {message}
                        </div>
                    )}

                    {!admin ? (
                        <div className="alert alert-secondary">
                            Cargando administrador...
                        </div>
                    ) : (
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h3 className="mb-4">{admin.email}</h3>

                                <p>
                                    <strong>ID:</strong> {admin.id}
                                </p>

                                <p>
                                    <strong>Estado:</strong> {admin.is_active ? "Activo" : "Inactivo"}
                                </p>

                                <div className="mt-4 d-flex gap-2">
                                    <Link
                                        to={`/admin/edit/${admin.id}`}
                                        className="btn btn-warning"
                                    >
                                        Editar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};