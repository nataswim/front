// src/pages/visitor/PolicyPage.jsx 
// Politique de confidentialité 
// Explique comment le site collecte, utilise et protège les informations personnelles des visiteurs et utilisateurs

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUserShield, 
  FaShieldAlt, 
  FaFileAlt, 
  FaDatabase, 
  FaClipboardList,
  FaExchangeAlt,
  FaGlobeEurope,
  FaUserClock,
  FaBalanceScale,
  FaKey,
  FaLock,
  FaCogs,
  FaChild,
  FaEnvelope,
  FaBell,
  FaRegHandshake,
  FaCheck,
  FaServer,
  FaIdCard,
  FaRunning,
  FaHeartbeat,
  FaTools,
  FaChartLine,
  FaCreditCard,
  FaUser,
  FaComment
} from 'react-icons/fa';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

// Composant pour les cartes de sections
const PolicyCard = ({ icon: Icon, title, children }) => (
  <div className="card shadow-sm hover-lift border-0 mb-4">
    <div className="card-body p-4">
      <div className="d-flex align-items-center mb-3">
        <div className="bg-success-subtle p-3 rounded-circle me-3">
          <Icon className="text-success fs-3" />
        </div>
        <h3 className="h5 mb-0">{title}</h3>
      </div>
      <div className="text-muted">{children}</div>
    </div>
  </div>
);

// Composant pour les catégories de données
const DataCategoryCard = ({ icon: Icon, title, description }) => (
  <div className="card shadow-sm border-0">
    <div className="card-body p-4 text-center">
      <Icon className="text-success mb-3 fs-3" />
      <h4 className="h6 fw-bold">{title}</h4>
      <p className="small text-muted mb-0">{description}</p>
    </div>
  </div>
);

// Composant pour les droits
const RightCard = ({ icon: Icon, title, description }) => (
  <div className="card border-0 shadow-sm">
    <div className="card-body p-3">
      <div className="d-flex align-items-center mb-2">
        <div className="bg-success-subtle rounded-circle p-2 me-3">
          <Icon className="text-info" />
        </div>
        <h4 className="h6 mb-0">{title}</h4>
      </div>
      <p className="text-muted small mb-0">{description}</p>
    </div>
  </div>
);

