import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const EditEventPromotor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    promotor_id: "",
    event_id: ""
  });

  useEffect(() => {
    fetch(`${backendUrl}/event-promotor/${id}`)
      .then(res => res.json())
      .then(data => setForm(data.results));
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${backendUrl}/event-promotor/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    navigate("/event-promotor");
  };

  return (
    <div className="container mt-5">
      <h2>Editar EventPromotor</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="promotor_id"
          className="form-control mb-2"
          value={form.promotor_id}
          onChange={handleChange}
        />

        <input
          type="number"
          name="event_id"
          className="form-control mb-2"
          value={form.event_id}
          onChange={handleChange}
        />

        <button className="btn btn-warning">Actualizar</button>
      </form>
    </div>
  );
};