// Composant Footer responsive 
// Avec les liens utiles, les réseaux sociaux, les coordonnées de contact et les mentions légales
// Liens vers les pages de confidentialité et conditions d'utilisation

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt 
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="visitor-footer text-white pt-5 pb-4">
      <div className="container">
        <div className="row">
          {/* Colonne Logo & Description */}
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase mb-4 fw-bold">NSAPP</h5>
            <p className="mb-3">
              Plateforme innovante dédiée aux nageurs et coachs pour optimiser leurs performances et suivre leur progression dans l'eau.
            </p>
            <div className="d-flex gap-3 mb-4">
              <a href="https://facebook.com" className="text-white" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-white" target="_blank" rel="noopener noreferrer">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-white" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={20} />
              </a>
              <a href="https://youtube.com" className="text-white" target="_blank" rel="noopener noreferrer">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Colonne Liens Rapides */}
          <div className="col-md-2 mb-4">
            <h6 className="text-uppercase fw-bold mb-4">Liens</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white text-decoration-none">Accueil</Link>
              </li>
              <li className="mb-2">
                <Link to="/fonctionnalites" className="text-white text-decoration-none">Fonctionnalités</Link>
              </li>
              <li className="mb-2">
                <Link to="/plan-inscription" className="text-white text-decoration-none">Tarifs</Link>
              </li>
              <li className="mb-2">
                <Link to="/a-propos" className="text-white text-decoration-none">À propos</Link>
              </li>
            </ul>
          </div>

          {/* Colonne Infos Support */}
          <div className="col-md-2 mb-4">
            <h6 className="text-uppercase fw-bold mb-4">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/contact" className="text-white text-decoration-none">Contact</Link>
              </li>
              <li className="mb-2">
                <Link to="/mentions-legales" className="text-white text-decoration-none">Mentions legales</Link>
              </li>
              <li className="mb-2">
                <Link to="/cookies" className="text-white text-decoration-none">Cookies & Données</Link>
              </li>
              <li className="mb-2">
                <Link to="/declaration-Accessibilite" className="text-white text-decoration-none"> Accessibilité</Link>
              </li>
            </ul>
          </div>

          {/* Colonne Adresse Contact */}
          <div className="col-md-4 mb-4">
            <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
            <p className="mb-2">
              <FaMapMarkerAlt className="me-2" />
              45 Avenue Albert Camus, 75000 Paris, France
            </p>
            <p className="mb-2">
              <FaEnvelope className="me-2" />
              contact@nataswim.net
            </p>
            <p className="mb-2">
              <FaPhone className="me-2" />
              +33 6 44 24 87 11
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-3 border-top">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0 small">
                © {currentYear} NSAPP. Tous droits réservés.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  <Link to="/politique-confidentialite" className="text-white small">⚖️ Politique de confidentialité</Link>
                </li>
                <li className="list-inline-item ms-3">
                <Link    to="https://www.nataswim.com/"    className="text-white small"    target="_blank"    rel="noopener noreferrer" >🥇 Sport NeT Systèmes SNS </Link>
                </li>
                <li className="list-inline-item ms-3">
                <Link    to="https://nataswimshop.com/"    className="text-white small"    target="_blank"    rel="noopener noreferrer" >💙 Sport Boutique </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;