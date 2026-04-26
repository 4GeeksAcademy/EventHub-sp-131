import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginAdmin = () => {
  const navigate = useNavigate();
  const urlApi = import.meta.env.VITE_BACKEND_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    console.log("URL BACKEND:", urlApi);

    try {
      const res = await fetch(`${urlApi}api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      console.log("RESPUESTA LOGIN:", data);
      if (!res.ok) {
        throw new Error(data.msg || "Error en login");
      }

      localStorage.setItem("tokenAdmin", data.token);
      console.log("TOKEN GUARDADO:", data.token);
      localStorage.setItem("adminAuth", "true");

      navigate("/admin/private");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4">Login Admin</h2>

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <button type="submit" className="btn btn-primary w-100">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};