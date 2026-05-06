import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const UserProfiles = () => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    const getUsers = () => {
        fetch(`${backendUrl}/api/users`)
            .then((resp) => resp.json())
            .then((data) => setUsers(data || []))
            .catch(() => setMessage("No se pudieron cargar los perfiles"));
    };

    const handleAddFriend = (friendId) => {
        const tokenUser = localStorage.getItem("tokenUser");

        if (!tokenUser) {
            navigate("/user/login");
            return;
        }

        fetch(`${backendUrl}/api/${friendId}/add-friend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + tokenUser
            }
        })
            .then((resp) => {
                if (!resp.ok) throw new Error();
                setMessage("Amigo agregado correctamente");
            })
            .catch(() => setMessage("Este usuario ya es tu amigo."));
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <DashboardLayout
            role="user"
            title="Mi perfil"
            subtitle="Bienvenida a tu espacio personal en EventHub."
            userName={store.privateUser?.name}
        >

            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="fw-bold mb-1">Explorar perfiles</h1>
                        <p className="text-muted mb-0">
                            Encuentra otros usuarios y agrégalos como amigos.
                        </p>
                    </div>
                </div>

                {message && (
                    <div className="alert alert-info shadow-sm">
                        {message}
                    </div>
                )}

                <div className="row g-4">
                    {users.length === 0 ? (
                        <div className="col-12">
                            <div className="card shadow-sm p-5 text-center">
                                <h4>No hay perfiles disponibles</h4>
                            </div>
                        </div>
                    ) : (
                        users.map((user) => (
                            <div key={user.id} className="col-md-6 col-lg-4">
                                <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div
                                            className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                            style={{ width: "55px", height: "55px" }}
                                        >
                                            <strong>{user.name ? user.name[0].toUpperCase() : "U"}</strong>
                                        </div>

                                        <div>
                                            <h5 className="fw-bold mb-0">{user.name || "Usuario"}</h5>
                                            <small className="text-muted">{user.email}</small>
                                        </div>
                                    </div>

                                    <p className="mb-1">
                                        <strong>Ubicación:</strong> {user.location || "No disponible"}
                                    </p>

                                    <p className="mb-1">
                                        <strong>Edad:</strong> {user.age || "No disponible"}
                                    </p>

                                    <p className="text-muted">
                                        {user.description || "Sin descripción"}
                                    </p>

                                    <button
                                        className="btn btn-secondary mt-auto"
                                        onClick={() => handleAddFriend(user.id)}
                                    >
                                        Agregar amigo
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};