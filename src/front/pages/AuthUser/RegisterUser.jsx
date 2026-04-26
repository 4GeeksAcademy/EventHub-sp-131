import { useState } from "react";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const RegisterUser = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        location: "",
        age: "",
        description: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = (e) => {
        e.preventDefault();

        fetch(`${backendUrl}/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                location: formData.location,
                age: formData.age,
                description: formData.description,
                is_active: true
            })
        })
            .then((resp) => resp.json().then((data) => ({ ok: resp.ok, data })))
            .then(({ ok, data }) => {
                if (!ok) {
                    setError(data.message || "No se pudo crear la cuenta");
                    return;
                }

                setSuccess("Cuenta creada correctamente. Ahora inicia sesión.");

                setTimeout(() => {
                    navigate("/user/login");
                }, 1000);
            })
            .catch(() => {
                setError("Error al crear la cuenta");
            });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-7">
                    <div className="card shadow p-4">
                        <h1 className="text-center mb-4">Crear cuenta</h1>

                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        <form onSubmit={handleRegister}>
                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Ubicación</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Edad</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Descripción</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <button className="btn btn-success w-100">
                                Registrarme
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary w-100 mt-2"
                                onClick={() => navigate("/user/login")}
                            >
                                Ya tengo cuenta
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};