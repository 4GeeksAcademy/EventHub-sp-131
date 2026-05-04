import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const CategoryEdit = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const { store } = useGlobalReducer();

	useEffect(() => {
		fetch(import.meta.env.VITE_BACKEND_URL + "/api/categories/" + id)
			.then((resp) => resp.json())
			.then((data) => setName(data.name))
			.catch((error) => console.log(error));
	}, [id]);

	const handleSubmit = (e) => {
		e.preventDefault();

		fetch(import.meta.env.VITE_BACKEND_URL + "/api/categories/" + id, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ name })
		})
			.then((resp) => resp.json())
			.then(() => navigate("/categories"))
			.catch((error) => console.log(error));
	};

	if (!store.adminAuth) {
			return <Navigate to="/admin/login" />;
	}

	return (
		<div className="container mt-4">
			<h2 className="mb-4">Editar categoría</h2>

			<form onSubmit={handleSubmit} className="card p-4">
				<div className="mb-3">
					<label className="form-label">Nombre</label>
					<input
						type="text"
						className="form-control"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>

				<div className="d-flex gap-2">
					<button type="submit" className="btn btn-warning">
						Actualizar
					</button>
					<Link to="/categories" className="btn btn-secondary">
						Volver a la lista
					</Link>
				</div>
			</form>
		</div>
	);
};