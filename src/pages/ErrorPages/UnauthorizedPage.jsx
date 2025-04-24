import React from 'react';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';
import ErrorComponent from '../../components/ErrorComponent';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus, FaKey } from 'react-icons/fa';

/**
 * Page d'erreur 401 - Non autorisé
 * Affichée lorsque l'utilisateur tente d'accéder à une ressource nécessitant une authentification
 */
const UnauthorizedPage = () => {
  const illustration = "/assets/images/logo/nataswim_app_logo_4.png";

  return (
    <>
      <Header />
      <main className="bg-light py-5">
        <ErrorComponent
          title="Authentification requise"
          code="401"
          message="Vous devez être connecté pour accéder à cette page."
          illustration={illustration}
          showSupportButton={false}
        >
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card bg-white shadow-sm mb-4">
                <div className="card-header bg-info bg-opacity-10 py-3">
                  <div className="d-flex align-items-center">
                    <FaKey className="text-info me-3 fs-4" />
                    <h5 className="card-title mb-0">Connexion nécessaire</h5>
                  </div>
                </div>
                <div className="card-body p-4">
                  <p className="card-text mb-4">
                    Pour accéder à cette section, veuillez vous connecter avec votre compte 
                    ou créer un nouveau compte si vous n'en avez pas encore.
                  </p>
                  
                  <div className="d-flex flex-wrap gap-3 justify-content-center">
                    <Link to="/login" className="btn btn-primary px-4">
                      <FaSignInAlt className="me-2" /> Se connecter
                    </Link>
                    <Link to="/register" className="btn btn-outline-primary px-4">
                      <FaUserPlus className="me-2" /> Créer un compte
                    </Link>
                  </div>
                </div>
                <div className="card-footer bg-light py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Vous avez oublié votre mot de passe ?</span>
                    <Link to="/forgot-password" className="btn btn-link text-decoration-none">
                      Réinitialiser
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ErrorComponent>
      </main>
      <Footer />
    </>
  );
};

export default UnauthorizedPage;