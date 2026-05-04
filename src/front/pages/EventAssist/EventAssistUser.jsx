import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const EventAssistUser = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [assists, setAssists] = useState([]);
  const navigate = useNavigate();
  const { store } = useGlobalReducer();

  useEffect(() => {
    fetch(`${backendUrl}/api/event-assists`)
      .then((res) => res.json())
      .then((data) => setAssists(data))
      .catch((err) => console.error(err));
  }, []);

  if (!store.adminAuth) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Asistencias a Eventos</h1>

      {/* Botones arriba */}
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/create-event-assist")}
        >
          + Añadir asistencia
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/")}
        >
          Volver
        </button>
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered shadow">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Evento</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {assists.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No hay asistencias todavía
                </td>
              </tr>
            ) : (
              assists.map((assist) => (
                <tr key={assist.id}>
                  <td>{assist.id}</td>
                  <td>{assist.user_name}</td>
                  <td>{assist.event_name}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        navigate(`/delete-event-assist/${assist.id}`)
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventAssistUser;