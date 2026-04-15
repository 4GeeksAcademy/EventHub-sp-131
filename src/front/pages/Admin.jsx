import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Admin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [admins, setAdmins] = useState([]);
    const [message, setMessage] = useState("");

    const getAdmins = () => {
        fetch(`${backendUrl}/api/admins`)
            .then((resp) => resp.json())
            .then((data) => setAdmins(data.results || []))
            .catch(() => setMessage("Error al cargar administradores"));
    };

    useEffect(() => {
        getAdmins();
    }, []);

    const handleDelete = (id) => {
        fetch(`${backendUrl}/api/admins/${id}`, {
            method: "DELETE"
        })
            .then((resp) => resp.json())
            .then((data) => {
                setMessage(data.message || "Administrador eliminado correctamente");
                getAdmins();
            })
            .catch(() => setMessage("Error al eliminar administrador"));
    };

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold mb-1">Panel de Administración</h1>
                    <p className="text-muted mb-0">Gestión de administradores</p>
                </div>
                <Link to="/" className="btn btn-outline-dark">
                    Volver
                </Link>
            </div>

            {message && <div className="alert alert-info">{message}</div>}

            <div className="mb-4">
                <Link to="/admin/create" className="btn btn-dark">
                    Crear administrador
                </Link>
            </div>

            <div className="row">
                {admins.length > 0 ? (
                    admins.map((admin) => (
                        <div className="col-md-6 col-lg-4 mb-4" key={admin.id}>
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body">
                                    <h5 className="fw-bold mb-3">{admin.email}</h5>

                                    <p className="mb-1">
                                        <strong>ID:</strong> {admin.id}
                                    </p>

                                    <p className="mb-1">
                                        <strong>User ID:</strong> {admin.user_id}
                                    </p>

                                    <p className="mb-3">
                                        <strong>Activo:</strong> {admin.is_active ? "Sí" : "No"}
                                    </p>

                                    <div className="d-flex gap-2">

                                        <Link
                                            to={`/admin/details/${admin.id}`}
                                            className="btn btn-info btn-sm"
                                        >
                                            Ver
                                        </Link>
                                        
                                        <Link
                                            to={`/admin/edit/${admin.id}`}
                                            className="btn btn-warning btn-sm"
                                        >
                                            Editar
                                        </Link>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(admin.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-secondary text-center">
                            No hay administradores registrados.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};