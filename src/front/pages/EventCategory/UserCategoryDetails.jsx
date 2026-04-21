import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export const EventCategroyDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { theId } = useParams();

    const [event_category, setEventCategroy] = useState(null);
    const [eventData, setEventData] = useState()
    const [categroyData, setCategroyData] = useState()

    async function getEventCategroyById(theId) {
        try {
            const response = await fetch(`${backendUrl}/api/event_category/${theId}`, {
                "Content-Type": "application/json"
            })
            const data = await response.json()
            setEventCategroy(data)
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    async function getDataById(theId, str) {
        try {
            const response = await fetch(`${backendUrl}/api/${str}/${theId}`, {
                "Content-Type": "application/json"
            })
            const data = await response.json()
            if (str === "events") {
                setEventData(data.results)
            }
            if (str === "categories") {
                setCategroyData(data)
            }
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    useEffect(() => {
        getEventCategroyById(theId)
    }, [])

    useEffect(() => {
        if (event_category) {
            getDataById(event_category.event_id, "events")
            getDataById(event_category.category_id, "categories")
        }
    }, [event_category])

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Link to="/event-category" className="btn btn-outline-dark">
                            Back
                        </Link>
                    </div>
                    {!event_category ? (
                        <div className="alert alert-secondary">
                            Loading saved categries...
                        </div>
                    ) : (
                        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                            {event_category ?
                                <div>
                                    <h2>Saved Event with ID {event_category.id}</h2>
                                    <div className="">
                                        {eventData  ?
                                            <h5>Event {eventData.name}</h5>
                                            :
                                            null
                                        }
                                        {categroyData ?
                                            <h5>has the categroy {categroyData.name}</h5>
                                            :
                                            null
                                        }
                                    </div>
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                    </div>
                                </div>
                                :
                                null
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};