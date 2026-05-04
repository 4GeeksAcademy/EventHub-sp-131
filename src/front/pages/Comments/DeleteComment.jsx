import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const DeleteComment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { store } = useGlobalReducer();

    const [comment, setComment] = useState(null);

    useEffect(() => {
        fetch(`${backendUrl}/api/comments/${id}`)
            .then(res => res.json())
            .then(data => setComment(data))
            .catch(err => console.log(err));
    }, [id]);

    const handleDelete = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/comments/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                navigate("/comments");
            } else {
                alert("Error al eliminar comentario");
            }

        } catch (error) {
            console.error(error);
        }
    };

    if (!store.adminAuth) {
        return <Navigate to="/admin/login" />;
    }

    return (
        <div className="container mt-5">
            <h2>Eliminar Comentario</h2>

            {comment && (
                <div className="card p-3 mt-3">
                    <p><strong>Mensaje:</strong> {comment.message}</p>
                    <p><strong>User:</strong> {comment.user?.name}</p>
                    <p><strong>Event:</strong> {comment.event?.name}</p>
                </div>
            )}

            <div className="mt-3 d-flex gap-2">
                <button className="btn btn-danger" onClick={handleDelete}>
                    Confirmar eliminación
                </button>

                <Link to="/comments" className="btn btn-secondary">
                    Cancelar
                </Link>
            </div>
        </div>
    );
};