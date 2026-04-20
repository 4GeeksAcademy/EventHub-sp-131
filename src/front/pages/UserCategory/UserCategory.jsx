import React, { useEffect, useState } from "react"
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";

export const UserCategroy = () => {
    const { store, dispatch } = useGlobalReducer()
    const urlAPI = import.meta.env.VITE_BACKEND_URL
    const [allUserCategroys, setAllUserCategroys] = useState([])

    async function getUserCategroys() {
        try {
            const response = await fetch(`${urlAPI}/api/user_category`, {
                "Content-Type": "application/json"
            })
            const data = await response.json()
            setAllUserCategroys(data)
            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    useEffect(() => {
        getUserCategroys()
    }, [])

    return (
        <>
            <div className="container">
                <div className="d-flex justify-content-between">
                    <div className="d-flex gap-2 mt-3">
                        <button type="button" className="btn btn-primary" onClick={getUserCategroys}>Get all saved events</button>
                        <Link to="/user_category-create">
                            <button type="button" className="btn btn-primary">Create saved event</button>
                        </Link>
                    </div>
                    <Link to="/">
                        <button type="button" className="btn btn-outline-dark mt-3">Back</button>
                    </Link>
                </div>
                <div className="row row-cols-1 row-cols-md-4 g-4 gap-3">
                    {allUserCategroys.length === 0 ?
                        <p className="text-center p-5">No hay grupos registrados</p>
                        :
                        allUserCategroys ?
                            allUserCategroys.map((item) => {
                                return (
                                    <div className="col-sm-6 mb-3 mb-sm-0" key={item.id}>
                                        <div className="card my-3" style={{ "width": "18rem" }}>
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between">
                                                    <h6 className="card-title">UserCategroy number {item.id}</h6>
                                                    <div className="d-flex gap-1">
                                                        <Link to={`/user_category-delete/${item.id}`}>
                                                            <button type="button" className="btn btn-outline-dark">
                                                                <i className="fa-regular fa-trash-can"></i>
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <Link to={`/user_category/${item.id}/detail`}>
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