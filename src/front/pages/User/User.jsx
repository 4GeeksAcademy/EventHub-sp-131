import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const User = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [users, setUsers] = useState([]);
    const location = useLocation();

    const getUsers = async () => {
        try {
            const resp = await fetch(`${backendUrl}/api/users`);
            const data = await resp.json();
            setUsers(data || []);
        } catch {
            console.log("Error cargando usuarios");
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className="container py-5">
            <h1>Lista de Usuarios</h1>

            {location.state?.message && (
                <div className="alert alert-success">
                    {location.state.message}
                </div>
            )}

            <Link to="/create-user" className="btn btn-primary mb-3">
                Crear Usuario
            </Link>

            <Link to="/" className="btn btn-outline-dark mb-3">
                Volver al Home
            </Link>

            <div className="row">
                {users.map(user => (
                    <div key={user.id} className="col-md-4 mb-3">
                        <div className="card p-3 shadow-sm">
                            <h5>{user.name}</h5>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Location:</strong> {user.location}</p>
                            <p><strong>Age:</strong> {user.age}</p>
                            <p><strong>Description:</strong> {user.description}</p>

                            <Link to={`/edit-user/${user.id}`} className="btn btn-warning btn-sm">
                                Editar
                            </Link>

                            <Link to={`/delete-user/${user.id}`} className="btn btn-danger btn-sm">
                                Eliminar
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default User
