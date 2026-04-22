import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const DeleteEventAssist = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const res = await fetch(`${backendUrl}/api/event-assists/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      navigate("/event-assists");
    } else {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0">
            <div className="card-body text-center">

              <h2 className="mb-3 text-danger">
                ⚠️ Eliminar Asistencia
              </h2>

              <p className="mb-4">
                ¿Estás seguro de que quieres eliminar esta asistencia?
              </p>

              <div className="d-flex justify-content-center gap-3">
                <button
                  className="btn btn-danger px-4"
                  onClick={handleDelete}
                >
                  Sí, eliminar
                </button>

                <button
                  className="btn btn-secondary px-4"
                  onClick={() => navigate("/event-assists")}
                >
                  Cancelar
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteEventAssist;