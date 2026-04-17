import React, { useState } from "react"
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";

export const CreatePromotor = () => {

    const urlAPI = import.meta.env.VITE_BACKEND_URL
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [location, setLocation] = useState("")
    const [phone, setPhone] = useState()
    const [webPage, setWebPage] = useState("")

    const navigate = useNavigate()


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

    async function createPromotor() {
        try {
            const response = await fetch(`${urlAPI}/api/promotor`, {
                method: "POST",
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
        <div style={{ "width": "60%", "margin": "auto", "margin-top": "4rem" }}>
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
            <button type="button" className="btn btn-primary" onClick={createPromotor}>Create</button>
        </div>
    );
}