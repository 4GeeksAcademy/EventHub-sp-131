import { Link, useLocation, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
    const location = useLocation();
	const { store, dispatch } = useGlobalReducer()
	console.log(store);
	
	const navigate = useNavigate()
	function logOutUser() {
		localStorage.removeItem("tokenUser");
		dispatch({ type: "USER_LOGOUT" });
		navigate("/user/login");
	}

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>

				{
						store.userAuth === false
							? location.pathname &&
							  !location.pathname.includes("login") && (
									<Link to="/user/login">
										<button className="btn btn-success">User Login</button>
									</Link>
							  )
							: (
									<button className="btn btn-success" onClick={logOutUser}>
										User Log Out
									</button>
							  )
					}
				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};