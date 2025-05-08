import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaLifeRing, FaWater } from 'react-icons/fa';
import PropTypes from 'prop-types';

/**
 * Composant d'erreur réutilisable pour différents types d'erreurs
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.title - Titre de l'erreur
 * @param {string} props.code - Code d'erreur à afficher
 * @param {string} props.message - Message détaillé de l'erreur
 * @param {string} props.illustration - URL de l'illustration à afficher
 * @param {React.ReactNode} props.children - Contenu supplémentaire
 * @param {boolean} props.showHomeButton - Afficher le bouton vers l'accueil
 * @param {boolean} props.showBackButton - Afficher le bouton de retour
 * @param {boolean} props.showSupportButton - Afficher le bouton de support
 * @returns {React.ReactElement} Composant d'erreur
 */
const ErrorComponent = ({
  title = "Une erreur s'est produite",
  code,
  message = "Nous rencontrons un problème technique. Veuillez réessayer ultérieurement.",
  illustration,
  children,
  showHomeButton = true,
  showBackButton = true,
  showSupportButton = true
}) => {
  // Illustration par défaut (vagues d'eau pour thème natation)
  const defaultIllustration = (
    <div className="text-primary my-4" style={{ fontSize: '120px' }} aria-hidden="true">
      <FaWater />
    </div>
  );

  return (
    <div className="error-container py-5" role="alert" aria-live="polite">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            {/* Code d'erreur */}
            {code && (
              <div className="error-code mb-3">
                <span className="display-4 fw-bold text-primary">{code}</span>
              </div>
            )}

            {/* Titre de l'erreur */}
            <h1 className="error-title mb-4">{title}</h1>

            {/* Illustration */}
            <div className="error-illustration mb-4" aria-hidden="true">
              {illustration ? (
                <img 
                  src={illustration} 
                  alt="" 
                  className="img-fluid" 
                  style={{ maxHeight: '250px' }}
                />
              ) : (
                defaultIllustration
              )}
            </div>

            {/* Message d'erreur */}
            <div className="error-message mb-4">
              <p className="lead">{message}</p>
            </div>

            {/* Contenu personnalisé */}
            {children && <div className="custom-content mb-4">{children}</div>}

            {/* Boutons d'action */}
            <div className="error-actions d-flex flex-wrap justify-content-center gap-3">
              {showHomeButton && (
                <Link to="/" className="btn btn-primary">
                  <FaHome className="me-2" aria-hidden="true" /> Retour à l'accueil
                </Link>
              )}

              {showBackButton && (
                <button 
                  onClick={() => window.history.back()}
                  className="btn btn-outline-secondary"
                >
                  <FaArrowLeft className="me-2" aria-hidden="true" /> Page précédente
                </button>
              )}

              {showSupportButton && (
                <Link to="/contact" className="btn btn-outline-primary">
                  <FaLifeRing className="me-2" aria-hidden="true" /> Contacter le support
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes pour la vérification des types
ErrorComponent.propTypes = {
  title: PropTypes.string,
  code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  message: PropTypes.string,
  illustration: PropTypes.string,
  children: PropTypes.node,
  showHomeButton: PropTypes.bool,
  showBackButton: PropTypes.bool,
  showSupportButton: PropTypes.bool
};

export default ErrorComponent;