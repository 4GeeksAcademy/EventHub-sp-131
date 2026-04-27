import { useEffect, useState } from "react";
import { getUsers } from "../../services/userService";
import { Link } from "react-router-dom";

export const UserUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(data => {
      setUsers(data.results || []);
    });
  }, []);

  return (
    <div className="container py-5">
      <h2>Usuarios</h2>

      {users.map(user => (
        <div key={user.id} className="card p-3 mb-3">
          <h5>{user.name}</h5>
          <p>{user.email}</p>

          <Link to={`/user-flow/users/${user.id}`} className="btn btn-primary">
            Ver perfil
          </Link>
        </div>
      ))}

      {users.length === 0 && <p>No hay usuarios disponibles.</p>}
    </div>
  );
};