import React from "react";
import { Link, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const CategoryPanel = () => {
	const { store } = useGlobalReducer();

	if (!store.adminAuth) {
				return <Navigate to="/admin/login" />;
	}

	return (
		<div className="container mt-5">
			<h2 className="mb-4">Panel de Categorías</h2>

			<div className="card p-4">
				<p className="mb-4">Selecciona la acción que quieres realizar.</p>

				<div className="d-flex gap-3 flex-wrap">
					<Link to="/categories" className="btn btn-primary">
						Ver categorías
					</Link>

					<Link to="/categories/create" className="btn btn-success">
						Crear categoría
					</Link>
				</div>
			</div>
		</div>
	);
};