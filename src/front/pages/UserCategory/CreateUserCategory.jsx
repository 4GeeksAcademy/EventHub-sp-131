import React, { useState, useEffect } from "react"
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import { Link, useNavigate } from "react-router-dom";
import { use } from "react";

export const CreateUserCategroy = () => {

    const urlAPI = import.meta.env.VITE_BACKEND_URL
    const [selectedIDUser, setSelectedIDUser] = useState("")
    const [selectedIDCategroy, setSelectedIDCategroy] = useState("")
    const [allUsers, setAllUsers] = useState([])
    const [allCategroy, setAllCategroy] = useState([])
    const [message, setMessage] = useState("");

    const navigate = useNavigate()

    const handleInput = e => {
        e.preventDefault();
        switch (e.target.id) {
            case 'userId':
                setSelectedIDUser(e.target.value)
                break;
            case 'categroyId':
                setSelectedIDCategroy(e.target.value)
                break;
            default:
                break;
        }
    }

    async function createUserCategroy() {
        try {
            const response = await fetch(`${urlAPI}api/user_category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "user_id": selectedIDUser,
                    "category_id": selectedIDCategroy,
                })
            })
            const data = await response.json()
            if (!response.ok) {
                setMessage(data)
                throw new Error("Error on post fetch, status: ", response.status)
            }
            if (response.ok) {
                navigate("/user_category")
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
            if (str === "users") {
                setAllUsers(data.results)
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
        getData("users")
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
            <select className="form-select mb-3" aria-label="User id selector" id="userId" onChange={handleInput}>
                <option defaultValue>Select the ID of the user</option>
                {allUsers.map((user) => {
                    return (
                        <option key={user.id} value={user.id} >{user.name}</option>
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
            <button type="button" className="btn btn-primary" onClick={createUserCategroy}>Create</button>
        </div>
    );
}