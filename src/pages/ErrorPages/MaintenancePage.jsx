import React from 'react';
import { FaTools, FaClock, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';

/**
 * Page de maintenance
 * Affichée lorsque le site est en maintenance programmée
 * Cette page est statique (sans Header ni Footer) car elle est destinée à être affichée
 * lorsque le reste de l'application n'est pas disponible
 */
const MaintenancePage = () => {
  // Paramètres de maintenance (à configurer selon les besoins)
  const maintenanceInfo = {
    startTime: "8:00",
    endTime: "10:00",
    date: "18 mars 2025",
    reason: "mise à jour de sécurité et améliorations des performances",
  };

  return (
    <div className="maintenance-page min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-sm border-0">
              <div className="card-body p-md-5 p-4">
                <div className="text-center mb-4">
                  {/* Logo de l'application */}
                  <img 
                    src="/assets/images/logo/nataswim_app_logo_1.png"
                    alt="NSAPP Logo"
                    height="120"
                    className="mb-4"
                  />
                  
                  <div className="maintenance-icon text-warning display-1 mb-3">
                    <FaTools />
                  </div>
                  
                  <h1 className="fw-bold text-primary mb-3">Site en maintenance</h1>
                  
                  <p className="lead mb-4">
                    Notre équipe effectue actuellement une {maintenanceInfo.reason}.
                    Nous serons de retour très bientôt !
                  </p>
                </div>
                
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <div className="card bg-info bg-opacity-10 border-0 h-100">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-3">
                          <FaClock className="text-info me-3 fs-3" />
                          <h5 className="card-title mb-0">Durée estimée</h5>
                        </div>
                        <p className="card-text">
                          Maintenance prévue de {maintenanceInfo.startTime} à {maintenanceInfo.endTime}.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="card bg-info bg-opacity-10 border-0 h-100">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-3">
                          <FaCalendarAlt className="text-info me-3 fs-3" />
                          <h5 className="card-title mb-0">Date</h5>
                        </div>
                        <p className="card-text">
                          {maintenanceInfo.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="alert alert-warning d-flex" role="alert">
                  <FaExclamationTriangle className="text-warning me-3 fs-4 mt-1" />
                  <div>
                    <h5 className="alert-heading">Important</h5>
                    <p className="mb-0">
                      Aucune donnée ne sera perdue pendant cette maintenance. 
                      Veuillez revenir plus tard et nous vous remercions de votre patience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center text-muted mt-4">
              <p className="small mb-0">
                © {new Date().getFullYear()} NSAPP - Pour toute urgence, contactez notre support à 
                <a href="mailto:support@nataswim.net" className="text-decoration-none"> support@nataswim.net</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;