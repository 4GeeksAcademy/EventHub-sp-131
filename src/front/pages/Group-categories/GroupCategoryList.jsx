import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const GroupCategoryList = () => {
	const [relations, setRelations] = useState([]);

	const getRelations = () => {
		fetch(import.meta.env.VITE_BACKEND_URL + "/api/group-categories")
			.then((response) => response.json())
			.then((data) => {
				setRelations(data);
			})
			.catch((error) => console.log(error));
	};

	const deleteRelation = (id) => {
		fetch(import.meta.env.VITE_BACKEND_URL + `/api/group-categories/${id}`, {
			method: "DELETE"
		})
			.then((response) => response.json())
			.then(() => {
				getRelations();
			})
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		getRelations();
	}, []);

	return (
		<div className="container mt-4">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h2>CRUD Category - Group</h2>
				<Link to="/add-group-category" className="btn btn-success">
					Añadir relación
				</Link>
			</div>

			<table className="table table-bordered table-striped">
				<thead className="table-dark">
					<tr>
						<th>ID</th>
						<th>Grupo</th>
						<th>Categoría</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{relations.map((item) => (
						<tr key={item.id}>
							<td>{item.id}</td>
							<td>{item.group ? item.group.name : item.group_id}</td>
							<td>{item.category ? item.category.name : item.category_id}</td>
							<td>
								<Link
									to={`/edit-group-category/${item.id}`}
									className="btn btn-primary btn-sm me-2"
								>
									Editar
								</Link>
								<button
									className="btn btn-danger btn-sm"
									onClick={() => deleteRelation(item.id)}
								>
									Eliminar
								</button>
							</td>
						</tr>
					))}

					{relations.length === 0 && (
						<tr>
							<td colSpan="4" className="text-center">
								No hay relaciones creadas
							</td>
						</tr>
					)}
				</tbody>
			</table>

			<Link to="/" className="btn btn-secondary">
				Volver al Home
			</Link>
		</div>
	);
};