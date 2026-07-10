import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import devLog from "../../utils/devLogger";

export const DeleteEventCategory = () => {

    const urlAPI = import.meta.env.VITE_BACKEND_URL;
    const { theId } = useParams();
    const navigate = useNavigate();
    const { store } = useGlobalReducer();

    async function deleteEventCategroy(id) {
        try {
            const response = await fetch(`${urlAPI}/api/event_category/${id}`, {
                "method": "DELETE",
                "Content-Type": "application/json"
            });
            if (!response.ok) {
                throw new Error("Error on post fetch, status: ", response.status);
            }
            navigate("/event-category");
        }
        catch (error) {
            devLog.error("Error on fetch: ", error.message);
        }
    }

    if (!store.adminAuth) {
            return <Navigate to="/admin/login" />;
    }

    return (
        <div>
            <h1 className="text-center">Sure you want to baish this from existance??</h1>
            <div className="d-flex gap-2 justify-content-center">
                <Link to="/user-category">
                    <button type="button" className="btn btn-primary">Go Back</button>
                </Link>
                <button type="button" className="btn btn-danger" onClick={() => deleteEventCategroy(theId)}>Delete</button>
            </div>
        </div>
    );
};