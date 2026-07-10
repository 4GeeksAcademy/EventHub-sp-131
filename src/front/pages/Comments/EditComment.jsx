import { useEffect, useState } from "react";
import { useNavigate, useParams, Link, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import devLog from "../../utils/devLogger";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const EditComment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { store } = useGlobalReducer();

    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch(`${backendUrl}/api/comments/${id}`)
            .then(res => res.json())
            .then(data => {
                setMessage(data.message);
            })
            .catch(err => devLog.error(err));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message) {
            alert("El comentario no puede estar vacío");
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/comments/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
            });

            if (response.ok) {
                navigate("/comments");
            } else {
                alert("Error al actualizar comentario");
            }

        } catch (error) {
            devLog.error(error);
        }
    };

    if (!store.adminAuth) {
    return <Navigate to="/admin/login" />;
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between mb-3">
                <h2>Editar Comentario</h2>

                <Link to="/comments" className="btn btn-secondary">
                    Volver
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Comentario</label>
                    <textarea
                        className="form-control"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                <button className="btn btn-warning">
                    Actualizar
                </button>
            </form>
        </div>
    );
};