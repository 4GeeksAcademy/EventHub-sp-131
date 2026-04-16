import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const CategoryCreate = () => {
	const [name, setName] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		fetch(import.meta.env.VITE_BACKEND_URL + "/api/categories", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ name })
		})
			.then((resp) => resp.json())
			.then(() => navigate("/categories"))
			.catch((error) => console.log(error));
	};

	return (
		<div className="container mt-4">
			<h2 className="mb-4">Crear categoría</h2>

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
					<button type="submit" className="btn btn-success">
						Guardar
					</button>
					<Link to="/category-panel" className="btn btn-secondary">
						Volver al panel
					</Link>
				</div>
			</form>
		</div>
	);
};