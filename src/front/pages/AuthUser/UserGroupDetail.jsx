import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const UserGroupDetail = () => {
    const { theId } = useParams();
    const [group, setGroup] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${backendUrl}/api/group/${theId}`)
            .then(res => res.json())
            .then(data => setGroup(data))
            .catch(() => alert("Error cargando grupo"));
    }, []);

    if (!group) return <p className="text-center mt-5">Cargando...</p>;

    return (
        <div className="container mt-5">
            <button
                className="btn btn-outline-secondary mb-3"
                onClick={() => navigate("/user/groups")}
            >
                ← Volver
            </button>

            <div className="card shadow p-4">
                <h2>{group.name}</h2>
                <p><strong>📍</strong> {group.location}</p>
                <p>{group.description}</p>
            </div>
        </div>
    );
};