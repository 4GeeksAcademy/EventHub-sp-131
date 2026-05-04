import React, { useEffect, useState } from "react"
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import { Link, Navigate } from "react-router-dom";

export const SavedEvent = () => {
    const { store, dispatch } = useGlobalReducer()
    const urlAPI = import.meta.env.VITE_BACKEND_URL
    const [allSavedEvents, setAllSavedEvents] = useState([])

    async function getSavedEvents() {
        try {
            const response = await fetch(`${urlAPI}/api/saved_event`, {
                "Content-Type": "application/json"
            })
            const data = await response.json()
            setAllSavedEvents(data)
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    useEffect(() => {
        getSavedEvents()
    }, [])

    if (!store.adminAuth) {
    return <Navigate to="/admin/login" />;
    }

    return (
        <>
            <div className="container">
                <div className="d-flex justify-content-between">
                    <div className="d-flex gap-2 mt-3">
                        <button type="button" className="btn btn-primary" onClick={getSavedEvents}>Get all saved events</button>
                        <Link to="/saved-event-create">
                            <button type="button" className="btn btn-primary">Create saved event</button>
                        </Link>
                    </div>
                    <Link to="/">
                        <button type="button" className="btn btn-outline-dark mt-3">Back</button>
                    </Link>
                </div>
                <div className="row row-cols-1 row-cols-md-4 g-4 gap-3">
                    {allSavedEvents.length === 0 ?
                        <p className="text-center p-5">No hay grupos registrados</p>
                        :
                        allSavedEvents ?
                            allSavedEvents.map((item) => {
                                return (
                                    <div className="col-sm-6 mb-3 mb-sm-0" key={item.id}>
                                        <div className="card my-3" style={{ "width": "18rem" }}>
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between">
                                                    <h6 className="card-title">SavedEvent number {item.id}</h6>
                                                    <div className="d-flex gap-1">
                                                        <Link to={`/saved-event-delete/${item.id}`}>
                                                            <button type="button" className="btn btn-outline-dark">
                                                                <i className="fa-regular fa-trash-can"></i>
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <Link to={`/saved-event/${item.id}/detail`}>
                                                    <button type="button" className="btn btn-primary">Ver</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            : null
                    }
                </div>
            </div>
        </>
    );
}; 