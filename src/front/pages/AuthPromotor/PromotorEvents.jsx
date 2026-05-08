import { Navigate ,useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { EventList } from "../../components/Event/EventList";
import { usePromotorAuth } from "../../hooks/usePromotorAuth";

export const PromotorEvents = () => {
    const navigate = useNavigate();
    const { profileInfo, loading, isAuthorized } = usePromotorAuth();

    if (loading) {
        return (
            <DashboardLayout
                role="promotor"
                title="Mis Eventos"
                subtitle="Cargando..."
                userName="Promotor"
            >
                <div className="eventhub-panel">
                    <p className="mb-0">Cargando eventos...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (isAuthorized === false) return <Navigate to="/promotor/login" replace />;

    return (
        <DashboardLayout
            role="promotor"
            title="Mis Eventos"
            subtitle="Gestiona los eventos que has creado."
            userName={profileInfo?.name}
            onCreateEvent={() => navigate("/promotor/private/create-event")}
        >
            {profileInfo ? (
                <div className="eventhub-panel">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <span className="eventhub-kicker">Eventos</span>
                            <h3 className="mb-0">Mis eventos</h3>
                        </div>
                        <button
                            className="eventhub-main-btn"
                            onClick={() => navigate("/promotor/create-event")}
                        >
                            + Crear evento
                        </button>
                    </div>

                    <EventList profile={profileInfo} type="promotor" />
                </div>
            ) : (
                <div className="eventhub-panel">
                    <p className="mb-0">No se pudo cargar el perfil del promotor.</p>
                </div>
            )}
        </DashboardLayout>
    );
};