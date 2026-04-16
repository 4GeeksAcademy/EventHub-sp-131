import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const EditPromotor = () => {

    const urlAPI = import.meta.env.VITE_BACKEND_URL
    const { store, dispatch } = useGlobalReducer()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [location, setLocation] = useState("")
    const [phone, setPhone] = useState()
    const [webPage, setWebPage] = useState("")

    const { theId } = useParams()
    console.log(theId);


    console.log("La Store ", store);


    const navigate = useNavigate()

    async function getPromotor(id) {
        try {
            const response = await fetch(`${urlAPI}/api/promotor/${id}`, {
                "Content-Type": "application/json"
            })
            const data = await response.json()
            setName(data.name)
            setEmail(data.email)
            setPassword(data.password)
            setLocation(data.location)
            setPhone(data.phone)
            setWebPage(data.webPage)

            return response
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }

    const handleInput = e => {
        e.preventDefault();
        switch (e.target.id) {
            case 'name':
                setName(e.target.value)
                break;
            case 'email':
                setEmail(e.target.value)
                break;
            case 'phone':
                setPhone(e.target.value)
                break;
            case 'location':
                setLocation(e.target.value)
                break;
            case 'password':
                setPassword(e.target.value)
                break;
            case 'webPage':
                setWebPage(e.target.value)
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        getPromotor(theId)
    }, [])

    async function editPromotor(id) {
        try {
            const response = await fetch(`${urlAPI}/api/promotor/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "name": name,
                    "email": email,
                    "password": password,
                    "phone": phone,
                    "location": location,
                    "web_page": webPage
                })
            })
            if (!response.ok) {
                throw new Error("Error on post fetch, status: ", response.status)
            }
            navigate("/promotor")
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }
    return (
        <div style={{ "width": "60%", "margin": "auto", "marginTop": "4rem" }}>
            <h1 className="text-center">Edit the promotor { }</h1>
            <div className="input-group mb-3">
                <input onChange={handleInput} type="text" className="form-control" placeholder="Username" id="name" aria-label="Username" aria-describedby="name" value={name} />
            </div>
            <div className="input-group mb-3">
                <input onChange={handleInput} type="text" className="form-control" placeholder="Email" id="email" aria-label="Email" aria-describedby="email" value={email} />
                <span className="input-group-text" id="basic-addon2">@example.com</span>
            </div>
            <div className="input-group mb-3">
                <input onChange={handleInput} type="password" className="form-control" placeholder="Password" id="password" aria-label="Password" aria-describedby="password" value={password} />
            </div>
            <div className="input-group mb-3">
                <input onChange={handleInput} type="text" className="form-control" placeholder="Location" id="location" aria-label="Location" aria-describedby="location" value={location} />
            </div>
            <div className="input-group mb-3">
                <input onChange={handleInput} type="number" className="form-control" placeholder="Phone" id="phone" aria-label="Phone" aria-describedby="phone" value={phone} />
            </div>
            <div className="input-group mb-3">
                <input onChange={handleInput} type="text" className="form-control" placeholder="Web page" id="webPage" aria-label="Web page" aria-describedby="webPage" value={webPage} />
            </div>
            <button type="button" className="btn btn-primary" onClick={() => editPromotor(theId)}>Edit</button>
        </div>
    );
}