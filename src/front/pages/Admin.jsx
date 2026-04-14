import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Admin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [admins, setAdmins] = useState([]);
    const [message, setMessage] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        email: "",
        password: "",
        is_active: true
    });

    const getAdmins = () => {
        fetch(`${backendUrl}/api/admins`)
            .then((resp) => resp.json())
            .then((data) => {
                setAdmins(data.results || []);
            })
            .catch(() => {
                setMessage("Error al cargar administradores");
            });
    };

    useEffect(() => {
        getAdmins();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const resetForm = () => {
        setForm({
            email: "",
            password: "",
            is_active: true
        });
        setEditingId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = editingId
            ? `${backendUrl}/api/admins/${editingId}`
            : `${backendUrl}/api/admins`;

        const method = editingId ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        })
            .then((resp) => resp.json())
            .then((data) => {
                setMessage(data.message || "Operación realizada correctamente");
                resetForm();
                getAdmins();
            })
            .catch(() => {
                setMessage("Error al guardar administrador");
            });
    };

    const handleEdit = (admin) => {
        setEditingId(admin.id);
        setForm({
            email: admin.email,
            password: "",
            is_active: admin.is_active
        });
        setMessage("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = (id) => {
        fetch(`${backendUrl}/api/admins/${id}`, {
            method: "DELETE"
        })
            .then((resp) => resp.json())
            .then((data) => {
                setMessage(data.message || "Administrador eliminado correctamente");
                getAdmins();
            })
            .catch(() => {
                setMessage("Error al eliminar administrador");
            });
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="fw-bold mb-1">Panel de Administración</h1>
                            <p className="text-muted mb-0">Gestión de administradores</p>
                        </div>

                        <Link to="/" className="btn btn-outline-dark">
                            Volver
                        </Link>
                    </div>

                    {message && (
                        <div className="alert alert-info">
                            {message}
                        </div>
                    )}

                    <div className="card shadow-sm border-0 mb-5">
                        <div className="card-body p-4">
                            <h3 className="mb-4">
                                {editingId ? "Editar administrador" : "Crear administrador"}
                            </h3>

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Correo electrónico</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="admin@test.com"
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder="********"
                                            required={!editingId}
                                        />
                                    </div>
                                </div>

                                <div className="form-check mb-4">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="is_active"
                                        checked={form.is_active}
                                        onChange={handleChange}
                                        id="isActiveCheck"
                                    />
                                    <label className="form-check-label" htmlFor="isActiveCheck">
                                        Activo
                                    </label>
                                </div>

                                <div className="d-flex gap-2">
                                    <button className="btn btn-dark" type="submit">
                                        {editingId ? "Actualizar" : "Crear"}
                                    </button>

                                    <button
                                        className="btn btn-secondary"
                                        type="button"
                                        onClick={resetForm}
                                    >
                                        Limpiar
                                    </button>
                                </div>
                            </form>
                        </div>
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
                                                <button
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() => handleEdit(admin)}
                                                >
                                                    Editar
                                                </button>

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
            </div>
        </div>
    );
};
