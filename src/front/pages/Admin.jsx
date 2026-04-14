import React, { useEffect, useState } from "react";

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
                setMessage("Error al cargar admins");
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
                setMessage(data.message || "Operación realizada");
                resetForm();
                getAdmins();
            })
            .catch(() => {
                setMessage("Error al guardar admin");
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
    };

    const handleDelete = (id) => {
        fetch(`${backendUrl}/api/admins/${id}`, {
            method: "DELETE"
        })
            .then((resp) => resp.json())
            .then((data) => {
                setMessage(data.message || "Admin eliminado correctamente");
                getAdmins();
            })
            .catch(() => {
                setMessage("Error al eliminar admin");
            });
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">CRUD de Admin</h1>

            {message && (
                <div className="alert alert-info">
                    {message}
                </div>
            )}

            <div className="card p-4 mb-4">
                <h3 className="mb-3">
                    {editingId ? "Editar Admin" : "Crear Admin"}
                </h3>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="form-control mb-3"
                        placeholder="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                    />

                    <div className="form-check mb-3">
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
                        <button className="btn btn-primary" type="submit">
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

            <div className="row">
                {admins.length > 0 ? (
                    admins.map((admin) => (
                        <div className="col-md-4 mb-4" key={admin.id}>
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{admin.email}</h5>
                                    <p className="card-text mb-1">
                                        <strong>ID:</strong> {admin.id}
                                    </p>
                                    <p className="card-text mb-1">
                                        <strong>Rol:</strong> {admin.role}
                                    </p>
                                    <p className="card-text mb-3">
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
                    <p>No hay admins registrados</p>
                )}
            </div>
        </div>
    );
};