import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import EventHubHeroImage from "../../assets/img/EventHubHeroImage.png";

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
				localStorage.setItem("user", JSON.stringify(data.user));

				dispatch({
					type: "ADD_TOKEN_USER",
					payload: data.token
				});

				dispatch({
					type: "ADD_LOGIN_STATUS_USER",
					payload: true
				});

				navigate("/user/private");
			})
			.catch(() => {
				setError("Something went wrong");
			});
	}

	return (
		<div style={{ background: `linear-gradient(rgba(10, 10, 15, 0.75), rgba(10, 10, 15, 0.85)), url(${EventHubHeroImage}) center/cover no-repeat`}}>
			<div className="container row mx-auto mt-3">
				<div className="d-flex justify-content-end mb-1">
					<Link to="/">
						<button type="button" className="btn btn-outline mt-3">Back</button>
					</Link>
				</div>
				<div className="pt-4 w-50 mx-auto forms">
					<h1 className="d-flex justify-content-center mb-4">User Login</h1>
					{error && <div className="alert alert-danger">{error}</div>}
					<form onSubmit={handleLogin}>
						<div className="mb-3 m-auto" style={{ width: "500px" }}>
							<label className="form-label">Email</label>
							<input
								type="email"
								className="form-control"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div className="mb-4 m-auto" style={{ width: "500px" }}>
							<label className="form-label">Password</label>
							<input
								type="password"
								className="form-control"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<button className="btn btn-primary d-grid gap-2 col-6 mx-auto">
							Iniciar Sesión
						</button>
					</form>
					<div className="d-flex mt-2 p-3 gap-4 align-items-center" style={{ justifySelf: "center" }}>
						<p className="">Not registered?</p>
						<Link to="/user/register">
							<button className="btn btn-secondary">Sign Up Here</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};