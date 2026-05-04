import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const CategoryDetail = () => {
	const { id } = useParams();
	const [category, setCategory] = useState(null);
	const { store } = useGlobalReducer();

	useEffect(() => {
		fetch(import.meta.env.VITE_BACKEND_URL + "/api/categories/" + id)
			.then((resp) => resp.json())
			.then((data) => setCategory(data))
			.catch((error) => console.log(error));
	}, [id]);

	if (!category) {
		return <div className="container mt-4">Cargando...</div>;
	}

	if (!store.adminAuth) {
		return <Navigate to="/admin/login" />;
	}

	return (
		<div className="container mt-4">
			<h2 className="mb-4">Detalle de categoría</h2>

			<div className="card p-4">
				<p><strong>ID:</strong> {category.id}</p>
				<p><strong>Nombre:</strong> {category.name}</p>

				<div className="d-flex gap-2 mt-3">
					<Link
						to={`/categories/edit/${category.id}`}
						className="btn btn-warning"
					>
						Editar
					</Link>

					<Link to="/categories" className="btn btn-secondary">
						Volver a la lista
					</Link>
				</div>
			</div>
		</div>
	);
};