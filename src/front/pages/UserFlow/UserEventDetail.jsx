import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getEventById,
  assistEvent,
  saveEvent,
  createComment,
  getComments
} from "../../services/userService";

export const UserEventDetail = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getEventById(id).then(data => setEvent(data.results));

    getComments().then(data => {
      const filtered = data.filter(c => c.event_id == id);
      setComments(filtered);
    });
  }, []);

  const handleAssist = () => {
    assistEvent({ user_id: user.id, event_id: Number(id) });
  };

  const handleSave = () => {
    saveEvent({ user_id: user.id, event_id: Number(id) });
  };

  const handleComment = (e) => {
    e.preventDefault();

    createComment({
      user_id: user.id,
      event_id: Number(id),
      message: text
    }).then(() => {
      setText("");
    });
  };

  if (!event) return <p>Cargando...</p>;

  return (
    <div className="container py-5">
      <h2>{event.name}</h2>

      <button onClick={handleAssist} className="btn btn-success me-2">
        Voy a asistir
      </button>

      <button onClick={handleSave} className="btn btn-primary">
        Guardar evento
      </button>

      <hr />

      <form onSubmit={handleComment}>
        <textarea
          className="form-control"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-primary mt-2">Comentar</button>
      </form>

      <h4 className="mt-4">Comentarios</h4>

      {comments.map(c => (
        <div key={c.id} className="card p-2 mb-2">
          {c.message}
        </div>
      ))}
    </div>
  );
};