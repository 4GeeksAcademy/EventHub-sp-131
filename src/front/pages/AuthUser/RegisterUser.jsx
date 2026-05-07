import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import EventHubHeroImage from "../../assets/img/EventHubHeroImage.png";

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
            .then((resp) =>
                resp.json().then((data) => ({
                    ok: resp.ok,
                    data
                }))
            )
            .then(({ ok, data }) => {

                if (!ok) {
                    setError(data.message || "Could not create account");
                    return;
                }

                setSuccess("Account created successfully");

                setTimeout(() => {
                    navigate("/user/login");
                }, 1200);
            })
            .catch(() => {
                setError("Something went wrong");
            });
    };

    return (

        <div
            className="login-page"
            style={{
                background: `
                linear-gradient(rgba(5, 8, 22, 0.82), rgba(5, 8, 22, 0.92)),
                url(${EventHubHeroImage})
                center/cover no-repeat`
            }}
        >

            <div className="container-fluid">

                <div className="row min-vh-100 align-items-center">

                    {/* LEFT SIDE */}

                    <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-center px-5">

                        <div className="branding-content">

                            <h1 className="brand-title">
                                EVENT HUB
                            </h1>

                            <h2 className="hero-text">
                                Vive la
                                <br />
                                nueva genereación
                                <br />
                                de experiencias.
                            </h2>

                            <p className="hero-subtext">
                                Crea tu cuenta y descubre conciertos, festivales, vida nocturna y eventos inolvidables.
                            </p>

                            <div className="stats-container mt-5">

                                <div>
                                    <h3>+500</h3>
                                    <p>Eventos</p>
                                </div>

                                <div>
                                    <h3>+20K</h3>
                                    <p>Usuarios</p>
                                </div>

                                <div>
                                    <h3>∞</h3>
                                    <p>Recuerdos</p>
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT SIDE */}

                    <div className="col-lg-6 d-flex justify-content-center align-items-center py-5">

                        <div className="login-card register-card">

                            <Link to="/" className="back-link">
                                ← Volver
                            </Link>

                            <h1 className="login-title">
                                Crear Cuenta
                            </h1>

                            <p className="login-subtitle">
                                Tu próxima experiencia comienza aquí con EventHub.
                            </p>

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleRegister}>

                                <div className="mb-3">
                                    <label className="form-label login-label">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control login-input"
                                        name="name"
                                        placeholder="Tu nombre completo"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label login-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control login-input"
                                        name="email"
                                        placeholder="Ingresa tu correo"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label login-label">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control login-input"
                                        name="password"
                                        placeholder="Crea una contraseña"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="row">

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label login-label">
                                            Location
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control login-input"
                                            name="location"
                                            placeholder="Ciudad"
                                            value={formData.location}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label login-label">
                                            Age
                                        </label>

                                        <input
                                            type="number"
                                            className="form-control login-input"
                                            name="age"
                                            placeholder="Edad"
                                            value={formData.age}
                                            onChange={handleChange}
                                        />
                                    </div>

                                </div>

                                <div className="mb-4">

                                    <label className="form-label login-label">
                                        About You
                                    </label>

                                    <textarea
                                        className="form-control login-input"
                                        name="description"
                                        rows="3"
                                        placeholder="Cuéntanos algo sobre ti..."
                                        value={formData.description}
                                        onChange={handleChange}
                                    />

                                </div>

                                <button className="btn login-btn w-100">
                                    Crear Cuenta
                                </button>

                            </form>

                            <div className="signup-container">

                                <p>
                                    ¿Ya tienes una cuenta?
                                </p>

                                <Link
                                    to="/user/login"
                                    className="signup-link"
                                >
                                    Inicia sesion
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};