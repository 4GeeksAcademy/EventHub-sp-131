import React, { useEffect, useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:3000";

export const PromotorCategory = () => {
    const [promotors, setPromotors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [relations, setRelations] = useState([]);

    const [formData, setFormData] = useState({
        promotor_id: "",
        category_id: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const loadData = () => {
        setLoading(true);

        Promise.all([
            fetch(`${API_URL}/promotors`).then((resp) => resp.json()),
            fetch(`${API_URL}/categories`).then((resp) => resp.json()),
            fetch(`${API_URL}/promotor-categories`).then((resp) => resp.json())
        ])
            .then(([promotorsData, categoriesData, relationsData]) => {
                setPromotors(Array.isArray(promotorsData) ? promotorsData : []);
                setCategories(Array.isArray(categoriesData) ? categoriesData : []);
                setRelations(Array.isArray(relationsData) ? relationsData : []);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                setMessage("Hubo un error cargando la información.");
            });
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const resetForm = () => {
        setFormData({
            promotor_id: "",
            category_id: ""
        });
        setEditingId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");

        const payload = {
            promotor_id: parseInt(formData.promotor_id),
            category_id: parseInt(formData.category_id)
        };

        if (!payload.promotor_id || !payload.category_id) {
            setMessage("Debes seleccionar un promotor y una categoría.");
            return;
        }

        const url = editingId
            ? `${API_URL}/promotor-categories/${editingId}`
            : `${API_URL}/promotor-categories`;

        const method = editingId ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.msg && (
                    data.msg === "Esta relación ya existe" ||
                    data.msg === "Ya existe otra relación con esos datos" ||
                    data.msg === "Promotor no encontrado" ||
                    data.msg === "Categoría no encontrada" ||
                    data.msg === "Faltan datos"
                )) {
                    setMessage(data.msg);
                    return;
                }

                setMessage(editingId ? "Relación actualizada correctamente." : "Relación creada correctamente.");
                resetForm();
                loadData();
            })
            .catch((error) => {
                console.log(error);
                setMessage("Hubo un error guardando la relación.");
            });
    };

    const handleEdit = (relation) => {
        setEditingId(relation.id);
        setFormData({
            promotor_id: String(relation.promotor_id),
            category_id: String(relation.category_id)
        });
        setMessage("");
    };

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

                if (editingId === relationId) {
                    resetForm();
                }

                setMessage("Relación eliminada correctamente.");
                loadData();
            })
            .catch((error) => {
                console.log(error);
                setMessage("Hubo un error eliminando la relación.");
            });
    };

    const selectedPromotorRelations = useMemo(() => {
        if (formData.promotor_id === "") return [];

        return relations.filter(
            (relation) => relation.promotor_id === parseInt(formData.promotor_id)
        );
    }, [relations, formData.promotor_id]);

    const selectedPromotor = useMemo(() => {
        if (formData.promotor_id === "") return null;

        return promotors.find(
            (promotor) => promotor.id === parseInt(formData.promotor_id)
        ) || null;
    }, [promotors, formData.promotor_id]);

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow border-0 mb-4">
                        <div className="card-body p-4">
                            <h2 className="mb-4">
                                {editingId ? "Editar relación Promotor - Categoría" : "Crear relación Promotor - Categoría"}
                            </h2>

                            {message && (
                                <div className="alert alert-info">
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            Selector de promotor
                                        </label>
                                        <select
                                            className="form-select"
                                            name="promotor_id"
                                            value={formData.promotor_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">-- Selecciona un promotor --</option>
                                            {promotors.map((promotor) => (
                                                <option key={promotor.id} value={promotor.id}>
                                                    {promotor.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            Selector de categoría
                                        </label>
                                        <select
                                            className="form-select"
                                            name="category_id"
                                            value={formData.category_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">-- Selecciona una categoría --</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h5 className="mb-3">
                                        Categorías que pertenecen al promotor seleccionado
                                    </h5>

                                    {!selectedPromotor ? (
                                        <p className="text-muted mb-0">
                                            Selecciona un promotor para ver sus categorías.
                                        </p>
                                    ) : selectedPromotorRelations.length > 0 ? (
                                        <>
                                            <p>
                                                <strong>Promotor:</strong> {selectedPromotor.name}
                                            </p>
                                            <ul className="list-group">
                                                {selectedPromotorRelations.map((relation) => (
                                                    <li key={relation.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                        <span>{relation.category?.name}</span>
                                                        <span className="badge text-bg-secondary">
                                                            Relación #{relation.id}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : (
                                        <>
                                            <p>
                                                <strong>Promotor:</strong> {selectedPromotor.name}
                                            </p>
                                            <p className="text-muted mb-0">
                                                Este promotor no tiene categorías relacionadas.
                                            </p>
                                        </>
                                    )}
                                </div>

                                <div className="d-flex gap-2 mt-4">
                                    <button type="submit" className="btn btn-primary">
                                        {editingId ? "Actualizar relación" : "Guardar relación"}
                                    </button>

                                    {editingId && (
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={resetForm}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card shadow border-0">
                        <div className="card-body p-4">
                            <h3 className="mb-4">Lista de relaciones</h3>

                            {relations.length === 0 ? (
                                <p className="text-muted mb-0">
                                    No hay relaciones registradas.
                                </p>
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
                                                            <button
                                                                type="button"
                                                                className="btn btn-warning btn-sm"
                                                                onClick={() => handleEdit(relation)}
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                type="button"
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
            </div>
        </div>
    );
};