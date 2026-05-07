import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { CreateEventForm } from "../../components/Event/CreateEventForm";
import { usePromotorAuth } from "../../hooks/usePromotorAuth";

export const PromotorCreateEvent = () => {
    const navigate = useNavigate();
    const { profileInfo, loading } = usePromotorAuth();

    if (loading) {
        return (
            <DashboardLayout
                role="promotor"
                title="Crear Evento"
                subtitle="Cargando..."
                userName="Promotor"
            >
                <div className="eventhub-panel">
                    <p className="mb-0">Cargando...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            role="promotor"
            title="Crear Evento"
            subtitle="Publica un nuevo evento para la comunidad."
            userName={profileInfo?.name}
            onCreateEvent={() => navigate("/promotor/private/create-event")}
        >
            {profileInfo ? (
                <div className="eventhub-panel">
                    <span className="eventhub-kicker">Nuevo evento</span>
                    <h3>Crear evento</h3>

                    <CreateEventForm
                        id={profileInfo.id}
                        type="promotor"
                        onSuccess={() => navigate("/promotor/private/events")}
                    />
                </div>
            ) : (
                <div className="eventhub-panel">
                    <p className="mb-0">No se pudo cargar el perfil del promotor.</p>
                </div>
            )}
        </DashboardLayout>
    );
};