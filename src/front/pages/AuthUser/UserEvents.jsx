import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Map } from "../../components/Map";
import { artisticFilter } from "@cloudinary/url-gen/actions/effect";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const geoApiKey = import.meta.env.VITE_GEOCODING_API_KEY

export const UserEvents = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([])
    const [message, setMessage] = useState("");
    const [categories, setCategories] = useState(null)
    const [categoryFilter, setCategoryFilter] = useState(null)
    const [dateFilter, setDateFilter] = useState("")
    const [distanceFilter, setDistanceFiler] = useState(100)
    const [artistFilter, setArtistFilter] = useState("")
    const navigate = useNavigate();
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [userLocation, setUserLocation] = useState(null);
    const [infoWindowEvent, setInfoWindowEvent] = useState(null);
    console.log("userloc ",userLocation);
    
    const [searchLocation, setSearchLocation] = useState(null);
    const [defZoom, setDefZoom] = useState(12)
    const [mapCenter, setMapCenter] = useState({ lat: 40.4168, lng: -3.7038 });
    console.log(mapCenter);
    
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

    const handleAssist = (eventId) => {
        const tokenUser = localStorage.getItem("tokenUser");

        if (!tokenUser) {
            navigate("/user/login");
            return;
        }

        fetch(`${backendUrl}/api/events/${eventId}/assist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + tokenUser
            }
        })
            .then((resp) => {
                if (!resp.ok) throw new Error();
                setMessage("Asistencia confirmada correctamente");
            })
            .catch(() => setMessage("Ya confirmaste asistencia o no se pudo procesar"));
    };

    useEffect(() => {
        getEvents();
        getCategories()
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
            console.error("Error cargando categorías:", err);
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
        let filtered = [...events]

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
                .sort((a, b) => a.distance - b.distance)
        }

        if (categoryFilter) {
            filtered = filtered.filter(event => event.categories.some((cat) => {
                return cat.name === categoryFilter
            }))
        }

        if (artistFilter) {
            filtered = filtered.filter(event =>
                event.name?.toLowerCase().includes(artistFilter.toLowerCase())
            );
        }

        if (dateFilter) {
            filtered = filtered.filter(event => {
                console.log(!event.date_event);
                console.log(!dateFilter);

                if (!event.date_event || !dateFilter) return false
                console.log("entra");

                const eventDate = new Date(event.date_event)
                const formattedEventDate = eventDate.toISOString().split('T')[0]
                console.log(formattedEventDate);

                return formattedEventDate === dateFilter
            }
            )
        }
        setFilteredEvents(filtered)
    }, [userLocation, events, distanceFilter, categoryFilter, artistFilter, dateFilter, searchLocation])

    useEffect(() => {
        setSearchLocation(mapCenter)
    }, [mapCenter])

    async function geoloc(lat, lng) {
        console.log("lat ", lat, " long ", lng);
        try {
            const resp = await fetch(
                `https://geocode.googleapis.com/v4/geocode/location/${lat},${lng}?key=${geoApiKey}`
            );
            if (resp.ok) {
                const data = await resp.json();
                setUserLocation({ "address": data.results[0].formattedAddress, lat: lat, lng: lng });
            }
        } catch (err) {
            console.error("Error obteniendo dirección:", err);
        }
    }

    return (
        <>
            <div className="container-flex mt-5 mx-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="fw-bold mb-1">Eventos disponibles</h1>
                        <p className="text-muted mb-0">
                            Explora eventos, guarda tus favoritos y confirma asistencia.
                        </p>
                    </div>

                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate("/user/private")}
                    >
                        Volver al perfil
                    </button>
                </div>

                {message && (
                    <div className="alert alert-info shadow-sm">
                        {message}
                    </div>
                )}
                <div className="row g-4">
                    <div className="col">
                        <div className="d-flex row mb-2">
                            <div className="w-auto">
                                <select className="form-select" defaultValue="" onChange={(e) => setCategoryFilter(e.target.value)}>
                                    <option value="" disabled defaultValue>Seleccionar categoría</option>
                                    {categories?.map(cat => (
                                        <option key={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-auto">
                                <label className="form-label me-2">Distance(KM)</label>
                                <input type="number" onChange={(e) => setDistanceFiler(e.target.value)} value={distanceFilter} />
                            </div>
                            <div className="w-auto d-flex gap-2">
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={artistFilter}
                                    onChange={(e) => setArtistFilter(e.target.value)}
                                />
                            </div>
                            <div className="w-auto d-flex gap-2">
                                <label className="form-label">Fecha</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="row">
                            {filteredEvents.length === 0 ? (
                                <div className="col-12">
                                    <div className="card shadow-sm p-5 text-center">
                                        <h4>No hay eventos cercanos disponibles</h4>
                                        <p className="text-muted mb-0">
                                            Cuando se creen eventos, aparecerán aquí.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                filteredEvents.map((event) => (
                                    <div key={event.id} className="col-md-6 col-lg-4" onMouseEnter={() => setSelectedEvent(event)} onMouseLeave={() => setSelectedEvent(null)} onClick={() => setInfoWindowEvent(event)}>
                                        <div className="card shadow-sm h-auto rounded-4 overflow-hidden" style={{ border: event.id === selectedEvent?.id ? "1px solid black" : "" }}>
                                            {event.media ? (
                                                <img
                                                    src={event.media}
                                                    className="card-img-top"
                                                    style={{ height: "210px", objectFit: "cover" }}
                                                    alt={event.name}
                                                />
                                            ) : (
                                                <div
                                                    className="bg-light d-flex align-items-center justify-content-center"
                                                    style={{ height: "210px" }}
                                                >
                                                    <span className="text-muted">Sin imagen</span>
                                                </div>
                                            )}

                                            <div className="card-body d-flex flex-column p-4">
                                                <h5 className="card-title fw-bold">{event.name}</h5>

                                                <p className="text-muted mb-2">
                                                    📍 {event.location || "Ubicación no disponible"} {event.distance ? event.distance.toFixed(1) + 'km away' : ''}
                                                </p>

                                                <p className="small text-muted mb-2">
                                                    📅 {event.date_event
                                                        ? new Date(event.date_event).toLocaleString()
                                                        : "Fecha no disponible"}
                                                </p>

                                                <p className="card-text">
                                                    {event.description || "Sin descripción"}
                                                </p>

                                                <p className="mb-3">
                                                    <strong>Capacidad:</strong> {event.capacity || "No definida"}
                                                </p>

                                                {event.categories &&
                                                    event.categories.map((categoryRel) => {
                                                        return (
                                                            <div key={categoryRel.id}>
                                                                <p className="p-1" style={{ width: "fit-content", textAlign: "center", textDecoration: "none", verticalAlign: "middle", backgroundColor: "#ffc107", border: "1px solid", borderRadius: "2rem" }}>
                                                                    {categoryRel.name}
                                                                </p>
                                                            </div>
                                                        )
                                                    })
                                                }

                                                <div className="mt-auto d-grid gap-2">
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => navigate(`/events/${event.id}`)}
                                                    >
                                                        Ver detalle
                                                    </button>

                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-success w-100"
                                                            onClick={() => handleSave(event.id)}
                                                        >
                                                            Guardar
                                                        </button>

                                                        <button
                                                            className="btn btn-warning w-100"
                                                            onClick={() => handleAssist(event.id)}
                                                        >
                                                            Asistir
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    {userLocation && (
                        <div className="col h-100">
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
                                height={'700px'}
                                infoWindowEvent={infoWindowEvent}
                                setInfoWindowEvent={setInfoWindowEvent}
                                >
                            </Map>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};