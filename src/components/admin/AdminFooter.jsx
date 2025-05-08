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
import '../../assets/styles/Admin-layout.css';


const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="admin-footer text-white pt-5 pb-4" role="contentinfo">
      <div className="container">
        <div className="row">
          {/* Colonne Logo & Description */}
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase mb-4 fw-bold">Espace Administrateur</h5>
            <p className="mb-3">
              Plateforme innovante dédiée aux nageurs et coachs pour optimiser leurs performances et suivre leur progression dans l'eau.
            </p>
            
          </div>


          {/* Colonne Liens Rapides */}
          <div className="col-md-2 mb-4">
            <h6 className="text-uppercase fw-bold mb-4">Test Pages d'erreur</h6>
            <ul className="list-unstyled">
  <li className="mb-2">
    <a href="/404" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">404 - Page introuvable</a>
  </li>
  <li className="mb-2">
    <a href="/500" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">500-Erreur serveur</a>
  </li>
  <li className="mb-2">
    <a href="/403" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">403 - Accès non autorisé</a>
  </li>
  <li className="mb-2">
    <a href="/504" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">504 - Délai d'attente dépassé</a>
  </li>
  <li className="mb-2">
    <a href="/401" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">401 - Authentification requise</a>
  </li>
  <li className="mb-2">
    <a href="/maintenance" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">Site en maintenance</a>
  </li>
</ul>

          </div>

          {/* Colonne Infos Support */}
          <div className="col-md-2 mb-4">
            <h6 className="text-uppercase fw-bold mb-4">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="https://laravel.com/docs/11.x/csrf" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">CSRF Protection</Link>
              </li>
              <li className="mb-2">
                <Link to="https://laravel.com/docs/11.x/authentication" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">Authentication</Link>
              </li>
              <li className="mb-2">
                <Link to="https://laravel.com/docs/11.x/middleware" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">Middleware</Link>
              </li>
              <li className="mb-2">
                <Link to="https://react.dev/blog/2024/12/05/react-19" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none"> React 19</Link>
              </li>
              <li className="mb-2">
                <Link to="https://www.cert.ssi.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none"> SÉCURITÉ  MENACES ET INCIDENTS</Link>
              </li>
              <li className="mb-2">
                <Link to="https://www.infosecurity-magazine.com" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none"> Infosecurity Magazine</Link>
              </li>
            </ul>
          </div>

          {/* Colonne Adresse Contact */}
          <div className="col-md-4 mb-4">
            <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
            <p className="mb-2">
              <FaMapMarkerAlt className="me-2" aria-hidden="true" />
              45 Avenue Albert Camus, 75000 Paris, France
            </p>
            <p className="mb-2">
              <FaEnvelope className="me-2" aria-hidden="true" />
              <a href="mailto:contact@nataswim.net" className="text-white">contact@nataswim.net</a>
            </p>
            <p className="mb-2">
              <FaPhone className="me-2" aria-hidden="true" />
              <a href="tel:+33644248711" className="text-white">+33 6 44 24 87 11</a>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-3 border-top">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0 small">
                © {currentYear} NataSwim APP V 1.0. Tous droits réservés.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <ul className="list-inline mb-0">
                
                <li className="list-inline-item ms-3">
                <Link to="https://www.nataswim.com/" className="text-white small" target="_blank" rel="noopener noreferrer">🥇 Sport NeT Systèmes SNS </Link>
                </li>
                <li className="list-inline-item ms-3">
                <Link to="https://nataswimshop.com/" className="text-white small" target="_blank" rel="noopener noreferrer">💙 Sport Boutique </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;