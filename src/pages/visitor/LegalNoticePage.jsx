// src/pages/legal/LegalNoticePage.jsx 
// Mentions légales obligatoires 
// Identification du professionnel 
// Conditions générales de vente (CGV) 
// Résiliation d'abonnement par voie électronique

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGavel, 
  FaBuilding, 
  FaServer, 
  FaCopyright, 
  FaLink, 
  FaExclamationTriangle,
  FaGlobeEurope,
  FaUniversalAccess,
  FaQuestionCircle,
  FaEnvelope
} from 'react-icons/fa';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

// Composant pour les sections d'information légale
const LegalSection = ({ icon: Icon, title, children }) => (
  <div className="card mb-5 border-0 shadow-sm">
    <div className="card-body p-4">
      <div className="d-flex align-items-center mb-3">
        <div className="bg-primary-subtle p-3 rounded-circle me-3">
          <Icon className="text-primary fs-3" />
        </div>
        <h3 className="h5 mb-0">{title}</h3>
      </div>
      {children}
    </div>
  </div>
);

const LegalNoticePage = () => {
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
                  <FaGavel className="me-3 fs-1" />
                  <h1 className="display-4 fw-bold mb-0">Mentions Légales</h1>
                </div>
                <p className="lead mb-0">
                  Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance en l'économie numérique, voici les informations légales concernant ce site.
                </p>
                <p className="mt-2 mb-0 opacity-75">
                  Dernière mise à jour : 5 mars 2025
                </p>
              </div>
              <div className="col-lg-4 text-center">
                <div className="bg-white p-4 rounded shadow-sm d-inline-block">
                  <FaBuilding className="text-primary" size={80} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="alert alert-info mb-5">
                  <div className="d-flex">
                    <div className="me-3">
                      <FaQuestionCircle className="text-primary fs-3" />
                    </div>
                    <div>
                      <p className="mb-0">
                        Les présentes mentions légales sont susceptibles d'être modifiées à tout moment. Nous vous invitons à les consulter régulièrement.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Éditeur du site */}
                <LegalSection icon={FaBuilding} title="Éditeur du site">
                  <div className="card p-4 bg-light border-0">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Raison sociale :</strong> SNS (6201Z)</p>
                        <p className="mb-1"><strong>Forme juridique :</strong> Entrepreneur individuel</p>
                        <p className="mb-1"><strong>Adresse du siège social :</strong> 45 AVENUE ALBERT CAMUS, 79200 PARTHENAY France</p>
                        <p className="mb-1"><strong>SIRET :</strong> 81003756400012</p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1"><strong>SIREN :</strong> 810037564</p>
                        <p className="mb-1"><strong>Numéro de TVA :</strong> FR28810037564</p>
                        <p className="mb-1"><strong>Directeur de la publication :</strong> MONSIEUR HASSAN EL HAOUAT</p>
                        <p className="mb-0"><strong>Contact :</strong> contact@"SNS".com</p>
                      </div>
                    </div>
                  </div>
                </LegalSection>

                {/* Hébergeur */}
                <LegalSection icon={FaServer} title="Hébergeur">
                  <div className="card p-4 bg-light border-0">
                    <p className="mb-1"><strong>Raison sociale :</strong> O2switch</p>
                    <p className="mb-1"><strong>Adresse :</strong> Chem. des Pardiaux, 63000 Clermont-Ferrand</p>
                    <p className="mb-0"><strong>Site web :</strong> https://www.o2switch.fr/</p>
                  </div>
                </LegalSection>

                {/* Propriété intellectuelle */}
                <LegalSection icon={FaCopyright} title="Propriété intellectuelle">
                  <p className="mb-3">
                    L'ensemble de ce site (structure, présentation, textes, logos, images, photographies, vidéos, sons, applications informatiques, etc.) constitue une œuvre protégée par la législation française et internationale relative à la propriété intellectuelle.
                  </p>
                  <p className="mb-3">
                    "SNS" est titulaire exclusif de tous les droits de propriété intellectuelle sur le site et son contenu. Sauf autorisation préalable et expresse de "SNS", toute représentation, reproduction, modification, publication ou adaptation de tout ou partie du site ou de son contenu, sur quelque support que ce soit et par quelque procédé que ce soit, est interdite.
                  </p>
                  <p className="mb-0">
                    Le non-respect de cette interdiction constitue une contrefaçon susceptible d'engager la responsabilité civile et pénale du contrefacteur.
                  </p>
                </LegalSection>

                {/* Liens hypertextes */}
                <LegalSection icon={FaLink} title="Liens hypertextes">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body p-4">
                          <h4 className="h6 mb-3 fw-bold">Liens vers notre site</h4>
                          <p className="mb-0">
                            La mise en place d'un lien hypertexte vers notre site nécessite une autorisation préalable et écrite. Veuillez nous contacter si vous souhaitez établir un lien vers notre site.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body p-4">
                          <h4 className="h6 mb-3 fw-bold">Liens depuis notre site</h4>
                          <p className="mb-0">
                            Notre site peut contenir des liens hypertextes redirigeant vers d'autres sites internet. "SNS" n'a pas la possibilité de vérifier le contenu de ces sites et n'assumera aucune responsabilité de ce fait quant aux contenus de ces sites.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </LegalSection>

                {/* Limitation de responsabilité */}
                <LegalSection icon={FaExclamationTriangle} title="Limitation de responsabilité">
                  <p className="mb-3">
                    "SNS" s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur son site. Cependant, "SNS" ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à la disposition sur ce site.
                  </p>
                  <p className="mb-3">
                    "SNS" décline toute responsabilité :
                  </p>
                  <div className="row">
                    <div className="col-md-6">
                      <ul className="mb-3">
                        <li>Pour toute interruption du site</li>
                        <li>Pour toute survenance de bogues</li>
                        <li>Pour toute inexactitude ou omission dans les informations disponibles sur ce site</li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className="mb-0">
                        <li>Pour tous dommages résultant d'une intrusion frauduleuse d'un tiers</li>
                        <li>Et plus généralement de tout dommage direct ou indirect, quelles qu'en soient les causes</li>
                      </ul>
                    </div>
                  </div>
                </LegalSection>

                {/* Gestion des données */}
                <LegalSection icon={FaGlobeEurope} title="Gestion des données personnelles">
                  <p className="mb-0">
                    Les informations concernant la collecte et le traitement des données personnelles sont détaillées dans notre <Link to="/politique-confidentialite" className="text-primary">Politique de Confidentialité</Link> et notre <Link to="/cookies" className="text-primary">Politique de Cookies</Link>.
                  </p>
                </LegalSection>

                {/* Droit applicable */}
                <LegalSection icon={FaGavel} title="Droit applicable et juridiction compétente">
                  <p className="mb-0">
                    Les présentes mentions légales sont régies par le droit français. En cas de litige relatif à l'interprétation ou à l'exécution des présentes, les tribunaux français seront seuls compétents.
                  </p>
                </LegalSection>

                {/* Accessibilité */}
                <LegalSection icon={FaUniversalAccess} title="Accessibilité">
                  <p className="mb-0">
                    Notre engagement en matière d'accessibilité est détaillé dans notre <Link to="/declaration-Accessibilite" className="text-primary">Déclaration d'Accessibilité</Link>.
                  </p>
                </LegalSection>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Contact */}
        <section className="py-5 bg-primary text-white text-center">
          <div className="container py-3">
            <h2 className="mb-4 fw-bold">Nous Contacter</h2>
            <p className="lead mb-4 mx-auto" style={{ maxWidth: "700px" }}>
              Pour toute question concernant les présentes mentions légales, n'hésitez pas à nous contacter.
            </p>
            <div className="d-flex justify-content-center">
              <Link to="/contact" className="btn btn-light text-primary btn-lg">
                <FaEnvelope className="me-2" />
                Contactez-nous
              </Link>
            </div>
            <p className="mt-4 small opacity-75">
              Ces mentions légales sont fournies à titre informatif.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default LegalNoticePage;