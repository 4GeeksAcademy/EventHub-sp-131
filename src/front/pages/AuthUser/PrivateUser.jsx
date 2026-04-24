import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const PrivateUser = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("tokenUser");

		if (!token) {
			navigate("/user/login");
			return;
		}

		fetch(import.meta.env.VITE_BACKEND_URL + "/api/user/private", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token
			}
		})
			.then((resp) => resp.json().then((data) => ({ ok: resp.ok, data })))
			.then(({ ok, data }) => {
				if (!ok) {
					localStorage.removeItem("tokenUser");
					localStorage.removeItem("userAuth");

					dispatch({ type: "USER_LOGOUT" });
					navigate("/user/login");
					return;
				}

				localStorage.setItem("userAuth", JSON.stringify(data.user));

				dispatch({
					type: "ADD_TOKEN_USER",
					payload: token
				});

				dispatch({
					type: "ADD_LOGIN_STATUS_USER",
					payload: true
				});

				dispatch({
					type: "GET_PRIVATE_USER",
					payload: data.user
				});
			})
			.catch(() => {
				navigate("/user/login");
			});
	}, [dispatch, navigate]);

	return (
		<div className="container py-5">
			<div className="card shadow p-4 mt-5">
				<h1 className="mb-4">Mi perfil</h1>

				{store.privateUser ? (
					<>
						<p><strong>ID:</strong> {store.privateUser.id}</p>
						<p><strong>Nombre:</strong> {store.privateUser.name || "No registrado"}</p>
						<p><strong>Email:</strong> {store.privateUser.email || "No registrado"}</p>
						<p><strong>Edad:</strong> {store.privateUser.age || "No registrada"}</p>
						<p><strong>Localidad:</strong> {store.privateUser.location || "No registrada"}</p>
						<p><strong>Descripción:</strong> {store.privateUser.description || "Sin descripción"}</p>

						<div className="d-flex gap-2 mt-4">
							<Link to="/user-flow/dashboard" className="btn btn-primary">
								Ir al dashboard
							</Link>

							<Link to={`/edit-user/${store.privateUser.id}`} className="btn btn-outline-secondary">
								Editar perfil
							</Link>
						</div>
					</>
				) : (
					<p>Loading...</p>
				)}
			</div>
		</div>
	);
};