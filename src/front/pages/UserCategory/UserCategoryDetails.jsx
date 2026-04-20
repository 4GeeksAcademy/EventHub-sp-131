import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export const UserCategroyDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { theId } = useParams();

    const [user_category, setUserCategroy] = useState(null);
    const [userData, setUserData] = useState()
    const [categroyData, setCategroyData] = useState()

    async function getUserCategroyById(theId) {
        try {
            const response = await fetch(`${backendUrl}/api/user_category/${theId}`, {
                "Content-Type": "application/json"
            })
            const data = await response.json()
            setUserCategroy(data)
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
        getUserCategroyById(theId)
    }, [])

    useEffect(() => {
        if (user_category) {
            getDataById(user_category.user_id, "users")
            getDataById(user_category.category_id, "categories")
        }
    }, [user_category])

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Link to="/user_category" className="btn btn-outline-dark">
                            Back
                        </Link>
                    </div>
                    {!user_category ? (
                        <div className="alert alert-secondary">
                            Loading saved categries...
                        </div>
                    ) : (
                        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                            {user_category ?
                                <div>
                                    <h2>Saved Event with ID {user_category.id}</h2>
                                    <div className="">
                                        {userData  ?
                                            <h5>User {userData.name}</h5>
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