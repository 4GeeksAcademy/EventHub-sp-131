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

	fetch(import.meta.env.VITE_BACKEND_URL + "/api/private", {
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

			localStorage.setItem("userAuth", "true");

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
				payload: data.user || data
			});
		})
		.catch((error) => {
			console.log("ERROR PRIVATE USER:", error);
		});
}, []);
	return (
		<div className="container mt-5">
			<div className="mb-4">
				<h1 className="fw-bold">Mi perfil</h1>
				<button
					className="btn btn-danger rounded-circle shadow"
					style={{
						position: "fixed",
						bottom: "20px",
						right: "20px",
						width: "60px",
						height: "60px",
						fontSize: "20px"
					}}
					onClick={() => navigate("/discover")}
					>
					🔥
				</button>
				<p className="text-muted mb-0">
					Gestiona tu actividad dentro de la plataforma.
				</p>
				<Link to="/search-by-image" className="btn btn-outline-primary">
                            Buscar eventos 🔍
                </Link>
			</div>

			{store.privateUser ? (
				<>
					{/* PERFIL */}
					<div className="card shadow-sm border-0 p-4 mb-4">
						<h5 className="fw-bold mb-2">
							Hola, {store.privateUser.name}
						</h5>

						<p className="text-muted mb-3">
							{store.privateUser.email}
						</p>

						<div className="row">
							<div className="col-md-4">
								<p className="mb-1"><strong>Localidad:</strong></p>
								<p className="text-muted">
									{store.privateUser.location || "No registrada"}
								</p>
							</div>

							<div className="col-md-4">
								<p className="mb-1"><strong>Edad:</strong></p>
								<p className="text-muted">
									{store.privateUser.age || "No registrada"}
								</p>
							</div>

							<div className="col-md-4">
								<p className="mb-1"><strong>Sobre mí:</strong></p>
								<p className="text-muted">
									{store.privateUser.description || "Sin descripción"}
								</p>
							</div>
						</div>
					</div>

					{/* DASHBOARD */}
					<div className="row g-3">
						<div className="col-md-4">
							<div className="card h-100 shadow-sm border-0 p-4">
								<h5>Eventos</h5>
								<p className="text-muted">Explora eventos disponibles.</p>
								<button
									className="btn btn-primary mt-auto"
									onClick={() => navigate("/user/events")}
								>
									Ver eventos
								</button>
							</div>
						</div>

						<div className="col-md-4">
							<div className="card h-100 shadow-sm border-0 p-4">
								<h5>Guardados</h5>
								<p className="text-muted">Tus eventos favoritos.</p>
								<button
									className="btn btn-success mt-auto"
									onClick={() => navigate("/user/saved-events")}
								>
									Ver guardados
								</button>
							</div>
						</div>

						<div className="col-md-4">
							<div className="card h-100 shadow-sm border-0 p-4">
								<h5>Asistencias</h5>
								<p className="text-muted">Eventos a los que asistirás.</p>
								<button
									className="btn btn-warning mt-auto"
									onClick={() => navigate("/user/assisting-events")}
								>
									Ver asistencias
								</button>
							</div>
						</div>

						<div className="col-md-4">
							<div className="card h-100 shadow-sm border-0 p-4">
								<h5>Grupos</h5>
								<p className="text-muted">Explora comunidades.</p>
								<button
									className="btn btn-info mt-auto"
									onClick={() => navigate("/user/groups")}
								>
									Ver grupos
								</button>
							</div>
						</div>

						<div className="col-md-4">
							<div className="card h-100 shadow-sm border-0 p-4">
								<h5>Perfiles</h5>
								<p className="text-muted">Conecta con otros usuarios.</p>
								<button
									className="btn btn-secondary mt-auto"
									onClick={() => navigate("/user/profiles")}
								>
									Ver perfiles
								</button>
							</div>
						</div>
					</div>
					
				</>
			) : (
				<p>Cargando...</p>
			)}
		</div>
	);
};