const PolicyPage = () => {
  // Categories de données
  const dataCategories = [
    {
      icon: FaIdCard,
      title: "Données d'identification",
      description: "Nom, prénom, email, identifiants de connexion"
    },
    {
      icon: FaRunning,
      title: "Données de profil",
      description: "Âge, sexe, niveau, objectifs d'entraînement"
    },
    {
      icon: FaChartLine,
      title: "Données d'activité",
      description: "Performances, fréquence, progression"
    },
    {
      icon: FaHeartbeat,
      title: "Données de santé",
      description: "Fréquence cardiaque, calories (si fournies)"
    },
    {
      icon: FaTools,
      title: "Données techniques",
      description: "Adresse IP, navigateur, appareil utilisé"
    },
    {
      icon: FaServer,
      title: "Données d'utilisation",
      description: "Pages visitées, fonctionnalités utilisées"
    },
    {
      icon: FaCreditCard,
      title: "Données de transaction",
      description: "Historique des achats, abonnements"
    },
    {
      icon: FaComment,
      title: "Données de communication",
      description: "Messages, demandes de support"
    }
  ];

  // Droits des utilisateurs
  const userRights = [
    {
      icon: FaUserShield,
      title: "Droit d'accès",
      description: "Obtenir une copie de vos données"
    },
    {
      icon: FaClipboardList,
      title: "Droit de rectification",
      description: "Corriger des données inexactes"
    },
    {
      icon: FaDatabase,
      title: "Droit à l'effacement",
      description: "Faire supprimer vos données"
    },
    {
      icon: FaCogs,
      title: "Droit à la limitation",
      description: "Restreindre le traitement"
    },
    {
      icon: FaExchangeAlt,
      title: "Droit à la portabilité",
      description: "Recevoir vos données dans un format structuré"
    },
    {
      icon: FaBalanceScale,
      title: "Droit d'opposition",
      description: "Vous opposer au traitement"
    },
    {
      icon: FaBell,
      title: "Retrait du consentement",
      description: "Retirer votre consentement à tout moment"
    },
    {
      icon: FaRegHandshake,
      title: "Non-décision automatisée",
      description: "Ne pas faire l'objet d'une décision automatisée"
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
                  <FaShieldAlt className="me-3 fs-1" />
                  <h1 className="display-5 fw-bold mb-0">Politique de Confidentialité</h1>
                </div>
                <p className="lead mb-0">
                  Protection de votre vie privée et sécurité de vos données
                </p>
                <p className="mb-4">
                  Dernière mise à jour : 5 mars 2025
                </p>
              </div>
              <div className="col-lg-4 text-center">
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="h5 text-success mb-3">Résumé de notre politique</h3>
                  <p className="small text-dark mb-3">
                    Chez NSAPP, nous prenons la protection de vos données personnelles très au sérieux. Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
                  </p>
                  <p className="small text-dark mb-0">
                    Nous respectons pleinement le Règlement Général sur la Protection des Données (RGPD).
                  </p>
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
                  La présente politique de confidentialité s'applique à tous les utilisateurs de l'application et du site web NSAPP (ci-après "nos Services"). En utilisant nos Services, vous acceptez les pratiques décrites dans cette politique.
                </p>
                <p className="mb-4">
                  Si vous n'êtes pas d'accord avec cette politique, veuillez ne pas utiliser nos Services. Si vous avez des questions, n'hésitez pas à nous contacter aux coordonnées indiquées à la fin de ce document.
                </p>

                <div className="card p-4 mb-5 border-0 bg-light shadow-sm">
                  <h3 className="h5 fw-bold mb-3">2. Responsable du traitement</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-2"><strong>Raison sociale :</strong> NSAPP SAS</p>
                      <p className="mb-0"><strong>Adresse :</strong> 123 Rue Exemple, 75000 Paris, France</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-2"><strong>Email :</strong> privacy@nsapp.com</p>
                      <p className="mb-0"><strong>Délégué à la protection des données :</strong> DPO NSAPP (dpo@nsapp.com)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Données collectées */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="text-center mb-5">
                  <div className="d-inline-flex align-items-center mb-3">
                    <div className="bg-success p-2 rounded-circle me-3">
                      <FaDatabase className="text-white fs-4" />
                    </div>
                    <h2 className="h3 fw-bold mb-0">3. Données personnelles que nous collectons</h2>
                  </div>
                  <p className="text-muted mb-0">
                    Selon votre utilisation de nos Services, nous pouvons collecter les types de données suivants
                  </p>
                </div>

                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5">
                  {dataCategories.slice(0, 4).map((category, index) => (
                    <div key={index} className="col">
                      <DataCategoryCard 
                        icon={category.icon}
                        title={category.title}
                        description={category.description}
                      />
                    </div>
                  ))}
                </div>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5">
                  {dataCategories.slice(4).map((category, index) => (
                    <div key={index} className="col">
                      <DataCategoryCard 
                        icon={category.icon}
                        title={category.title}
                        description={category.description}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="alert alert-info mb-5">
                  <div className="d-flex">
                    <FaHeartbeat className="text-success me-3 fs-4 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="h6 fw-bold">Remarque importante concernant les données de santé</h4>
                      <p className="mb-0 small">
                        Certaines données collectées peuvent être considérées comme des données de santé selon le RGPD. Nous ne traitons ces données qu'avec votre consentement explicite et uniquement dans le but de vous fournir nos Services.
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="h3 fw-bold mb-4">4. Comment nous collectons vos données</h2>
                <div className="row row-cols-1 row-cols-md-2 g-4 mb-5">
                  <div className="col">
                    <div className="card shadow-sm border-0">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-success-subtle p-2 rounded-circle me-3">
                            <FaUser className="text-info" />
                          </div>
                          <h4 className="h6 mb-0">Directement auprès de vous</h4>
                        </div>
                        <p className="small text-muted mb-0">
                          Lorsque vous créez un compte, complétez votre profil, utilisez nos Services
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card shadow-sm border-0">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-success-subtle p-2 rounded-circle me-3">
                            <FaTools className="text-info" />
                          </div>
                          <h4 className="h6 mb-0">Automatiquement</h4>
                        </div>
                        <p className="small text-muted mb-0">
                          Via des cookies et technologies similaires lorsque vous utilisez notre site web et application
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card shadow-sm border-0">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-success-subtle p-2 rounded-circle me-3">
                            <FaHeartbeat className="text-info" />
                          </div>
                          <h4 className="h6 mb-0">Via des appareils connectés</h4>
                        </div>
                        <p className="small text-muted mb-0">
                          Que vous choisissez de synchroniser avec notre application (montres connectées, trackers d'activité)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card shadow-sm border-0">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-success-subtle p-2 rounded-circle me-3">
                            <FaRegHandshake className="text-info" />
                          </div>
                          <h4 className="h6 mb-0">Via des tiers</h4>
                        </div>
                        <p className="small text-muted mb-0">
                          Lorsque vous vous connectez via des services d'authentification tiers (Google, Facebook) ou des partenaires
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mb-5">
                  Pour plus d'informations sur notre utilisation des cookies, veuillez consulter notre <Link to="/legal/cookies-policy" className="text-decoration-none">Politique de Cookies</Link>.
                </p>

                <PolicyCard icon={FaBalanceScale} title="5. Bases légales du traitement">
                  <div className="row row-cols-1 row-cols-md-2 g-3">
                    <div className="col">
                      <div className="card border-0 bg-light">
                        <div className="card-body p-3">
                          <h5 className="h6 fw-bold mb-2">Exécution du contrat</h5>
                          <p className="small mb-0">Le traitement est nécessaire pour l'exécution de nos Services auxquels vous avez souscrit</p>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="card border-0 bg-light">
                        <div className="card-body p-3">
                          <h5 className="h6 fw-bold mb-2">Consentement</h5>
                          <p className="small mb-0">Vous nous avez donné votre consentement spécifique pour le traitement</p>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="card border-0 bg-light">
                        <div className="card-body p-3">
                          <h5 className="h6 fw-bold mb-2">Obligations légales</h5>
                          <p className="small mb-0">Le traitement est nécessaire pour respecter nos obligations légales</p>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="card border-0 bg-light">
                        <div className="card-body p-3">
                          <h5 className="h6 fw-bold mb-2">Intérêts légitimes</h5>
                          <p className="small mb-0">Le traitement est nécessaire aux fins de nos intérêts légitimes ou ceux d'un tiers</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </PolicyCard>

                <PolicyCard icon={FaCogs} title="6. Comment nous utilisons vos données">
                  <div className="row row-cols-1 row-cols-md-2 g-3">
                    <div className="col">
                      <div className="d-flex">
                        <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                        <p className="small mb-0">Fournir nos Services : inscription, authentification, accès aux fonctionnalités</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex">
                        <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                        <p className="small mb-0">Personnaliser votre expérience : contenus et programmes adaptés</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex">
                        <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                        <p className="small mb-0">Améliorer nos Services : analyser l'utilisation, résoudre les problèmes</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex">
                        <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                        <p className="small mb-0">Communiquer avec vous : informations, assistance, réponses</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex">
                        <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                        <p className="small mb-0">Marketing : vous informer sur nos offres (avec votre consentement)</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex">
                        <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                        <p className="small mb-0">Assurer la sécurité : détecter les fraudes, protéger nos systèmes</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex">
                        <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                        <p className="small mb-0">Respecter nos obligations légales : conformité avec les lois</p>
                      </div>
                    </div>
                  </div>
                </PolicyCard>

                <PolicyCard icon={FaExchangeAlt} title="7. Partage de vos données">
                  <p className="mb-3">
                    Nous pouvons partager vos données personnelles avec les catégories de destinataires suivantes :
                  </p>
                  <ul className="mb-3">
                    <li className="mb-2"><strong>Prestataires de services :</strong> Entreprises qui nous aident à fournir nos Services</li>
                    <li className="mb-2"><strong>Partenaires commerciaux :</strong> Dans le cadre de fonctionnalités spécifiques (avec votre consentement)</li>
                    <li className="mb-2"><strong>Entités du groupe :</strong> D'autres entités de notre groupe d'entreprises</li>
                    <li className="mb-2"><strong>Autorités publiques :</strong> Lorsque la loi l'exige ou pour protéger nos droits</li>
                    <li><strong>Acquéreurs potentiels :</strong> En cas de vente, fusion ou réorganisation de notre entreprise</li>
                  </ul>
                  <p className="mb-2">
                    <strong>Nous ne vendons pas vos données personnelles à des tiers.</strong>
                  </p>
                  <p className="mb-0 small text-muted">
                    Tous nos prestataires de services et partenaires sont tenus de respecter la confidentialité et la sécurité de vos données conformément au RGPD.
                  </p>
                </PolicyCard>

                <PolicyCard icon={FaGlobeEurope} title="8. Transferts internationaux de données">
                  <p className="mb-3">
                    Vos données personnelles peuvent être transférées et traitées dans des pays en dehors de l'Espace Économique Européen (EEE), notamment pour l'hébergement et le support technique.
                  </p>
                  <p className="mb-3">
                    Lorsque nous transférons vos données hors de l'EEE, nous nous assurons qu'elles bénéficient d'un niveau de protection approprié en utilisant :
                  </p>
                  <div className="row row-cols-1 row-cols-md-2 g-3 mb-3">
                    <div className="col">
                      <div className="d-flex">
                        <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                        <p className="small mb-0">Des pays bénéficiant d'une décision d'adéquation de la Commission européenne</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex">
                        <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                        <p className="small mb-0">Des clauses contractuelles types approuvées par la Commission</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex">
                        <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                        <p className="small mb-0">Des règles d'entreprise contraignantes pour les transferts internes</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex">
                        <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                        <p className="small mb-0">D'autres mécanismes de transfert approuvés par les autorités</p>
                      </div>
                    </div>
                  </div>
                  <p className="mb-0 small">
                    Vous pouvez nous contacter pour obtenir plus d'informations sur les garanties mises en place pour protéger vos données lors de ces transferts.
                  </p>
                </PolicyCard>

                <PolicyCard icon={FaUserClock} title="9. Conservation des données">
                  <p className="mb-3">
                    Nous conservons vos données personnelles uniquement pendant la durée nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées, ou pour nous conformer à nos obligations légales.
                  </p>
                  <div className="table-responsive mb-3">
                    <table className="table table-sm table-bordered mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Type de données</th>
                          <th>Durée de conservation</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Données de compte</strong></td>
                          <td>Pendant la durée de votre compte, puis 3 ans après sa fermeture</td>
                        </tr>
                        <tr>
                          <td><strong>Données d'activité</strong></td>
                          <td>Pendant la durée de votre compte, puis en version anonymisée</td>
                        </tr>
                        <tr>
                          <td><strong>Données de transaction</strong></td>
                          <td>10 ans pour les obligations comptables et fiscales</td>
                        </tr>
                        <tr>
                          <td><strong>Données de communication</strong></td>
                          <td>3 ans après le dernier contact</td>
                        </tr>
                        <tr>
                          <td><strong>Données techniques</strong></td>
                          <td>13 mois maximum</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mb-0 small">
                    À l'issue de ces périodes, vos données sont soit supprimées, soit anonymisées de manière irréversible.
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
                    <div className="bg-success p-2 rounded-circle me-3">
                      <FaUserShield className="text-white fs-4" />
                    </div>
                    <h2 className="h3 fw-bold mb-0">10. Vos Droits</h2>
                  </div>
                  <p className="text-muted mb-0">
                    Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles
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
                
                <div className="bg-light p-4 rounded shadow-sm mb-5">
                  <p className="mb-3">
                    Pour exercer ces droits, veuillez nous contacter aux coordonnées indiquées à la section "Nous contacter" ci-dessous.
                  </p>
                  <p className="mb-3 small">
                    Nous répondrons à votre demande dans un délai d'un mois, qui peut être prolongé de deux mois supplémentaires si nécessaire, compte tenu de la complexité et du nombre de demandes.
                  </p>
                  <p className="mb-0 small">
                    Si vous n'êtes pas satisfait de notre réponse, vous avez le droit d'introduire une réclamation auprès de la CNIL (www.cnil.fr) ou de toute autre autorité de protection des données compétente.
                  </p>
                </div>

                <PolicyCard icon={FaLock} title="11. Sécurité des données">
                  <p className="mb-3">
                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles :
                  </p>
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 mb-3">
                    <div className="col">
                      <div className="d-flex align-items-center">
                        <div className="bg-success-subtle p-2 rounded-circle me-2">
                          <FaKey className="text-success" />
                        </div>
                        <p className="mb-0 small">Chiffrement des données sensibles</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex align-items-center">
                        <div className="bg-success-subtle p-2 rounded-circle me-2">
                          <FaUserShield className="text-success" />
                        </div>
                        <p className="mb-0 small">Contrôles d'accès stricts</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex align-items-center">
                        <div className="bg-success-subtle p-2 rounded-circle me-2">
                          <FaDatabase className="text-success" />
                        </div>
                        <p className="mb-0 small">Sauvegardes régulières</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex align-items-center">
                        <div className="bg-success-subtle p-2 rounded-circle me-2">
                          <FaTools className="text-success" />
                        </div>
                        <p className="mb-0 small">Tests de sécurité périodiques</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex align-items-center">
                        <div className="bg-success-subtle p-2 rounded-circle me-2">
                          <FaUserClock className="text-success" />
                        </div>
                        <p className="mb-0 small">Formation de notre personnel</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex align-items-center">
                        <div className="bg-success-subtle p-2 rounded-circle me-2">
                          <FaClipboardList className="text-success" />
                        </div>
                        <p className="mb-0 small">Évaluation régulière des mesures</p>
                      </div>
                    </div>
                  </div>
                  <div className="alert alert-warning mb-0">
                    <p className="mb-0 small">
                      <strong>Note :</strong> Bien que nous mettions en œuvre les meilleures pratiques de sécurité, aucun système n'est totalement sécurisé. Nous ne pouvons donc pas garantir la sécurité absolue de vos données.
                    </p>
                  </div>
                </PolicyCard>

                <PolicyCard icon={FaChild} title="12. Protection des mineurs">
                  <p className="mb-3">
                    Nos Services ne sont pas destinés aux personnes de moins de 16 ans, et nous ne collectons pas sciemment des données personnelles auprès de mineurs de moins de 16 ans.
                  </p>
                  <p className="mb-0 small">
                    Si vous êtes un parent ou un tuteur et que vous pensez que votre enfant nous a fourni des données personnelles, veuillez nous contacter immédiatement. Si nous découvrons que nous avons collecté des données personnelles auprès d'un enfant sans vérification du consentement parental, nous prendrons des mesures pour supprimer ces informations de nos serveurs.
                  </p>
                </PolicyCard>

                <PolicyCard icon={FaBell} title="13. Modifications de cette politique">
                  <p className="mb-3">
                    Nous pouvons mettre à jour cette politique de confidentialité de temps à autre pour refléter des changements dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires.
                  </p>
                  <p className="mb-3">
                    En cas de modifications substantielles, nous vous en informerons par email ou par une notification sur notre site ou application avant que les modifications ne prennent effet.
                  </p>
                  <p className="mb-0 small">
                    La date de la dernière mise à jour est indiquée en haut de cette politique. Nous vous encourageons à consulter régulièrement cette politique pour rester informé.
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
                  Si vous avez des questions, des préoccupations ou des demandes concernant cette politique de confidentialité ou le traitement de vos données personnelles, veuillez nous contacter :
                </p>
                <div className="bg-white text-dark p-4 rounded shadow mb-4 text-start">
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-2 small"><strong>Responsable de la protection :</strong> DPO NSAPP</p>
                      <p className="mb-2 small"><strong>Email :</strong> <a href="mailto:privacy@nsapp.com" className="text-decoration-none">privacy@nsapp.com</a></p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-2 small"><strong>Adresse :</strong> NSAPP SAS - Service DPO, 123 Rue Exemple, 75000 Paris</p>
                      <p className="mb-0 small"><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PolicyPage;