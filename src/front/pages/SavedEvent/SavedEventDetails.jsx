import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export const SavedEventDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { theId } = useParams();

    const [saved_event, setSavedEvent] = useState(null);
    console.log(saved_event);
    
    const [userData, setUserData] = useState()
    console.log("userData ",userData);
    
    const [eventData, setGroupData] = useState()
    console.log("GroupData", eventData);



    async function getSavedEventById(theId) {
        try {
            const response = await fetch(`${backendUrl}/api/saved_event/${theId}`, {
                "Content-Type": "application/json"
            })
            const data = await response.json()
            setSavedEvent(data)
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
            if (str === "users") {
                setUserData(data.results)
            }
            if (str === "events") {
                setGroupData(data.results)
            }
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    useEffect(() => {
        getSavedEventById(theId)
    }, [])

    useEffect(() => {
        if (saved_event) {
            getDataById(saved_event.user_id, "users")
            getDataById(saved_event.event_id, "events")
        }
    }, [saved_event])

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Link to="/saved-event" className="btn btn-outline-dark">
                            Back
                        </Link>
                    </div>
                    {!saved_event ? (
                        <div className="alert alert-secondary">
                            Loading saved events...
                        </div>
                    ) : (
                        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                            {saved_event ?
                                <div>
                                    <h2>Saved Event with ID {saved_event.id}</h2>
                                    <div className="">
                                        {userData  || eventData ?
                                            <h5>User: {userData.name}</h5>
                                            :
                                            null
                                        }
                                        {eventData ?
                                            <h5>will assist to the event {eventData.name}</h5>
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