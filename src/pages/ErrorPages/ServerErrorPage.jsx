import React from 'react';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';
import ErrorComponent from '../../components/ErrorComponent';
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

/**
 * Page d'erreur 500 - Erreur serveur
 * Affichée lorsqu'une erreur survient côté serveur
 */
const ServerErrorPage = () => {
  // Utiliser un logo de l'application avec une teinte d'erreur
  const illustration = "/assets/images/logo/nataswim_app_logo_2.png";

  // Vérifier si l'erreur persiste depuis longtemps (simulation)
  const isLongstanding = false;

  return (
    <>
      <Header />
      <main className="bg-light py-5">
        <ErrorComponent
          title="Erreur serveur"
          code="500"
          message="Notre serveur rencontre des difficultés techniques. Notre équipe travaille à résoudre ce problème."
          illustration={illustration}
        >
          <div className="alert alert-info" role="alert">
            <div className="d-flex align-items-center mb-2">
              <div className="fs-4 me-3">💦</div>
              <h5 className="mb-0">Que s'est-il passé ?</h5>
            </div>
            <p className="mb-1">
              Notre serveur est temporairement indisponible. Cette erreur est souvent temporaire et peut être résolue en rafraîchissant la page.
            </p>
            <p className="mb-0">
              Si le problème persiste, n'hésitez pas à nous contacter.
            </p>
          </div>

          {isLongstanding && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">Statut du service</h5>
                <p className="card-text">
                  Nous sommes actuellement confrontés à un problème technique majeur. Notre équipe travaille activement à sa résolution.
                </p>
                <div className="d-flex gap-2">
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-sm btn-outline-primary"
                  >
                    <FaTwitter className="me-1" /> Suivre les mises à jour
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="mt-3">
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
            >
              Rafraîchir la page
            </button>
          </div>
        </ErrorComponent>
      </main>
      <Footer />
    </>
  );
};

export default ServerErrorPage;