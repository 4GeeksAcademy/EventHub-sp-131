import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const EventDetail = () => {
    const { store, dispatch } = useGlobalReducer()
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();
    const { type } = useParams();
    const { ownerId } = useParams();
    const [event, setEvent] = useState(null);
    const [eventCat, setEventCat] = useState(null)

    const [categories, setCategories] = useState(null)
    const [eventAsistants, setEventAssistants] = useState(null)
    const [comments, setComments] = useState(null)

    const [message, setMessage] = useState("");

    useEffect(() => {
        if (localStorage.getItem("promotorAuth") == true) {
            setIsLogged(localStorage.getItem("promotorAuth"))
        }
        authUser(localStorage.getItem("token"));
    }, [])

    async function authUser(token) {
        try {
            const response = await fetch(`${urlApi}api/promotor/private`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })

            if (!response.ok) {
                navigate('/promotor/login')
            }
            dispatch({ type: "ADD_LOGIN_STATUS_PROMOTOR", payload: response.ok })
            localStorage.setItem("promotorAuth", response.ok)
            const data = await response.json()
            setProfileInfo(data.promotor)
        }

        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    async function getEventById() {
        try {
            const response = await fetch(`${backendUrl}/api/${type}/${ownerId}/events/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            })
            const data = await response.json()
            setEvent(data.event)
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    async function getEventCategoryById() {
        try {
            const response = await fetch(`${backendUrl}/api/${type}/${ownerId}/events/${id}/event_category`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            })
            const data = await response.json()
            setEventCat(data.eventCategories)
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    async function removeCategoryById(e) {
        console.log(e.target.value);
        try {
            const response = await fetch(`${backendUrl}/api/${type}/${ownerId}/events/${id}/event_category/${e.target.value}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            })
            const data = await response.json()
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
        getEventCategoryById()
        getCategories()
    }

    async function getEventAssistById() {
        try {
            const response = await fetch(`${backendUrl}/api/${type}/events/${id}/event-assists`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            })
            const data = await response.json()
            setEventAssistants(data.relations)
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }


    async function getCategories() {
        try {
            const response = await fetch(`${backendUrl}/api/categories`, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data = await response.json()
            const newCat = data.filter((cat) => !eventCat.some(item => item.name === cat.name))
            setCategories(newCat)
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    async function addNewCat(e) {
        const addedCategory = categories.find(cat => cat.name === e.target.value)
        try {
            const response = await fetch(`${backendUrl}/api/${type}/${ownerId}/events/${id}/event_category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    "event_id": parseInt(id),
                    "category_id": addedCategory.id,
                })
            })
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
        getEventCategoryById()
        getCategories()
    }

    async function getComments() {
        try {
            const response = await fetch(`${backendUrl}/api/${type}/events/${id}/comments`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            })
            const data = await response.json()
            setComments(data.comments)
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    useEffect(() => {
        getEventById()
        getEventAssistById()
        getEventCategoryById()
        getComments()
    }, [])


    useEffect(() => {
        if (eventCat) {
            getCategories()
        }
    }, [eventCat])

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Link to={`/${type}/private`} className="btn btn-outline-dark">
                            Volver
                        </Link>
                    </div>

                    {message && (
                        <div className="alert alert-danger">
                            {message}
                        </div>
                    )}

                    {!event ? (
                        <div className="alert alert-secondary">
                            Cargando evento...
                        </div>
                    ) : (
                        <div className="card shadow-sm border-0">
                            <img src={event.media} className="card-img-top" alt="..." />
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between">
                                    <h3 className="mb-4">{event.name}</h3>
                                    <div>
                                        <p className="card-text"><i className="fa-solid fa-location-dot"></i>  {event.location}</p>
                                        <p><i className="fa-solid fa-calendar"></i> {event.date_event}</p>
                                    </div>
                                </div>
                                <p>{event.description}</p>
                                <div>
                                    <select className="form-select" aria-label="Default select example" onChange={(e) => addNewCat(e)}>
                                        <option defaultValue>Open this select menu</option>
                                        {categories &&
                                            categories.map((cat) => {
                                                return (
                                                    <option key={cat.id}>{cat.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="d-flex py-3 gap-2 row row-cols-auto">
                                    {eventCat &&
                                        eventCat.map((categoryRel) => {
                                            return (
                                                <div key={categoryRel.id}>
                                                    <p className="p-1" style={{ textAlign: "center", textDecoration: "none", verticalAlign: "middle", backgroundColor: "#ffc107", border: "1px solid", borderRadius: "2rem" }}>
                                                        {categoryRel.category_name}
                                                        <button type="button" className="btn rounded-end-circle p-1 ps-2" onClick={(e) => { removeCategoryById(e) }} value={categoryRel.id}>X</button>
                                                    </p>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div>
                                    Who's going
                                    <div className="d-flex py-3 gap-2 row row-cols-auto">
                                        {eventAsistants &&
                                            eventAsistants.map((assistant) => {
                                                return (
                                                    <span key={assistant.id} className="badge d-flex align-items-center p-1 pe-2 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-pill" >
                                                        <img className="rounded-circle me-1" width="24" height="24" src="https://github.com/mdo.png" alt={assistant.user_name} />
                                                        {assistant.user_name}
                                                    </span>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div>
                                    Comments
                                    <div className="d-flex py-3 gap-2 row">
                                        {comments &&
                                            comments.map((comment) => {
                                                return (
                                                    <div key={comment.id} className="border border-dark-subtle p-2 rounded">
                                                        <span className="badge align-items-center p-1 pe-2 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-pill w-auto" >
                                                            <img className="rounded-circle me-1" width="24" height="24" src="https://github.com/mdo.png" alt={comment.user.name} />
                                                            {comment.user.name}
                                                        </span>
                                                        <p>{comment.message}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};