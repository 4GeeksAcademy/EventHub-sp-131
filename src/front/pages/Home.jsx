import React from "react";
import { Link } from "react-router-dom";
import EventHubHeroImage from "../assets/img/EventHubHeroImage.png";
import "../styles/home.css";

export const Home = () => {
  return (
    <>
      <section className="eh-hero">
        <div className="eh-hero-bg"></div>
        <div className="eh-orb eh-orb-one"></div>
        <div className="eh-orb eh-orb-two"></div>
        <div className="eh-orb eh-orb-three"></div>

        <div className="container eh-hero-container">
          <div className="row align-items-center min-vh-100 g-5">
            <div className="col-lg-7">
              <div className="eh-hero-copy reveal-left">
                <span className="eh-kicker">Plataforma de eventos sociales</span>

                <h1>
                  Descubre.
                  <br />
                  Conecta.
                  <br />
                  <span>Vive.</span>
                </h1>

                <p>
                  Encuentra eventos cerca de ti, conecta con personas, crea
                  planes con tus amigos y vive experiencias únicas desde una
                  sola plataforma.
                </p>

                <div className="eh-hero-actions">
                  <a href="#explorar" className="eh-btn-primary">
                    Explorar eventos
                  </a>

                  <Link to="/promotor/login" className="eh-btn-secondary">
                    Publicar evento
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="eh-hero-visual reveal-right">
                <div className="eh-hero-ring"></div>
                <div className="eh-hero-ring eh-hero-ring-two"></div>

                <div className="eh-hero-logo-card">
                  <img src={EventHubHeroImage} alt="Event Hub" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="eh-featured-week">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <span className="eh-kicker">Evento destacado</span>

              <h2 className="eh-section-title">
                El plan más esperado de la semana.
              </h2>

              <p className="eh-section-text">
                Descubre eventos recomendados por tendencia, ubicación e
                intereses. Ideal para salir con amigos, crear grupos y vivir
                una experiencia diferente.
              </p>

              <div className="eh-featured-actions">
                <a href="#explorar" className="eh-btn-primary">
                  Ver eventos
                </a>

                <Link to="/user/login" className="eh-btn-secondary">
                  Guardar favorito
                </Link>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="eh-featured-card reveal-up">
                <div className="eh-featured-image">
                  <div className="eh-featured-badge">Semana destacada</div>
                </div>

                <div className="eh-featured-info">
                  <div>
                    <span>Viernes · 22:00</span>
                    <h3>Neon Night Experience</h3>
                    <p>
                      Música, luces, comunidad y una experiencia urbana para
                      vivir con amigos.
                    </p>
                  </div>

                  <div className="eh-featured-meta">
                    <div>
                      <strong>Madrid</strong>
                      <span>Ubicación</span>
                    </div>

                    <div>
                      <strong>+120</strong>
                      <span>Interesados</span>
                    </div>

                    <div>
                      <strong>4.8</strong>
                      <span>Valoración</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="eh-discover-section" id="explorar">
        <div className="container">
          <div className="eh-section-header">
            <span className="eh-kicker">Explora</span>
            <h2>Eventos para cada plan</h2>
            <p>
              Una experiencia pensada para encontrar planes, guardar favoritos y
              compartirlos con tu círculo.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="eh-category-card reveal-up">
                <span className="eh-category-icon">🎤</span>
                <h3>Música</h3>
                <p>Conciertos, festivales y noches en vivo.</p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="eh-category-card reveal-up">
                <span className="eh-category-icon">⚽</span>
                <h3>Deporte</h3>
                <p>Partidos, torneos y experiencias deportivas.</p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="eh-category-card reveal-up">
                <span className="eh-category-icon">🎭</span>
                <h3>Cultura</h3>
                <p>Teatro, arte, exposiciones y actividades locales.</p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="eh-category-card reveal-up">
                <span className="eh-category-icon">🍽️</span>
                <h3>Social</h3>
                <p>Planes, quedadas, gastronomía y comunidad.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="eh-community-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="eh-community-panel reveal-left">
                <div className="eh-community-item active">
                  <span>01</span>
                  <div>
                    <h4>Guarda eventos favoritos</h4>
                    <p>Ten tus próximos planes siempre a mano.</p>
                  </div>
                </div>

                <div className="eh-community-item">
                  <span>02</span>
                  <div>
                    <h4>Crea grupos con amigos</h4>
                    <p>Organiza planes y comparte eventos fácilmente.</p>
                  </div>
                </div>

                <div className="eh-community-item">
                  <span>03</span>
                  <div>
                    <h4>Descubre por intereses</h4>
                    <p>Encuentra eventos según categorías y ubicación.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <span className="eh-kicker">Comunidad</span>

              <h2 className="eh-section-title">
                Más que eventos: una red para vivir experiencias.
              </h2>

              <p className="eh-section-text">
                Event Hub no solo muestra eventos. Ayuda a conectar usuarios,
                amigos, grupos y promotores en un mismo espacio.
              </p>

              <Link to="/user/login" className="eh-btn-primary">
                Unirme a Event Hub
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};