import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";

export const PrivateUser = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("tokenUser");

    if (!token) {
      navigate("/user/login");
      return;
    }

    fetch(import.meta.env.VITE_BACKEND_URL + "/api/private", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((resp) => resp.json().then((data) => ({ ok: resp.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          localStorage.removeItem("tokenUser");
          localStorage.removeItem("userAuth");
          dispatch({ type: "USER_LOGOUT" });
          navigate("/user/login");
          return;
        }

        localStorage.setItem("userAuth", "true");

        dispatch({ type: "ADD_TOKEN_USER", payload: token });
        dispatch({ type: "ADD_LOGIN_STATUS_USER", payload: true });
        dispatch({ type: "GET_PRIVATE_USER", payload: data.user || data });
      })
      .catch((error) => {
        console.log("ERROR PRIVATE USER:", error);
      });
  }, []);

  return (
    <DashboardLayout
      role="user"
      title="Mi perfil"
      subtitle="Bienvenida a tu espacio personal en EventHub."
      userName={store.privateUser?.name}
    >
      {store.privateUser ? (
        <div className="eventhub-user-dashboard">
          <section className="eventhub-user-profile-main">
            <div className="eventhub-user-cover">
              <div>
                <span>Perfil de usuario</span>
                <h3>Tu actividad en EventHub</h3>
              </div>
            </div>

            <div className="eventhub-user-profile-content">
              <div className="eventhub-user-avatar-large">
                {store.privateUser.name?.charAt(0).toUpperCase()}
              </div>

              <div className="eventhub-user-main-info">
                <h2>{store.privateUser.name}</h2>
                <p>{store.privateUser.email}</p>
              </div>

              <div className="eventhub-user-info-grid">
                <div>
                  <span>Localidad</span>
                  <strong>{store.privateUser.location || "No registrada"}</strong>
                </div>

                <div>
                  <span>Edad</span>
                  <strong>{store.privateUser.age || "No registrada"}</strong>
                </div>

                <div>
                  <span>Sobre mí</span>
                  <strong>{store.privateUser.description || "Sin descripción"}</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="eventhub-user-side-panel">
            <div className="eventhub-user-action-card">
              <span className="eventhub-kicker">Acciones rápidas</span>
              <h4>Explora eventos</h4>
              <p>
                Busca eventos por imagen o revisa la lista completa de eventos disponibles.
              </p>

              <div className="eventhub-action-buttons">
                <Link to="/search-by-image" className="eventhub-main-btn">
                  Buscar por imagen
                </Link>

                <button
                  className="eventhub-secondary-btn"
                  type="button"
                  onClick={() => navigate("/user/events")}
                >
                  Ver eventos
                </button>
              </div>
            </div>

            <div className="eventhub-user-mini-card">
              <span className="eventhub-kicker">Resumen</span>
              <h5>Tu panel</h5>
              <p>
                Usa el menú lateral para eventos guardados, asistencias, grupos,
                perfiles y MatchEvents.
              </p>
            </div>
          </section>
        </div>
      ) : (
        <div className="eventhub-panel">
          <p className="mb-0">Cargando...</p>
        </div>
      )}
    </DashboardLayout>
  );
};