// src/pages/visitor/NotFoundPage.jsx (optimisé)
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';
import ErrorComponent from '../../components/ErrorComponent';
import { Link } from 'react-router-dom';
import { FaSearch, FaSitemap } from 'react-icons/fa';

const NotFoundPage = () => {
  const location = useLocation();
  const illustration = "/assets/images/logo/nataswim_app_logo_3.png";

  // Journalisation de l'URL introuvable (utile pour la maintenance)
  useEffect(() => {
    console.log(`Page non trouvée: ${location.pathname}`);
    // Ici vous pourriez intégrer un système de journalisation plus avancé
  }, [location]);

  // Déterminer le contexte pour adapter l'affichage
  const path = location.pathname;
  let contextMessage = "La page que vous recherchez semble avoir plongé trop profondément ou n'existe pas.";
  
  // Adapter le message selon le contexte (admin, user, etc.)
  if (path.startsWith('/admin')) {
    contextMessage = "Cette section d'administration n'existe pas ou vous n'avez pas les droits nécessaires.";
  } else if (path.startsWith('/user')) {
    contextMessage = "Cette section utilisateur n'existe pas ou a été déplacée.";
  }

  return (
    <>
      <Header />
      <main className="bg-light py-5">
        <ErrorComponent
          title="Page introuvable"
          code="404"
          message={contextMessage}
          illustration={illustration}
        >
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card bg-white shadow-sm mb-4">
                <div className="card-body p-4">
                  <h5 className="card-title fw-bold mb-3">Suggestions :</h5>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      • Vérifiez l'URL dans la barre d'adresse de votre navigateur
                    </li>
                    <li className="mb-2">
                      • Utilisez notre barre de recherche pour trouver ce que vous cherchez
                    </li>
                    <li className="mb-2">
                      • Retournez à la page d'accueil pour recommencer votre navigation
                    </li>
                    <li>
                      • Explorez nos sections principales pour découvrir nos contenus
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 mt-3">
            <Link to="/articles" className="btn btn-outline-info">
              <FaSearch className="me-2" /> Explorer les articles
            </Link>
            <Link to="/plan-inscription" className="btn btn-outline-info">
              <FaSitemap className="me-2" /> Plans d'entraînement
            </Link>
          </div>
        </ErrorComponent>
      </main>
      <Footer />
    </>
  );
};

export default NotFoundPage;