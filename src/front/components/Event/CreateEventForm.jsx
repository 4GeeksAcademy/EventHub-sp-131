import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import devLog from "../../utils/devLogger";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { Resize } from "@cloudinary/url-gen/actions";
import CloudinaryUploadWidget from "../CloudinaryUploadWidget";
import { Map } from "../Map";
import { useArtistSearch } from "../../hooks/useArtistSearch";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const geoApiKey = import.meta.env.VITE_GEOCODING_API_KEY;

const cloudName = 'dxv6ytl25';
const uploadPreset = 'ml_default';

export const CreateEventForm = (props) => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [lat, setLatitude] = useState("");
    const [lng, setLongitude]= useState("");
    const [description, setDescription] = useState("");
    const [date_event, setDateEvent] = useState("");
    const [capacity, setCapacity] = useState("");
    const [publicId, setPublicId] = useState("");
    const [imgFromApi, setImgFromApi] = useState("");
    const [mapCenter, setMapCenter] = useState({ lat: 39.9514572, lng: -4.3435391 });
    const [defZoom, setDefZoom] = useState(3);
    const [markerPosition, setMarkerPosition] = useState(null);

    const {
        artistQuery,
        setArtistQuery,
        artistSuggestions,
        isDropdownOpen,
        containerRef,
        selectArtist,
        selectedArtist
    } = useArtistSearch();

    const urlApi = props.type === undefined
        ? "events"
        : `${props.type}/${props.id}/events`;

    const cld = useMemo(() => new Cloudinary({ cloud: { cloudName, uploadPreset } }), []);
    const uwConfig = useMemo(() => ({ cloudName, uploadPreset }), []);

    async function geoloc(lat, lng) {
        devLog.log("lat ",lat," long ",lng);
        try {
            const resp = await fetch(
                `https://geocode.googleapis.com/v4/geocode/location/${lat},${lng}?key=${geoApiKey}`
            );
            if (resp.ok) {
                const data = await resp.json();
                setLocation(data.results[0].formattedAddress);
            }
        } catch (err) {
            devLog.error("Error obteniendo dirección:", err);
        }
    }

    useEffect(() => {
        if (!selectedArtist) {
            setName("");
            setLocation("");
            setLatitude("");
            setLongitude("");
            setDateEvent("");
            setImgFromApi("");
            setDescription("");
            setMapCenter({ lat: 39.9514572, lng: -4.3435391 });
            setMarkerPosition(null);
            setDefZoom(3);
        }
    }, [selectedArtist]);

    

    const handleInputChange = (e) => {
        const value = e.target.value;
        setArtistQuery(value);
        setName(value);
    };

    const handleSuggestionSelected = (item) => {
        selectArtist(item);
        setName(item?.name);
        setLocation(`${item?._embedded.venues[0].name} ${item?._embedded.venues[0].address.line1} ${item?._embedded.venues[0].city.name} ${item?._embedded.venues[0].country.name}`);
        setLatitude(parseFloat(item?._embedded.venues[0].location.latitude) ?? mapCenter.lat);
        setLongitude(parseFloat(item?._embedded.venues[0].location.longitude)?? mapCenter.lng);
        setDateEvent(item?.dates.start.dateTime.slice(0, 16));
        setImgFromApi(item?.images[0].url);
        setDescription(item?.description);
        setMapCenter({ lat: parseFloat(item?._embedded.venues[0].location.latitude), lng: parseFloat(item?._embedded.venues[0].location.longitude) });
        setMarkerPosition({ lat: parseFloat(item?._embedded.venues[0].location.latitude), lng: parseFloat(item?._embedded.venues[0].location.longitude) });
        setDefZoom(13);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const finalImg = publicId ? publicId : imgFromApi;
        const resp = await fetch(`${backendUrl}/api/${urlApi}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                name,
                location,
                lat,
                lng,
                description,
                date_event,
                capacity: Number(capacity),
                "media": finalImg
            })
        });

        if (resp.ok) {
            setName("");
            setLocation("");
            setDateEvent("");
            setImgFromApi("");
            setDescription("");
            setMapCenter({ lat: 39.9514572, lng: -4.3435391 });
            setMarkerPosition(null);
            setDefZoom(3);
            props.onSuccess?.();
        } else {
            devLog.error("Error creando evento");
        }
    };

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="mb-4 text-center">Crear Evento</h2>

                    <form onSubmit={handleSubmit}>

                        {(publicId || imgFromApi) &&
                            (
                                <div className="p-4 mb-3 text-center">
                                    {publicId ?
                                        <AdvancedImage
                                            cldImg={cld.image(publicId).resize(Resize.scale().width(450).height(250))}
                                        />
                                        :
                                        <img src={imgFromApi} style={{ width: "450px", height: "250px" }} />
                                    }
                                </div>
                            )}
                        {/* Imagen */}
                        <div className="mb-3 d-flex justify-content-center">
                            <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} />
                        </div>
                        {/* Nombre con autocomplete de artistas */}
                        <div className="mb-3" ref={containerRef}>
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                value={artistQuery}
                                onChange={handleInputChange}
                                required
                            />
                            {isDropdownOpen && artistSuggestions.length > 0 && (
                                <div className="border rounded-bottom-1">
                                    <ul className="list-group">
                                        {artistSuggestions.map((suggestion) => (
                                            <li
                                                key={suggestion.id || suggestion.name}
                                                onClick={() => handleSuggestionSelected(suggestion)}
                                                className="list-group-item list-group-item-action p-2"
                                                style={{ cursor: "pointer" }}
                                            >
                                                {suggestion.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Mapa */}
                        <div className="mb-3">
                            <label className="form-label">Ubicación</label>
                            <Map
                                location={location}
                                mapCenter={mapCenter}
                                setLatitude={setLatitude}
                                setLongitude={setLongitude}
                                defZoom={defZoom}
                                setDefZoom={setDefZoom}
                                setMapCenter={setMapCenter}
                                markerPosition={markerPosition}
                                setMarkerPosition={setMarkerPosition}
                                onLocationChange={geoloc}
                                height={'400px'}
                            />
                        </div>

                        {/* Descripción */}
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

                        {/* Fecha */}
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

                        {/* Capacidad */}
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




                        <div className="d-flex justify-content-between">
                            <button type="submit" className="btn btn-primary">
                                Crear
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

CreateEventForm.propTypes = {
    type: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onSuccess: PropTypes.func
};