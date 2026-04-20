import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const AddGroupCategory = () => {
	const navigate = useNavigate();

	const [groups, setGroups] = useState([]);
	const [categories, setCategories] = useState([]);
	const [formData, setFormData] = useState({
		group_id: "",
		category_id: ""
	});

	const getGroups = () => {
		fetch(import.meta.env.VITE_BACKEND_URL + "/api/groups")
			.then((response) => response.json())
			.then((data) => {
				setGroups(data);
			})
			.catch((error) => console.log(error));
	};

	const getCategories = () => {
		fetch(import.meta.env.VITE_BACKEND_URL + "/api/categories")
			.then((response) => response.json())
			.then((data) => {
				setCategories(data);
			})
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		getGroups();
		getCategories();
	}, []);

	const handleChange = (event) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		fetch(import.meta.env.VITE_BACKEND_URL + "/api/group-categories", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				group_id: Number(formData.group_id),
				category_id: Number(formData.category_id)
			})
		})
			.then((response) => response.json())
			.then(() => {
				navigate("/group-category");
			})
			.catch((error) => console.log(error));
	};

	return (
		<div className="container mt-4">
			<h2>Añadir relación Category - Group</h2>

			<form onSubmit={handleSubmit} className="mt-4">
				<div className="mb-3">
					<label className="form-label">Grupo</label>
					<select
						className="form-select"
						name="group_id"
						value={formData.group_id}
						onChange={handleChange}
					>
						<option value="">Selecciona un grupo</option>
						{groups.map((group) => (
							<option key={group.id} value={group.id}>
								{group.name}
							</option>
						))}
					</select>
				</div>

				<div className="mb-3">
					<label className="form-label">Categoría</label>
					<select
						className="form-select"
						name="category_id"
						value={formData.category_id}
						onChange={handleChange}
					>
						<option value="">Selecciona una categoría</option>
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
				</div>

				<button type="submit" className="btn btn-success me-2">
					Guardar
				</button>

				<Link to="/group-category" className="btn btn-secondary">
					Cancelar
				</Link>
			</form>
		</div>
	);
};