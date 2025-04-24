// src/pages/visitor/FeaturesPage.jsx
// Page des fonctionnalités de l'application d'entraînement de natation

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSwimmer, 
  FaChartLine, 
  FaMobileAlt, 
  FaCalendarAlt, 
  FaVideo, 
  FaUsers, 
  FaClipboardCheck,
  FaBrain,
  FaHeartbeat,
  FaTrophy,
  FaChevronRight,
  FaCheckCircle,
  FaDumbbell,
  FaTachometerAlt,
  FaStopwatch,
  FaListAlt,
  FaClipboardList,
  FaRegLightbulb,
  FaUserCog,
  FaDatabase,
  FaSwimmingPool,
  FaWater
} from 'react-icons/fa';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';

// Composant pour les cartes des fonctionnalités principales
const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="card h-100 shadow-sm hover-lift border-0">
    <div className="card-body text-center p-4">
      <div className={`bg-${color || 'primary'}-subtle p-3 rounded-circle d-inline-flex align-items-center justify-content-center mb-3`} style={{width: '100px', height: '100px'}}>
        <Icon size={50} className={`text-${color || 'primary'}`} />
      </div>
      <h3 className="h4 mb-3">{title}</h3>
      <p className="text-muted">{description}</p>
    </div>
  </div>
);

// Composant pour les cartes des fonctionnalités secondaires
const SecondaryFeatureCard = ({ icon: Icon, title, description }) => (
  <div className="card h-100 shadow-sm border-0 hover-lift">
    <div className="card-body p-4">
      <div className="d-flex align-items-center mb-3">
        <div className="bg-primary-subtle p-3 rounded-circle d-inline-block mb-3">
          <Icon className="text-light" size={24} />
        </div>
        <h3 className="h5 mb-0">{title}</h3>
      </div>
      <p className="text-muted mb-0">{description}</p>
    </div>
  </div>
);

// Composant pour les témoignages
const TestimonialCard = ({ quote, name, role }) => (
  <div className="card h-100 border-0 shadow-sm">
    <div className="card-body p-4">
      <div className="mb-3">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-warning">★</span>
        ))}
      </div>
      <p className="mb-4 fst-italic">"{quote}"</p>
      <div className="d-flex align-items-center">
        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '45px', height: '45px'}}>
          <span className="fw-bold">{name.charAt(0)}</span>
        </div>
        <div>
          <h5 className="mb-0 fw-semibold">{name}</h5>
          <small className="text-muted">{role}</small>
        </div>
      </div>
    </div>
  </div>
);

