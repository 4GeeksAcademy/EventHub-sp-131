import { Link, useLocation, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {

	const location = useLocation();
	const { store, dispatch } = useGlobalReducer()	
	const navigate = useNavigate()

	function logOutPromotor() {
		localStorage.removeItem("token")
		localStorage.removeItem("promotorAuth")
		dispatch({ type: "PROMOTOR_LOGOUT" })
		navigate('/promotor/login');
	}	
	
	function logOutAdmin() {
		localStorage.removeItem("tokenAdmin");
		localStorage.removeItem("adminAuth");
		dispatch({ type: "ADMIN_LOGOUT" });
		navigate("/admin/login");
	}
	

	function logOutUser() {
	   localStorage.removeItem("tokenUser");
	   localStorage.removeItem("userAuth");
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
					store.promotorAuth === false ?
						location.pathname &&
							!location.pathname.includes("login") ?
							<div className="gap-3">
								<div className="ml-auto">
									<Link to="/promotor/login">
										<button className="btn btn-primary">Promotor Login</button>
									</Link>
								</div>
							</div>
							: null
						:
						<div className="gap-3">
							<div className="ml-auto">
									<button className="btn btn-primary" onClick={logOutPromotor}>Log Out</button>
							</div>
						</div>
				}

				{
						store.userAuth === false
							? location.pathname &&
							  !location.pathname.includes("login") && (
									<Link to="/user/login">
										<button className="btn btn-primary">User Login</button>
									</Link>
							  )
							: (
									<button className="btn btn-success" onClick={logOutUser}>
										User Log Out
									</button>
							  )
					}

				{
						store.adminAuth === false
							? location.pathname &&
							!location.pathname.includes("login") && (
								<Link to="/admin/login">
								<button className="btn btn-warning">Admin Login</button>
								</Link>
							)
							: (
								<button className="btn btn-danger" onClick={logOutAdmin}>
								Admin Log Out
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