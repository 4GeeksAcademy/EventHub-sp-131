import React, { useEffect } from "react"
import { Link } from "react-router-dom";
import EventHubHeroImage from "../assets/img/EventHubHeroImage.png";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Contact = () => {
    return (
        <section className="contact py-5 bg-dark" id="contact">
            <div className="container">
                <h2 className="section-title text-center mb-5">¿Listo para crear tu próximo evento?</h2>
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <form className="contact-form">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <input type="text" className="form-control" placeholder="Tu nombre" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <input type="email" className="form-control" placeholder="Correo electrónico" required />
                                </div>
                            </div>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder="Asunto" required />
                            </div>
                            <div className="mb-4">
                                <textarea className="form-control" rows="6" placeholder="Cuéntanos sobre tu evento..."></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Enviar Mensaje</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}; 