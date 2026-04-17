import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

export const EditGroup = () => {

    const urlAPI = import.meta.env.VITE_BACKEND_URL
    const { store, dispatch } = useGlobalReducer()
    const [name, setName] = useState("")
    const [media, setMedia] = useState("")
    const [location, setLocation] = useState("")
    const [description, setDescription] = useState("")
    const { theId } = useParams()

    const navigate = useNavigate()

    async function getGroup(id) {
        try {
            const response = await fetch(`${urlAPI}/api/group/${id}`, {
                "Content-Type": "application/json"
            })
            const data = await response.json()
            setName(data.name)
            setMedia(data.media)
            setLocation(data.location)
            setDescription(data.description)

            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    const handleInput = e => {
        e.preventDefault();
        switch (e.target.id) {
            case 'name':
                setName(e.target.value)
                break;
            case 'location':
                setLocation(e.target.value)
                break;
            case 'media':
                setMedia(e.target.value)
                break;
            case 'description':
                setDescription(e.target.value)
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        getGroup(theId)
    }, [])

    async function editGroup(id) {
        try {
            const response = await fetch(`${urlAPI}/api/group/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "name": name,
                    "media": media,
                    "location": location,
                    "description": description
                })
            })
            if (!response.ok) {
                throw new Error("Error on post fetch, status: ", response.status)
            }
            navigate("/group")
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }
    return (
        <div style={{ "width": "60%", "margin": "auto", "marginTop": "4rem" }}>
            <h1 className="text-center">Edit the group { }</h1>
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
            <div className="d-flex gap-2">
                <button type="button" className="btn btn-primary" onClick={() => editGroup(theId)}>Edit</button>
                <Link to="/group">
                    <button type="button" className="btn btn-secondary">Cancel</button>
                </Link>
            </div>
        </div>
    );
}