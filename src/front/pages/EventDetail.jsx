import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export const EventDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();
    const { type } = useParams();
    const { ownerId } = useParams();
    console.log(type);


    const [promot, setPromot] = useState(null);
    console.log(promot);

    const [message, setMessage] = useState("");

    async function getEventById() {
        try {
            const response = await fetch(`${backendUrl}/api/${type}/${ownerId}/events/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            })
            const data = await response.json()
            setPromot(data.event)
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    async function getEventAssistById() {
        try {
            const response = await fetch(`${backendUrl}/api/${type}/${ownerId}/events/${id}/event-assists`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            })
            const data = await response.json()
            setPromot(data.event)
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    useEffect(() => {
        getEventById()
        getEventAssistById()
    }, [])

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Link to={`/${type}/private`} className="btn btn-outline-dark">
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
                            Cargando evento...
                        </div>
                    ) : (
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h3 className="mb-4">{promot.name}</h3>
                                <p className="card-text">location {promot.location}</p>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};