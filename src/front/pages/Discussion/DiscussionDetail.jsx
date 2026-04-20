import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export const DiscussionDetail = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { theId } = useParams();

    const [discussion, setDiscussion] = useState(null);
    const [userData, setUserData] = useState()
    const [groupData, setGroupData] = useState()
    console.log("GroupData", groupData);



    async function getDiscussionById(theId) {
        try {
            const response = await fetch(`${backendUrl}/api/discussion/${theId}`, {
                "Content-Type": "application/json"
            })
            const data = await response.json()
            setDiscussion(data)
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
            if (str === "group") {
                setGroupData(data)
            }
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    useEffect(() => {
        getDiscussionById(theId)
    }, [])

    useEffect(() => {
        if (discussion) {
            getDataById(discussion.user_id, "users")
            getDataById(discussion.group_id, "group")
        }
    }, [discussion])

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Link to="/discussion" className="btn btn-outline-dark">
                            Back
                        </Link>
                    </div>
                    {!discussion ? (
                        <div className="alert alert-secondary">
                            Loading discussions...
                        </div>
                    ) : (
                        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                            {discussion ?
                                <div>
                                    <h2>Discussion with ID {discussion.id}</h2>
                                    <p>with Message: {discussion.message}</p>
                                    <p>was created on {discussion.create_date}</p>
                                    <div className="">
                                        {userData ?
                                            <h5>By the user: {userData.name}</h5>
                                            :
                                            null
                                        }
                                        {groupData ?
                                            <h5>on the group {groupData.name}</h5>
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