import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
		<div className="container">
			<div className="card shadow p-4 mt-5">
				<h1>User Private View</h1>

				{store.privateUser ? (
					<>
						<p><strong>ID:</strong> {store.privateUser.id}</p>
						<p><strong>Email:</strong> {store.privateUser.email}</p>
					</>
				) : (
					<p>Loading...</p>
				)}
			</div>
		</div>
	);
};