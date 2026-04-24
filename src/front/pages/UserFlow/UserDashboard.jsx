import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("tokenUser");

    if (!token) {
      navigate("/user/login");
      return;
    }

    fetch(import.meta.env.VITE_BACKEND_URL + "/api/user/private", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then((resp) => resp.json().then((data) => ({ ok: resp.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          navigate("/user/login");
          return;
        }

        setUser(data.user);
        localStorage.setItem("userAuth", JSON.stringify(data.user));
      });
  }, [navigate]);

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-5">
        <div className="bg-primary text-white p-4">
          <h2 className="fw-bold mb-1">Hola, {user?.name || "Usuario"} 👋</h2>
          <p className="mb-0">Bienvenido/a a tu perfil de usuario</p>
        </div>

        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-3 text-center mb-4 mb-md-0">
              <div
                className="rounded-circle bg-light border border-3 border-primary d-flex align-items-center justify-content-center mx-auto"
                style={{ width: "130px", height: "130px", fontSize: "45px" }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>

            <div className="col-md-9">
              <h3 className="fw-bold mb-3">
                {user?.name || "Nombre no registrado"}
              </h3>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3">
                    <small className="text-muted">Email</small>
                    <p className="mb-0 fw-semibold">{user?.email || "No registrado"}</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3">
                    <small className="text-muted">Edad</small>
                    <p className="mb-0 fw-semibold">{user?.age || "No registrada"}</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3">
                    <small className="text-muted">Localidad</small>
                    <p className="mb-0 fw-semibold">{user?.location || "No registrada"}</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3">
                    <small className="text-muted">Estado</small>
                    <p className="mb-0 fw-semibold text-success">Activo</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-light rounded-3">
                <small className="text-muted">Descripción</small>
                <p className="mb-0">
                  {user?.description || "Este usuario todavía no ha agregado una descripción."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h4 className="fw-bold mb-3">¿Qué quieres hacer?</h4>

      <div className="row g-4">
        <div className="col-md-3">
          <Link to="/user-flow/events" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
              <h5 className="fw-bold">Eventos futuros</h5>
              <p className="text-muted mb-0">Explora próximos eventos</p>
            </div>
          </Link>
        </div>

        <div className="col-md-3">
          <Link to="/user-flow/my-events" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
              <h5 className="fw-bold">Mis eventos</h5>
              <p className="text-muted mb-0">Asistidos y por asistir</p>
            </div>
          </Link>
        </div>

        <div className="col-md-3">
          <Link to="/user-flow/groups" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
              <h5 className="fw-bold">Grupos</h5>
              <p className="text-muted mb-0">Crea o únete a grupos</p>
            </div>
          </Link>
        </div>

        <div className="col-md-3">
          <Link to="/user-flow/users" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
              <h5 className="fw-bold">Usuarios</h5>
              <p className="text-muted mb-0">Conoce y agrega amigos</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};