import React, { useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import devLog from "../../utils/devLogger";
import { useNavigate, Navigate } from "react-router-dom";

export const CreateGroup = () => {

    const urlAPI = import.meta.env.VITE_BACKEND_URL;
    const [name, setName] = useState("");
    const [media, setMedia] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const { store } = useGlobalReducer();

    const navigate = useNavigate();


    const handleInput = e => {
        e.preventDefault();
        switch (e.target.id) {
            case 'name':
                setName(e.target.value);
                break;
            case 'location':
                setLocation(e.target.value);
                break;
            case 'media':
                setMedia(e.target.value);
                break;
            case 'description':
                setDescription(e.target.value);
                break;
            default:
                break;
        }
    };

    async function createGroup() {
        try {
            const response = await fetch(`${urlAPI}/api/group`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "name": name,
                    "media": media,
                    "location": location,
                    "description": description
                })
            });
            if (!response.ok) {
                throw new Error("Error on post fetch, status: ", response.status);
            }
            navigate("/group");
        }
        catch (error) {
            devLog.error("Error on fetch: ", error.message);
        }
    }

    if (!store.adminAuth) {
        return <Navigate to="/admin/login" />;
    }

    return (
        <div style={{ "width": "60%", "margin": "auto", marginTop: "4rem" }}>
            <div className="input-group mb-3">
                <input onChange={handleInput} type="text" className="form-control" placeholder="Username" id="name" aria-label="Username" aria-describedby="name" value={name} />
            </div>
            <div className="input-group mb-3">
                <input onChange={handleInput} type="media" className="form-control" placeholder="Your image url" id="media" aria-label="Media" aria-describedby="media" value={media} />
            </div>
            <div className="input-group mb-3">
                <input onChange={handleInput} type="text" className="form-control" placeholder="Location" id="location" aria-label="Location" aria-describedby="location" value={location} />
            </div>
            <div className="input-group mb-3">
                <input onChange={handleInput} type="text" className="form-control" placeholder="Description" id="description" aria-label="Description" aria-describedby="description" value={description} />
            </div>
            <button type="button" className="btn btn-primary" onClick={createGroup}>Create</button>
        </div>
    );
};