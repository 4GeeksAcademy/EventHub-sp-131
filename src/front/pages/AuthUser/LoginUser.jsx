import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import EventHubHeroImage from "../../assets/img/EventHubHeroImage.png";

export const LoginUser = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        if (store.userAuth && localStorage.getItem("tokenUser")) {
            navigate("/user/private");
        }
    }, [store.userAuth, navigate]);

    function handleLogin(e) {
        e.preventDefault();

        fetch(import.meta.env.VITE_BACKEND_URL + "/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })
            .then((resp) => resp.json().then((data) => ({ ok: resp.ok, data })))
            .then(({ ok, data }) => {
                if (!ok) {
                    setError("Bad email or password");
                    return;
                }

                localStorage.setItem("tokenUser", data.token);
                localStorage.setItem("userAuth", "true");
                localStorage.setItem("user", JSON.stringify(data.user));

                dispatch({
                    type: "ADD_TOKEN_USER",
                    payload: data.token
                });

                dispatch({
                    type: "ADD_LOGIN_STATUS_USER",
                    payload: true
                });

                navigate("/user/private");
            })
            .catch(() => {
                setError("Something went wrong");
            });
    }

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
            <div className="login-overlay container-fluid">

                <div className="row min-vh-100 align-items-center">

                    {/* LEFT SIDE */}
                    <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-center px-5">

                        <div className="branding-content">
                            <h1 className="brand-title">EVENT HUB</h1>

                            <h2 className="hero-text">
                                Conecta.
                                <br />
                                Descubre.
                                <br />
                                Vive la experiencia.
                            </h2>

                            <p className="hero-subtext">
                                Descubre eventos inolvidables,
                                conecta con personas y vive momentos únicos.
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
                                    <h3>24/7</h3>
                                    <p>Experiencias</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="col-lg-6 d-flex justify-content-center align-items-center">

                        <div className="login-card">

                            <Link to="/" className="back-link">
                                ← Volver
                            </Link>

                            <h1 className="login-title">
                                Bienvenido de nuevo
                            </h1>

                            <p className="login-subtitle">
                                Tu próxima experiencia comienza aquí.
                            </p>

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin}>

                                <div className="mb-4">
                                    <label className="form-label login-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control login-input"
                                        placeholder="Ingresa tu correo electrónico"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label login-label">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control login-input"
                                        placeholder="Ingresa tu contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <button className="btn login-btn w-100">
                                    Inicia sesión
                                </button>
                            </form>

                            <div className="signup-container">
                                <p>
                                    ¿No tienes cuenta?
                                </p>

                                <Link
                                    to="/user/register"
                                    className="signup-link"
                                >
                                    Crear Cuenta
                                </Link>
                            </div>

                            <div className="promoter-container">

                                <p className="promoter-text">
                                    ¿Gestionas eventos?
                                </p>

                                <Link
                                    to="/promotor/login"
                                    className="promoter-link"
                                >
                                    Inicia sesión como promotor
                                </Link>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};