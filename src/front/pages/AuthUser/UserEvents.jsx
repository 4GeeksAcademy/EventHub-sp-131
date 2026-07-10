import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Map } from "../../components/Map";
import { artisticFilter } from "@cloudinary/url-gen/actions/effect";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import devLog from "../utils/devLogger";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const geoApiKey = import.meta.env.VITE_GEOCODING_API_KEY;

export const UserEvents = () => {
    const { store, dispatch } = useGlobalReducer();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [message, setMessage] = useState("");
    const [categories, setCategories] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [dateFilter, setDateFilter] = useState("");
    const [distanceFilter, setDistanceFiler] = useState(10);
    const [artistFilter, setArtistFilter] = useState("");
    const navigate = useNavigate();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [infoWindowEvent, setInfoWindowEvent] = useState(null);
    devLog.log("userloc ", userLocation);

    const [searchLocation, setSearchLocation] = useState(null);
    const [defZoom, setDefZoom] = useState(15);
    const [mapCenter, setMapCenter] = useState({ lat: 40.4168, lng: -3.7038 });
    devLog.log(mapCenter);

    const [markerPosition, setMarkerPosition] = useState({ lat: 40.4168, lng: -3.7038 });

    const getEvents = () => {
        fetch(`${backendUrl}/api/events`)
            .then((resp) => resp.json())
            .then((data) => setEvents(data))
            .catch(() => setMessage("No se pudieron cargar los eventos"));
    };

    const handleSave = (eventId) => {
        const tokenUser = localStorage.getItem("tokenUser");

        if (!tokenUser) {
            navigate("/user/login");
            return;
        }

        fetch(`${backendUrl}/api/events/${eventId}/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + tokenUser
            }
        })
            .then((resp) => {
                if (!resp.ok) throw new Error();
                setMessage("Evento guardado correctamente");
            })
            .catch(() => setMessage("Este evento ya está guardado o no se pudo guardar"));
    };

    useEffect(() => {
        getEvents();
        getCategories();
    }, []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${geoApiKey}`)
                .then(response => response.json())
                .then(data => {
                    setUserLocation({ "address": data.results[0].formattedAddress, lat: data.results[0].geometry.location.lat, lng: data.results[0].geometry.location.lng });
                    setMapCenter({ "address": data.results[0].formattedAddress, lat: data.results[0].geometry.location.lat, lng: data.results[0].geometry.location.lng });
                    setMarkerPosition({ "address": data.results[0].formattedAddress, lat: data.results[0].geometry.location.lat, lng: data.results[0].geometry.location.lng });
                });
        });
    }, []);

    async function getCategories() {
        try {
            const resp = await fetch(`${backendUrl}/api/categories`, {
                headers: { "Content-Type": "application/json" }
            });
            const data = await resp.json();
            setCategories(data);
        } catch (err) {
            devLog.error("Error cargando categorías:", err);
        }
    }


    function haversineDistanceKM(lat1Deg, lon1Deg, lat2Deg, lon2Deg) {
        function toRad(degree) {
            return degree * Math.PI / 180;
        }

        const lat1 = toRad(lat1Deg);
        const lon1 = toRad(lon1Deg);
        const lat2 = toRad(lat2Deg);
        const lon2 = toRad(lon2Deg);

        const { sin, cos, sqrt, atan2 } = Math;

        const R = 6371; // earth radius in km 
        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;
        const a = sin(dLat / 2) * sin(dLat / 2)
            + cos(lat1) * cos(lat2)
            * sin(dLon / 2) * sin(dLon / 2);
        const c = 2 * atan2(sqrt(a), sqrt(1 - a));
        const d = R * c;
        return d; // distance in km
    }

    useEffect(() => {
        let filtered = [...events];

        const locationToUse = searchLocation || userLocation;

        if (locationToUse) {
            filtered = filtered.map((event) => {
                const distance = haversineDistanceKM(
                    locationToUse.lat,
                    locationToUse.lng,
                    event.latitude,
                    event.longitude
                );
                return { ...event, distance };
            })
                .filter(event => event.distance <= distanceFilter)
                .sort((a, b) => a.distance - b.distance);
        }

        if (categoryFilter) {
            filtered = filtered.filter(event => event.categories.some((cat) => {
                return cat.name === categoryFilter;
            }));
        }

        if (artistFilter) {
            filtered = filtered.filter(event =>
                event.name?.toLowerCase().includes(artistFilter.toLowerCase())
            );
        }

                if (dateFilter) {
            filtered = filtered.filter(event => {
                devLog.log(!event.date_event);
                devLog.log(!dateFilter);

                if (!event.date_event || !dateFilter) return false;
                devLog.log("entra");

                const eventDate = new Date(event.date_event);
                const formattedEventDate = eventDate.toISOString().split('T')[0];
                devLog.log(formattedEventDate);

                return formattedEventDate === dateFilter;
            }
            );
        }
        setFilteredEvents(filtered);
    }, [userLocation, events, distanceFilter, categoryFilter, artistFilter, dateFilter, searchLocation]);

    useEffect(() => {
        setSearchLocation(mapCenter);
    }, [mapCenter]);

    async function geoloc(lat, lng) {
        devLog.log("lat ", lat, " long ", lng);
        try {
            const resp = await fetch(
                `https://geocode.googleapis.com/v4/geocode/location/${lat},${lng}?key=${geoApiKey}`
            );
            if (resp.ok) {
                const data = await resp.json();
                setUserLocation({ "address": data.results[0].formattedAddress, lat: lat, lng: lng });
            }
        } catch (err) {
            devLog.error("Error obteniendo dirección:", err);
        }
    }

    return (
        <DashboardLayout
            role="user"
            title="Mi perfil"
            subtitle="Bienvenida a tu espacio personal en EventHub."
            userName={store.privateUser?.name}
        >
            <div className="container-fluid mt-5 mx-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="fw-bold mb-1 text-white">Eventos disponibles</h1>
                        <p className="text-muted mb-0">
                            Explora eventos, guarda tus favoritos y confirma asistencia.
                        </p>
                    </div>
                </div>

                {message && (
                    <div className="alert alert-info shadow-sm mb-4">
                        {message}
                    </div>
                )}

                {/* Filtros Mejorados */}
                <div className="card bg-dark border-secondary mb-4 p-3">
                    <div className="d-flex flex-wrap gap-3 align-items-end">
                        <div>
                            <label className="form-label text-white small mb-1">Categoría</label>
                            <select
                                className="form-select bg-dark text-white border-secondary"
                                style={{ width: "220px" }}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="">Todas las categorías</option>
                                {categories?.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="form-label text-white small mb-1">Distancia máx.</label>
                            <div className="input-group" style={{ width: "160px" }}>
                                <input
                                    type="number"
                                    className="form-control bg-dark text-white border-secondary"
                                    value={distanceFilter}
                                    onChange={(e) => setDistanceFiler(e.target.value)}
                                />
                                <span className="input-group-text bg-dark text-white border-secondary">km</span>
                            </div>
                        </div>

                        <div>
                            <label className="form-label text-white small mb-1">Artista / Nombre</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white border-secondary"
                                style={{ width: "240px" }}
                                value={artistFilter}
                                onChange={(e) => setArtistFilter(e.target.value)}
                                placeholder="Buscar artista o evento..."
                            />
                        </div>

                        <div>
                            <label className="form-label text-white small mb-1">Fecha</label>
                            <input
                                type="date"
                                className="form-control bg-dark text-white border-secondary"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Lista de Eventos - 3 por fila */}
                    <div className="col-lg-7">
                        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                            {filteredEvents.length === 0 ? (
                                <div className="col-12">
                                    <div className="card bg-dark border-secondary p-5 text-center">
                                        <h4>No hay eventos cercanos disponibles</h4>
                                        <p className="text-muted">Intenta cambiar los filtros</p>
                                    </div>
                                </div>
                            ) : (
                                filteredEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="col"
                                        onMouseEnter={() => setSelectedEvent(event)}
                                        onMouseLeave={() => setSelectedEvent(null)}
                                        onClick={() => setInfoWindowEvent(event)}
                                    >
                                        <div className="card h-100 shadow-sm bg-dark border-secondary overflow-hidden"
                                            style={{
                                                border: event.id === selectedEvent?.id ? "2px solid #ff2f7d" : ""
                                            }}>

                                            {event.media ? (
                                                <img
                                                    src={event.media}
                                                    className="card-img-top"
                                                    style={{ height: "200px", objectFit: "cover" }}
                                                    alt={event.name}
                                                />
                                            ) : (
                                                <div className="bg-secondary d-flex align-items-center justify-content-center"
                                                    style={{ height: "200px" }}>
                                                    <span className="text-muted">Sin imagen</span>
                                                </div>
                                            )}

                                            <div className="card-body d-flex flex-column p-4">
                                                <div className="d-flex justify-content-between">
                                                    <h5 className="card-title fw-bold text-white">{event.name}</h5>
                                                    <div className="d-flex gap-2">
                                                        <i className="fa-regular fa-bookmark" onClick={(e) => { e.stopPropagation(); handleSave(event.id); }} style={{ cursor: "pointer"}}></i>
                                                    </div>
                                                </div>

                                                <p className="text-muted mb-2 small">
                                                    📍 {event.location || "Ubicación no disponible"}
                                                    {event.distance && ` • ${event.distance.toFixed(1)} km`}
                                                </p>

                                                <p className="small text-muted mb-3">
                                                    📅 {event.date_event
                                                        ? new Date(event.date_event).toLocaleString('es-ES')
                                                        : "Fecha no disponible"}
                                                </p>

                                                <p className="card-text flex-grow-1">
                                                    {event.description?.substring(0, 110) || "Sin descripción"}...
                                                </p>

                                                <div className="mt-auto d-grid gap-2">
                                                    <button
                                                        className="btn btn-secondary"
                                                        onClick={(e) => { e.stopPropagation(); navigate(`/events/${event.id}`); }}
                                                    >
                                                        Ver detalle
                                                    </button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {userLocation && (
                        <div className="col-lg-5 pe-4">  
                            <div className="sticky-top" style={{ top: "110px" }}>
                                <Map
                                    location={userLocation.address}
                                    mapCenter={mapCenter}
                                    setMapCenter={setMapCenter}
                                    defZoom={defZoom}
                                    setDefZoom={setDefZoom}
                                    markerPosition={markerPosition}
                                    setMarkerPosition={setMarkerPosition}
                                    onLocationChange={geoloc}
                                    events={filteredEvents}
                                    selectedEvent={selectedEvent}
                                    setSelectedEvent={setSelectedEvent}
                                    height="720px"
                                    infoWindowEvent={infoWindowEvent}
                                    setInfoWindowEvent={setInfoWindowEvent}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};