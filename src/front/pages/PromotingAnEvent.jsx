import React from "react";
import { Link } from "react-router-dom";
import peopleDiscussionBlurredBackground from "../assets/img/peopleDiscussionBlurredBackground.webp";

export const PromotingAnEvent = () => {
  return (
    <section className="promote-page eh-inner-section" id="promote">
      <div className="eh-page-glow eh-page-glow-one"></div>
      <div className="eh-page-glow eh-page-glow-two"></div>

      <div className="container position-relative">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div className="promote-visual-card">
              <img
                src={peopleDiscussionBlurredBackground}
                alt="Promociona tu evento"
                className="promote-image"
              />

              <div className="promote-floating-card promote-floating-card-one">
                <strong>+ Visibilidad</strong>
                <span>Eventos destacados</span>
              </div>

              <div className="promote-floating-card promote-floating-card-two">
                <strong>Promotores</strong>
                <span>Conecta con tu audiencia</span>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
    
            <h2 className="section-title text-start">
              Haz que tu evento <span className="gradient-text">llegue más lejos</span>.
            </h2>

            <p className="section-description">
              Publica, promociona y conecta con personas interesadas en tu tipo
              de evento. Event Hub te ayuda a tener más alcance, mejor atención
              y una experiencia más profesional.
            </p>

            <div className="features-pro">
              <div className="feature-item-pro">
                <span className="feature-icon-pro">01</span>
                <div>
                  <h5>Alcance geolocalizado</h5>
                  <p>Tu evento se muestra a usuarios cercanos y con intereses compatibles.</p>
                </div>
              </div>

              <div className="feature-item-pro">
                <span className="feature-icon-pro">02</span>
                <div>
                  <h5>Promoción destacada</h5>
                  <p>Mayor presencia en secciones principales, recomendaciones y búsquedas.</p>
                </div>
              </div>

              <div className="feature-item-pro">
                <span className="feature-icon-pro">03</span>
                <div>
                  <h5>Conexión con usuarios</h5>
                  <p>Facilita la comunicación con asistentes y personas interesadas.</p>
                </div>
              </div>

              <div className="feature-item-pro">
                <span className="feature-icon-pro">04</span>
                <div>
                  <h5>Gestión más clara</h5>
                  <p>Organiza tus eventos desde un espacio preparado para promotores.</p>
                </div>
              </div>
            </div>

            <Link to="/promotor/login" className="eh-main-gradient-btn mt-4">
              Promocionar mi evento
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};