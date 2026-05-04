import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const EditEventPromotor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { store } = useGlobalReducer();

  const [form, setForm] = useState({
    promotor_id: "",
    event_id: ""
  });

  const [promotores, setPromotores] = useState([]);
  const [events, setEvents] = useState([]);

  // 🔹 cargar relación actual
  useEffect(() => {
    fetch(`${backendUrl}/api/event-promotor/${id}`)
      .then(res => res.json())
      .then(data => {
        const rel = data.results || data;
        setForm(rel);
      });
  }, [id]);

  // 🔹 cargar promotores y eventos
  useEffect(() => {
    fetch(`${backendUrl}/api/promotors`)
      .then(res => res.json())
      .then(data => setPromotores(data.results || data));

    fetch(`${backendUrl}/api/events`)
      .then(res => res.json())
      .then(data => setEvents(data.results || data));
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resp = await fetch(`${backendUrl}/api/event-promotor/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        promotor_id: Number(form.promotor_id),
        event_id: Number(form.event_id)
      })
    });

    if (resp.ok) {
      navigate("/event-promotor");
    } else {
      console.error("Error actualizando");
    }
  };

  if (!store.adminAuth) {
      return <Navigate to="/admin/login" />;
  }

  return (
    <div className="container mt-5">
      <h2>Editar EventPromotor</h2>

      <form onSubmit={handleSubmit}>

        {/* 🔥 PROMOTOR */}
        <select
          name="promotor_id"
          className="form-control mb-2"
          value={form.promotor_id}
          onChange={handleChange}
        >
          <option value="">Selecciona un promotor</option>
          {promotores.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* 🔥 EVENTO */}
        <select
          name="event_id"
          className="form-control mb-2"
          value={form.event_id}
          onChange={handleChange}
        >
          <option value="">Selecciona un evento</option>
          {events.map(e => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>

        <div className="d-flex gap-2 mt-3">
          <button type="submit" className="btn btn-warning">
            Actualizar
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/event-promotor")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};