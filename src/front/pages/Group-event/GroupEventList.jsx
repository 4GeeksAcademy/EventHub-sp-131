import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import devLog from "../../utils/devLogger";

export const GroupEventList = () => {
	const [relations, setRelations] = useState([]);
	const [groups, setGroups] = useState([]);
	const [events, setEvents] = useState([]);
	const { store } = useGlobalReducer();


	const backendUrl = import.meta.env.VITE_BACKEND_URL;

	const getRelations = () => {
		fetch(`${backendUrl}/api/group-event`)
			.then((resp) => resp.json())
			.then((data) => setRelations(Array.isArray(data) ? data : []))
			.catch((error) => {
				devLog.error(error);
				setRelations([]);
			});
	};

	const getGroups = () => {
		fetch(`${backendUrl}/api/group`)
			.then((resp) => resp.json())
			.then((data) => setGroups(Array.isArray(data) ? data : []))
			.catch((error) => {
				devLog.error(error);
				setGroups([]);
			});
	};

	const getEvents = () => {
		fetch(`${backendUrl}/api/events`)
			.then((resp) => resp.json())
			.then((data) => setEvents(Array.isArray(data) ? data : []))
			.catch((error) => {
				devLog.error(error);
				setEvents([]);
			});
	};

	useEffect(() => {
		getRelations();
		getGroups();
		getEvents();
	}, []);

	const handleDelete = (id) => {
		fetch(`${backendUrl}/api/group-event/${id}`, {
			method: "DELETE"
		})
			.then((resp) => resp.json())
			.then(() => getRelations())
			.catch((error) => devLog.error(error));
	};

	const getGroupName = (id) => {
		const group = groups.find((item) => item.id === id);
		return group ? group.name : id;
	};

	const getEventName = (id) => {
		const event = events.find((item) => item.id === id);
		return event ? event.name : id;
	};

	if (!store.adminAuth) {
    return <Navigate to="/admin/login" />;
  	}

	return (
		<div className="container mt-4">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1>Lista Group Event</h1>
				<Link to="/create-group-event" className="btn btn-primary">
					Crear relación
				</Link>
			</div>

			<table className="table table-bordered table-striped">
				<thead className="table-dark">
					<tr>
						<th>ID</th>
						<th>Grupo</th>
						<th>Evento</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{relations.map((item) => (
						<tr key={item.id}>
							<td>{item.id}</td>
							<td>{getGroupName(item.group_id)}</td>
							<td>{getEventName(item.event_id)}</td>
							<td>
								<Link
									to={`/edit-group-event/${item.id}`}
									className="btn btn-warning btn-sm me-2"
								>
									Editar
								</Link>

								<button
									className="btn btn-danger btn-sm"
									onClick={() => handleDelete(item.id)}
								>
									Eliminar
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};