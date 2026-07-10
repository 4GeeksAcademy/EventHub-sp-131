import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const CreateUser = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const { store } = useGlobalReducer();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        location: "",
        age: "",
        description: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await fetch(`${backendUrl}/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        navigate("/user", {
            state: { message: "Usuario creado correctamente" }
        });
    };
    
    if (!store.adminAuth) {
    return <Navigate to="/admin/login" />;
    }

    return (
        <div className="container py-5">
            <h1>Crear Usuario</h1>

            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Nombre" onChange={handleChange} className="form-control mb-2" />
                <input name="email" placeholder="Email" onChange={handleChange} className="form-control mb-2" />
                <input name="password" placeholder="Password" onChange={handleChange} className="form-control mb-2" />

                <input name="location" placeholder="Location" onChange={handleChange} className="form-control mb-2" />
                <input name="age" placeholder="Age" onChange={handleChange} className="form-control mb-2" />
                <textarea name="description" placeholder="Description" onChange={handleChange} className="form-control mb-2" />

                <button className="btn btn-success">Crear</button>
                <button className="btn btn-secondary" onClick={() => navigate("/user")}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default CreateUser;