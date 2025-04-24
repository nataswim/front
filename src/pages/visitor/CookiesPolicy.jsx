// src/pages/visitor/CookiesPolicy.jsx 
// Traitement des données personnelles et utilisation de cookies
// Conformité aux exigences légales du RGPD 
// Information transparente et détaillée pour les utilisateurs.

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCookieBite, 
  FaShieldAlt, 
  FaUserShield, 
  FaDatabase, 
  FaClipboardList,
  FaExchangeAlt,
  FaGlobeEurope,
  FaUserClock,
  FaBalanceScale,
  FaKey,
  FaLock,
  FaCogs,
  FaHistory,
  FaEnvelope,
  FaBell,
  FaInfo,
  FaCheck
} from 'react-icons/fa';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

// Composant pour les cartes de sections
const PolicyCard = ({ icon: Icon, title, children }) => (
  <div className="card shadow-sm hover-lift border-0 mb-4">
    <div className="card-body p-4">
      <div className="d-flex align-items-center mb-3">
        <div className="bg-primary-subtle p-3 rounded-circle me-3">
          <Icon className="text-primary fs-3" />
        </div>
        <h3 className="h5 mb-0">{title}</h3>
      </div>
      <div className="text-muted">{children}</div>
    </div>
  </div>
);

// Composant pour les cartes des types de cookies
const CookieTypeCard = ({ type, purpose, duration }) => (
  <div className="card shadow-sm border-0 mb-3">
    <div className="card-body p-4">
      <h4 className="h6 fw-bold mb-3">{type}</h4>
      <p className="mb-2 small">{purpose}</p>
      <div className="d-flex align-items-center">
        <FaHistory className="text-primary me-2" />
        <span className="text-muted small">{duration}</span>
      </div>
    </div>
  </div>
);

// Composant pour les droits
const RightCard = ({ icon: Icon, title, description }) => (
  <div className="card border-0 shadow-sm mb-3">
    <div className="card-body p-3">
      <div className="d-flex align-items-center mb-2">
        <div className="bg-primary-subtle rounded-circle p-2 me-3">
          <Icon className="text-primary" />
        </div>
        <h4 className="h6 mb-0">{title}</h4>
      </div>
      <p className="text-muted small mb-0">{description}</p>
    </div>
  </div>
);

