import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const EditUser = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();
    const navigate = useNavigate();
    const { store } = useGlobalReducer();

    const [form, setForm] = useState({});

    useEffect(() => {
        fetch(`${backendUrl}/api/users/${id}`)
            .then(resp => resp.json())
            .then(data => setForm(data.results));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await fetch(`${backendUrl}/api/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        navigate("/user", {
            state: { message: "Usuario actualizado correctamente" }
        });
    };

    if (!store.adminAuth) {
        return <Navigate to="/admin/login" />;
    }

    return (
        <div className="container py-5">
            <h1>Editar Usuario</h1>

            <form onSubmit={handleSubmit}>
                <input name="name" value={form.name || ""} onChange={handleChange} className="form-control mb-2" placeholder="Nombre" />
                <input name="email" value={form.email || ""} onChange={handleChange} className="form-control mb-2" placeholder="usuario@email.com"/>
                <input name="password" value={form.password || ""} onChange={handleChange} className="form-control mb-2" placeholder="********" />

                <input name="location" value={form.location || ""} onChange={handleChange} className="form-control mb-2" placeholder="Madrid,ES"/>
                <input name="age" value={form.age || ""} onChange={handleChange} className="form-control mb-2" placeholder="Edad"/>
                <textarea name="description" value={form.description || ""} onChange={handleChange} className="form-control mb-2" placeholder="Descripcion" />

                <button className="btn btn-warning">Actualizar</button>
                <button className="btn btn-secondary" onClick={() => navigate("/user")}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};
export default EditUser;