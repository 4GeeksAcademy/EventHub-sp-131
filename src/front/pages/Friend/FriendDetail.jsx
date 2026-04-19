import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export const FriendDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { theId } = useParams();

    const [friend, setFriend] = useState(null);
    const [message, setMessage] = useState("");
    console.log("Esto es friend", friend);
    const [userData, setUserData] = useState()
    console.log("UserData", userData);

    const [friendData, setFriendData] = useState()
    console.log("FriendData", friendData);



    async function getFriendById(theId) {
        try {
            const response = await fetch(`${backendUrl}/api/friend/${theId}`, {
                "Content-Type": "application/json"
            })
            const data = await response.json()
            setFriend(data)
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    async function getUserById(theId, str) {
        try {
            const response = await fetch(`${backendUrl}/api/users/${theId}`, {
                "Content-Type": "application/json"
            })
            const data = await response.json()

            if (str === "user") {
                setUserData(data.results)
            }
            if (str === "friend") {
                setFriendData(data.results)
            }
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    useEffect(() => {
        getFriendById(theId)
    }, [])

    useEffect(() => {
        if (friend) {
            getUserById(friend.user_id, "user")
            getUserById(friend.friend_id, "friend")
        }
    }, [friend])

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Link to="/friend" className="btn btn-outline-dark">
                            Volver
                        </Link>
                    </div>

                    {message && (
                        <div className="alert alert-danger">
                            {message}
                        </div>
                    )}

                    {!friend ? (
                        <div className="alert alert-secondary">
                            Loading friends...
                        </div>
                    ) : (
                        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                            <h4>The user:</h4>
                            {userData ?
                                <div className="card p-3 shadow-sm">
                                    <h5>{userData.name}</h5>
                                    <p><strong>Email:</strong> {userData.email}</p>
                                    <p><strong>Location:</strong> {userData.location}</p>
                                    <p><strong>Age:</strong> {userData.age}</p>
                                    <p><strong>Description:</strong> {userData.description}</p>
                                </div>
                                :
                                null
                            }
                            {friendData ?
                                <div className="card p-3 shadow-sm">
                                    <h5>{friendData.name}</h5>
                                    <p><strong>Email:</strong> {friendData.email}</p>
                                    <p><strong>Location:</strong> {friendData.location}</p>
                                    <p><strong>Age:</strong> {friendData.age}</p>
                                    <p><strong>Description:</strong> {friendData.description}</p>
                                </div>
                                :
                                null
                            }
                            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
