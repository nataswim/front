// src/pages/legal/Accessibility.jsx 
// Explique comment le site est accessible aux personnes handicapées
// Respect des exigences d'accessibilité fondamentales 

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUniversalAccess, 
  FaWheelchair, 
  FaEye, 
  FaCode, 
  FaHandsHelping, 
  FaHeadphonesAlt,
  FaMobileAlt,
  FaKeyboard,
  FaDesktop,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

// Composant pour les cartes de mesures d'accessibilité
const AccessibilityCard = ({ icon: Icon, title, items }) => (
  <div className="card h-100 border-0 shadow-sm hover-lift">
    <div className="card-body p-4">
      <div className="d-flex align-items-center mb-3">
        <div className="bg-primary-subtle p-3 rounded-circle me-3">
          <Icon className="text-primary fs-3" />
        </div>
        <h3 className="h5 mb-0">{title}</h3>
      </div>
      <ul className="mb-0">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  </div>
);

// Composant pour les technologies d'assistance
const AssistiveTechCard = ({ icon: Icon, title, description }) => (
  <div className="d-flex mb-4">
    <div className="flex-shrink-0">
      <div className="bg-primary text-white p-3 rounded-circle d-flex align-items-center justify-content-center" style={{width: '56px', height: '56px'}}>
        <Icon className="fs-4" />
      </div>
    </div>
    <div className="ms-3">
      <h3 className="h6 mb-2">{title}</h3>
      <p className="text-muted mb-0 small">{description}</p>
    </div>
  </div>
);

