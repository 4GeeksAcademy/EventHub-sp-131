import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import devLog from "../../utils/devLogger";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";


const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const UserGroups = () => {
    devLog.log("ENTRÉ A USER GROUPS");
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    const getGroups = () => {
        fetch(`${backendUrl}/api/group`)
            .then((resp) => resp.json())
            .then((data) => setGroups(data || []))
            .catch(() => alert("No se pudieron cargar los grupos"));
    };

    useEffect(() => {
        getGroups();
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
                        <h1 className="fw-bold mb-1">Grupos</h1>
                        <p className="text-muted mb-0">
                            Explora comunidades y únete a grupos.
                        </p>
                    </div>
                </div>


                <div className="row g-4">
                    {groups.length === 0 ? (
                        <div className="col-12">
                            <div className="card shadow-sm p-5 text-center">
                                <h4>No hay grupos disponibles</h4>
                            </div>
                        </div>
                    ) : (
                        groups.map((group) => (
                            <div key={group.id} className="col-md-6 col-lg-4">
                                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">

                                    {group.media ? (
                                        <img
                                            src={group.media}
                                            className="card-img-top"
                                            style={{ height: "200px", objectFit: "cover" }}
                                            alt={group.name}
                                        />
                                    ) : (
                                        <div
                                            className="bg-light d-flex align-items-center justify-content-center"
                                            style={{ height: "200px" }}
                                        >
                                            <span className="text-muted">Sin imagen</span>
                                        </div>
                                    )}

                                    <div className="card-body d-flex flex-column p-4">
                                        <h5 className="fw-bold">{group.name}</h5>

                                        <p className="text-muted mb-2">
                                            📍 {group.location || "Sin ubicación"}
                                        </p>

                                        <p className="text-muted">
                                            {group.description || "Sin descripción"}
                                        </p>

                                        <div className="mt-auto d-grid gap-2">
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => navigate(`/user/group/${group.id}`)}
                                            >
                                                Ver grupo
                                            </button>

                                            <button
                                                className="btn btn-tertiary"
                                                onClick={() => alert("Unirse (pendiente backend)")}
                                            >
                                                Unirme
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};