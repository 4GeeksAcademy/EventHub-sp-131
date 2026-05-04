import React, { useState, useEffect } from "react"
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { use } from "react";

export const CreateUserCategory = () => {

    const urlAPI = import.meta.env.VITE_BACKEND_URL
    const [selectedIDUser, setSelectedIDUser] = useState("")
    const [selectedIDCategory, setSelectedIDCategory] = useState("")
    const [allUsers, setAllUsers] = useState([])
    const [allCategory, setAllCategory] = useState([])
    const [message, setMessage] = useState("");

    const navigate = useNavigate()
    const { store } = useGlobalReducer();

    const handleInput = e => {
        e.preventDefault();
        switch (e.target.id) {
            case 'userId':
                setSelectedIDUser(e.target.value)
                break;
            case 'categroyId':
                setSelectedIDCategory(e.target.value)
                break;
            default:
                break;
        }
    }

    async function createUserCategory() {
        try {
            const response = await fetch(`${urlAPI}api/user_category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "user_id": selectedIDUser,
                    "category_id": selectedIDCategory,
                })
            })
            const data = await response.json()
            if (!response.ok) {
                setMessage(data)
                throw new Error("Error on post fetch, status: ", response.status)
            }
            if (response.ok) {
                navigate("/user-category")
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
                setAllUsers(data)
            }
            if (str === "categories") {
                setAllCategory(data)
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

    if (!store.adminAuth) {
    return <Navigate to="/admin/login" />;
    }

    return (
        <div style={{ "width": "60%", "margin": "auto", marginTop: "4rem" }}>
            <Link to="/user-category">
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
            <select className="form-select mb-3" aria-label="Category id selector" id="categroyId" onChange={handleInput}>
                <option defaultValue>Select the ID of the categroy</option>
                {allCategory.map((categroy) => {
                    return (
                        <option key={categroy.id} value={categroy.id}>{categroy.name}</option>
                    )
                })}
            </select>
            <button type="button" className="btn btn-primary" onClick={createUserCategory}>Create</button>
        </div>
    );
}