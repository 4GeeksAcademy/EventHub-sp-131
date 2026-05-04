import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const EditGroupEvent = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { store } = useGlobalReducer();

	const [groups, setGroups] = useState([]);
	const [events, setEvents] = useState([]);
	const [groupId, setGroupId] = useState("");
	const [eventId, setEventId] = useState("");

	const backendUrl = import.meta.env.VITE_BACKEND_URL;

	const getGroups = () => {
		fetch(`${backendUrl}/api/group`)
			.then((resp) => resp.json())
			.then((data) => setGroups(Array.isArray(data) ? data : []))
			.catch((error) => {
				console.log(error);
				setGroups([]);
			});
	};

	const getEvents = () => {
		fetch(`${backendUrl}/api/events`)
			.then((resp) => resp.json())
			.then((data) => setEvents(Array.isArray(data) ? data : []))
			.catch((error) => {
				console.log(error);
				setEvents([]);
			});
	};

	const getOneRelation = () => {
		fetch(`${backendUrl}/api/group-event/${id}`)
			.then((resp) => resp.json())
			.then((data) => {
				setGroupId(data.group_id?.toString() || "");
				setEventId(data.event_id?.toString() || "");
			})
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		getGroups();
		getEvents();
		getOneRelation();
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();

		fetch(`${backendUrl}/api/group-event/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				group_id: parseInt(groupId),
				event_id: parseInt(eventId)
			})
		})
			.then((resp) => resp.json())
			.then(() => navigate("/group-event"))
			.catch((error) => console.log(error));
	};

	if (!store.adminAuth) {
    return <Navigate to="/admin/login" />;
  	}

	return (
		<div className="container mt-4">
			<h1 className="mb-4">Editar Group Event</h1>

			<form onSubmit={handleSubmit} className="border rounded p-4 bg-light">
				<div className="mb-3">
					<label className="form-label">Grupo</label>
					<select
						className="form-select"
						value={groupId}
						onChange={(e) => setGroupId(e.target.value)}
						required
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
					<label className="form-label">Evento</label>
					<select
						className="form-select"
						value={eventId}
						onChange={(e) => setEventId(e.target.value)}
						required
					>
						<option value="">Selecciona un evento</option>
						{events.map((event) => (
							<option key={event.id} value={event.id}>
								{event.name}
							</option>
						))}
					</select>
				</div>

				<button type="submit" className="btn btn-primary me-2">
					Actualizar
				</button>

				<button
					type="button"
					className="btn btn-secondary"
					onClick={() => navigate("/group-event")}
				>
					Cancelar
				</button>
			</form>
		</div>
	);
};