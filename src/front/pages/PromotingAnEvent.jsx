import React, { useEffect } from "react"
import { Link } from "react-router-dom";
import peopleDiscussionBlurredBackground from "../assets/img/peopleDiscussionBlurredBackground.webp";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const PromotingAnEvent = () => {

	const { store, dispatch } = useGlobalReducer()

	return (
		<section className="promote-section py-5" id="promote">
			<div className="container">
				<div className="row align-items-center">

					<div className="col-lg-6 text-center">
						<img src={peopleDiscussionBlurredBackground}
							alt="Promociona tu evento"
							className="about-image" />
					</div>

					<div className="col-lg-6">
						<h2 className="section-title">
							¿Quieres <span className="gradient-text">llenar tu evento</span>?
						</h2>

						<p className="lead mb-4">
							Deja de depender solo de Instagram y WhatsApp.
							<strong> Event Hub</strong> te da visibilidad real, venta de entradas integrada y todas las herramientas para que tu evento sea un éxito.
						</p>

						<div className="features mt-4">
							<div className="feature-item">
								<h5>✅ Alcance masivo + geolocalizado</h5>
								<p>Tu evento aparece automáticamente a personas cercanas y interesadas en tu tipo de evento.</p>
							</div>
							<div className="feature-item">
								<h5>✅ Chat directo con tus clientes</h5>
								<p>Tus clientes merecen el mejor servicio, y nosotros te ayudamos a que asi sea.</p>
							</div>
							<div className="feature-item">
								<h5>✅ Promoción destacada</h5>
								<p>Destaca tu evento en la página principal, recomendaciones y newsletters.</p>
							</div>
							<div className="feature-item">
								<h5>✅ Herramientas de marketing</h5>
								<p>Enlaces personalizados, seguimiento de asistencia y analíticas completas.</p>
							</div>
						</div>

						<div className="mt-5">
							<Link to="/promotor/login">
								<button href="#crear-evento" className="btn btn-primary btn-lg px-5">
									Promocionar mi Evento Ahora
								</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}; 