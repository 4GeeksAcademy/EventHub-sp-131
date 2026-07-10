import { Link, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import EventHubHeroImage from "../../assets/img/EventHubHeroImage.png";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import FestivalPromotor from "../../assets/img/FestivalPromotor.jpg";
import devLog from "../../utils/devLogger";

export const PromotorSignUp = () => {
  const { store, dispatch } = useGlobalReducer();
  const urlApi = import.meta.env.VITE_BACKEND_URL;
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [webPage, setWebPage] = useState("");
  const navigate = useNavigate();

  async function loginUser(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${urlApi}/api/promotor/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "email": email,
          "password": pw
        })
      });

      if (!response.ok) {
        const resp = await response.json();
        setErrorMsg(resp.msg);
        throw new Error("Error on post fetch, status: ", response.status);
      }
      const token = (await response.json()).access_token;
      localStorage.setItem("token", token);
      dispatch({ type: "ADD_TOKEN_PROMOTOR", payload: token });
      setTimeout(() => {
        if (response.ok) {
          navigate('/promotor/private');
        }
      }, 1000);
        }

        catch (error) {
            devLog.error("Error on fetch: ", error.message);
        }
  }

  async function signUpPromotor(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${urlApi}/api/promotor/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "email": email,
          "password": pw,
          "name": name,
          "location": location,
          "phone": phone,
          "web_page": webPage
        })
      });
      if (!response.ok) {
        throw new Error("Error on post fetch, status: ", response.status);
      }
      loginUser(e);
      /*setTimeout(() => {
         if (response.ok) {
          navigate('/promotor/private');
        }
      }, 1000); */
        }
        catch (error) {
            devLog.error("Error on fetch: ", error.message);
        }
  }

  useEffect(() => {
    if (localStorage.getItem("promotorAuth") === "true") {
      dispatch({ type: "ADD_LOGIN_STATUS_PROMOTOR", payload: localStorage.getItem("promotorAuth") });
    }
  }, []);

  return (

    <div
        className="login-page"
        style={{
            background: `
            linear-gradient(rgba(5, 8, 22, 0.82), rgba(5, 8, 22, 0.94)),
            url(${FestivalPromotor})
            center/cover no-repeat`
        }}
    >

        {store.promotorAuth === "true"
            ? <Navigate to="/promotor/private" />
            : null
        }

        <div className="container-fluid">

            <div className="row min-vh-100 align-items-center">

                {/* LEFT SIDE */}

                <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-center px-5">

                    <div className="branding-content">

                        <h1 className="brand-title">
                            EVENT HUB PRO
                        </h1>

                        <h2 className="hero-text">
                            Lleva tus
                            <br />
                            eventos al
                            <br />
                            siguiente nivel.
                        </h2>

                        <p className="hero-subtext">
                            Gestiona conciertos, festivales y experiencias
                            masivas desde una sola plataforma.
                        </p>

                        <div className="stats-container mt-5">

                            <div>
                                <h3>+500</h3>
                                <p>Eventos</p>
                            </div>

                            <div>
                                <h3>+20K</h3>
                                <p>Asistentes</p>
                            </div>

                            <div>
                                <h3>24/7</h3>
                                <p>Producción</p>
                            </div>

                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE */}

                <div className="col-lg-6 d-flex justify-content-center align-items-center py-5">

                    <div className="login-card register-card promoter-card">

                        <Link to="/" className="back-link">
                            ← Volver
                        </Link>

                        <h1 className="login-title">
                            Registro Promotor
                        </h1>

                        <p className="login-subtitle">
                            Crea tu cuenta y comienza a gestionar eventos.
                        </p>

                        <form onSubmit={signUpPromotor}>

                            <div className="mb-3">

                                <label className="form-label login-label">
                                    Nombre
                                </label>

                                <input
                                    type="text"
                                    className="form-control login-input"
                                    placeholder="Nombre de empresa o promotor"
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    required
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label login-label">
                                    Correo electrónico
                                </label>

                                <input
                                    type="email"
                                    className="form-control login-input"
                                    placeholder="Ingresa tu correo"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    required
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label login-label">
                                    Contraseña
                                </label>

                                <input
                                    type="password"
                                    className="form-control login-input"
                                    placeholder="Crea una contraseña"
                                    onChange={(e) => setPw(e.target.value)}
                                    value={pw}
                                    required
                                />

                            </div>

                            <div className="row">

                                <div className="col-md-6 mb-3">

                                    <label className="form-label login-label">
                                        Ubicación
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control login-input"
                                        placeholder="Ciudad"
                                        onChange={(e) => setLocation(e.target.value)}
                                        value={location}
                                        required
                                    />

                                </div>

                                <div className="col-md-6 mb-3">

                                    <label className="form-label login-label">
                                        Teléfono
                                    </label>

                                    <input
                                        type="tel"
                                        className="form-control login-input"
                                        placeholder="912223344"
                                        onChange={(e) => setPhone(e.target.value)}
                                        value={phone}
                                        required
                                    />

                                </div>

                            </div>

                            <div className="mb-4">

                                <label className="form-label login-label">
                                    Página web
                                </label>

                                <input
                                    type="text"
                                    className="form-control login-input"
                                    placeholder="https://tuweb.com"
                                    onChange={(e) => setWebPage(e.target.value)}
                                    value={webPage}
                                    required
                                />

                            </div>

                            <button
                                type="submit"
                                className="btn login-btn w-100"
                            >
                                Crear cuenta
                            </button>

                        </form>

                        <div className="signup-container">

                            <p>
                                ¿Ya tienes cuenta?
                            </p>

                            <Link
                                to="/promotor/login"
                                className="signup-link"
                            >
                                Inicia sesión
                            </Link>

                        </div>

                        <div className="promoter-container">

                            <p className="promoter-text">
                                ¿Buscas eventos?
                            </p>

                            <Link
                                to="/user/register"
                                className="promoter-link"
                            >
                                Crear cuenta de usuario
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>
);

};