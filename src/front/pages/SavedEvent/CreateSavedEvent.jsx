import React, { useState, useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import devLog from "../../utils/devLogger";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { use } from "react";

export const CreateSavedEvent = () => {

    const urlAPI = import.meta.env.VITE_BACKEND_URL;
    const [selectedIDUser, setSelectedIDUser] = useState("");
    const [selectedIDEvent, setSelectedIDEvent] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [allEvent, setAllEvent] = useState([]);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const { store } = useGlobalReducer();

    const handleInput = e => {
        e.preventDefault();
        switch (e.target.id) {
            case 'userId':
                setSelectedIDUser(e.target.value);
                break;
            case 'eventId':
                setSelectedIDEvent(e.target.value);
                break;
            default:
                break;
        }
    };

    async function createSavedEvent() {
        try {
            const response = await fetch(`${urlAPI}api/saved_event`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "user_id": selectedIDUser,
                    "event_id": selectedIDEvent
                })
            });
            const data = await response.json();
            if (!response.ok) {
                setMessage(data);
                throw new Error("Error on post fetch, status: ", response.status);
            }
            if (response.ok) {
                navigate("/saved-event");
            }
        }
        catch (error) {
            devLog.error("Error on fetch: ", error.message);
        }
    }

    async function getData(str) {
        try {
            const response = await fetch(`${urlAPI}api/${str}`, {
                "Content-Type": "application/json"
            });
            const data = await response.json();
            if (str === "users") {
                setAllUsers(data);
            }
            if (str === "events") {
                setAllEvent(data);
            }
            return response;
        }
        catch (error) {
            devLog.error("Error on fetch: ", error.message);
        }
    }

    useEffect(() => {
        getData("users");
        getData("events");
    }, []);

    if (!store.adminAuth) {
    return <Navigate to="/admin/login" />;
    }

    return (
        <div style={{ "width": "60%", "margin": "auto", marginTop: "4rem" }}>
            <Link to="/saved-event">
                <button type="button" className="btn btn-outline-secondary my-4">Back</button>
            </Link>
            {message ?
                <div className="alert alert-danger" role="alert">
                    {message}
                </div>
                :
                null}
            <select className="form-select mb-3" aria-label="User id selector" id="userId" onChange={handleInput}>
                <option defaultValue>Select the ID of the user</option>
                {allUsers.map((user) => {
                    return (
                        <option key={user.id} value={user.id} >{user.name}</option>
                    );
                })}
            </select>
            <select className="form-select mb-3" aria-label="Event id selector" id="eventId" onChange={handleInput}>
                <option defaultValue>Select the ID of the event</option>
                {allEvent.map((event) => {
                    return (
                        <option key={event.id} value={event.id}>{event.name}</option>
                    );
                })}
            </select>
            <button type="button" className="btn btn-primary" onClick={createSavedEvent}>Create</button>
        </div>
    );
};