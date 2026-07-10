import { NavLink, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const DashboardLayout = ({
  role,
  title,
  subtitle,
  userName,
  children,
  onCreateEvent
}) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const { store, dispatch } = useGlobalReducer();

  const menus = {
    user: [
      { label: "Dashboard", to: "/user/private", icon: "bi bi-grid" },
      { label: "Eventos", to: "/user/events", icon: "bi bi-calendar-event" },
      { label: "Guardados", to: "/user/saved-events", icon: "bi bi-bookmark-heart" },
      { label: "Asistencias", to: "/user/assisting-events", icon: "bi bi-check-circle" },
      { label: "Grupos", to: "/user/groups", icon: "bi bi-people" },
      { label: "Perfiles", to: "/user/profiles", icon: "bi bi-person-lines-fill" },
      { label: "MatchEvents", to: "/discover", icon: "bi bi-fire" }
    ],

    promotor: [
      { label: "Dashboard", to: "/promotor/private", icon: "bi bi-grid" },
      { label: "Mis eventos", to: "/promotor/events", icon: "bi bi-calendar-event" },
      { label: "Crear evento", icon: "bi bi-plus-circle", to: "/promotor/create-event" }
    ],

    admin: [
      { label: "Dashboard", to: "/admin/private", icon: "bi bi-grid" },
      { label: "Admins", to: "/admin", icon: "bi bi-person-gear" },
      { label: "Promotores", to: "/promotor", icon: "bi bi-megaphone" },
      { label: "Usuarios", to: "/user", icon: "bi bi-people" },
      { label: "Eventos", to: "/events", icon: "bi bi-calendar-event" },
      { label: "Categorías", to: "/category-panel", icon: "bi bi-tags" }
    ]
  };

  const logout = () => {
    if (role === "admin") {
      localStorage.removeItem("tokenAdmin");
      localStorage.removeItem("adminAuth");
      navigate("/admin/login");
      return;
    }

    if (role === "promotor") {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenPromotor");
      localStorage.removeItem("promotorAuth");
      dispatch({ type: "ADD_LOGIN_STATUS_PROMOTOR", payload: false });
      dispatch({ type: "ADD_TOKEN_PROMOTOR", payload: null });
      navigate("/promotor/login");
      return;
    }

    if (role === "user") {
      localStorage.removeItem("tokenUser");
      localStorage.removeItem("userAuth");
      navigate("/user/login");
      return;
    }
  };

  const goToChats = () => {
    setOpenMenu(false);

    if (role === "user") navigate("/chat");
    if (role === "promotor") navigate("/promotor/chat");
  };

  const handleMenuClick = (item) => {
    if (item.action === "create-event" && onCreateEvent) {
      onCreateEvent();
    }
  };

  return (
    <div className="eventhub-dashboard">
      <aside className="eventhub-sidebar">
        <div className="eventhub-sidebar-brand">
          <Link to="/" className="d-flex gap-2" style={{ color: "none", textDecoration: "none"}}>
          <img src="/favicon.ico" alt="EventHub" className="eventhub-logo-img rounded"/>
          <div>
            <h5>
              Event<span>Hub</span>
            </h5>
            <small>{role}</small>
          </div>
          </Link>
        </div>

        <div className="eventhub-sidebar-user">
          <div className="eventhub-sidebar-avatar">
            {(userName || role || "E").charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{userName || "EventHub"}</strong>
            <span>{role}</span>
          </div>
        </div>

        <nav className="eventhub-sidebar-menu">
          {menus[role]?.map((item) => {
            if (item.action) {
              return (
                <button
                  key={item.label}
                  type="button"
                  className="eventhub-sidebar-link eventhub-sidebar-button"
                  onClick={() => handleMenuClick(item)}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `eventhub-sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <button className="eventhub-logout-btn" type="button" onClick={logout}>
          <i className="bi bi-box-arrow-left"></i>
          <span>Cerrar sesión</span>
        </button>
      </aside>

      <main className="eventhub-main">
        <header className="eventhub-topbar">
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          <div className="eventhub-topbar-actions">
            <div className="eventhub-notification-wrapper">
              <button
                className="eventhub-icon-btn"
                type="button"
                onClick={() => {
                  setOpenNotifications(!openNotifications);
                  setOpenMenu(false);
                }}
              >
                <i className="bi bi-bell"></i>
                <span className="eventhub-notification-dot"></span>
              </button>

              {openNotifications && (
                <div className="eventhub-notification-menu">
                  <h6>Notificaciones</h6>

                  <div className="eventhub-notification-item">
                    <strong>EventHub</strong>
                    <span>No tienes notificaciones nuevas.</span>
                  </div>
                </div>
              )}
            </div>

            <div className="eventhub-user-pill">
              <div className="eventhub-avatar">
                {(userName || role || "E").charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{userName || "EventHub"}</strong>
                <span>{role}</span>
              </div>
            </div>

            <div className="eventhub-more-wrapper">
              <button
                className="eventhub-icon-btn"
                type="button"
                onClick={() => {
                  setOpenMenu(!openMenu);
                  setOpenNotifications(false);
                }}
              >
                <i className="bi bi-three-dots"></i>
              </button>

              {openMenu && (
                <div className="eventhub-more-menu">
                  {role === "user" && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenu(false);
                        navigate("/search-by-image");
                      }}
                    >
                      <i className="bi bi-image"></i>
                      Buscar por imagen
                    </button>
                  )}

                  {(role === "user" || role === "promotor") && (
                    <button type="button" onClick={goToChats}>
                      <i className="bi bi-chat-dots"></i>
                      Chats
                    </button>
                  )}

                  <button type="button" onClick={logout}>
                    <i className="bi bi-box-arrow-left"></i>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="eventhub-dashboard-body">{children}</section>
      </main>
    </div>
  );
};

DashboardLayout.propTypes = {
  role: PropTypes.string.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  userName: PropTypes.string,
  children: PropTypes.node,
  onCreateEvent: PropTypes.func
};