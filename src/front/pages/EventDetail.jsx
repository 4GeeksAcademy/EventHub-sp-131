import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { usePromotorAuth } from "../hooks/usePromotorAuth";
import devLog from "../utils/devLogger";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const EventDetail = () => {
    const { profileInfo, loading } = usePromotorAuth();
    const navigate = useNavigate();
    const { id, type, ownerId } = useParams();

    const [event, setEvent] = useState(null);
    const [eventCat, setEventCat] = useState(null);
    const [categories, setCategories] = useState(null);
    const [eventAsistants, setEventAssistants] = useState(null);
    const [comments, setComments] = useState(null);

    const authHeader = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    };

    // ── Carga inicial ────────────────────────────────────────────────────────

    useEffect(() => {
        getEventById();
        getEventAssistById();
        getEventCategoryById();
        getComments();
    }, []);

    useEffect(() => {
        if (eventCat) getCategories();
    }, [eventCat]);

    // ── Fetches ──────────────────────────────────────────────────────────────

    async function getEventById() {
        try {
            const resp = await fetch(`${backendUrl}/api/${type}/${ownerId}/events/${id}`, { headers: authHeader });
            const data = await resp.json();
            setEvent(data.event);
        } catch (err) {
            devLog.error("Error cargando evento:", err);
        }
    }

    async function getEventCategoryById() {
        try {
            const resp = await fetch(`${backendUrl}/api/${type}/${ownerId}/events/${id}/event_category`, { headers: authHeader });
            const data = await resp.json();
            setEventCat(data.eventCategories);
        } catch (err) {
            devLog.error("Error cargando categorías:", err);
        }
    }

    async function getCategories() {
        try {
            const resp = await fetch(`${backendUrl}/api/categories`, {
                headers: { "Content-Type": "application/json" }
            });
            const data = await resp.json();
            const filtered = data.filter(cat => !eventCat.some(item => item.name === cat.name));
            setCategories(filtered);
        } catch (err) {
            devLog.error("Error cargando categorías globales:", err);
        }
    }

    async function getEventAssistById() {
        try {
            const resp = await fetch(`${backendUrl}/api/${type}/events/${id}/event-assists`, { headers: authHeader });
            const data = await resp.json();
            setEventAssistants(data.relations);
        } catch (err) {
            devLog.error("Error cargando asistentes:", err);
        }
    }

    async function getComments() {
        try {
            const resp = await fetch(`${backendUrl}/api/${type}/events/${id}/comments`, { headers: authHeader });
            const data = await resp.json();
            setComments(data.comments);
        } catch (err) {
            devLog.error("Error cargando comentarios:", err);
        }
    }

    async function addNewCat(e) {
        const addedCategory = categories.find(cat => cat.name === e.target.value);
        if (!addedCategory) return;
        try {
            await fetch(`${backendUrl}/api/${type}/${ownerId}/events/${id}/event_category`, {
                method: "POST",
                headers: authHeader,
                body: JSON.stringify({ event_id: parseInt(id), category_id: addedCategory.id })
            });
        } catch (err) {
            devLog.error("Error añadiendo categoría:", err);
        }
        getEventCategoryById();
        getCategories();
    }

    async function removeCategoryById(e) {
        try {
            await fetch(`${backendUrl}/api/${type}/${ownerId}/events/${id}/event_category/${e.target.value}`, {
                method: "DELETE",
                headers: authHeader
            });
        } catch (err) {
            devLog.error("Error eliminando categoría:", err);
        }
        getEventCategoryById();
        getCategories();
    }

    // ── Render ───────────────────────────────────────────────────────────────

    if (loading) {
        return (
            <DashboardLayout role="promotor" title="Detalle de evento" subtitle="Cargando..." userName="Promotor">
                <div className="eventhub-panel">
                    <p className="mb-0">Cargando...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            role="promotor"
            title="Detalle de evento"
            subtitle="Gestiona la información de tu evento."
            userName={profileInfo?.name}
            onCreateEvent={() => navigate("/promotor/private/create-event")}
        >
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {!event ? (
                            <div className="alert alert-secondary">Cargando evento...</div>
                        ) : (
                            <div className="card shadow-sm border-0">
                                {event.media && (
                                    <img src={event.media} className="card-img-top" alt={event.name} />
                                )}

                                <div className="card-body p-4">

                                    {/* Cabecera */}
                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                        <h3 className="mb-0">{event.name}</h3>
                                        <div className="text-end">
                                            <p className="mb-1">
                                                <i className="fa-solid fa-location-dot me-1"></i>
                                                {event.location}
                                            </p>
                                            <p className="mb-0">
                                                <i className="fa-solid fa-calendar me-1"></i>
                                                {new Date(event.date_event).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <p>{event.description}</p>

                                    {/* Categorías */}
                                    <div className="mb-3">
                                        <select
                                            className="form-select"
                                            onChange={addNewCat}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Añadir categoría</option>
                                            {categories?.map(cat => (
                                                <option key={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="d-flex py-3 gap-2 flex-wrap">
                                        {eventCat?.map(categoryRel => (
                                            <p key={categoryRel.id} className="p-1 mb-0 btn-secondary rounded" style={{
                                            }}>
                                                {categoryRel.category_name}
                                                <button
                                                    type="button"
                                                    className="btn p-1"
                                                    onClick={removeCategoryById}
                                                    value={categoryRel.id}
                                                >
                                                    X
                                                </button>
                                            </p>
                                        ))}
                                    </div>

                                    {/* Asistentes */}
                                    <div className="mt-4">
                                        <h6 className="fw-semibold mb-3">¿Quién asiste?</h6>
                                        <div className="d-flex flex-wrap gap-2">
                                            {eventAsistants?.length > 0
                                                ? eventAsistants.map(assistant => (
                                                    <span key={assistant.id} className="badge d-flex align-items-center p-1 pe-2 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-pill">
                                                        <img className="rounded-circle me-1" width="24" height="24" src="https://github.com/mdo.png" alt={assistant.user_name} />
                                                        {assistant.user_name}
                                                    </span>
                                                ))
                                                : <p className="text-muted small">Nadie ha confirmado asistencia aún.</p>
                                            }
                                        </div>
                                    </div>

                                    {/* Comentarios */}
                                    <div className="mt-4">
                                        <h6 className="fw-semibold mb-3">Comentarios</h6>
                                        <div className="d-flex flex-column gap-3">
                                            {comments?.length > 0
                                                ? comments.map(comment => (
                                                    <div key={comment.id} className="border border-dark-subtle p-2 rounded">
                                                        <span className="badge align-items-center p-1 pe-2 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-pill">
                                                            <img className="rounded-circle me-1" width="24" height="24" src="https://github.com/mdo.png" alt={comment.user.name} />
                                                            {comment.user.name}
                                                        </span>
                                                        <p className="mt-2 mb-0">{comment.message}</p>
                                                    </div>
                                                ))
                                                : <p className="text-muted small">No hay comentarios todavía.</p>
                                            }
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};