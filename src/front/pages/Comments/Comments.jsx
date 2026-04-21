import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Comments = () => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetch(`${backendUrl}/api/comments`)
            .then(res => res.json())
            .then(data => setComments(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Lista de Comentarios</h2>
                <div className="d-flex gap-2">
                    <Link to="/create-comment" className="btn btn-primary">
                        Crear Comentario
                    </Link>

                    <Link to="/" className="btn btn-secondary">
                        Back
                    </Link>
                </div>
            </div>
            {comments.length === 0 ? (
                <p>No hay comentarios aún</p>
            ) : (
                comments.map(comment => (
                    <div key={comment.id} className="card mb-3 p-3">
                        <p><strong>Mensaje:</strong> {comment.message}</p>
                        <p><strong>User:</strong> {comment.user?.name}</p>
                        <p><strong>Event:</strong> {comment.event?.name}</p>
                        <p className="text-muted">
                            {new Date(comment.create_date).toLocaleString()}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
};