// src/pages/visitor/PricingPage.jsx 
// Page publique accessible à tous les visiteurs
// Mettre en avant les différentes formules d'abonnement sans renouvellement automatique

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCheck, 
  FaSwimmer, 
  FaUserTie, 
  FaVideo, 
  FaCalendarAlt, 
  FaQuestionCircle,
  FaBook,
  FaDownload,
  FaPlayCircle,
  FaClock,
  FaMoneyBillWave,
  FaLightbulb
} from 'react-icons/fa';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

const PricingPage = () => {
  // Formules d'abonnement
  const subscriptionPlans = [
    {
      title: "12 mois",
      icon: <FaSwimmer className="text-primary" size={40} />,
      description: "Accès complet à tous les services pendant une année complète.",
      price: 6,
      duration: 12,
      totalPrice: 72,
      features: [
        "Paiement unique non récurrent",
        "Pas de Renouvellement Automatique",
        "Accès illimité à toutes les ressources",
        "Support prioritaire"
      ],
      buttonText: "Souscrire",
      buttonLink: "/register?plan=annual",
      popular: true,
      color: "primary"
    },
    {
      title: "6 mois",
      icon: <FaUserTie className="text-warning" size={40} />,
      description: "Solution intermédiaire avec tous les services pendant 6 mois.",
      price: 10,
      duration: 6,
      totalPrice: 60,
      features: [
        "Paiement unique non récurrent",
        "Pas de Renouvellement Automatique",
        "Accès illimité à toutes les ressources",
        "Support standard"
      ],
      buttonText: "Souscrire",
      buttonLink: "/register?plan=semestrial",
      popular: false,
      color: "warning"
    },
    {
      title: "3 mois",
      icon: <FaSwimmer className="text-danger" size={40} />,
      description: "Formule découverte avec tous les services pendant 3 mois.",
      price: 15,
      duration: 3,
      totalPrice: 45,
      features: [
        "Paiement unique non récurrent",
        "Pas de Renouvellement Automatique",
        "Accès illimité à toutes les ressources",
        "Support standard"
      ],
      buttonText: "Souscrire",
      buttonLink: "/register?plan=quarterly",
      popular: false,
      color: "danger"
    }
  ];

  // Avantages de la plateforme
  const platformBenefits = [
    {
      icon: <FaClock />,
      title: "Gagner du temps et de l'argent",
      description: "Des ressources conçues pour optimiser votre progression et améliorer rapidement vos performances."
    },
    {
      icon: <FaLightbulb />,
      title: "Souplesse et liberté d'utilisation",
      description: "Accédez à nos contenus quand vous voulez, où vous voulez, selon votre propre rythme."
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Qualité professionnelle",
      description: "Des contenus élaborés par des experts et professionnels reconnus dans le domaine de la natation."
    }
  ];

  // Ressources disponibles
  const availableResources = [
    {
      icon: <FaBook />,
      title: "Articles et Dossiers thématiques",
      description: "Une bibliothèque complète d'articles de fond et dossiers spécialisés."
    },
    {
      icon: <FaCalendarAlt />,
      title: "Fiches d'entraînement par niveau",
      description: "Des fiches d'exercices adaptées à tous les niveaux, du débutant au nageur confirmé."
    },
    {
      icon: <FaDownload />,
      title: "Documents téléchargeables",
      description: "E-books, fiches techniques et documents spécifiques à télécharger."
    },
    {
      icon: <FaPlayCircle />,
      title: "Vidéos d'exercices",
      description: "Bibliothèque de vidéos classées par domaine et spécialité, à visionner en ligne."
    },
    {
      icon: <FaCalendarAlt />,
      title: "Programmes et séances d'entraînement",
      description: "Plans complets et séances détaillées pour structurer votre progression."
    }
  ];

  

  return (
    <>
      <Header />
      <main className="bg-home">
        {/* Bannière */}
        <section className="bg-primary text-white py-5">
          <div className="container text-center">
            <h1 className="display-4 fw-bold mb-3">Choisir une formule d'Inscription</h1>
            <p className="lead mb-0">Choisissez la durée qui vous convient et accédez à la totalité des services</p>
          </div>
        </section>

        {/* Formules d'abonnement */}
        <section className="py-5">
          <div className="container">
            <div className="row justify-content-center mb-5">
              <div className="col-lg-8 text-center">
                <p className="lead mb-4">
                  Choisissez la durée qui vous convient : 12 / 6 / 3 mois, et accédez à la totalité des services sans dépenser davantage.
                </p>
              </div>
            </div>

            {/* Cartes de prix */}
            <div className="row g-4 justify-content-center mb-5">
              {subscriptionPlans.map((plan, index) => (
                <div key={index} className="col-lg-4 col-md-6">
                  <div className={`card h-100 border-${plan.popular ? plan.color : '0'} ${plan.popular ? 'shadow' : 'shadow-sm'}`}>
                    {plan.popular && (
                      <div className="card-header bg-primary text-white text-center py-3">
                        <span className="badge bg-white text-primary">Meilleure valeur</span>
                      </div>
                    )}
                    <div className="card-body p-4 text-center">
                      <div className="mb-3">
                        {plan.icon}
                      </div>
                      <h2 className="card-title h3 mb-2">{plan.title}</h2>
                      <p className="text-muted mb-3">{plan.description}</p>
                      
                      <div className="mb-3">
                        <span className="display-4 fw-bold">{plan.price}€</span>
                        <span className="text-muted">/mois</span>
                      </div>
                      
                      <div className="mb-4">
                        <span className="fw-bold text-primary">Paiement unique de {plan.totalPrice}€</span>
                      </div>
                      
                      <ul className="list-unstyled text-start mb-4">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="mb-2 d-flex align-items-center">
                            <FaCheck className="text-success me-2" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Link 
                        to={plan.buttonLink}
                        className={`btn btn-${plan.popular ? plan.color : 'outline-primary'} ${plan.popular ? 'btn-lg' : ''} w-100`}
                      >
                        {plan.buttonText}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        


        

        {/* CTA */}
        <section className="py-5 bg-primary text-white text-center">
          <div className="container">
            <h2 className="mb-4 fw-bold">Prêt  ?</h2>
            <p className="lead mb-4">
              Commencez aujourd'hui et accédez à toutes les ressources pour progresser.
            </p>
            <Link to="/register?plan=annual" className="btn btn-light btn-lg text-primary">
              S'inscrire maintenant
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PricingPage;