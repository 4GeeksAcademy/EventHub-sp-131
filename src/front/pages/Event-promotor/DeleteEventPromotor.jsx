import { useEffect } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const DeleteEventPromotor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { store } = useGlobalReducer();

  useEffect(() => {
    const deleteItem = async () => {
      await fetch(`${backendUrl}/api/event-promotor/${id}`, {
        method: "DELETE"
      });

      navigate("/event-promotor");
    };

    deleteItem();
  }, [id]);

  if (!store.adminAuth) {
      return <Navigate to="/admin/login" />;
  }

  return (
    <div className="container mt-5">
      <h3>Eliminando...</h3>
    </div>
  );
};