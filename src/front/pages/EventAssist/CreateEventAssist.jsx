import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



const CreateEventAssist = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [userId, setUserId] = useState("");
  const [eventId, setEventId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log("users state:", users);
    console.log("events state:", events);
    fetch(`${backendUrl}/api/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(console.error);

    fetch(`${backendUrl}/api/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !eventId) {
      alert("Selecciona usuario y evento");
      return;
    }

    const res = await fetch(`${backendUrl}/api/event-assists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: parseInt(userId),
        event_id: parseInt(eventId),
      }),
    });

    if (res.ok) {
      navigate("/event-assists");
    } else {
      const error = await res.json();
      alert(error.error || "Error al crear asistencia");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-4 text-center">Crear Asistencia</h2>

        <form onSubmit={handleSubmit}>
          {/* SELECT USER */}
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <select
              className="form-select"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            >
              <option value="">Selecciona un usuario</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* SELECT EVENT */}
          <div className="mb-3">
            <label className="form-label">Evento</label>
            <select
              className="form-select"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
            >
              <option value="">Selecciona un evento</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          {/* BOTONES */}
          <div className="d-flex justify-content-between mt-4">
            <button type="submit" className="btn btn-success">
              Asistiré
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/event-assists")}
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventAssist;