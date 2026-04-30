import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BackButton } from "../../components/BackButton";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [comments, setComments] = useState([]);
    const [message, setMessage] = useState("");
    const [promotorId, setPromotorId] = useState(null);

    const getEvent = () => {
        fetch(`${backendUrl}/api/events/${id}`)
            .then((resp) => resp.json())
            .then((data) => setEvent(data))
            .catch(() => alert("No se pudo cargar el evento"));
    };

    const getComments = () => {
        fetch(`${backendUrl}/api/events/${id}/comments`)
            .then((resp) => resp.json())
            .then((data) => setComments(data.comments || []))
            .catch(() => alert("No se pudieron cargar los comentarios"));
    };

    const getEventPromotor = () => {
        fetch(`${backendUrl}/api/event/event-promotor/${id}`)
            .then((resp) => resp.json())
            .then((data) => {
                if (data.relations && data.relations.length > 0) {
                    setPromotorId(data.relations[0].promotor_id);
                }
            })
            .catch(() => console.log("No se pudo cargar el promotor del evento"));
    };

    const handleComment = (e) => {
        e.preventDefault();

        const tokenUser = localStorage.getItem("tokenUser");

        if (!tokenUser) {
            navigate("/user/login");
            return;
        }

        fetch(`${backendUrl}/api/events/${id}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + tokenUser
            },
            body: JSON.stringify({
                message: message
            })
        })
            .then((resp) => {
                if (!resp.ok) throw new Error();
                setMessage("");
                getComments();
            })
            .catch(() => alert("No se pudo crear el comentario"));
    };

    const handleContactPromotor = () => {
        const tokenUser = localStorage.getItem("tokenUser");

        if (!tokenUser) {
            navigate("/user/login");
            return;
        }

        if (!promotorId) {
            alert("Este evento no tiene promotor asociado");
            return;
        }

        fetch(`${backendUrl}/api/chats`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + tokenUser
            },
            body: JSON.stringify({
                promotor_id: promotorId
            })
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.message) {
                    alert(data.message);
                    return;
                }

                navigate("/chat", { state: { chatId: data.id } });
            })
            .catch(() => alert("No se pudo crear el chat"));
    };

    useEffect(() => {
        getEvent();
        getComments();
        getEventPromotor();
    }, []);

    if (!event) {
        return <p className="text-center mt-5">Cargando evento...</p>;
    }

    return (
        <div className="container mt-5">

            <BackButton />

            <div className="card shadow mb-4">
                {event.media && (
                    <img
                        src={event.media}
                        className="card-img-top"
                        style={{ height: "350px", objectFit: "cover" }}
                        alt={event.name}
                    />
                )}

                <div className="card-body">
                    <h2>{event.name}</h2>

                    <p><strong>Ubicación:</strong> {event.location}</p>
                    <p><strong>Descripción:</strong> {event.description}</p>
                    <p><strong>Fecha:</strong> {new Date(event.date_event).toLocaleString()}</p>
                    <p><strong>Capacidad:</strong> {event.capacity}</p>

                    <button
                        className="btn btn-success mt-3"
                        onClick={handleContactPromotor}
                    >
                        Contactar promotor
                    </button>
                </div>
            </div>

            <div className="card shadow p-4">
                <h4>Comentarios</h4>

                <form onSubmit={handleComment} className="mb-4">
                    <textarea
                        className="form-control mb-2"
                        placeholder="Escribe un comentario..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <button className="btn btn-primary">
                        Comentar
                    </button>
                </form>

                {comments.length === 0 ? (
                    <p>No hay comentarios todavía</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="border-bottom py-2">
                            <p className="mb-1">{comment.message}</p>
                            <small className="text-muted">
                                Usuario ID: {comment.user_id}
                            </small>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};