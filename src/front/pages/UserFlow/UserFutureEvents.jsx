import { useEffect, useState } from "react";
import { getEvents } from "../../services/userService";
import { useNavigate, Link } from "react-router-dom";

export const UserFutureEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then(data => {
      const events = data.results || [];

      const future = events.filter(e =>
        new Date(e.date_event) >= new Date()
      );

      setEvents(future);
    });
  }, []);

  return (
    <div className="container py-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
             <button className="btn btn-light border shadow-sm" onClick={() => navigate(-1)}>
               ← Volver
             </button>
        </div>
      <h2>Eventos futuros</h2>

      {events.map(event => (
        <div key={event.id} className="card mb-3 p-3">
          <h5>{event.name}</h5>
          <p>{event.location}</p>

          <Link to={`/user-flow/events/${event.id}`} className="btn btn-outline-primary">
            Ver detalle
          </Link>
        </div>
      ))}
    </div>
  );
};