const Accessibility = () => {
  // Mesures d'accessibilité
  const accessibilityMeasures = [
    {
      icon: FaCode,
      title: "Navigation et Structure",
      items: [
        "Structure du contenu avec des éléments HTML sémantiques appropriés",
        "Navigation cohérente à travers le site",
        "Titres hiérarchiques pour faciliter la navigation avec les lecteurs d'écran",
        "Liens explicites avec des descriptions claires de leur destination"
      ]
    },
    {
      icon: FaEye,
      title: "Présentation Visuelle",
      items: [
        "Contraste de couleur suffisant entre le texte et l'arrière-plan",
        "Design responsive qui s'adapte à différentes tailles d'écran",
        "Aucune information transmise uniquement par la couleur",
        "Évitement des contenus clignotants qui pourraient causer des crises d'épilepsie"
      ]
    },
    {
      icon: FaDesktop,
      title: "Contenu Non Textuel",
      items: [
        "Textes alternatifs pour toutes les images informatives",
        "Sous-titres pour les contenus vidéo",
        "Transcriptions pour les contenus audio",
        "Descriptions détaillées pour les graphiques et les diagrammes complexes"
      ]
    },
    {
      icon: FaKeyboard,
      title: "Formulaires et Interaction",
      items: [
        "Étiquettes explicites pour tous les champs de formulaire",
        "Messages d'erreur clairs et instructions pour corriger les erreurs",
        "Temps suffisant pour lire et utiliser le contenu",
        "Possibilité de naviguer et de soumettre les formulaires au clavier"
      ]
    }
  ];

  // Technologies d'assistance
  const assistiveTechnologies = [
    {
      icon: FaHeadphonesAlt,
      title: "Lecteurs d'écran",
      description: "Notre site est conçu pour fonctionner avec JAWS, NVDA, VoiceOver et TalkBack, permettant aux personnes malvoyantes de naviguer facilement."
    },
    {
      icon: FaEye,
      title: "Logiciels de grossissement",
      description: "Compatibilité avec les logiciels qui agrandissent l'écran, facilitant la lecture pour les personnes ayant une vision partielle."
    },
    {
      icon: FaMobileAlt,
      title: "Reconnaissance vocale",
      description: "Support des logiciels de reconnaissance vocale pour permettre aux utilisateurs de naviguer sans clavier ni souris."
    },
    {
      icon: FaKeyboard,
      title: "Alternatives de saisie",
      description: "Compatibilité avec les alternatives au clavier et à la souris pour les personnes à mobilité réduite."
    }
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary text-white py-5">
          <div className="container py-3">
            <div className="row align-items-center">
              <div className="col-lg-8 mb-4 mb-lg-0">
                <div className="d-flex align-items-center mb-3">
                  <FaUniversalAccess className="me-3 fs-1" />
                  <h1 className="display-4 fw-bold mb-0">Déclaration d'Accessibilité</h1>
                </div>
                <p className="lead mb-0">
                  Chez "SNS", nous nous engageons à rendre notre site web et notre application accessibles à tous les utilisateurs, quelles que soient leurs capacités ou leur situation de handicap.
                </p>
              </div>
              <div className="col-lg-4 text-center">
                <div className="bg-white p-4 rounded shadow-sm d-inline-block">
                  <FaWheelchair className="text-primary" size={80} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notre engagement */}
        <section className="py-5">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="fw-bold mb-4">Notre Engagement</h2>
                <p className="lead text-muted mb-5">
                  Nous nous efforçons de respecter les normes WCAG (Web Content Accessibility Guidelines) 2.1 de niveau AA. Ces directives internationales aident à rendre le contenu web plus accessible aux personnes handicapées.
                </p>
              </div>
            </div>

            <div className="row g-4">
              {accessibilityMeasures.map((measure, index) => (
                <div key={index} className="col-md-6">
                  <AccessibilityCard 
                    icon={measure.icon}
                    title={measure.title}
                    items={measure.items}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies d'assistance */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="fw-bold mb-4">Technologies d'Assistance Compatibles</h2>
                <p className="lead text-muted mb-5">
                  Notre site est conçu pour être compatible avec un large éventail de technologies d'assistance
                </p>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-8 mx-auto">
                <div className="row">
                  {assistiveTechnologies.map((tech, index) => (
                    <div key={index} className="col-md-6">
                      <AssistiveTechCard 
                        icon={tech.icon}
                        title={tech.title}
                        description={tech.description}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Limitations et améliorations */}
        <section className="py-5">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 mx-auto">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-warning-subtle p-3 rounded-circle me-3">
                            <FaExclamationTriangle className="text-warning fs-4" />
                          </div>
                          <h3 className="h5 mb-0">Limitations Connues</h3>
                        </div>
                        <p className="text-muted mb-3">
                          Malgré nos efforts, certaines parties de notre site peuvent ne pas être pleinement accessibles. Nous travaillons activement à améliorer ces aspects :
                        </p>
                        <ul className="mb-0">
                          <li>Certains contenus tiers intégrés peuvent ne pas respecter les mêmes normes d'accessibilité</li>
                          <li>Certaines visualisations de données complexes peuvent être difficiles à percevoir pour les utilisateurs de lecteurs d'écran</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-success-subtle p-3 rounded-circle me-3">
                            <FaCheckCircle className="text-success fs-4" />
                          </div>
                          <h3 className="h5 mb-0">Amélioration Continue</h3>
                        </div>
                        <p className="text-muted mb-3">
                          Notre site est régulièrement testé pour l'accessibilité en utilisant :
                        </p>
                        <ul className="mb-0">
                          <li>Des outils automatisés de vérification d'accessibilité</li>
                          <li>Des tests d'utilisabilité avec des personnes handicapées</li>
                          <li>Des évaluations d'experts en accessibilité</li>
                        </ul>
                        <p className="mt-3 mb-0">
                          Nous nous engageons à améliorer continuellement l'accessibilité de notre site en fonction des retours des utilisateurs et des évolutions des normes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conformité */}
        <section className="py-5 bg-primary text-white text-center">
          <div className="container py-3">
            <h2 className="mb-4 fw-bold">Conformité</h2>
            <p className="lead mb-3 mx-auto" style={{ maxWidth: "700px" }}>
              Cette déclaration d'accessibilité a été établie le 5 mars 2025 et est régulièrement mise à jour.
            </p>
            <p className="mx-auto" style={{ maxWidth: "700px" }}>
              Nous nous engageons à respecter les exigences légales en matière d'accessibilité numérique conformément à la directive européenne 2016/2102 et aux réglementations nationales applicables.
            </p>
            <div className="mt-4">
              <Link to="/contact" className="btn btn-light text-primary">
                <FaHandsHelping className="me-2" />
                Nous signaler un problème d'accessibilité
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Accessibility;