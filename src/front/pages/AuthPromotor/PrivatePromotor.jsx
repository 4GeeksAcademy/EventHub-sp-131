import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { usePromotorAuth } from "../../hooks/usePromotorAuth";

export const PrivatePromotor = () => {
    const navigate = useNavigate();
    const { profileInfo, loading } = usePromotorAuth();

    if (loading) {
        return (
            <DashboardLayout
                role="promotor"
                title="Mi perfil"
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
            title="Mi perfil"
            subtitle="Bienvenido a tu espacio como promotor en EventHub."
            userName={profileInfo?.name}
            onCreateEvent={() => navigate("/promotor/private/create-event")}
        >
            {profileInfo ? (
                <div className="eventhub-user-dashboard">

                    {/* — Bloque principal izquierdo — */}
                    <section className="eventhub-user-profile-main">
                        <div className="eventhub-user-cover">
                            <div>
                                <span>Perfil de promotor</span>
                                <h3>Tu actividad en EventHub</h3>
                            </div>
                        </div>

                        <div className="eventhub-user-profile-content">
                            <div className="eventhub-user-avatar-large">
                                {profileInfo.name?.charAt(0).toUpperCase()}
                            </div>

                            <div className="eventhub-user-main-info">
                                <h2>{profileInfo.name}</h2>
                                <p>{profileInfo.email || "Email no registrado"}</p>
                            </div>

                            <div className="eventhub-user-info-grid">
                                <div>
                                    <span>Ubicación</span>
                                    <strong>{profileInfo.location || "No registrada"}</strong>
                                </div>
                                <div>
                                    <span>Web</span>
                                    <strong>
                                        {profileInfo.web_page
                                            ? <a href={profileInfo.web_page} target="_blank" rel="noreferrer">{profileInfo.web_page}</a>
                                            : "No registrada"
                                        }
                                    </strong>
                                </div>
                                <div>
                                    <span>Organización verificada</span>
                                    <strong>{profileInfo.verified_org ? "✅ Sí" : "❌ No"}</strong>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* — Panel lateral derecho — */}
                    <section className="eventhub-user-side-panel">
                        <div className="eventhub-user-action-card">
                            <span className="eventhub-kicker">Acciones rápidas</span>
                            <h4>Gestiona tus eventos</h4>
                            <p>
                                Crea nuevos eventos o consulta y edita los que ya has publicado.
                            </p>

                            <div className="eventhub-action-buttons">
                                <button
                                    className="eventhub-main-btn"
                                    type="button"
                                    onClick={() => navigate("/promotor/private/create-event")}
                                >
                                    Crear evento
                                </button>

                                <button
                                    className="eventhub-secondary-btn"
                                    type="button"
                                    onClick={() => navigate("/promotor/private/events")}
                                >
                                    Mis eventos
                                </button>
                            </div>
                        </div>

                        <div className="eventhub-user-mini-card">
                            <span className="eventhub-kicker">Mensajes</span>
                            <h5>Comunicación con usuarios</h5>
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

                </div>
            ) : (
                <div className="eventhub-panel">
                    <p className="mb-0">No se pudo cargar el perfil del promotor.</p>
                </div>
            )}
        </DashboardLayout>
    );
};