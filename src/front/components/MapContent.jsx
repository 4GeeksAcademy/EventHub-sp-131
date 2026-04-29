import { useEffect, useRef, useState, useCallback } from 'react';
import { Map, AdvancedMarker, Pin, useApiIsLoaded, useMap } from '@vis.gl/react-google-maps';
import { PlaceOverview, PlaceDirectionsButton, IconButton, PlaceDataProvider, PlaceReviews } from '@googlemaps/extended-component-library/react';

const MapController = ({ college, markerPosition, setMarkerPosition }) => {
    const map = useMap("gmap");

    useEffect(() => {
        if (!map) return;

        let position = null;

        if (markerPosition) {
            position = markerPosition;
        } else if (college?.location) {
            const loc = college.location;
            const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
            const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
            position = { lat, lng };
        } else if (markerPosition) {
            position = markerPosition;
        }

        if (position) {
            map.panTo(position);
            map.setZoom(17);
        }
    }, [map, college, markerPosition]);

    const currentPosition = markerPosition ||
        (college?.location
            ? {
                lat: typeof college.location.lat === 'function'
                    ? college.location.lat()
                    : college.location.lat,
                lng: typeof college.location.lng === 'function'
                    ? college.location.lng()
                    : college.location.lng,
            }
            : null);

    if (!currentPosition) return null;

    const handleDragEnd = (event) => {
        console.log(event);
        
        const latLng = event.latLng;
        if (!latLng) {
            console.error("No LatLng ");
            return;
        }

        const newPosition = {
            lat: latLng.lat(),
            lng: latLng.lng()
        };

        console.log("Marcador movido a:", newPosition);
        setMarkerPosition(newPosition);
    };

    return (
        <AdvancedMarker
            position={currentPosition}
            draggable={true}
            onDragEnd={handleDragEnd}
        >
            <Pin
                background={'#fb2104'}
                glyphColor={'#000'}
                borderColor={'#000'}
            />
        </AdvancedMarker>
    );
};

export const MapContent = ({ college, setCollege, markerPosition, setMarkerPosition }) => {
    const DEFAULT_CENTER = { lat: 38, lng: -98 };
    const containerRef = useRef(null);
    const [showReviews, setShowReviews] = useState(false);
    const isLoaded = useApiIsLoaded();

    useEffect(() => {
        if (!isLoaded || !containerRef.current) return;

        const initAutocomplete = async () => {
            await window.google.maps.importLibrary("places");

            // Evitar duplicados
            if (containerRef.current.querySelector("gmp-place-autocomplete")) return;

            const autocomplete = document.createElement("gmp-place-autocomplete");
            autocomplete.setAttribute("for-map", "gmap");
            autocomplete.setAttribute("placeholder", "Busca una ubicación");
            autocomplete.style.cssText = "width: 100%; margin-bottom: 12px; display: block;";

            containerRef.current.prepend(autocomplete);

            const handlePlaceSelect = async (event) => {

                let place;

                if (event.placePrediction) {
                    place = event.placePrediction.toPlace();
                }
                else {
                    console.error("No se encontró place ni placePrediction en el evento", event);
                    return;
                }

                try {
                    await place.fetchFields({
                        fields: ["displayName", "location", "formattedAddress"]
                    });

                    setCollege(place);
                    setMarkerPosition(null)
                } catch (error) {
                    console.error("Error al obtener detalles del place:", error);
                }
            };

            autocomplete.addEventListener("gmp-select", handlePlaceSelect);
        };

        initAutocomplete();
    }, [isLoaded]);

    if (!isLoaded) return <p>Cargando mapa...</p>;
    
    


    return (
        <>
            <div ref={containerRef}>
                {college && (
                    <PlaceOverview
                        size="large"
                        place={college}
                        googleLogoAlreadyDisplayed
                    >
                        <div slot="action">
                            <IconButton
                                variant="filled"
                                onClick={() => setShowReviews(!showReviews)}
                            >
                                {showReviews ? "Ocultar reseñas" : "Ver reseñas"}
                            </IconButton>
                        </div>
                        <div slot="action">
                            <PlaceDirectionsButton variant="filled">
                                Direcciones
                            </PlaceDirectionsButton>
                        </div>
                    </PlaceOverview>
                )}
            </div>

            {showReviews && college && (
                <div className="border rounded p-2 mb-2">
                    <button
                        className="btn btn-sm btn-secondary mb-2"
                        onClick={() => setShowReviews(false)}
                    >
                        Cerrar
                    </button>
                    <PlaceDataProvider place={college}>
                        <PlaceReviews />
                    </PlaceDataProvider>
                </div>
            )}

            <Map
                id="gmap"
                mapId="8c732c82e4ec29d9"
                style={{ width: "100%", height: "400px" }}
                defaultCenter={DEFAULT_CENTER}
                defaultZoom={4}
                gestureHandling="greedy"
                fullscreenControl={true}
                zoomControl={true}
            >
                <MapController college={college} markerPosition={markerPosition} setMarkerPosition={setMarkerPosition} />
            </Map>
        </>
    );
};