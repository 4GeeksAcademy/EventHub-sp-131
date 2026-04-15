import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const CreateAdmin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [form, setForm] = useState({
        email: "",
        password: "",
        is_active: true
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`${backendUrl}/api/admins`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        })
            .then(async (resp) => {
                const data = await resp.json();
                if (!resp.ok) throw new Error(data.message || "Error al crear administrador");
                return data;
            })
            .then((data) => {
                setMessage(data.message || "Administrador creado correctamente");
                setTimeout(() => navigate("/admin"), 800);
            })
            .catch((error) => {
                setMessage(error.message);
            });
    };

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold mb-1">Crear administrador</h1>
                    <p className="text-muted mb-0">Registro de nuevos administradores</p>
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
                                placeholder="admin@test.com"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="********"
                                required
                            />
                        </div>

                        <div className="form-check mb-4">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="is_active"
                                checked={form.is_active}
                                onChange={handleChange}
                                id="createIsActive"
                            />
                            <label className="form-check-label" htmlFor="createIsActive">
                                Activo
                            </label>
                        </div>

                        <button className="btn btn-dark" type="submit">
                            Crear administrador
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};