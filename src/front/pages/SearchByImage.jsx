import React, { useState } from "react";
import { Link } from "react-router-dom";

export const SearchByImage = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [events, setEvents] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
        setEvents([]);
        setKeywords([]);
        setMessage("");
    };

    const uploadToCloudinary = () => {
        const formData = new FormData();

        formData.append("file", image);
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

        return fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData
        }).then((resp) => resp.json());
    };

    const searchEventsByImage = () => {
        if (!image) {
            setMessage("Primero selecciona una imagen.");
            return;
        }

        setLoading(true);
        setMessage("");
        setEvents([]);
        setKeywords([]);

        uploadToCloudinary()
            .then((cloudinaryData) => {
                console.log("Respuesta Cloudinary:", cloudinaryData);

                const imageUrl = cloudinaryData.secure_url || cloudinaryData.url;

                if (!imageUrl) {
                    throw new Error("Cloudinary no devolvió una URL válida.");
                }

                return fetch(import.meta.env.VITE_BACKEND_URL + "/api/search-by-image", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                    image_url: imageUrl,
                    country_code: "ES"
                    })
                });
            })
            .then((resp) =>
                resp.json().then((data) => ({
                    ok: resp.ok,
                    status: resp.status,
                    data
                }))
            )
            .then(({ ok, status, data }) => {
                console.log("Respuesta backend:", data);

                if (!ok) {
                    setMessage(data.message || `Error del backend: ${status}`);
                    return;
                }

                const detectedLabels = data.detected_labels || [];

                const cleanKeywords = detectedLabels.map((item) => {
                    if (typeof item === "string") return item;
                    return item.label;
                });

                setKeywords(cleanKeywords);
                setEvents(data.events || []);

                if (!data.events || data.events.length === 0) {
                    setMessage(data.message || "La imagen subió bien, pero no se encontraron eventos relacionados.");
                    return;
                }

                setMessage(`Se encontraron ${data.events.length} eventos relacionados.`);
            })
            .catch((error) => {
                console.error("Error buscando eventos por imagen:", error);
                setMessage("Hubo un error buscando eventos por imagen.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <div className="container-fluid px-4 pt-4">
                <div className="d-flex justify-content-end">
                    <Link to="/user/private" className="btn eh-back-profile-btn">
                        <i className="bi bi-arrow-left me-2"></i>
                        Volver al perfil
                    </Link>
                </div>
            </div>

            <div className="container py-5">
                <h1 className="mb-3">Buscar eventos por imagen</h1>

                <p className="text-muted">
                    Sube una imagen. El sistema la procesa con inteligencia artificial,
                    identifica elementos clave y busca eventos relacionados en tiempo real.
                </p>

                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <label className="form-label">Selecciona una imagen</label>

                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        {preview && (
                            <div className="mt-3">
                                <img
                                    src={preview}
                                    alt="Vista previa"
                                    className="img-fluid rounded"
                                    style={{
                                        maxHeight: "300px",
                                        objectFit: "cover"
                                    }}
                                />
                            </div>
                        )}

                        <button
                            className="btn btn-primary mt-3"
                            onClick={searchEventsByImage}
                            disabled={loading}
                        >
                            {loading ? "Buscando..." : "Buscar eventos"}
                        </button>

                        {message && (
                            <div className="alert alert-info mt-3">
                                {message}
                            </div>
                        )}
                    </div>
                </div>

                {keywords.length > 0 && (
                    <div className="mb-4">
                        <h5>Palabras detectadas:</h5>

                        {keywords.map((keyword, index) => (
                            <span key={index} className="badge bg-secondary me-2">
                                {keyword}
                            </span>
                        ))}
                    </div>
                )}

                <div className="row">
                    {events.map((event) => (
                        <div className="col-md-4 mb-4" key={event.id}>
                            <div className="card h-100 shadow-sm">
                                {event.image && (
                                    <img
                                        src={event.image}
                                        className="card-img-top"
                                        alt={event.name}
                                        style={{
                                            height: "200px",
                                            objectFit: "cover"
                                        }}
                                    />
                                )}

                                <div className="card-body">
                                    <h5 className="card-title">{event.name}</h5>

                                    <p className="card-text mb-1">
                                        <strong>Tipo:</strong> {event.event_type || "Sin tipo"}
                                    </p>

                                    <p className="card-text mb-1">
                                        <strong>Fecha:</strong> {event.date || "Sin fecha"}
                                    </p>

                                    <p className="card-text mb-1">
                                        <strong>Hora:</strong> {event.time || "Sin hora"}
                                    </p>

                                    <p className="card-text mb-1">
                                        <strong>Lugar:</strong> {event.venue || "Sin lugar"}
                                    </p>

                                    <p className="card-text">
                                        <strong>Ciudad:</strong> {event.city || "Sin ciudad"}
                                    </p>

                                    {event.url && (
                                        <a
                                            href={event.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-outline-primary"
                                        >
                                            Ver evento
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};