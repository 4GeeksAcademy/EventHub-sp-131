import React, { useEffect } from "react"
import { Link } from "react-router-dom";
import EventHubHeroImage from "../assets/img/EventHubHeroImage.png";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
	return (
		<section className="hero" >
			<div className="hero-overlay" style={{ background: `linear-gradient(rgba(10, 10, 15, 0.75), rgba(10, 10, 15, 0.85)), url(${EventHubHeroImage}) center/cover no-repeat`}}></div>
			<div className="hero-content">
				<h1 className="display-3">Crea. Conecta.<span className="gradient-text">Vive la experiencia</span></h1>
				<p className="lead">La plataforma todo-en-uno para organizar eventos inolvidables</p>
				<div className="hero-buttons">
					<a href="#explorar" className="btn btn-primary">Explorar Eventos</a>
				</div>
			</div>
		</section >
	)
}; 