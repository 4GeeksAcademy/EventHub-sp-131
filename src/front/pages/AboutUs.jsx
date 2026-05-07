import React from "react";
import Carolina from "../assets/img/Carolina.jpg";
import Matias from "../assets/img/Matias.jpeg"
import Kristhiam from "../assets/img/Kristhiam.jpeg"

export const AboutUs = () => {
  const team = [
    {
      name: "Carolina Naranjo",
      role: "Full Stack Developer",
      image: Carolina,
      github: "https://github.com/CarolinaNFeria",
      linkedin: "https://www.linkedin.com/in/carolina-naranjo-feria-793132295/",
      initials: "CN",
    },
    {
      name: "Kristhiam Altamiranda",
      role: "Full Stack Developer",
      image: Kristhiam,
      github: "https://github.com/akristhiam93",
      linkedin: "https://www.linkedin.com/in/kristhiam-altamiranda-5a5b76230/",
      initials: "KA",
    },
    {
      name: "Matias Otero Sarra",
      role: "Full Stack Developer",
      image: Matias,
      github: "https://github.com/MatOtS",
      linkedin: "https://www.linkedin.com/in/oterosarramatias/",
      initials: "MO",
    },
  ];

  return (
    <section className="about-us-page eh-inner-section" id="about">
      <div className="eh-page-glow eh-page-glow-one"></div>
      <div className="eh-page-glow eh-page-glow-two"></div>

      <div className="container position-relative">
        <div className="eh-inner-header text-center">
          <span className="section-kicker">Equipo Event Hub</span>
          <h2 className="section-title">¿Quiénes somos?</h2>
          <p className="section-description mx-auto">
            Somos un equipo construyendo una plataforma para descubrir eventos,
            conectar personas y crear experiencias sociales reales.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {team.map((member) => (
            <div className="col-md-6 col-lg-4" key={member.name}>
              <div className="team-card-pro">
                <div className="team-card-top">
                  {member.image ? (
                    <img src={member.image} className="team-img-pro" alt={member.name} />
                  ) : (
                    <div className="team-placeholder-pro">{member.initials}</div>
                  )}
                </div>

                <div className="team-body-pro">
                  <span className="team-role">{member.role}</span>
                  <h5>{member.name}</h5>

                  <div className="team-links-pro">
                    <a href={member.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                      <i className="fa-brands fa-github"></i>
                    </a>

                    <a href={member.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                      <i className="fa-brands fa-linkedin"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};