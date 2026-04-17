import React, { useEffect, useState } from "react"
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";

export const Promotor = () => {
    const { store, dispatch } = useGlobalReducer()
    const urlAPI = import.meta.env.VITE_BACKEND_URL
    const [allPromotors, setAllPromotors] = useState([])


    async function getPromotors() {
        try {
            const response = await fetch(`${urlAPI}/api/promotor`, {
                "Content-Type": "application/json"
            })
            const data = await response.json()
            setAllPromotors(data)
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    useEffect(() => {
        getPromotors()
    }, [])

    return (
        <>
            <div className="container">
                <div className="d-flex justify-content-between">
                    <div className="d-flex gap-2 mt-3">
                        <button type="button" className="btn btn-primary" onClick={getPromotors}>Get all promotors</button>
                        <Link to="/promotor-create">
                            <button type="button" className="btn btn-primary">Create promotor</button>
                        </Link>
                    </div>
                    <Link to="/">
                        <button type="button" className="btn btn-outline-dark mt-3">Back</button>
                    </Link>
                </div>
                <div className="row row-cols-1 row-cols-md-4 g-4">
                    {allPromotors.length === 0 ?
                        <p className="text-center p-5">No hay Promotores registrados</p>
                        :
                        allPromotors ?
                            allPromotors.map((item) => {
                                return (
                                    <div className="col-sm-6 mb-3 mb-sm-0" key={item.id}>
                                        <div className="card my-3" style={{ "width": "18rem" }}>
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between">
                                                    <h5 className="card-title">{item.name}</h5>
                                                    <div className="d-flex gap-1">
                                                        <Link to={`/promotor-edit/${item.id}`}>
                                                            <button type="button" className="btn btn-outline-dark">
                                                                <i className="fa-regular fa-pen-to-square"></i>
                                                            </button>
                                                        </Link>
                                                        <Link to={`/promotor-delete/${item.id}`}>
                                                            <button type="button" className="btn btn-outline-dark">
                                                                <i className="fa-regular fa-trash-can"></i>
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <p className="card-text">email: {item.email}</p>
                                                <p className="card-text">location {item.location}</p>
                                                <p className="card-text">Tel: {item.phone}</p>
                                                <p className="card-text">{item.webPage}</p>
                                                <p className="card-text">{item.verifiedOrg === true ? "Active" : "Inactive"}</p>
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