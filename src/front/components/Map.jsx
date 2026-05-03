import { useRef, useEffect } from "react"
import { AdvancedMarker, APIProvider, Map as GoogleMap } from '@vis.gl/react-google-maps'

const geoApiKey = import.meta.env.VITE_GEOCODING_API_KEY

export const Map = ({ location, mapCenter, setMapCenter, markerPosition, setMarkerPosition, onLocationChange, defZoom, setDefZoom }) => {
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
                style={{ width: "100%", height: "400px" }}
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
            </GoogleMap>
        </APIProvider>
    )
}