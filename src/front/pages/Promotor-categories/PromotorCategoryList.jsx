import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL || "/api";

export const PromotorCategoryList = () => {
    const [relations, setRelations] = useState([]);
    const [message, setMessage] = useState("");

    const loadRelations = () => {
        fetch(`${API_URL}/promotor-categories`)
            .then((resp) => resp.json())
            .then((data) => {
                setRelations(Array.isArray(data) ? data : []);
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        loadRelations();
    }, []);

    const handleDelete = (relationId) => {
        fetch(`${API_URL}/promotor-categories/${relationId}`, {
            method: "DELETE"
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.msg === "Relación no encontrada") {
                    setMessage(data.msg);
                    return;
                }

                setMessage("Relación eliminada correctamente.");
                loadRelations();
            })
            .catch((error) => {
                console.log(error);
                setMessage("Hubo un error eliminando la relación.");
            });
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Lista de relaciones</h2>
                <Link to="/promotor-category/create" className="btn btn-primary">
                    Nueva relación
                </Link>
            </div>

            {message && <div className="alert alert-info">{message}</div>}

            <div className="card shadow border-0">
                <div className="card-body p-4">
                    {relations.length === 0 ? (
                        <p className="text-muted mb-0">No hay relaciones registradas.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Promotor</th>
                                        <th>Categoría</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {relations.map((relation) => (
                                        <tr key={relation.id}>
                                            <td>{relation.id}</td>
                                            <td>{relation.promotor?.name}</td>
                                            <td>{relation.category?.name}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Link
                                                        to={`/promotor-category/edit/${relation.id}`}
                                                        className="btn btn-warning btn-sm"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(relation.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};