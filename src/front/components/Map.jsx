import { useRef, useEffect, useState } from "react"
import { AdvancedMarker, APIProvider, Map as GoogleMap, InfoWindow, Pin } from '@vis.gl/react-google-maps'

const geoApiKey = import.meta.env.VITE_GEOCODING_API_KEY

export const Map = ({ location, mapCenter, setMapCenter, markerPosition, setMarkerPosition, onLocationChange, defZoom, setDefZoom, setLatitude, setLongitude, events, selectedEvent, setSelectedEvent, height, infoWindowEvent, setInfoWindowEvent }) => {
    const autocompleteRef = useRef(null)


    useEffect(() => {
        const autocomplete = autocompleteRef.current
        if (!autocomplete) return

        const handlePlaceSelect = async (event) => {
            const place = event.placePrediction?.toPlace() ?? event.place ?? null
            if (!place) return
            try {
                await place.fetchFields({ fields: ["location", "formattedAddress", "displayName", "viewport"] })
                if (place.location) {
                    const newCenter = { lat: place.location.lat(), lng: place.location.lng() }
                    setMarkerPosition(newCenter)
                    setMapCenter(newCenter)
                    if (setLatitude) {
                        setLatitude(newCenter.lat)
                    }
                    if (setLongitude) {
                        setLongitude(newCenter.lng)
                    }
                    onLocationChange(newCenter.lat, newCenter.lng)
                    setDefZoom(13)
                }
            } catch (err) {
                console.error("Error obteniendo datos del place:", err)
            }
        }

        autocomplete.addEventListener("gmp-select", handlePlaceSelect)
        return () => autocomplete.removeEventListener("gmp-select", handlePlaceSelect)
    }, [])

    const handleDragEnd = (e) => {
        const newCenter = { lat: e.latLng.lat(), lng: e.latLng.lng() }
        setMarkerPosition(newCenter)
        setMapCenter(newCenter)
        onLocationChange(newCenter.lat, newCenter.lng)
        setDefZoom(13)
        if (setLatitude) setLatitude(newPosition.lat);
        if (setLongitude) setLongitude(newPosition.lng);
    }

    return (
        <APIProvider apiKey={geoApiKey} version='beta' libraries={['marker', 'places']}>
            {location && <p className="mt-2 text-muted">{location}</p>}
            <div style={{ marginBottom: "10px" }}>
                <gmp-place-autocomplete
                    ref={autocompleteRef}
                    placeholder="Busca una ubicación"
                    style={{ width: "100%", height: "40px", padding: "8px", fontSize: "16px" }}
                />
            </div>
            <GoogleMap
                style={{ width: "100%", height: height }}
                zoom={defZoom}
                id="my-map"
                mapId="8c732c82e4ec29d9"
                center={mapCenter}
                onCameraChanged={(ev) => {
                    setMapCenter(ev.detail.center),
                        setDefZoom(ev.detail.zoom)
                }}
            >
                <AdvancedMarker
                    position={markerPosition}
                    draggable={true}
                    onDragEnd={handleDragEnd}
                />
                <div>
                    {events &&
                        events.map((event) => {
                            return (
                                <AdvancedMarker
                                    className="rounded"
                                    key={event.id}
                                    position={{ lat: event.latitude, lng: event.longitude }}
                                    onClick={() => setInfoWindowEvent(event)} title={event.name}
                                    onMouseEnter={() => setSelectedEvent(event)}
                                    onMouseLeave={() => setSelectedEvent(null)}
                                    style={{ border: event.id === selectedEvent?.id ? "1px solid black" : "" }}
                                >
                                    <div className="fs-6 badge text-bg-light border shadow p-2 bg-body-ligth rounded">
                                        {event.name}
                                    </div>
                                </AdvancedMarker>
                            )
                        })}
                    {infoWindowEvent && (
                        <InfoWindow position={{ lat: infoWindowEvent.latitude, lng: infoWindowEvent.longitude }}
                            onCloseClick={() => setInfoWindowEvent(null)}
                        >
                            <div className="text-dark">
                                <h5>{infoWindowEvent.name}</h5>
                                <p>{infoWindowEvent.date_event}</p>
                                <p>Distancia: {infoWindowEvent.distance?.toFixed(1)} km</p>
                            </div>
                        </InfoWindow>
                    )}
                </div>
            </GoogleMap>
        </APIProvider>
    )
}