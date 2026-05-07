import { useNavigate } from "react-router-dom";

export const BackButton = ({ fallback = "/" , where}) => {
    const navigate = useNavigate();

    const goBack = () => {
        if (where) {
            navigate(where)
            return
        }
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