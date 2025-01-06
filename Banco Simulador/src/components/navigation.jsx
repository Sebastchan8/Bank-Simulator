import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SmoothScroll from "smooth-scroll";

const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

export const Navigation = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (e, section) => {
    e.preventDefault();
    const isOnSimuladores = location.pathname === "/simuladores";

    if (isOnSimuladores) {
      // Redirige a la página principal y lueo navega a la sección
      navigate("/");
      setTimeout(() => {
        scroll.animateScroll(document.querySelector(section));
      }, 300);
    } else {
      scroll.animateScroll(document.querySelector(section));
    }
  };

  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <a className="navbar-brand page-scroll" href="#page-top" onClick={(e) => handleNavigation(e, "#page-top")}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <img src="img/logo.png" style={{ width: "30px" }} alt="" />Banco Pichincha
            </div>
          </a>{" "}
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#features" className="page-scroll" onClick={(e) => handleNavigation(e, "#features")}>
                Visión
              </a>
            </li>
            <li>
              <a href="#about" className="page-scroll" onClick={(e) => handleNavigation(e, "#about")}>
                Nosotros
              </a>
            </li>
            <li>
              <a href="#services" className="page-scroll" onClick={(e) => handleNavigation(e, "#services")}>
                Servicios
              </a>
            </li>
            <li>
              <a href="#portfolio" className="page-scroll" onClick={(e) => handleNavigation(e, "#portfolio")}>
                Galería
              </a>
            </li>
            <li>
              <a href="#testimonials" className="page-scroll" onClick={(e) => handleNavigation(e, "#testimonials")}>
                Testimonios
              </a>
            </li>
            <li>
              <a href="#contact" className="page-scroll" onClick={(e) => handleNavigation(e, "#contact")}>
                Contacto
              </a>
            </li>
            <li>
              <a
                className="page-scroll btn"
                style={{
                  background: '#2e3673', color: 'white', padding: '6px 10px', borderRadius: '6px'
                }}
                onClick={() => navigate("/simuladores")}
              >
                Simuladores              
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
