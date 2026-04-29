import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { Resize } from "@cloudinary/url-gen/actions";
import CloudinaryUploadWidget from "../CloudinaryUploadWidget";
import { AdvancedMarker, APIProvider, Map, } from '@vis.gl/react-google-maps';



const backendUrl = import.meta.env.VITE_BACKEND_URL;
const geoApiKey = import.meta.env.VITE_GEOCODING_API_KEY;

export const CreateEventForm = (props) => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [date_event, setDateEvent] = useState("");
    const [capacity, setCapacity] = useState("");
    const [publicId, setPublicId] = useState('');
    const [mapCenter, setMapCenter] = useState({ lat: 39.9514572, lng: -4.3435391 });
    const [isProgrammaticMove, setIsProgrammaticMove] = useState(false);
    const autocompleteRef = useRef(null);

    const cloudName = 'dxv6ytl25';
    const uploadPreset = 'ml_default';

    useEffect(() => {
        const autocomplete = autocompleteRef.current;
        if (!autocomplete) return;

        const handlePlaceSelect = async (event) => {
            let place = null

            if (event.placePrediction) {
                place = event.placePrediction.toPlace();
            } else if (event.place) {
                place = event.place

            }
            if (!place) return;

            try {
                await place.fetchFields({ fields: ["location", "formattedAddress", "displayName", "viewport"] });;
                if (place.location) {
                    const newCenter = {
                        lat: place.location.lat(),
                        lng: place.location.lng()
                    };
                    setIsProgrammaticMove(newCenter);
                    setMapCenter(newCenter)                    
                    geoloc(newCenter.lat, newCenter.lng)

                }
            } catch (error) {
                console.error("Error al obtener datos del place:", error);
            }
        }
        autocomplete.addEventListener("gmp-select", handlePlaceSelect);
        return () => {
            autocomplete.removeEventListener("gmp-select", handlePlaceSelect);
        };
    }, [])


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

    async function geoloc(lat, long) {
        const resp = await fetch(`https://geocode.googleapis.com/v4/geocode/location/${lat},${long}?key=${geoApiKey}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (resp.ok) {
            const data = await resp.json()
            setLocation(data.results[0].formattedAddress)
        } else {
            console.error("Error creando evento");
        }
    }

    const dragMarkerOnMap = (e) => {
        const newCenter = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        };
        setIsProgrammaticMove(newCenter);
        setMapCenter(newCenter);
        geoloc(newCenter.lat, newCenter.lng)
    }

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
                            <p>{location}</p>
                            <APIProvider apiKey={geoApiKey} version='beta' libraries={['marker', 'places']}>
                                <div style={{ marginBottom: "10px" }}>
                                    <gmp-place-autocomplete
                                        ref={autocompleteRef}
                                        placeholder="Busca una ubicación"
                                        style={{
                                            width: "100%",
                                            height: "40px",
                                            padding: "8px",
                                            fontSize: "16px"
                                        }}
                                    />
                                </div>
                                <Map
                                    style={{ width: "100%", height: "400px" }}
                                    defaultZoom={3}
                                    id="my-map"
                                    mapId="8c732c82e4ec29d9"
                                    center={mapCenter}
                                    onCameraChanged={(ev) => {
                                        setMapCenter(ev.detail.center)
                                    }
                                    }>
                                    <AdvancedMarker position={isProgrammaticMove ? isProgrammaticMove : null} draggable={true} onDragEnd={(e) => dragMarkerOnMap(e)}></AdvancedMarker>
                                </Map>

                            </APIProvider>
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