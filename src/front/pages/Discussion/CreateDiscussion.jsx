import React, { useState, useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import devLog from "../../utils/devLogger";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { use } from "react";

export const CreateDiscussion = () => {

    const urlAPI = import.meta.env.VITE_BACKEND_URL;
    const [selectedIDUser, setSelectedIDUser] = useState("");
    const [selectedIDGroup, setSelectedIDGroup] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    const [discussionMessage, setDiscussionMessage] = useState("");
    const { store } = useGlobalReducer();

    const [message, setMessage] = useState("");

    const navigate = useNavigate();


    const handleInput = e => {
        e.preventDefault();
        switch (e.target.id) {
            case 'userId':
                setSelectedIDUser(e.target.value);
                break;
            case 'groupId':
                setSelectedIDGroup(e.target.value);
                break;
            case 'message':
                setDiscussionMessage(e.target.value);
                break;
            default:
                break;
        }
    };

    async function createDiscussion() {
        try {
            const response = await fetch(`${urlAPI}api/discussion`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "user_id": selectedIDUser,
                    "group_id": selectedIDGroup,
                    "message": discussionMessage
                })
            });
            const data = await response.json();
            if (!response.ok) {
                setMessage(data);
                throw new Error("Error on post fetch, status: ", response.status);
            }
            if (response.ok) {
                navigate("/discussion");
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
            if (str === "group") {
                setAllGroups(data);
            }
            return response;
        }
        catch (error) {
            devLog.error("Error on fetch: ", error.message);
        }
    }

    useEffect(() => {
        getData("users");
        getData("group");
    }, []);

    if (!store.adminAuth) {
        return <Navigate to="/admin/login" />;
    }

    return (
        <div style={{ "width": "60%", "margin": "auto", marginTop: "4rem" }}>
            <Link to="/discussion">
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
            <select className="form-select mb-3" aria-label="Group id selector" id="groupId" onChange={handleInput}>
                <option defaultValue>Select the ID of the group</option>
                {allGroups.map((group) => {
                    return (
                        <option key={group.id} value={group.id}>{group.name}</option>
                    );
                })}
            </select>
            <div className="input-group mb-3">
                <input onChange={handleInput} type="text" className="form-control" placeholder="Write your message" id="message" aria-label="Message" aria-describedby="mesage" value={discussionMessage} />
            </div>
            <button type="button" className="btn btn-primary" onClick={createDiscussion}>Create</button>
        </div>
    );
};