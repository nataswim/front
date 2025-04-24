import React from 'react';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';
import ErrorComponent from '../../components/ErrorComponent';
import { Link } from 'react-router-dom';
import { FaLock, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

/**
 * Page d'erreur 403 - Accès interdit
 * Affichée lorsque l'utilisateur n'a pas les droits d'accès à une ressource
 */
const ForbiddenPage = () => {
  const { isAuthenticated } = useAuth();
  const illustration = "/assets/images/logo/nataswim_app_logo_0.png";

  return (
    <>
      <Header />
      <main className="bg-light py-5">
        <ErrorComponent
          title="Accès non autorisé"
          code="403"
          message="Vous n'avez pas les permissions nécessaires pour accéder à cette page."
          illustration={illustration}
          showSupportButton={false}
        >
          <div className="card bg-white shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <FaLock className="text-warning me-3 fs-3" />
                <h5 className="card-title mb-0">Zone réservée</h5>
              </div>
              <p className="card-text">
                Cette section de notre application nécessite des droits d'accès spécifiques. 
                {isAuthenticated 
                  ? " Votre compte actuel ne dispose pas des autorisations nécessaires." 
                  : " Veuillez vous connecter ou vous inscrire pour accéder à ce contenu."}
              </p>
              
              {!isAuthenticated && (
                <div className="mt-3 d-flex flex-wrap gap-2">
                  <Link to="/login" className="btn btn-primary">
                    <FaSignInAlt className="me-2" /> Se connecter
                  </Link>
                  <Link to="/register" className="btn btn-outline-primary">
                    <FaUserPlus className="me-2" /> Créer un compte
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="alert alert-info mb-0" role="alert">
            <p className="mb-0">
              Si vous pensez qu'il s'agit d'une erreur ou si vous avez besoin d'autorisations supplémentaires, 
              veuillez contacter notre équipe de support.
            </p>
          </div>
        </ErrorComponent>
      </main>
      <Footer />
    </>
  );
};

export default ForbiddenPage;