const CookiesPolicy = () => {
  // Types de cookies
  const cookieTypes = [
    {
      type: "Cookies Essentiels",
      purpose: "Nécessaires au fonctionnement du site. Ils permettent d'utiliser les principales fonctionnalités, comme l'accès à votre compte.",
      duration: "Session / Persistants (1 an max)"
    },
    {
      type: "Cookies de Fonctionnalité",
      purpose: "Permettent de mémoriser vos préférences et de personnaliser votre expérience (langue, région, paramètres d'affichage).",
      duration: "Persistants (1 an max)"
    },
    {
      type: "Cookies Analytiques",
      purpose: "Nous aident à comprendre comment vous interagissez avec le site, à mesurer l'audience et à améliorer le site.",
      duration: "Persistants (2 ans max)"
    },
    {
      type: "Cookies de Marketing",
      purpose: "Utilisés pour suivre les visiteurs sur les sites web et afficher des publicités pertinentes.",
      duration: "Persistants (1 an max)"
    }
  ];

  // Droits des utilisateurs
  const userRights = [
    {
      icon: FaUserShield,
      title: "Droit d'accès",
      description: "Obtenir une copie de vos données personnelles que nous détenons"
    },
    {
      icon: FaClipboardList,
      title: "Droit de rectification",
      description: "Corriger des données inexactes ou incomplètes vous concernant"
    },
    {
      icon: FaDatabase,
      title: "Droit à l'effacement",
      description: "Demander la suppression de vos données dans certaines conditions"
    },
    {
      icon: FaCogs,
      title: "Droit à la limitation",
      description: "Restreindre le traitement de vos données personnelles"
    },
    {
      icon: FaExchangeAlt,
      title: "Droit à la portabilité",
      description: "Recevoir vos données dans un format structuré et lisible"
    },
    {
      icon: FaBalanceScale,
      title: "Droit d'opposition",
      description: "S'opposer au traitement de vos données pour certains motifs"
    },
    {
      icon: FaBell,
      title: "Retrait du consentement",
      description: "Retirer votre consentement à tout moment pour les traitements basés sur celui-ci"
    },
    {
      icon: FaInfo,
      title: "Droit de réclamation",
      description: "Déposer une plainte auprès d'une autorité de contrôle de la protection des données"
    }
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary text-white py-5">
          <div className="container py-4">
            <div className="row align-items-center">
              <div className="col-lg-8 mb-4 mb-lg-0">
                <div className="d-flex align-items-center mb-3">
                  <FaCookieBite className="me-3 fs-1" />
                  <h1 className="display-5 fw-bold mb-0">Politique de Cookies</h1>
                </div>
                <p className="lead mb-0">
                  Transparence et protection de vos données personnelles
                </p>
                <p className="mb-4">
                  Dernière mise à jour : 5 mars 2025
                </p>
              </div>
              <div className="col-lg-4 text-center">
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="h5 text-primary mb-3">Résumé Simplifié</h3>
                  <ul className="list-unstyled mb-0 text-start">
                    <li className="mb-2 d-flex align-items-start">
                      <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                      <span className="text-dark small">Nous utilisons des cookies pour améliorer votre expérience</span>
                    </li>
                    <li className="mb-2 d-flex align-items-start">
                      <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                      <span className="text-dark small">Vos données sont traitées dans le respect du RGPD</span>
                    </li>
                    <li className="mb-2 d-flex align-items-start">
                      <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                      <span className="text-dark small">Vous pouvez gérer vos préférences à tout moment</span>
                    </li>
                    <li className="mb-2 d-flex align-items-start">
                      <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                      <span className="text-dark small">Nous ne vendons pas vos données à des tiers</span>
                    </li>
                    <li className="d-flex align-items-start">
                      <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                      <span className="text-dark small">Vous avez des droits sur vos données</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <h2 className="h3 fw-bold mb-4">1. Introduction</h2>
                <p className="mb-4">
                  La présente politique de cookies et de traitement des données personnelles décrit la manière dont "SNS" (ci-après "nous", "notre", "nos") collecte, utilise et partage les informations, y compris vos données personnelles, lorsque vous utilisez notre site web et notre application mobile.
                </p>
                <p className="mb-4">
                  Cette politique vise à vous informer sur vos droits et sur la façon dont vos données sont protégées conformément au Règlement Général sur la Protection des Données (RGPD) et autres lois applicables sur la protection des données.
                </p>

                <PolicyCard icon={FaCookieBite} title="2. Qu'est-ce qu'un Cookie ?">
                  <p className="mb-3">
                    Un cookie est un petit fichier texte placé sur votre appareil (ordinateur, tablette, smartphone) lorsque vous visitez un site web. Les cookies permettent au site de reconnaître votre appareil et de mémoriser certaines informations sur votre visite, comme vos préférences de langue ou vos informations de connexion.
                  </p>
                  <p className="mb-0">
                    Les cookies peuvent être "persistants" ou "de session". Les cookies persistants restent sur votre appareil jusqu'à ce qu'ils expirent ou que vous les supprimiez, tandis que les cookies de session sont supprimés dès que vous fermez votre navigateur.
                  </p>
                </PolicyCard>
              </div>
            </div>
          </div>
        </section>

        {/* Types de Cookies */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="text-center mb-5">
                  <div className="d-inline-flex align-items-center mb-3">
                    <div className="bg-primary p-2 rounded-circle me-3">
                      <FaDatabase className="text-white fs-4" />
                    </div>
                    <h2 className="h3 fw-bold mb-0">3. Types de Cookies Utilisés</h2>
                  </div>
                  <p className="text-muted mb-0">
                    Découvrez les différents types de cookies que nous utilisons et leur finalité
                  </p>
                </div>

                <div className="row row-cols-1 row-cols-md-2 g-4 mb-5">
                  {cookieTypes.map((cookie, index) => (
                    <div key={index} className="col">
                      <CookieTypeCard 
                        type={cookie.type}
                        purpose={cookie.purpose}
                        duration={cookie.duration}
                      />
                    </div>
                  ))}
                </div>

                <h2 className="h3 fw-bold mb-4">4. Données Personnelles Collectées</h2>
                <p className="mb-3">
                  Nous collectons différents types de données personnelles, selon votre interaction avec notre plateforme :
                </p>
                <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
                  <div className="col">
                    <div className="card shadow-sm border-0">
                      <div className="card-body p-4 text-center">
                        <FaUserShield className="text-primary mb-3 fs-3" />
                        <h4 className="h6 fw-bold">Données d'identification</h4>
                        <p className="small text-muted mb-0">Nom, prénom, adresse email</p>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card shadow-sm border-0">
                      <div className="card-body p-4 text-center">
                        <FaCogs className="text-primary mb-3 fs-3" />
                        <h4 className="h6 fw-bold">Données techniques</h4>
                        <p className="small text-muted mb-0">Adresse IP, navigateur, appareil</p>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card shadow-sm border-0">
                      <div className="card-body p-4 text-center">
                        <FaGlobeEurope className="text-primary mb-3 fs-3" />
                        <h4 className="h6 fw-bold">Données de navigation</h4>
                        <p className="small text-muted mb-0">Pages visitées, temps passé</p>
                      </div>
                    </div>
                  </div>
                </div>

                <PolicyCard icon={FaClipboardList} title="5. Finalités du Traitement">
                  <ul className="mb-0">
                    <li className="mb-2">Fournir et améliorer nos services</li>
                    <li className="mb-2">Personnaliser votre expérience utilisateur</li>
                    <li className="mb-2">Analyser l'utilisation de notre site et application</li>
                    <li className="mb-2">Communiquer avec vous (notifications, assistance)</li>
                    <li className="mb-2">Assurer la sécurité de notre plateforme</li>
                    <li>Répondre à des obligations légales</li>
                  </ul>
                </PolicyCard>

                <PolicyCard icon={FaBalanceScale} title="6. Base Légale du Traitement">
                  <div className="row">
                    <div className="col-md-6">
                      <p className="fw-semibold mb-1">Exécution d'un contrat</p>
                      <p className="small mb-3">Lorsque le traitement est nécessaire à l'exécution de nos services</p>
                    </div>
                    <div className="col-md-6">
                      <p className="fw-semibold mb-1">Consentement</p>
                      <p className="small mb-3">Lorsque vous avez donné votre consentement explicite</p>
                    </div>
                    <div className="col-md-6">
                      <p className="fw-semibold mb-1">Intérêt légitime</p>
                      <p className="small mb-3">Lorsque nous avons un intérêt commercial légitime</p>
                    </div>
                    <div className="col-md-6">
                      <p className="fw-semibold mb-1">Obligation légale</p>
                      <p className="small mb-0">Lorsque nous devons nous conformer à une obligation légale</p>
                    </div>
                  </div>
                </PolicyCard>

                <PolicyCard icon={FaExchangeAlt} title="7. Partage de Vos Données">
                  <p className="mb-3">
                    Nous ne partageons pas vos données.
                  </p>
                  <p className="mb-0">
                    Nous ne vendons pas vos données personnelles à des tiers. En cas où nous partageons vos données avec des prestataires, nous nous assurons qu'ils respectent des normes de sécurité et de confidentialité conformes au RGPD.
                  </p>
                </PolicyCard>
              </div>
            </div>
          </div>
        </section>

        {/* Vos Droits */}
        <section className="py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="text-center mb-5">
                  <div className="d-inline-flex align-items-center mb-3">
                    <div className="bg-primary p-2 rounded-circle me-3">
                      <FaUserShield className="text-white fs-4" />
                    </div>
                    <h2 className="h3 fw-bold mb-0">8. Vos Droits</h2>
                  </div>
                  <p className="text-muted mb-0">
                    En vertu du RGPD, vous disposez des droits suivants concernant vos données personnelles
                  </p>
                </div>

                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mb-5">
                  {userRights.slice(0, 4).map((right, index) => (
                    <div key={index} className="col">
                      <RightCard 
                        icon={right.icon}
                        title={right.title}
                        description={right.description}
                      />
                    </div>
                  ))}
                </div>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mb-5">
                  {userRights.slice(4).map((right, index) => (
                    <div key={index} className="col">
                      <RightCard 
                        icon={right.icon}
                        title={right.title}
                        description={right.description}
                      />
                    </div>
                  ))}
                </div>
                
                <p className="text-center mb-5">
                  Pour exercer ces droits, veuillez nous contacter aux coordonnées indiquées à la fin de ce document.
                </p>

                <PolicyCard icon={FaCogs} title="9. Gestion des Cookies">
                  <p className="mb-3">
                    Vous pouvez gérer vos préférences en matière de cookies en modifiant les paramètres de votre navigateur pour bloquer ou supprimer les cookies.
                  </p>
                  <div className="alert alert-info mb-0">
                    <p className="mb-0">
                      <strong>Note</strong> : La désactivation de certains cookies peut affecter la fonctionnalité de notre site et limiter votre capacité à utiliser certaines fonctionnalités.
                    </p>
                  </div>
                </PolicyCard>

                <PolicyCard icon={FaLock} title="10. Sécurité des Données">
                  <p className="mb-3">
                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre la perte, l'accès non autorisé, la divulgation, l'altération et la destruction, notamment :
                  </p>
                  <div className="row row-cols-1 row-cols-md-3 g-3">
                    <div className="col">
                      <div className="d-flex align-items-center">
                        <FaKey className="text-primary me-2" />
                        <p className="mb-0 small">Chiffrement des données sensibles</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex align-items-center">
                        <FaUserShield className="text-primary me-2" />
                        <p className="mb-0 small">Contrôles d'accès stricts</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex align-items-center">
                        <FaDatabase className="text-primary me-2" />
                        <p className="mb-0 small">Formation sur la protection des données</p>
                      </div>
                    </div>
                  </div>
                </PolicyCard>

                <PolicyCard icon={FaUserClock} title="11. Conservation des Données">
                  <p className="mb-3">
                    Nous conservons vos données personnelles aussi longtemps que nécessaire pour atteindre les finalités pour lesquelles elles ont été collectées, sauf si une période de conservation plus longue est requise ou permise par la loi.
                  </p>
                  <p className="mb-3">
                    Les critères utilisés pour déterminer nos délais de conservation incluent :
                  </p>
                  <ul className="mb-0">
                    <li className="mb-2">La durée pendant laquelle nous entretenons une relation avec vous</li>
                    <li className="mb-2">Nos obligations légales</li>
                    <li className="mb-2">Les recommandations des autorités de protection des données</li>
                    <li>Les délais de prescription applicables</li>
                  </ul>
                </PolicyCard>

                <PolicyCard icon={FaGlobeEurope} title="12. Transferts Internationaux de Données">
                  <p className="mb-3">
                    Vos données personnelles peuvent être transférées et traitées dans des pays autres que celui dans lequel vous résidez. Ces pays peuvent avoir des lois différentes sur la protection des données.
                  </p>
                  <p className="mb-3">
                    Lorsque nous transférons des données vers des pays en dehors de l'Espace Économique Européen, nous nous assurons qu'un niveau de protection adéquat est en place, conformément aux exigences du RGPD, par l'utilisation de :
                  </p>
                  <div className="row row-cols-1 row-cols-md-2 g-3">
                    <div className="col">
                      <div className="d-flex align-items-center">
                        <FaCheck className="text-success me-2" />
                        <p className="mb-0 small">Décisions d'adéquation de la Commission européenne</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex align-items-center">
                        <FaCheck className="text-success me-2" />
                        <p className="mb-0 small">Clauses contractuelles types</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex align-items-center">
                        <FaCheck className="text-success me-2" />
                        <p className="mb-0 small">Règles d'entreprise contraignantes</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex align-items-center">
                        <FaCheck className="text-success me-2" />
                        <p className="mb-0 small">Autres mécanismes de transfert approuvés</p>
                      </div>
                    </div>
                  </div>
                </PolicyCard>

                <PolicyCard icon={FaBell} title="13. Modifications de la Politique">
                  <p className="mb-3">
                    Nous pouvons mettre à jour cette politique de temps à autre pour refléter les changements dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires. Nous vous encourageons à consulter régulièrement cette page pour rester informé des changements.
                  </p>
                  <p className="mb-0">
                    En cas de modifications substantielles, nous vous en informerons par email ou par une notification visible sur notre site.
                  </p>
                </PolicyCard>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-5 bg-primary text-white">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <div className="mb-4">
                  <FaEnvelope className="fs-1" />
                </div>
                <h2 className="h3 fw-bold mb-4">14. Nous Contacter</h2>
                <p className="mb-4">
                  Si vous avez des questions, des préoccupations ou des demandes concernant cette politique ou le traitement de vos données personnelles, veuillez nous contacter.
                </p>
                <p className="mb-4">
                  Si vous n'êtes pas satisfait de notre réponse, vous avez le droit de déposer une plainte auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) ou de toute autre autorité de protection des données compétente.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CookiesPolicy;