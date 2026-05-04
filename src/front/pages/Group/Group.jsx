import React, { useEffect, useState } from "react"
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import { Link, Navigate } from "react-router-dom";

export const Group = () => {
    const { store, dispatch } = useGlobalReducer()
    const urlAPI = import.meta.env.VITE_BACKEND_URL
    const [allGroups, setAllGroups] = useState([])


    async function getGroups() {
        try {
            const response = await fetch(`${urlAPI}/api/group`, {
                "Content-Type": "application/json"
            })
            const data = await response.json()
            setAllGroups(data)
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    useEffect(() => {
        getGroups()
    }, [])

    if (!store.adminAuth) {
        return <Navigate to="/admin/login" />;
    }

    return (
        <>
            <div className="container">
                <div className="d-flex justify-content-between">
                    <div className="d-flex gap-2 mt-3">
                        <button type="button" className="btn btn-primary" onClick={getGroups}>Get all groups</button>
                        <Link to="/group-create">
                            <button type="button" className="btn btn-primary">Create group</button>
                        </Link>
                    </div>
                    <Link to="/">
                        <button type="button" className="btn btn-outline-dark mt-3">Back</button>
                    </Link>
                </div>
                <div className="row row-cols-1 row-cols-md-4 g-4">
                    {allGroups.length === 0 ?
                        <p className="text-center p-5">No hay grupos registrados</p>
                        :
                        allGroups ?
                            allGroups.map((item) => {
                                return (
                                    <div className="col-sm-6 mb-3 mb-sm-0" key={item.id}>
                                        <div className="card my-3" style={{ "width": "18rem" }}>
                                            <img src={item.media} className="card-img-top" alt="..."></img>
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between">
                                                    <h5 className="card-title">{item.name}</h5>
                                                    <div className="d-flex gap-1">
                                                        <Link to={`/group-edit/${item.id}`}>
                                                            <button type="button" className="btn btn-outline-dark">
                                                                <i className="fa-regular fa-pen-to-square"></i>
                                                            </button>
                                                        </Link>
                                                        <Link to={`/group-delete/${item.id}`}>
                                                            <button type="button" className="btn btn-outline-dark">
                                                                <i className="fa-regular fa-trash-can"></i>
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <p className="card-text">location {item.location}</p>
                                                <p className="card-text">{item.description}</p>
                                                <Link to={`/group/${item.id}/detail`}>
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