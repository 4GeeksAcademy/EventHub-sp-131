import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const LoginUser = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	useEffect(() => {
		if (store.userAuth && localStorage.getItem("tokenUser")) {
			navigate("/user/private");
		}
	}, [store.userAuth, navigate]);

	function handleLogin(e) {
		e.preventDefault();

		fetch(import.meta.env.VITE_BACKEND_URL + "/api/user/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				email: email,
				password: password
			})
		})
			.then((resp) => resp.json().then((data) => ({ ok: resp.ok, data })))
			.then(({ ok, data }) => {
				if (!ok) {
					setError("Bad email or password");
					return;
				}

				localStorage.setItem("tokenUser", data.token);
				localStorage.setItem("userAuth", "true");

				dispatch({
					type: "ADD_TOKEN_USER",
					payload: data.token
				});

				dispatch({
					type: "ADD_LOGIN_STATUS_USER",
					payload: true
				});

				navigate("/user-flow/dashboard");
			})
			.catch(() => {
				setError("Something went wrong");
			});
	}

	return (
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card shadow p-4 mt-5">
						<h1 className="text-center mb-4">User Login</h1>

						{error && <div className="alert alert-danger">{error}</div>}

						<form onSubmit={handleLogin}>
							<div className="mb-3">
								<label className="form-label">Email</label>
								<input
									type="email"
									className="form-control"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>

							<div className="mb-3">
								<label className="form-label">Password</label>
								<input
									type="password"
									className="form-control"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>

							<button className="btn btn-success w-100">
								Login
							</button>

							<button
								type="button"
								className="btn btn-secondary w-100 mt-2"
								onClick={() => navigate("/")}
							>
								Volver
							</button>
						</form>
						<Link to="/create-user" className="btn btn-outline-success mt-3">
                           Crear cuenta
                        </Link>
					</div>
				</div>
			</div>
		</div>
	);
};