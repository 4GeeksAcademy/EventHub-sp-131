import { Navigate, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";

export const PrivateAdmin = () => {
  const { store, dispatch } = useGlobalReducer();
  const urlApi = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);

  const adminModules = [
    {
      title: "Admins",
      text: "Gestiona administradores de la plataforma.",
      to: "/admin",
      icon: "bi bi-person-gear",
    },
    {
      title: "Promotores",
      text: "Gestiona cuentas de promotores.",
      to: "/promotor",
      icon: "bi bi-megaphone",
    },
    {
      title: "Usuarios",
      text: "Consulta y administra usuarios registrados.",
      to: "/user",
      icon: "bi bi-people",
    },
    {
      title: "Categorías",
      text: "Administra categorías de eventos.",
      to: "/category-panel",
      icon: "bi bi-tags",
    },
    {
      title: "Eventos",
      text: "Gestiona eventos creados en la plataforma.",
      to: "/events",
      icon: "bi bi-calendar-event",
    },
    {
      title: "Grupos",
      text: "Administra grupos y comunidades.",
      to: "/group",
      icon: "bi bi-diagram-3",
    },
    {
      title: "Promotor-Categoría",
      text: "Gestiona relaciones entre promotores y categorías.",
      to: "/promotor-category/list",
      icon: "bi bi-link-45deg",
    },
    {
      title: "Saved Events",
      text: "Consulta eventos guardados por usuarios.",
      to: "/saved-event",
      icon: "bi bi-bookmark-heart",
    },
    {
      title: "Discusiones",
      text: "Administra discusiones dentro de grupos.",
      to: "/discussion",
      icon: "bi bi-chat-square-text",
    },
    {
      title: "Amigos",
      text: "Gestiona relaciones de amistad entre usuarios.",
      to: "/friend",
      icon: "bi bi-person-plus",
    },
    {
      title: "Comentarios",
      text: "Revisa comentarios hechos en eventos.",
      to: "/comments",
      icon: "bi bi-chat-dots",
    },
    {
      title: "User Category",
      text: "Gestiona intereses o categorías de usuarios.",
      to: "/user-category",
      icon: "bi bi-person-lines-fill",
    },
    {
      title: "Group Category",
      text: "Gestiona categorías asociadas a grupos.",
      to: "/group-category",
      icon: "bi bi-collection",
    },
    {
      title: "Group Event",
      text: "Gestiona eventos asociados a grupos.",
      to: "/group-event",
      icon: "bi bi-calendar-range",
    },
    {
      title: "Event Category",
      text: "Gestiona categorías asociadas a eventos.",
      to: "/event-category",
      icon: "bi bi-calendar2-check",
    },
    {
      title: "Event Promotor",
      text: "Gestiona relaciones entre eventos y promotores.",
      to: "/event-promotor",
      icon: "bi bi-megaphone-fill",
    },
    {
      title: "Event Assist",
      text: "Consulta asistencias confirmadas por usuarios.",
      to: "/event-assists",
      icon: "bi bi-check-circle",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("tokenAdmin")?.trim();

    if (!token) {
      dispatch({ type: "ADD_LOGIN_STATUS_ADMIN", payload: false });
      setLoading(false);
      return;
    }

    authAdmin(token);
  }, []);

  async function authAdmin(token) {
    try {
      const response = await fetch(`${urlApi}api/admin/private`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem("tokenAdmin");
        localStorage.removeItem("adminAuth");

        dispatch({ type: "ADD_LOGIN_STATUS_ADMIN", payload: false });
        return;
      }

      const data = await response.json();

      dispatch({ type: "ADD_LOGIN_STATUS_ADMIN", payload: true });
      localStorage.setItem("adminAuth", "true");

      setAdminInfo(data.admin || data);

      console.log("Admin validado:", data);
    } catch (error) {
      console.log("Error:", error.message);
      dispatch({ type: "ADD_LOGIN_STATUS_ADMIN", payload: false });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        role="admin"
        title="Panel Admin"
        subtitle="Verificando sesión..."
        userName="Admin"
      >
        <div className="eventhub-panel">
          <p className="mb-0">Verificando sesión...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!store.adminAuth) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <DashboardLayout
      role="admin"
      title="Panel Admin"
      subtitle="Administra usuarios, promotores, eventos y relaciones internas de EventHub."
      userName={adminInfo?.name || "Admin"}
    >
      <div className="eventhub-admin-dashboard">
        <section className="eventhub-admin-hero">
          <div>
            <span className="eventhub-kicker">Administrador</span>
            <h2>Centro de control</h2>
            <p>
              Desde aquí puedes acceder a los CRUDs principales y supervisar la estructura interna de la plataforma.
            </p>
          </div>

          <div className="eventhub-admin-badge">
            <i className="bi bi-shield-check"></i>
          </div>
        </section>

        <section className="eventhub-admin-modules">
          {adminModules.map((item) => (
            <Link key={item.title} to={item.to} className="eventhub-admin-card">
              <div className="eventhub-admin-card-icon">
                <i className={item.icon}></i>
              </div>

              <div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </DashboardLayout>
  );
};