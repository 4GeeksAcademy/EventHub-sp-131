import { useNavigate } from "react-router-dom";

export const BackButton = ({ fallback = "/" }) => {
    const navigate = useNavigate();

    const goBack = () => {
        if (localStorage.getItem("tokenUser")) {
            navigate("/user/private");
            return;
        }

        if (localStorage.getItem("tokenPromotor")) {
            navigate("/promotor/private");
            return;
        }

        if (localStorage.getItem("tokenAdmin")) {
            navigate("/admin/private");
            return;
        }

        navigate(fallback);
    };

    return (
        <button className="btn btn-outline-secondary" onClick={goBack}>
            ← Volver
        </button>
    );
};