// Composant principal de la page Fonctionnalités
const FeaturesPage = () => {
  // Fonctionnalités principales avec icônes mises à jour et descriptions améliorées
  const mainFeatures = [
    {
      icon: FaSwimmingPool,
      title: "Planification avancée",
      description: "Créez et personnalisez des plans d'entraînement détaillés adaptés à votre niveau, vos objectifs et votre emploi du temps. Organisez vos séances de manière optimale.",
      color: "primary"
    },
    {
      icon: FaChartLine,
      title: "Suivi de performance",
      description: "Suivez en temps réel votre progression avec des statistiques détaillées, des graphiques d'évolution et des analyses comparatives pour optimiser vos performances.",
      color: "success"
    },
    {
      icon: FaClipboardList,
      title: "Bibliothèque d'exercices",
      description: "Accédez à une bibliothèque complète d'exercices techniques spécifiques à la natation, classés par niveau, style et objectif d'entraînement.",
      color: "danger"
    },
    {
      icon: FaStopwatch,
      title: "Gestion des séries",
      description: "Créez et suivez des séries de natation personnalisées avec contrôle précis des distances, répétitions, intensités et temps de récupération.",
      color: "info"
    }
  ];

  // Fonctionnalités plus spécifiques avec descriptions détaillées
  const specificFeatures = [
    {
      icon: FaDumbbell,
      title: "Entraînement technique",
      description: "Améliorez votre technique de nage grâce à des exercices ciblés pour chaque style: crawl, brasse, dos et papillon."
    },
    {
      icon: FaTachometerAlt,
      title: "Analyse de vitesse",
      description: "Mesurez et analysez vos performances par section de nage, identifiez vos points forts et vos opportunités d'amélioration."
    },
    {
      icon: FaHeartbeat,
      title: "Gestion de l'intensité",
      description: "Contrôlez l'intensité de vos entraînements grâce à des indicateurs de fréquence cardiaque et d'effort perçu."
    },
    {
      icon: FaListAlt,
      title: "Modèles de séances",
      description: "Utilisez des modèles de séances pré-établis ou créez et sauvegardez vos propres modèles pour une réutilisation facile."
    },
    {
      icon: FaUserCog,
      title: "Espace coach",
      description: "Fonctionnalités dédiées aux entraîneurs pour créer, assigner et suivre les programmes d'entraînement de leurs athlètes."
    },
    {
      icon: FaDatabase,
      title: "Historique complet",
      description: "Archivage et visualisation de l'historique complet de vos entraînements, avec possibilité d'export et d'analyse."
    }
  ];

  // Avantages de l'application avec descriptions plus spécifiques
  const benefits = [
    {
      icon: FaCheckCircle,
      title: "Progression structurée",
      description: "Progressez de manière méthodique et scientifique avec des plans adaptés à votre niveau actuel et vos objectifs."
    },
    {
      icon: FaRegLightbulb,
      title: "Expertise intégrée",
      description: "Bénéficiez de l'expertise d'entraîneurs professionnels dans la conception de vos programmes d'entraînement."
    },
    {
      icon: FaUsers,
      title: "Communauté motivante",
      description: "Rejoignez une communauté de nageurs partageant les mêmes objectifs pour rester motivé et échanger des conseils."
    },
    {
      icon: FaMobileAlt,
      title: "Accessibilité maximale",
      description: "Accédez à vos plans et suivez vos performances depuis n'importe quel appareil, même au bord du bassin."
    }
  ];

  // Témoignages plus détaillés et spécifiques
  const testimonials = [
    {
      quote: "Cette application a révolutionné mon approche de l'entraînement. J'ai amélioré mon 200m papillon de 3 secondes en seulement deux mois grâce aux séries personnalisées et au suivi précis.",
      name: "Sophie E.",
      role: "Nageuse de compétition"
    },
    {
      quote: "En tant qu'entraîneur, je peux désormais gérer facilement les programmes de toute mon équipe. La possibilité de personnaliser les plans selon le niveau de chaque nageur est inestimable.",
      name: "Nicolas G.",
      role: "Coach de club"
    },
    {
      quote: "La planification intuitive et le suivi détaillé m'ont permis d'améliorer considérablement mes performances. L'application s'est parfaitement intégrée à ma préparation pour mon premier triathlon.",
      name: "Thomas D.",
      role: "Triathlète amateur"
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
              <div className="col-lg-7 mb-4 mb-lg-0">
                <div className="d-flex align-items-center mb-3">
                  <FaWater className="me-3 fs-1" />
                  <h1 className="display-4 fw-bold mb-0">Fonctionnalités complètes</h1>
                </div>
                <p className="lead mb-4">
                  Découvrez toutes les fonctionnalités conçues spécifiquement pour améliorer vos performances en natation et vous aider à atteindre vos objectifs dans l'eau.
                </p>
                <Link to="/register" className="btn btn-light text-primary btn-lg px-4">
                  Essayer gratuitement
                </Link>
              </div>
              <div className="col-lg-5 text-center">
                <div className="bg-white p-3 rounded shadow-sm">
                  <img src="/assets/images/banner/nataswim_app_banner_1.jpg" alt="Fonctionnalités de natation" className="img-fluid rounded" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fonctionnalités principales */}
        <section className="py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="fw-bold">Fonctionnalités principales</h2>
              <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
                Des outils puissants pour optimiser vos entraînements de natation et suivre vos progrès avec précision
              </p>
            </div>
            
            <div className="row g-4">
              {mainFeatures.map((feature, index) => (
                <div key={index} className="col-md-6 col-lg-3">
                  <FeatureCard 
                    icon={feature.icon} 
                    title={feature.title} 
                    description={feature.description} 
                    color={feature.color}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fonctionnalités spécifiques */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="fw-bold">Fonctionnalités spécialisées</h2>
              <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
                Développées spécifiquement pour les besoins des nageurs, triathlètes et entraîneurs
              </p>
            </div>
            
            <div className="row g-4">
              {specificFeatures.map((feature, index) => (
                <div key={index} className="col-md-6 col-lg-4">
                  <SecondaryFeatureCard 
                    icon={feature.icon} 
                    title={feature.title} 
                    description={feature.description}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Démonstration visuelle */}
        <section className="py-5 bg-white">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <h2 className="fw-bold mb-4">Interface intuitive et puissante</h2>
                <p className="mb-4">
                  Notre application a été conçue pour offrir une expérience utilisateur optimale, que vous soyez un nageur débutant ou un athlète de haut niveau.
                </p>
                <ul className="list-unstyled">
                  <li className="d-flex align-items-center mb-3">
                    <FaCheckCircle className="text-success me-3" />
                    <span>Navigation simple et intuitive pour tous les niveaux</span>
                  </li>
                  <li className="d-flex align-items-center mb-3">
                    <FaCheckCircle className="text-success me-3" />
                    <span>Visualisation claire de vos données et statistiques</span>
                  </li>
                  <li className="d-flex align-items-center mb-3">
                    <FaCheckCircle className="text-success me-3" />
                    <span>Personnalisation complète selon vos préférences</span>
                  </li>
                  <li className="d-flex align-items-center">
                    <FaCheckCircle className="text-success me-3" />
                    <span>Accessible sur tous vos appareils, même au bord du bassin</span>
                  </li>
                </ul>
              </div>
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-0">
                    <img src="/assets/images/banner/nataswim_app_banner_2.jpg" alt="Interface de l'application" className="img-fluid rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Avantages */}
        <section className="py-5 bg-primary text-white">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="fw-bold">Les avantages de notre application</h2>
              <p className="lead mx-auto" style={{ maxWidth: "700px" }}>
                Pourquoi des milliers de nageurs et d'entraîneurs nous font confiance
              </p>
            </div>
            
            <div className="row g-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="col-md-6">
                  <div className="card bg-primary-dark border-0 h-100">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-white rounded-circle p-2 me-3">
                          <benefit.icon className="text-success" size={24} />
                        </div>
                        <h3 className="h5 mb-0">{benefit.title}</h3>
                      </div>
                      <p className="text-50 mb-0">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Témoignages */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="fw-bold">Ce qu'en disent nos utilisateurs</h2>
              <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
                Découvrez comment notre application aide les nageurs à atteindre leurs objectifs
              </p>
            </div>
            
            <div className="row g-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="col-md-4">
                  <TestimonialCard
                    quote={testimonial.quote}
                    name={testimonial.name}
                    role={testimonial.role}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        

        {/* CTA */}
        <section className="py-5 bg-primary text-white text-center">
          <div className="container py-3">
            <h2 className="mb-4 fw-bold">Prêt à transformer votre entraînement ?</h2>
            <p className="lead mb-4 mx-auto" style={{ maxWidth: "700px" }}>
              Rejoignez des milliers de nageurs, triathlètes et entraîneurs qui utilisent notre application pour atteindre leurs objectifs dans l'eau.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
             
              <Link to="/contact" className="btn btn-outline-light btn-lg px-4">
                Nous contacter
                <FaChevronRight className="ms-2" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default FeaturesPage;