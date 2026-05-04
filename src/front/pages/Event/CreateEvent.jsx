import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { CreateEventForm } from "../../components/Event/CreateEventForm";


export const CreateEvent = () => {
    const navigate = useNavigate();
    const { store } = useGlobalReducer();

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [date_event, setDateEvent] = useState("");
    const [capacity, setCapacity] = useState("");
    const [media, setMedia] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const resp = await fetch(`${backendUrl}/api/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                location,
                description,
                date_event,
                capacity: Number(capacity),
                media
            })
        });

        if (resp.ok) {
            navigate("/events");
        } else {
            console.error("Error creando evento");
        }
    };

    if (!store.adminAuth) {
            return <Navigate to="/admin/login" />;
    }

    return (
        <div className="container mt-5">
            <CreateEventForm />
        </div>
    );
};