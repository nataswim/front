import React from 'react';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';
import ErrorComponent from '../../components/ErrorComponent';
import { FaClock, FaWifi, FaSync } from 'react-icons/fa';

/**
 * Page d'erreur 504 - Timeout
 * Affichée lorsque la requête au serveur prend trop de temps
 */
const TimeoutPage = () => {
  const illustration = "/assets/images/logo/nataswim_app_logo_1.png";

  // Fonction pour tenter de recharger la page
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <>
      <Header />
      <main className="bg-light py-5">
        <ErrorComponent
          title="Délai d'attente dépassé"
          code="504"
          message="La requête a pris trop de temps à être traitée. Cela peut être dû à un problème temporaire de connexion."
          illustration={illustration}
        >
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card bg-white shadow-sm mb-4">
                <div className="card-body p-4">
                  <h5 className="card-title d-flex align-items-center mb-3">
                    <FaClock className="text-warning me-2" /> Que faire ?
                  </h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex align-items-start py-3 px-0 border-0">
                      <FaWifi className="text-primary mt-1 me-3" />
                      <div>
                        <strong>Vérifiez votre connexion internet</strong>
                        <p className="mb-0 text-muted">
                          Assurez-vous que votre connexion internet est stable et fonctionnelle.
                        </p>
                      </div>
                    </li>
                    <li className="list-group-item d-flex align-items-start py-3 px-0">
                      <FaSync className="text-primary mt-1 me-3" />
                      <div>
                        <strong>Essayez de rafraîchir la page</strong>
                        <p className="mb-0 text-muted">
                          Une simple actualisation de la page peut résoudre le problème.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleRetry} 
            className="btn btn-primary btn-lg mt-2"
          >
            <FaSync className="me-2" /> Réessayer
          </button>
        </ErrorComponent>
      </main>
      <Footer />
    </>
  );
};

export default TimeoutPage;