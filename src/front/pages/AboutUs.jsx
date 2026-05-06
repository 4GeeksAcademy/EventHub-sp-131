import React, { useEffect } from "react"
import { Link } from "react-router-dom";
import Carolina from "../assets/img/Carolina.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const AboutUs = () => {
  return (
    <section className="about py-5" id="about">
      <div className="container">
        <div className="row align-items-center">
          <h2 className="section-title">¿Quienes somos?</h2>

          <div class="card-group gap-5">
            <div class="card rounded">
              <img src={Carolina} class="card-img-top rounded-top" alt="..." />
              <div class="card-body">
                <h5 class="card-title">Carolina Naranjo</h5>
                <div className="d-flex justify-content-around">
                  <a href="https://github.com/CarolinaNFeria" className="fs-3 text-light">
                    <i class="fa-brands fa-github"></i>
                  </a>
                  <a href="https://www.linkedin.com/in/carolina-naranjo-feria-793132295/" className="fs-3 text-light">
                    <i class="fa-brands fa-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>
            <div class="card rounded">
              <img src="..." class="card-img-top rounded-top" alt="..."/>
              <div class="card-body">
                <h5 class="card-title">Kristhiam Altamiranda</h5>
                <div className="d-flex justify-content-around">
                  <a href="" className="fs-3 text-light">
                    <i class="fa-brands fa-github"></i>
                  </a>
                  <a href="" className="fs-3 text-light">
                    <i class="fa-brands fa-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>
            <div class="card rounded">
              <img src="..." class="card-img-top rounded-top" alt="..." />
              <div class="card-body">
                <h5 class="card-title">Matias Otero Sarra</h5>
                <div className="d-flex justify-content-around">
                  <a href="https://github.com/MatOtS" className="fs-3 text-light">
                    <i class="fa-brands fa-github"></i>
                  </a>
                  <a href="https://www.linkedin.com/in/oterosarramatias/" className="fs-3 text-light">
                    <i class="fa-brands fa-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}; 