import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export const EditAdmin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const { id } = useParams();

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        email: "",
        password: "",
        is_active: true
    });

    useEffect(() => {
        fetch(`${backendUrl}/api/admins/${id}`)
            .then(async (resp) => {
                const data = await resp.json();
                if (!resp.ok) throw new Error(data.message || "Error al cargar administrador");
                return data;
            })
            .then((data) => {
                setForm({
                    email: data.results.email || "",
                    password: "",
                    is_active: data.results.is_active
                });
                setLoading(false);
            })
            .catch((error) => {
                setMessage(error.message);
                setLoading(false);
            });
    }, [backendUrl, id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`${backendUrl}/api/admins/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        })
            .then(async (resp) => {
                const data = await resp.json();
                if (!resp.ok) throw new Error(data.message || "Error al actualizar administrador");
                return data;
            })
            .then((data) => {
                setMessage(data.message || "Administrador actualizado correctamente");
                setTimeout(() => navigate("/admin"), 800);
            })
            .catch((error) => {
                setMessage(error.message);
            });
    };

    if (loading) {
        return (
            <div className="container py-5">
                <div className="alert alert-secondary">Cargando administrador...</div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold mb-1">Editar administrador</h1>
                    <p className="text-muted mb-0">Actualización de datos del administrador</p>
                </div>
                <Link to="/admin" className="btn btn-outline-dark">
                    Volver al panel
                </Link>
            </div>

            {message && <div className="alert alert-info">{message}</div>}

            <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Correo electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Nueva contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Déjala vacía si no quieres cambiarla"
                            />
                        </div>

                        <div className="form-check mb-4">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="is_active"
                                checked={form.is_active}
                                onChange={handleChange}
                                id="editIsActive"
                            />
                            <label className="form-check-label" htmlFor="editIsActive">
                                Activo
                            </label>
                        </div>

                        <button className="btn btn-dark" type="submit">
                            Guardar cambios
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};