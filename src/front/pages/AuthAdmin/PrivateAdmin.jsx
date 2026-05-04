import { Navigate, Link } from "react-router-dom";
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
      <div className="row row-cols-1 row-cols-sm-6 g-3">
        <div>
          <Link className="p-2" to="/admin" >
            <button className="btn btn-primary">Admin CRUD</button>
          </Link>
        </div>
        <div>
          <Link className="p-2" to="/promotor">
            <button className="btn btn-primary">Promotor CRUD</button>
          </Link>
        </div>
        <div>
          <Link className="p-2" to="/user">
            <button className="btn btn-primary">User CRUD</button>
          </Link>
        </div>
        <div>
          <Link className="p-2" to="/category-panel">
            <button className="btn btn-primary">Category CRUD</button>
          </Link>
        </div>
        <div>
          <Link className="p-2" to="/events">
            <button className="btn btn-primary">Ir a CRUD Events</button>
          </Link>
        </div>
        <div>
          <Link className="p-2" to="/group">
            <button className="btn btn-primary">Group CRUD</button>
          </Link>
        </div>
        <div>
          <Link className="p-2" to="/promotor-category/list">
            <button className="btn btn-primary">Promotor-Category CRUD</button>
          </Link>
        </div>
        <div>
          <Link className="p-2" to="/saved-event">
            <button className="btn btn-primary">
              Saved Event CRUD
            </button>
          </Link>
        </div>
        <div>
          <Link className="p-2" to="/discussion">
            <button className="btn btn-primary">Discussion CRUD</button>
          </Link>
        </div>
        <div>
          <Link className="p-2" to="/friend">
            <button className="btn btn-primary">Friend CRUD</button>
          </Link>
        </div>
        <div>
          <Link className="p-2" to="/comments">
            <button className="btn btn-primary">Comments CRUD</button>
          </Link>
        </div>
        <div>
          <Link className="p-2" to="/user-category">
            <button className="btn btn-primary">User Category CRUD</button>
          </Link>
        </div>
        <div>
          <Link className="p-2" to="/group-category">
            <button className="btn btn-primary">Group-Category CRUD</button>
          </Link>
        </div>
        <div>
          <Link className="p-2" to="/group-event">
            <button className="btn btn-primary">Group-Event CRUD</button>
          </Link>
        </div>
        <div>
          <Link className="p-2" to="/event-category">
            <button className="btn btn-primary">Event Category CRUD</button>
          </Link>
        </div>
        <div>
          <Link className="p-2" to="/event-promotor">
            <button className="btn btn-primary">Event Promotor CRUD</button>
          </Link>
        </div>
        <div>
          <Link className="p-2" to="/event-assists">
            <button className="btn btn-primary">Event Assist CRUD</button>
          </Link>
        </div>
      </div>
    </div>
  );
};