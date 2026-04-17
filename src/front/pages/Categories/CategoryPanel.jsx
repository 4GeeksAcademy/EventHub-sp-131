import React from "react";
import { Link } from "react-router-dom";

export const CategoryPanel = () => {
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