import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const DeleteEventPromotor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const deleteItem = async () => {
      await fetch(`${backendUrl}/event-promotor/${id}`, {
        method: "DELETE"
      });

      navigate("/event-promotor");
    };

    deleteItem();
  }, [id]);

  return (
    <div className="container mt-5">
      <h3>Eliminando...</h3>
    </div>
  );
};