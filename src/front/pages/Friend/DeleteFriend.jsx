import { Link, useNavigate, useParams } from "react-router-dom";

export const DeleteFriend = () => {

    const urlAPI = import.meta.env.VITE_BACKEND_URL
    const { theId } = useParams()
    const navigate = useNavigate()

    async function deleteFriend(id) {
        try {
            const response = await fetch(`${urlAPI}/api/friend/${id}`, {
                "method": "DELETE",
                "Content-Type": "application/json"
            })
            if (!response.ok) {
                throw new Error("Error on post fetch, status: ", response.status)
            }
            navigate("/friend")
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    return (
        <div>
            <h1 className="text-center">Sure you want to baish this from existance??</h1>
            <div className="d-flex gap-2 justify-content-center">
                <Link to="/friend">
                    <button type="button" className="btn btn-primary">Go Back</button>
                </Link>
                <button type="button" className="btn btn-danger" onClick={() => deleteFriend(theId)}>Delete</button>
            </div>
        </div>
    );
}