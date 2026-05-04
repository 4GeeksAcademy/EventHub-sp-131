import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

export const DeleteSavedEvent = () => {

    const urlAPI = import.meta.env.VITE_BACKEND_URL
    const { theId } = useParams()
    const navigate = useNavigate()
    const { store } = useGlobalReducer();

    async function deleteSavedEvent(id) {
        try {
            const response = await fetch(`${urlAPI}/api/saved_event/${id}`, {
                "method": "DELETE",
                "Content-Type": "application/json"
            })
            if (!response.ok) {
                throw new Error("Error on post fetch, status: ", response.status)
            }
            navigate("/saved-event")
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    if (!store.adminAuth) {
    return <Navigate to="/admin/login" />;
    }

    return (
        <div>
            <h1 className="text-center">Sure you want to baish this from existance??</h1>
            <div className="d-flex gap-2 justify-content-center">
                <Link to="/saved-event">
                    <button type="button" className="btn btn-primary">Go Back</button>
                </Link>
                <button type="button" className="btn btn-danger" onClick={() => deleteSavedEvent(theId)}>Delete</button>
            </div>
        </div>
    );
}