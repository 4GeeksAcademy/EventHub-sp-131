import React, { useEffect } from "react"
import { Link } from "react-router-dom";
import EventHubLogoImage from "../assets/img/EventHubLogoImage.png";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const AboutUs = () => {
    return (
<section className="about py-5" id="about">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <h2 className="section-title">¿Por qué Event Hub?</h2>
          <p className="lead">Sabemos lo complicado que es organizar un evento exitoso. Por eso creamos la plataforma más intuitiva y poderosa del mercado.</p>
          
          <div className="features">
            <div className="feature-item">
              <h5>Gestión Completa</h5>
              <p>Entradas, capacidad, listas de invitados, pagos y QR en un solo lugar.</p>
            </div>
            <div className="feature-item">
              <h5>Mapa Interactivo</h5>
              <p>Encuentra eventos cerca de ti y comparte tu ubicación fácilmente.</p>
            </div>
            <div className="feature-item">
              <h5>Comunidad Real</h5>
              <p>Conecta con artistas, organizadores y asistentes apasionados.</p>
            </div>
          </div>
        </div>
        <div className="col-lg-6 text-center">
          <img src={EventHubLogoImage} alt="Event Hub" className="about-image"/>
        </div>
      </div>
    </div>
  </section>
    )
}; 