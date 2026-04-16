import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Card } from "../components/Card.jsx";
import { Link } from "react-router-dom";

export const Promotor = () => {
    const { store, dispatch } = useGlobalReducer()
    const urlAPI = import.meta.env.VITE_BACKEND_URL
    const [allPromotors, setAllPromotors] = useState([])
    console.log(allPromotors);

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
                {allPromotors.length === 0 ?
                    <p className="text-center p-5">No hay Promotores registrados</p>
                    :
                    <Card data={allPromotors} />
                }
            </div>
        </>
    );
}; 