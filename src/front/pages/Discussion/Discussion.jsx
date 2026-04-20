import React, { useEffect, useState } from "react"
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";

export const Discussion = () => {
    const { store, dispatch } = useGlobalReducer()
    const urlAPI = import.meta.env.VITE_BACKEND_URL
    const [allDiscussions, setAllDiscussions] = useState([])

    async function getDiscussions() {
        try {
            const response = await fetch(`${urlAPI}/api/discussion`, {
                "Content-Type": "application/json"
            })
            const data = await response.json()
            setAllDiscussions(data)
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    useEffect(() => {
        getDiscussions()
    }, [])

    return (
        <>
            <div className="container">
                <div className="d-flex justify-content-between">
                    <div className="d-flex gap-2 mt-3">
                        <button type="button" className="btn btn-primary" onClick={getDiscussions}>Get all discussions</button>
                        <Link to="/discussion-create">
                            <button type="button" className="btn btn-primary">Create discussion</button>
                        </Link>
                    </div>
                    <Link to="/">
                        <button type="button" className="btn btn-outline-dark mt-3">Back</button>
                    </Link>
                </div>
                <div className="row row-cols-1 row-cols-md-4 g-4 gap-3">
                    {allDiscussions.length === 0 ?
                        <p className="text-center p-5">No hay grupos registrados</p>
                        :
                        allDiscussions ?
                            allDiscussions.map((item) => {
                                return (
                                    <div className="col-sm-6 mb-3 mb-sm-0" key={item.id}>
                                        <div className="card my-3" style={{ "width": "18rem" }}>
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between">
                                                    <h6 className="card-title">Discussion number {item.id}</h6>
                                                    <div className="d-flex gap-1">
                                                        <Link to={`/discussion-delete/${item.id}`}>
                                                            <button type="button" className="btn btn-outline-dark">
                                                                <i className="fa-regular fa-trash-can"></i>
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <Link to={`/discussion/${item.id}/detail`}>
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