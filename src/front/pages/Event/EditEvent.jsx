import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import devLog from "../../utils/devLogger";
import { useNavigate, useParams, useLocation, Navigate } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { Resize } from "@cloudinary/url-gen/actions";
import CloudinaryUploadWidget from "../../components/CloudinaryUploadWidget";
import { Map } from "../../components/Map";
import { useArtistSearch } from "../../hooks/useArtistSearch";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const geoApiKey = import.meta.env.VITE_GEOCODING_API_KEY;

const cloudName = 'dxv6ytl25';
const uploadPreset = 'ml_default';

export const EditEvent = () => {
    const { store, dispatch } = useGlobalReducer();
    const fromData = useLocation()?.state?.from?.split("/");
    const routeProps = {
        type: fromData ? fromData[1] : undefined,
        id: fromData ? fromData[2] : undefined
    };

    const navigate = useNavigate();
    const { id } = useParams();


    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [description, setDescription] = useState("");
    const [date_event, setDateEvent] = useState("");
    const [capacity, setCapacity] = useState("");
    const [publicId, setPublicId] = useState("");
    const [media, setMedia] = useState("");
    const [mapCenter, setMapCenter] = useState({ lat: 39.9514572, lng: -4.3435391 });
    const [markerPosition, setMarkerPosition] = useState(null);
    const [defZoom, setDefZoom] = useState(3);
    const [eventCat, setEventCat] = useState(null);
    const [categories, setCategories] = useState(null);
    const [imgFromApi, setImgFromApi] = useState("");
    const authApiA = import.meta.env.VITE_BACKEND_URL;
    devLog.log(latitude);
    devLog.log(longitude);

    const {
        artistQuery,
        setArtistQuery,
        artistSuggestions,
        isDropdownOpen,
        containerRef,
        selectArtist,
        selectedArtist
    } = useArtistSearch();

    const urlApi = routeProps.type === undefined
        ? "events"
        : `${routeProps.type}/${routeProps.id}/events`;

    const cld = useMemo(() => new Cloudinary({ cloud: { cloudName, uploadPreset } }), []);
    const uwConfig = useMemo(() => ({ cloudName, uploadPreset }), []);

    useEffect(() => {
        if (localStorage.getItem("promotorAuth") == true) {
            setIsLogged(localStorage.getItem("promotorAuth"));
        }
        authUser(localStorage.getItem("token"));
    }, []);

    async function authUser(token) {
        try {
            const response = await fetch(`${authApiA}api/promotor/private`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                navigate('/promotor/login');
            }
            dispatch({ type: "ADD_LOGIN_STATUS_PROMOTOR", payload: response.ok });
            localStorage.setItem("promotorAuth", response.ok);
            const data = await response.json();
        }

        catch (error) {
            devLog.error("Error on fetch: ", error.message);
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
        setDateEvent(item?.dates.start.dateTime.slice(0, 16));
        setLatitude(parseFloat(item?._embedded.venues[0].location.latitude));
        setLongitude(parseFloat(item?._embedded.venues[0].location.longitude));
        setImgFromApi(item?.images[0].url);
        setDescription(item?.description);
        setMapCenter({ lat: parseFloat(item?._embedded.venues[0].location.latitude), lng: parseFloat(item?._embedded.venues[0].location.longitude) });
        setMarkerPosition({ lat: parseFloat(item?._embedded.venues[0].location.latitude), lng: parseFloat(item?._embedded.venues[0].location.longitude) });
        setDefZoom(13);
    };

    useEffect(() => {
        getEvent();
        getEventCategoryById();
    }, []);

    useEffect(() => {
        if (eventCat) getCategories();
    }, [eventCat]);

    async function getEvent() {
        try {
            const resp = await fetch(`${backendUrl}/api/${urlApi}/${id}`);
            const data = await resp.json();
            const e = routeProps.type !== undefined ? data.event : data;
            setName(e.name || "");
            setLocation(e.location || "");
            setDescription(e.description || "");
            setCapacity(e.capacity || "");
            setMedia(e.media || "");
            if (e.latitude) setLatitude(e.latitude);
            if (e.longitude) setLongitude(e.longitude);

            if (e.date_event) setDateEvent(e.date_event.slice(0, 16));
            if (e.location) getCurrentEventLoc(e.location);
        } catch (err) {
            devLog.error("Error cargando evento:", err);
        }
    }

    async function geoloc(lat, lng) {
        setLatitude(lat);
        setLongitude(lng);
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

    async function getCurrentEventLoc(address) {
        const encoded = encodeURIComponent(address).replace(/%20/g, '+');
        try {
            const resp = await fetch(
                `https://geocode.googleapis.com/v4/geocode/address/${encoded}?key=${geoApiKey}`
            );
            if (!resp.ok) throw new Error("Error localizando el evento");
            const data = await resp.json();
            const newCenter = {
                lat: data.results[0].location.latitude,
                lng: data.results[0].location.longitude
            };
            setMapCenter(newCenter);
            setMarkerPosition(newCenter);
            setDefZoom(13);
        } catch (err) {
            devLog.error("Error al obtener ubicación del evento:", err);
        }
    }

    async function getEventCategoryById() {
        try {
            const resp = await fetch(`${backendUrl}/api/${urlApi}/${id}/event_category`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await resp.json();
            setEventCat(data.eventCategories);
        } catch (err) {
            devLog.error("Error cargando categorías del evento:", err);
        }
    }

    async function getCategories() {
        try {
            const resp = await fetch(`${backendUrl}/api/categories`, {
                headers: { "Content-Type": "application/json" }
            });
            const data = await resp.json();
            const filtered = data.filter(cat => !eventCat.some(item => item.name === cat.name));
            setCategories(filtered);
        } catch (err) {
            devLog.error("Error cargando categorías:", err);
        }
    }

    async function addNewCat(e) {
        const addedCategory = categories.find(cat => cat.name === e.target.value);
        if (!addedCategory) return;
        try {
            await fetch(`${backendUrl}/api/${urlApi}/${id}/event_category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ event_id: parseInt(id), category_id: addedCategory.id })
            });
        } catch (err) {
            devLog.error("Error añadiendo categoría:", err);
        }
        getEventCategoryById();
        getCategories();
    }

    async function removeCategoryById(e) {
        try {
            await fetch(`${backendUrl}/api/${urlApi}/${id}/event_category/${e.target.value}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
        } catch (err) {
            devLog.error("Error eliminando categoría:", err);
        }
        getEventCategoryById();
        getCategories();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        devLog.log(latitude);
        devLog.log(longitude);

        const finalMedia = publicId || imgFromApi || media;;
        try {
            const resp = await fetch(`${backendUrl}/api/${urlApi}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ name, location, description, date_event, capacity: Number(capacity), media: finalMedia, latitude: parseFloat(latitude), longitude: parseFloat(longitude) })
            });
            if (!resp.ok) throw new Error("Error actualizando evento");
        } catch (err) {
            devLog.error(err);
        }

        routeProps.type === undefined
            ? navigate("/events")
            : navigate(`/${routeProps.type}/private`);
    };

    /*     if (!store.adminAuth) {
            return <Navigate to="/admin/login" />;
        } */

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="mb-4 text-center">Editar Evento</h2>

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
                        {/* Nombre */}
                        <div className="mb-3" ref={containerRef}>
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
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

                        {/* Categorías */}
                        <div>
                            <select className="form-select" onChange={addNewCat} defaultValue="">
                                <option value="" disabled>Añadir categoría</option>
                                {categories?.map(cat => (
                                    <option key={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="d-flex py-3 gap-2 row row-cols-auto">
                            {eventCat?.map(categoryRel => (
                                <div key={categoryRel.id}>
                                    <p className="p-1" style={{
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                        backgroundColor: "#ffc107",
                                        border: "1px solid",
                                        borderRadius: "2rem"
                                    }}>
                                        {categoryRel.category_name}
                                        <button
                                            type="button"
                                            className="btn rounded-end-circle p-1 ps-2"
                                            onClick={removeCategoryById}
                                            value={categoryRel.id}
                                        >
                                            X
                                        </button>
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Mapa */}
                        <div className="mb-3">
                            <label className="form-label">Ubicación</label>
                            <Map
                                location={location}
                                mapCenter={mapCenter}
                                setMapCenter={setMapCenter}
                                markerPosition={markerPosition}
                                setMarkerPosition={setMarkerPosition}
                                onLocationChange={geoloc}
                                setLatitude={setLatitude}
                                setLongitude={setLongitude}
                                defZoom={defZoom}
                                setDefZoom={setDefZoom}
                                height={"400px"}
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
                            <button type="submit" className="btn btn-success">
                                Editar
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

EditEvent.propTypes = {
    type: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};