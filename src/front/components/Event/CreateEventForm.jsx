import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { Resize } from "@cloudinary/url-gen/actions";
import CloudinaryUploadWidget from "../CloudinaryUploadWidget";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const CreateEventForm = (props) => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [date_event, setDateEvent] = useState("");
    const [capacity, setCapacity] = useState("");
    const [publicId, setPublicId] = useState('');

    const cloudName = 'dxv6ytl25';
    const uploadPreset = 'ml_default';

    const cld = new Cloudinary({
        cloud: {
            cloudName,
            uploadPreset
        }
    })

    const uwConfig = {
        cloudName,
        uploadPreset
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const resp = await fetch(`${backendUrl}/api/${props.type}/${props.id}/event`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                name,
                location,
                description,
                date_event,
                capacity: Number(capacity),
                publicId
            })
        });

        if (resp.ok) {
            navigate("/events");
        } else {
            console.error("Error creando evento");
        }
    };

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-md-6">

                    <h2 className="mb-4 text-center">Crear Evento</h2>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Ubicación</label>
                            <input
                                type="text"
                                className="form-control"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Descripción</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Fecha</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                value={date_event}
                                onChange={(e) => setDateEvent(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Capacidad</label>
                            <input
                                type="number"
                                className="form-control"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label me-3">Imagen</label>
                            <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} />
                        </div>

                        {/* Preview */}
                        {publicId && (
                            <div className="p-4 mb-3 text-center">
                                <AdvancedImage cldImg={cld.image(publicId).resize(Resize.scale().width(450).height(250))} />
                            </div>
                        )}

                        <div className="d-flex justify-content-between">
                            <button type="submit" className="btn btn-success">
                                Crear
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};