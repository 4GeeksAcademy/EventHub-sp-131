import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { Resize } from "@cloudinary/url-gen/actions";
import CloudinaryUploadWidget from "../CloudinaryUploadWidget";
import { MapContent } from "../MapContent";
import { APIProvider } from '@vis.gl/react-google-maps';
import { setLocationType } from "react-geocode";


const backendUrl = import.meta.env.VITE_BACKEND_URL;
const geoApiKey = import.meta.env.VITE_GEOCODING_API_KEY;

export const CreateEventForm = (props) => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    console.log("esto es location ",location);
    
    const [description, setDescription] = useState("");
    const [date_event, setDateEvent] = useState("");
    const [capacity, setCapacity] = useState("");
    const [publicId, setPublicId] = useState('');
    const [college, setCollege] = useState(undefined);
    console.log(college);

    const [markerPosition, setMarkerPosition] = useState(null);
    console.log(markerPosition);

    const cloudName = 'dxv6ytl25';
    const uploadPreset = 'ml_default';

    useEffect(() => {
        if (!markerPosition) {
            setLocation(college?.Di?.formattedAddress)
        }
        else {
            async function geoloc() {
                const resp = await fetch(`https://geocode.googleapis.com/v4/geocode/location/${markerPosition.lat},${markerPosition.lng}?key=${geoApiKey}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (resp.ok) {
                    const data = await resp.json()
                    console.log(data);
                    setLocation(data.results[0].formattedAddress)
                } else {
                    console.error("Error creando evento");
                }
            }
            geoloc()
        }
    }, [college, markerPosition])


    const cld = useMemo(() => new Cloudinary({
        cloud: {
            cloudName,
            uploadPreset
        }
    }), []);

    const uwConfig = useMemo(() => ({
        cloudName,
        uploadPreset
    }), []);



    const handleSubmit = async (e) => {
        e.preventDefault();

        const resp = await fetch(`${backendUrl}/api/${props.type}/${props.id}/events`, {
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
        } else {
            console.error("Error creando evento");
        }
    };

    /*     async function geoloc(lat, long) {
            const resp = await fetch(`https://geocode.googleapis.com/v4/geocode/location/${lat},${long}?key=${geoApiKey}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (resp.ok) {
                const data = resp.json()
                console.log(data);
            } else {
                console.error("Error creando evento");
            }
        } */

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
                            <APIProvider apiKey={geoApiKey} version='beta' libraries={['marker']}>
                                <MapContent
                                    college={college}
                                    setCollege={setCollege}
                                    markerPosition={markerPosition}
                                    setMarkerPosition={setMarkerPosition}
                                />
                            </APIProvider>
                            {/* <button type="submit" className="btn btn-success" onClick={() => geoloc(latitud, longitud)}>Search</button> */}
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
            </div >
        </div >
    );
};