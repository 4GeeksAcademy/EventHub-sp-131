import React, { useState, useEffect } from "react"
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import { Link, useNavigate } from "react-router-dom";
import { use } from "react";

export const CreateEventCategory = () => {

    const urlAPI = import.meta.env.VITE_BACKEND_URL
    const [selectedIDEvent, setSelectedIDEvent] = useState("")
    const [selectedIDCategroy, setSelectedIDCategroy] = useState("")
    const [allEvents, setAllEvents] = useState([])
    const [allCategroy, setAllCategroy] = useState([])
    const [message, setMessage] = useState("");

    const navigate = useNavigate()

    const handleInput = e => {
        e.preventDefault();
        switch (e.target.id) {
            case 'eventId':
                setSelectedIDEvent(e.target.value)
                break;
            case 'categroyId':
                setSelectedIDCategroy(e.target.value)
                break;
            default:
                break;
        }
    }

    async function createEventCategroy() {
        try {
            const response = await fetch(`${urlAPI}api/event_category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "event_id": selectedIDEvent,
                    "category_id": selectedIDCategroy,
                })
            })
            const data = await response.json()
            if (!response.ok) {
                setMessage(data)
                throw new Error("Error on post fetch, status: ", response.status)
            }
            if (response.ok) {
                navigate("/event-category")
            }
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    async function getData(str) {
        try {
            const response = await fetch(`${urlAPI}api/${str}`, {
                "Content-Type": "application/json"
            })
            const data = await response.json()
            if (str === "events") {
                setAllEvents(data)
            }
            if (str === "categories") {
                setAllCategroy(data)
            }
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    useEffect(() => {
        getData("events")
        getData("categories")
    }, [])

    return (
        <div style={{ "width": "60%", "margin": "auto", marginTop: "4rem" }}>
            <Link to="/saved_categroy">
                <button type="button" className="btn btn-outline-secondary my-4">Back</button>
            </Link>
            {message ?
                <div className="alert alert-danger" role="alert">
                    {message}
                </div>
                :
                null}
            <select className="form-select mb-3" aria-label="Event id selector" id="eventId" onChange={handleInput}>
                <option defaultValue>Select the ID of the event</option>
                {allEvents.map((event) => {
                    return (
                        <option key={event.id} value={event.id} >{event.name}</option>
                    )
                })}
            </select>
            <select className="form-select mb-3" aria-label="Categroy id selector" id="categroyId" onChange={handleInput}>
                <option defaultValue>Select the ID of the categroy</option>
                {allCategroy.map((categroy) => {
                    return (
                        <option key={categroy.id} value={categroy.id}>{categroy.name}</option>
                    )
                })}
            </select>
            <button type="button" className="btn btn-primary" onClick={createEventCategroy}>Create</button>
        </div>
    );
}