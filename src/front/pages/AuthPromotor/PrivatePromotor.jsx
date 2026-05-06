import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useEffect, useState, useRef } from "react";
import { CreateEventForm } from "../../components/Event/CreateEventForm";
import { EventList } from "../../components/Event/EventList";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";

export const PrivatePromotor = () => {
  const { dispatch } = useGlobalReducer();
  const eventListRef = useRef(null);
  const createEventRef = useRef(null);

  const navigate = useNavigate();
  const urlApi = import.meta.env.VITE_BACKEND_URL;

  const [profileInfo, setProfileInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authUser(localStorage.getItem("token"));
  }, []);

  async function authUser(token) {
    try {
      if (!token) {
        navigate("/promotor/login");
        return;
      }

      const response = await fetch(`${urlApi}/api/promotor/private`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        dispatch({ type: "ADD_LOGIN_STATUS_PROMOTOR", payload: false });
        localStorage.removeItem("promotorAuth");
        navigate("/promotor/login");
        return;
      }

      dispatch({ type: "ADD_LOGIN_STATUS_PROMOTOR", payload: true });
      localStorage.setItem("promotorAuth", "true");

      const data = await response.json();
      setProfileInfo(data.promotor);
    } catch (error) {
      console.log("Error on fetch: ", error.message);
      dispatch({ type: "ADD_LOGIN_STATUS_PROMOTOR", payload: false });
      navigate("/promotor/login");
    } finally {
      setLoading(false);
    }
  }

  const openCreateEvent = () => {
    const collapseElement = document.getElementById("collapseExample");

    if (collapseElement && window.bootstrap) {
      const collapse = new window.bootstrap.Collapse(collapseElement, {
        toggle: false,
      });

      collapse.show();
    }

    setTimeout(() => {
      createEventRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  if (loading) {
    return (
      <DashboardLayout
        role="promotor"
        title="Panel Promotor"
        subtitle="Verificando sesión..."
        userName="Promotor"
      >
        <div className="eventhub-panel">
          <p className="mb-0">Cargando perfil...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="promotor"
      title="Panel Promotor"
      subtitle="Gestiona tu actividad como promotor dentro de EventHub."
      userName={profileInfo?.name}
      onCreateEvent={openCreateEvent}
    >
      {profileInfo ? (
        <div className="eventhub-promotor-dashboard">
          <section className="eventhub-promotor-overview">
            <div className="eventhub-promotor-profile-card">
              <span className="eventhub-kicker">Perfil promotor</span>
              <h2>{profileInfo.name}</h2>
              <p>{profileInfo.email || "Email no registrado"}</p>

              <div className="eventhub-promotor-info-grid">
                <div>
                  <span>Ubicación</span>
                  <strong>{profileInfo.location || "No registrada"}</strong>
                </div>

                <div>
                  <span>Estado</span>
                  <strong>Activo</strong>
                </div>

                <div>
                  <span>Rol</span>
                  <strong>Promotor</strong>
                </div>
              </div>
            </div>

            <div className="eventhub-promotor-message-card">
              <span className="eventhub-kicker">Mensajes</span>
              <h3>Comunicación con usuarios</h3>
              <p>
                Revisa conversaciones iniciadas por usuarios interesados en tus eventos.
              </p>

              <button
                className="eventhub-main-btn"
                type="button"
                onClick={() => navigate("/promotor/chat")}
              >
                Ver mensajes
              </button>
            </div>
          </section>

          <section className="eventhub-promotor-guide">
            <span className="eventhub-kicker">Guía rápida</span>
            <h3>Qué puedes hacer como promotor</h3>

            <div className="eventhub-promotor-guide-grid">
              <div>
                <i className="bi bi-calendar-plus"></i>
                <h5>Crear eventos</h5>
                <p>Usa la opción del menú lateral para abrir el formulario.</p>
              </div>

              <div>
                <i className="bi bi-calendar-check"></i>
                <h5>Gestionar publicaciones</h5>
                <p>Revisa tus eventos creados y actualiza la información.</p>
              </div>

              <div>
                <i className="bi bi-chat-dots"></i>
                <h5>Responder mensajes</h5>
                <p>Atiende dudas de usuarios y mantén la comunicación activa.</p>
              </div>
            </div>
          </section>

          <section ref={createEventRef} className="collapse mb-4" id="collapseExample">
            <div className="eventhub-panel">
              <span className="eventhub-kicker">Nuevo evento</span>
              <h3>Crear evento</h3>

              <CreateEventForm
                id={profileInfo.id}
                type={"promotor"}
                onSuccess={() => {
                  const collapseElement = document.getElementById("collapseExample");

                  if (collapseElement && window.bootstrap) {
                    const collapse = new window.bootstrap.Collapse(collapseElement);
                    collapse.hide();
                  }

                  eventListRef.current?.refreshEvents();
                }}
              />
            </div>
          </section>

          <section className="eventhub-panel">
            <span className="eventhub-kicker">Eventos</span>
            <h3>Mis eventos</h3>

            <EventList ref={eventListRef} profile={profileInfo} type={"promotor"} />
          </section>
        </div>
      ) : (
        <div className="eventhub-panel">
          <p className="mb-0">No se pudo cargar el perfil del promotor.</p>
        </div>
      )}
    </DashboardLayout>
  );
};