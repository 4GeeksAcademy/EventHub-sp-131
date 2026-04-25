import { Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useEffect, useState } from "react";

export const PrivateAdmin = () => {
  const { store, dispatch } = useGlobalReducer();
  const urlApi = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("tokenAdmin")?.trim();

    if (!token) {
      dispatch({ type: "ADD_LOGIN_STATUS_ADMIN", payload: false });
      setLoading(false);
      return;
    }

    authAdmin(token);
  }, []);

  async function authAdmin(token) {
    try {
      const response = await fetch(`${urlApi}api/admin/private`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem("tokenAdmin");
        localStorage.removeItem("adminAuth");

        dispatch({ type: "ADD_LOGIN_STATUS_ADMIN", payload: false });
        return;
      }

      const data = await response.json();

      dispatch({ type: "ADD_LOGIN_STATUS_ADMIN", payload: true });
      localStorage.setItem("adminAuth", "true");

      console.log("Admin validado:", data);

    } catch (error) {
      console.log("Error:", error.message);
      dispatch({ type: "ADD_LOGIN_STATUS_ADMIN", payload: false });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p className="text-center mt-5">Verificando sesión...</p>;
  }

  if (!store.adminAuth) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="container">
      <h1 className="text-center p-4">Panel Admin (Privado)</h1>
    </div>
  );
};