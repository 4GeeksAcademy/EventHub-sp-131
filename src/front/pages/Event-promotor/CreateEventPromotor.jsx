import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const CreateEventPromotor = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    promotor_id: "",
    event_id: ""
  });

  const [promotores, setPromotores] = useState([]);
  const [eventos, setEventos] = useState([]);
  console.log(eventos)
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔹 Cargar promotores y eventos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const promRes = await fetch(`${backendUrl}/api/promotor`);
        const eventRes = await fetch(`${backendUrl}/api/events`);

        const promData = await promRes.json();
        const eventData = await eventRes.json();

        setPromotores(promData);
        setEventos(eventData.results);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/api/event-promotor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          promotor_id: Number(form.promotor_id),
          event_id: Number(form.event_id)
        })
      });

      if (response.ok) {
        navigate("/event-promotor");
      } else {
        console.error("Error al crear event-promotor");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Crear EventPromotor</h2>

      <form onSubmit={handleSubmit}>
        {/* 🔽 Select Promotor */}
        <select
          name="promotor_id"
          className="form-control mb-2"
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un promotor</option>
          {promotores.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name || p.nombre || `Promotor ${p.id}`}
            </option>
          ))}
        </select>

        {/* 🔽 Select Evento */}
        <select
          name="event_id"
          className="form-control mb-2"
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un evento</option>
          {eventos.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title || e.name || `Evento ${e.id}`}
            </option>
          ))}
        </select>

        <button className="btn btn-success me-2">Crear</button>

        <button
          type="button"
          className="btn btn-danger"
          onClick={() => navigate("/event-promotor")}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};