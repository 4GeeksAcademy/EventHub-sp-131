import { Link, useNavigate, Navigate } from "react-router-dom";
import EventHubHeroImage from "../../assets/img/EventHubHeroImage.png";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useEffect, useState } from "react";
import FestivalPromotor from "../../assets/img/FestivalPromotor.jpg";

export const LoginPromotor = () => {
  const { store, dispatch } = useGlobalReducer()
  const urlApi = import.meta.env.VITE_BACKEND_URL
  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")
  const [tokenApi, setTokenApi] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const navigate = useNavigate()

  async function loginUser(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${urlApi}/api/promotor/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "email": email,
          "password": pw
        })
      })

      if (!response.ok) {
        const resp = await response.json()
        setErrorMsg(resp.msg)
        throw new Error("Error on post fetch, status: ", response.status)
      }
      const token = (await response.json()).access_token
      localStorage.setItem("token", token)
      dispatch({ type: "ADD_TOKEN_PROMOTOR", payload: token })
      setTimeout(() => {
        if (response.ok) {
          navigate('/promotor/private');
        }
      }, 1000);
    }

    catch (error) {
      console.log("Error on fetch: ", error.message)
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token") != null && localStorage.getItem("token") != "") {
      setTokenApi(localStorage.getItem("token"))
      dispatch({ type: "ADD_TOKEN_PROMOTOR", payload: localStorage.getItem("token") })
    }

    if (localStorage.getItem("promotorAuth") === "true") {
      dispatch({ type: "ADD_LOGIN_STATUS_PROMOTOR", payload: localStorage.getItem("promotorAuth") })
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setErrorMsg("")
    }, 6000)
  }, [errorMsg])

  return (

        <div
            className="login-page"
            style={{
                background: `
                linear-gradient(rgba(5, 8, 22, 0.80), rgba(5, 8, 22, 0.92)),
                url(${FestivalPromotor})
                center/cover no-repeat`
            }}
        >

            {store.promotorAuth === true &&
                <Navigate to="/promotor/private" />
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
                                Gestiona.
                                <br />
                                Promociona.
                                <br />
                                Haz crecer tus eventos.
                            </h2>

                            <p className="hero-subtext">
                                Administra conciertos, festivales y experiencias
                                inolvidables desde una sola plataforma.
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
                                    <p>Producción</p>
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT SIDE */}

                    <div className="col-lg-6 d-flex justify-content-center align-items-center">

                        <div className="login-card promoter-card">

                            <Link to="/" className="back-link">
                                ← Volver
                            </Link>

                            <h1 className="login-title">
                                Panel Promotor
                            </h1>

                            <p className="login-subtitle">
                                Accede y administra tus eventos en tiempo real.
                            </p>

                            {errorMsg &&
                                <div className="alert alert-danger">
                                    {errorMsg}
                                </div>
                            }

                            <form onSubmit={loginUser}>

                                <div className="mb-4">

                                    <label className="form-label login-label">
                                        Correo electrónico
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control login-input"
                                        placeholder="Ingresa tu correo"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                </div>

                                <div className="mb-4">

                                    <label className="form-label login-label">
                                        Contraseña
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control login-input"
                                        placeholder="Ingresa tu contraseña"
                                        value={pw}
                                        onChange={(e) => setPw(e.target.value)}
                                    />

                                </div>

                                <button
                                    type="submit"
                                    className="btn login-btn w-100"
                                >
                                    Iniciar sesión
                                </button>

                            </form>

                            <div className="signup-container">

                                <p>
                                    ¿Aún no eres promotor?
                                </p>

                                <Link
                                    to="/promotor/sign-up"
                                    className="signup-link"
                                >
                                    Crear cuenta
                                </Link>

                            </div>

                            <div className="promoter-container">

                                <p className="promoter-text">
                                    ¿Buscas eventos?
                                </p>

                                <Link
                                    to="/user/login"
                                    className="promoter-link"
                                >
                                    Inicia sesión como usuario
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};