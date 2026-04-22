import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const EventPromotor = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await fetch(`${backendUrl}/api/event-promotor`);
    const json = await res.json();
    setData(json.results);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Event Promotor</h2>

      <Link to="/create-event-promotor" className="btn btn-primary mb-3">
        Crear relación
      </Link>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Promotor</th>
            <th>Evento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.promotor_name}</td>
              <td>{item.event_name}</td>
              <td>
                <Link
                  to={`/edit-event-promotor/${item.id}`}
                  className="btn btn-warning btn-sm me-2"
                >
                  Editar
                </Link>

                <Link
                  to={`/delete-event-promotor/${item.id}`}
                  className="btn btn-danger btn-sm"
                >
                  Eliminar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};