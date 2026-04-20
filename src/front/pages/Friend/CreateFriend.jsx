import React, { useState, useEffect } from "react"
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";

export const CreateFriend = () => {

    const urlAPI = import.meta.env.VITE_BACKEND_URL
    const [selectedIDUser, setSelectedIDUser] = useState("")
    const [selectedIDFriend, setSelectedIDFriend] = useState("")
    const [allFriends, setAllFriends] = useState([])
    const [message, setMessage] = useState("");

    const navigate = useNavigate()


    const handleInput = e => {
        e.preventDefault();        
        switch (e.target.id) {
            case 'userId':
                setSelectedIDUser(e.target.value)
                break;
            case 'friendId':
                setSelectedIDFriend(e.target.value)
                break;
            default:
                break;
        }
    }

    async function createFriend() {
        try {
            const response = await fetch(`${urlAPI}api/friend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "user_id": selectedIDUser,
                    "friend_id": selectedIDFriend,
                })
            })
            const data = await response.json()
            if (!response.ok) {
                setMessage(data)
                throw new Error("Error on post fetch, status: ", response.status)
            }
            if (response.ok) {
                navigate("/friend")
            }
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    async function getFriends() {
        try {
            const response = await fetch(`${urlAPI}api/users`, {
                "Content-Type": "application/json"
            })
            const data = await response.json()
            setAllFriends(data.results)
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    useEffect(() => {
        getFriends()
    }, [])

    return (
        <div style={{ "width": "60%", "margin": "auto", marginTop: "4rem" }}>
            {message ?
                <div className="alert alert-danger" role="alert">
                    {message}
                </div>
                :
                null}
            <select className="form-select mb-3" aria-label="User id selector" id="userId" onChange={handleInput}>
                <option defaultValue>Select the ID of the user</option>
                {allFriends.map((user) => {
                    return (
                        <option key={user.id} value={user.id} >{user.name}</option>
                    )
                })}
            </select>
            <select className="form-select mb-3" aria-label="Friend id selector" id="friendId" onChange={handleInput}>
                <option defaultValue>Select the ID of the friend</option>
                {allFriends.map((user) => {
                    return (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    )
                })}
            </select>
            <button type="button" className="btn btn-primary" onClick={createFriend}>Create</button>
        </div>
    );
}