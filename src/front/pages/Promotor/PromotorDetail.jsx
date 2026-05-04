import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export const PromotorDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { theId } = useParams();

    const [promot, setPromot] = useState(null);
    const [message, setMessage] = useState("");

    async function getPromotorById(theId) {
        try {
            const response = await fetch(`${backendUrl}/api/promotor/${theId}`, {
                "Content-Type": "application/json"
            })
            const data = await response.json()
            setPromot(data)
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    useEffect(() => {
        
            if (!localStorage.getItem("adminAuth")) {
                navigate("/admin/login");
            }
        
        getPromotorById(theId)
    }, [])

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Link to="/promotor" className="btn btn-outline-dark">
                            Volver
                        </Link>
                    </div>

                    {message && (
                        <div className="alert alert-danger">
                            {message}
                        </div>
                    )}

                    {!promot ? (
                        <div className="alert alert-secondary">
                            Cargando promotores...
                        </div>
                    ) : (
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h3 className="mb-4">{promot.email}</h3>
                                <p className="card-text">email: {promot.email}</p>
                                <p className="card-text">location {promot.location}</p>
                                <p className="card-text">Tel: {promot.phone}</p>
                                <p className="card-text">{promot.webPage}</p>
                                <p className="card-text">{promot.verifiedOrg === true ? "Active" : "Inactive"}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};