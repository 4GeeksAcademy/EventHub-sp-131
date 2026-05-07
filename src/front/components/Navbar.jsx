import { Link, useLocation, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import EventHubIcon from "../assets/img/EventHubIcon.png";

export const Navbar = () => {
  const location = useLocation();
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const isPromotorAuth = localStorage.getItem("promotorAuth");
  const isUserAuth = localStorage.getItem("userAuth");

  function logOutPromotor() {
    localStorage.removeItem("token");
    localStorage.removeItem("promotorAuth");
    dispatch({ type: "PROMOTOR_LOGOUT" });
    navigate("/promotor/login");
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
    <header className="header-section header-2 ordered-list-header sticky-navbar">
      <div className="container mt-3">
        <nav className="navbar navbar-expand-xl">
          <div className="d-flex w-100 justify-content-between align-items-center">
            <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
              <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
                 <img src={EventHubIcon} alt="EventHub" className="navbar-logo-img"/>

                    <span className="navbar-brand mb-0 h1 navbar-logo-text">
                       Event Hub
                    </span>
              </Link>
			</Link>

            <div className="d-none d-xl-block">
              <ul className="menu-list list-unstyled d-flex gap-4 navbar-nav mb-0">
                <li className="nav-item">
                  <Link to="/" className="nav-link text-uppercase fw-semibold nav-hover">
                    Home
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/about" className="nav-link text-uppercase fw-semibold nav-hover">
                    About Us
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/promote" className="nav-link text-uppercase fw-semibold nav-hover">
                    Promoting an event?
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/contact" className="nav-link text-uppercase fw-semibold nav-hover">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="d-flex align-items-center gap-3">
              {!isPromotorAuth && !isUserAuth && !location.pathname.includes("login") && (
                <Link to="/user/login" className="navbar-login-btn">
                       Login
                </Link>
              )}

              {isUserAuth && (
                <>
                  <Link to="/user/private" className="navbar-dashboard-btn">
                    Dashboard
                  </Link>

                  <button className="navbar-logout-btn" onClick={logOutUser}>
                    Log Out
                  </button>
                </>
              )}

              {isPromotorAuth && !isUserAuth && (
                <>
                  <Link to="/promotor/private" className="navbar-dashboard-btn">
                    Dashboard
                  </Link>

                  <button className="navbar-logout-btn" onClick={logOutPromotor}>
                    Log Out
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};