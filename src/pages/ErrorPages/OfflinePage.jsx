import React from 'react';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';
import ErrorComponent from '../../components/ErrorComponent';
import { FaWifi, FaSync } from 'react-icons/fa';

/**
 * Page d'erreur hors ligne
 * Affichée lorsque l'application détecte que l'utilisateur est hors ligne
 */
const OfflinePage = () => {
  const illustration = "/assets/images/logo/nataswim_app_logo_0.png";

  // Fonction pour tenter de recharger la page
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <>
      <Header />
      <main className="bg-light py-5">
        <ErrorComponent
          title="Vous êtes hors ligne"
          message="Votre appareil n'est pas connecté à Internet. Veuillez vérifier votre connexion."
          illustration={illustration}
          showSupportButton={false}
        >
          <div className="card bg-white shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="card-title d-flex align-items-center mb-3">
                <FaWifi className="text-warning me-2" /> Que faire ?
              </h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item border-0 py-2">
                  • Vérifiez que le Wi-Fi ou les données mobiles de votre appareil sont activés
                </li>
                <li className="list-group-item border-0 py-2">
                  • Si vous utilisez le Wi-Fi, assurez-vous d'être à portée du signal
                </li>
                <li className="list-group-item border-0 py-2">
                  • Vérifiez que le mode avion n'est pas activé
                </li>
                <li className="list-group-item border-0 py-2">
                  • Redémarrez votre routeur si nécessaire
                </li>
              </ul>
            </div>
          </div>

          <div className="alert alert-info" role="alert">
            <p className="mb-0">
              Certaines fonctionnalités peuvent continuer à fonctionner en mode hors ligne si vous avez déjà visité les pages concernées.
            </p>
          </div>

          <button 
            onClick={handleRetry} 
            className="btn btn-primary btn-lg mt-3"
          >
            <FaSync className="me-2" /> Reconnecter
          </button>
        </ErrorComponent>
      </main>
      <Footer />
    </>
  );
};

export default OfflinePage;