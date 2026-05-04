import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const GroupDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { theId } = useParams();
    const { store } = useGlobalReducer();

    const [group, setGroup] = useState(null);
    const [message, setMessage] = useState("");

    async function getGroupById(theId) {
        try {
            const response = await fetch(`${backendUrl}/api/group/${theId}`, {
                "Content-Type": "application/json"
            })
            const data = await response.json()
            setGroup(data)
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    useEffect(() => {
        getGroupById(theId)
    }, [])

    if (!store.adminAuth) {
    return <Navigate to="/admin/login" />;
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Link to="/group" className="btn btn-outline-dark">
                            Volver
                        </Link>
                    </div>

                    {message && (
                        <div className="alert alert-danger">
                            {message}
                        </div>
                    )}

                    {!group ? (
                        <div className="alert alert-secondary">
                            Cargando grupos...
                        </div>
                    ) : (
                        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                            <div className="col-10 col-sm-8 col-lg-6">
                                <img src={group.media} className="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes" width="700" height="500" loading="lazy" />
                            </div>
                            <div className="col-lg-6">
                                <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">{group.name}</h1>
                                <p className="lead">location {group.location}</p>
                                <p className="lead">{group.description}</p>
                                <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

{/* <div className="my-3" style={{ "width": "18rem" }}>
    <img src={group.media} className="" alt="..."></img>
    <div className="">
        <div className="d-flex justify-content-between">
            <h5 className="card-title"></h5>
            <div className="d-flex gap-1">
            </div>
        </div>
        <p className="card-text">location {group.location}</p>
        <p className="card-text">{group.description}</p>
    </div>
</div>
 */}