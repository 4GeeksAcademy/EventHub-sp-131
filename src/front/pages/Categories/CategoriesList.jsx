import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const CategoriesList = () => {
	const [categories, setCategories] = useState([]);
	const { store } = useGlobalReducer();

	const loadCategories = () => {
		fetch(import.meta.env.VITE_BACKEND_URL + "/api/categories")
			.then((resp) => resp.json())
			.then((data) => setCategories(data))
			.catch((error) => console.log(error));
	};

	const deleteCategory = (id) => {
		fetch(import.meta.env.VITE_BACKEND_URL + "/api/categories/" + id, {
			method: "DELETE"
		})
			.then((resp) => resp.json())
			.then(() => loadCategories())
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		loadCategories();
	}, []);

	if (!store.adminAuth) {
    return <Navigate to="/admin/login" />;
	}

	return (
		<div className="container mt-4">
			<div className="d-flex justify-content-between align-items-center mb-3">
				<h2>Categorías</h2>

				<div className="d-flex gap-2">
					<Link to="/category-panel" className="btn btn-secondary">
						Volver al panel
					</Link>
					<Link to="/categories/create" className="btn btn-success">
						Crear categoría
					</Link>
				</div>
			</div>

			<table className="table table-bordered">
				<thead>
					<tr>
						<th>ID</th>
						<th>Nombre</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{categories.map((item) => (
						<tr key={item.id}>
							<td>{item.id}</td>
							<td>{item.name}</td>
							<td>
								<div className="d-flex gap-2">
									<Link
										to={`/categories/${item.id}`}
										className="btn btn-primary btn-sm"
									>
										Leer
									</Link>

									<Link
										to={`/categories/edit/${item.id}`}
										className="btn btn-warning btn-sm"
									>
										Editar
									</Link>

									<button
										className="btn btn-danger btn-sm"
										onClick={() => deleteCategory(item.id)}
									>
										Eliminar
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};