// src/pages/visitor/HomePage.jsx
// Page principale de l'application d'entraînement de natation

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaWater,
  FaSwimmer,
  FaChartLine,
  FaUsers,
  FaClock,
  FaList,
  FaChevronRight,
  FaDumbbell,
  FaCalendarAlt,
  FaClipboardList,
  FaUserCog,
  FaTrophy,
  FaRegLightbulb,
  FaUserFriends,
  FaRegCheckCircle,
  FaNewspaper,
  FaFileAlt,
  FaAngleRight
} from "react-icons/fa";
import Header from "../../components/template/Header";
import Footer from "../../components/template/Footer";
import { getPages } from "../../services/pages";
import { getUpload } from "../../services/uploads";

// Composant pour les cartes de fonctionnalités
const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="card h-100 shadow-sm hover-lift border-0">
    <div className="card-body text-center p-4">
      <div className="bg-primary-subtle p-3 rounded-circle d-inline-block mb-3">
        <Icon className="fs-1" />
      </div>
      <h3 className="card-title h5 mb-3">{title}</h3>
      <p className="card-text text-muted">{description}</p>
    </div>
  </div>
);

// Composant pour les cartes d'utilisateurs cibles
const UserTypeCard = ({ icon: Icon, title, description }) => (
  <div className="card h-100 shadow-sm border-0">
    <div className="card-body d-flex p-4">
      <div className="me-3">
        <div className="bg-success-subtle p-3 rounded-circle">
          <Icon className="text-success fs-1" />
        </div>
      </div>
      <div>
        <h4 className="h6 mb-2">{title}</h4>
        <p className="card-text text-muted small mb-0">{description}</p>
      </div>
    </div>
  </div>
);

// Composant pour les cartes d'articles
const ArticleCard = ({ title, content, category, date, id, image }) => {
  // État pour suivre les erreurs de chargement d'image
  const [imageError, setImageError] = useState(false);

  // Formater le contenu (enlever HTML et limiter longueur)
  const formatContentPreview = (content, maxLength = 150) => {
    if (!content) return "Aucun contenu";
    
    // Supprimer les balises HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    
    // Limiter la longueur
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...'
      : textContent;
  };

  // Obtenir la couleur du badge selon la catégorie
  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'Information': return 'info';
      case 'Conseils': return 'success';
      case 'Règles': return 'warning';
      case 'Foire aux questions': return 'primary';
      default: return 'secondary';
    }
  };

  return (
    <div className="card h-100 shadow-sm hover-lift border-0">
      {/* Image de l'article */}
      <div style={{ height: '180px', overflow: 'hidden' }}>
        {image && !imageError ? (
          <img 
            src={image} 
            alt={title}
            className="card-img-top"
            style={{ 
              height: '100%', 
              width: '100%', 
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div 
            className="bg-light d-flex align-items-center justify-content-center" 
            style={{ height: '100%' }}
          >
            <FaNewspaper className="text-muted mb-0" size={40} />
          </div>
        )}
      </div>

      <div className="card-body">
        {/* Catégorie */}
        {category && (
          <div className="mb-2">
            <span className={`badge bg-${getCategoryBadgeColor(category)}`}>
              {category}
            </span>
          </div>
        )}
        <h3 className="card-title h5 mb-3">{title}</h3>
        <p className="card-text text-muted small">
          {formatContentPreview(content)}
        </p>
      </div>
      <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center">
        <small className="text-muted d-flex align-items-center">
          <FaCalendarAlt className="me-1" /> 
          {new Date(date).toLocaleDateString()}
        </small>
        <Link 
          to={`/pages/${id}`} 
          className="btn btn-sm btn-outline-primary"
        >
          Lire la suite
        </Link>
      </div>
    </div>
  );
};

const HomePage = () => {
  // Ajout d'un état pour les dernières pages publiées
  const [latestPages, setLatestPages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [pagesError, setPagesError] = useState(null);
  const [pageImages, setPageImages] = useState({});

  useEffect(() => {
    // Fonction pour récupérer les dernières pages
    const fetchLatestPages = async () => {
      try {
        setLoadingPages(true);
        const response = await getPages();
        
        // Trier les pages par date de création (du plus récent au plus ancien)
        const sortedPages = response.data.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        
        // Prendre les 3 premières pages
        const latest = sortedPages.slice(0, 3);
        setLatestPages(latest);
        
        // Récupérer les images pour les pages qui en ont
        const images = {};
        const BASE_URL = 'http://127.0.0.1:8000'; // URL de base pour compléter les chemins d'images
        
        for (const page of latest) {
          if (page.upload_id) {
            try {
              const imageResponse = await getUpload(page.upload_id);
              
              if (imageResponse.data) {
                // Si la réponse a une URL complète, l'utiliser directement
                if (imageResponse.data.url) {
                  images[page.id] = imageResponse.data.url;
                }
                // Sinon, essayer de construire l'URL à partir du chemin
                else if (imageResponse.data.path) {
                  const path = imageResponse.data.path.startsWith('/') 
                    ? imageResponse.data.path 
                    : `/${imageResponse.data.path}`;
                  
                  images[page.id] = `${BASE_URL}${path}`;
                }
                // Si ni URL ni chemin, essayer avec le nom de fichier
                else if (imageResponse.data.filename) {
                  images[page.id] = `${BASE_URL}/storage/uploads/${imageResponse.data.filename}`;
                }
              }
            } catch (err) {
              console.error(`Erreur lors du chargement de l'image pour la page ${page.id}:`, err);
            }
          }
        }
        
        setPageImages(images);
        setPagesError(null);
      } catch (error) {
        console.error("Erreur lors du chargement des dernières pages:", error);
        setPagesError("Impossible de charger les derniers articles");
      } finally {
        setLoadingPages(false);
      }
    };

    fetchLatestPages();
  }, []);

  const features = [
    {
      icon: FaSwimmer,
      title: "Plans d'Entraînement Personnalisés",
      description:
        "Créez des plans adaptés à votre niveau et vos objectifs spécifiques de natation, du sprint à l'endurance."
    },
    {
      icon: FaDumbbell,
      title: "Exercices Spécialisés",
      description:
        "Bibliothèque d'exercices conçus par des entraîneurs professionnels pour la technique, la vitesse, l'endurance et la récupération."
    },
    {
      icon: FaCalendarAlt,
      title: "Organisation des Séances",
      description:
        "Planifiez vos entraînements, suivez votre progression et organisez vos séances de façon optimale."
    },
    {
      icon: FaClipboardList,
      title: "Carnet d'Entraînement",
      description:
        "Enregistrez vos performances, notez vos sensations et suivez votre évolution au fil du temps."
    },
    {
      icon: FaChartLine,
      title: "Suivi des Performances",
      description:
        "Visualisez vos progrès avec des graphiques détaillés et des statistiques personnalisées."
    },
    {
      icon: FaUsers,
      title: "Partage et Communauté",
      description:
        "Partagez vos plans d'entraînement, échangez avec d'autres nageurs et bénéficiez de conseils d'experts."
    }
  ];

  const userTypes = [
    {
      icon: FaSwimmer,
      title: "Nageurs et Nageuses",
      description: "De tous niveaux, du débutant au compétiteur confirmé, pour structurer vos entraînements."
    },
    {
      icon: FaUserCog,
      title: "Entraîneurs et Coaches",
      description: "Pour créer, partager et superviser des plans pour vos athlètes ou équipes."
    },
    {
      icon: FaTrophy,
      title: "Triathlètes",
      description: "Pour optimiser votre segment natation et intégrer vos entraînements multi-disciplines."
    },
    {
      icon: FaRegLightbulb,
      title: "Amateurs Passionnés",
      description: "Pour progresser méthodiquement et atteindre vos objectifs personnels."
    }
  ];

  const testimonials = [
    {
      name: "Sarah, Nageuse compétition",
      quote: "Cette application a transformé ma façon de m'entraîner. J'ai amélioré mon 200m papillon de 3 secondes en seulement deux mois.",
      role: "Nageuse compétition"
    },
    {
      name: "Marc, Coach",
      quote: "Un outil indispensable pour tout entraîneur. Je gère les programmes de toute mon équipe et peux suivre leur progression en temps réel.",
      role: "Coach"
    },
    {
      name: "Sophie, Triathlète amateur",
      quote: "Enfin un outil qui me permet d'intégrer parfaitement mes séances de natation dans mon planning global d'entraînement.",
      role: "Triathlète"
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
                  <h1 className="display-4 fw-bold mb-0">Votre partenaire d'entraînement aquatique</h1>
                </div>
                <p className="lead mb-4">
                  Planifiez, suivez et optimisez vos entraînements de natation. Une plateforme complète pour nageurs, coaches et triathlètes, du débutant au professionnel.
                </p>
                <div className="d-flex gap-3">
                  
                  <Link
                    to="/plans-de-natation"
                    className="btn btn-outline-light d-flex align-items-center px-4"
                  >
                    Découvrir les plans
                    <FaChevronRight className="ms-2" />
                  </Link>
                </div>
              </div>
              <div className="col-lg-5 text-center">
                {/* Emplacement pour une image d'un nageur/une nageuse */}
                <div className="bg-white p-3 rounded shadow-sm">
                  <img src="/assets/images/banner/nataswim_app_banner_0.jpg" alt="Natation entraînement" className="img-fluid rounded" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pour qui ? Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="fw-bold">Pour qui est conçue cette application ?</h2>
              <p className="lead text-muted">
                Une solution adaptée à tous les profils, amateurs ou professionnels
              </p>
            </div>
            <div className="row g-4">
              {userTypes.map((userType, index) => (
                <div key={index} className="col-md-6">
                  <UserTypeCard
                    icon={userType.icon}
                    title={userType.title}
                    description={userType.description}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="fw-bold">Fonctionnalités clés</h2>
              <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
                Notre application offre tous les outils nécessaires pour progresser et atteindre vos objectifs dans l'eau
              </p>
            </div>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {features.map((feature, index) => (
                <div key={index} className="col">
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-5 bg-primary text-white">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="fw-bold">Ce qu'en disent nos utilisateurs</h2>
            </div>
            <div className="row g-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="col-md-4">
                  <div className="card h-100 bg-info-subtle border-0">
                    <div className="card-body p-4">
                      <p className="card-text mb-4">"{testimonial.quote}"</p>
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle text-success p-2 me-3">
                          <FaUserFriends />
                        </div>
                        <div>
                          <p className="mb-0 text-success fw-bold">{testimonial.name}</p>
                          <small className="text-danger-50">{testimonial.role}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="fw-bold">Comment ça marche ?</h2>
              <p className="lead text-muted">Trois étapes simples pour optimiser vos entraînements</p>
            </div>
            <div className="row g-4 align-items-center">
              <div className="col-md-4 text-center">
                <div className="bg-success-subtle rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "100px", height: "100px" }}>
                  <FaRegCheckCircle className="text-success fs-1" />
                </div>
                <h3 className="h5">1. Créez votre compte</h3>
                <p className="text-muted">Inscrivez-vous et définissez votre profil</p>
              </div>
              <div className="col-md-4 text-center">
                <div className="bg-warning-subtle rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "100px", height: "100px" }}>
                  <FaSwimmer className="text-warning fs-1" />
                </div>
                <h3 className="h5">2. Choisissez vos plans</h3>
                <p className="text-muted">Sélectionnez des plans / Séances existants ou créez les vôtres</p>
              </div>
              <div className="col-md-4 text-center">
                <div className="bg-info-subtle rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "100px", height: "100px" }}>
                  <FaChartLine className="text-info fs-1" />
                </div>
                <h3 className="h5">3. Suivez vos progrès</h3>
                <p className="text-muted">Enregistrez vos performances et visualisez votre progression</p>
              </div>
            </div>
          </div>
        </section>

        {/* Derniers Articles */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold mb-0">
                <FaFileAlt className="text-primary me-2" /> Derniers Articles
              </h2>
              <Link to="/pages" className="btn btn-outline-primary">
                Tous les articles <FaAngleRight className="ms-1" />
              </Link>
            </div>
            
            {loadingPages ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            ) : pagesError ? (
              <div className="alert alert-info" role="alert">
                <FaNewspaper className="me-2" /> {pagesError}
              </div>
            ) : latestPages.length === 0 ? (
              <div className="alert alert-info" role="alert">
                <FaNewspaper className="me-2" /> Aucun article n'est disponible actuellement.
              </div>
            ) : (
              <div className="row g-4">
                {latestPages.map(page => (
                  <div key={page.id} className="col-md-4">
                    <ArticleCard 
                      title={page.title}
                      content={page.content}
                      category={page.page_category}
                      date={page.created_at}
                      id={page.id}
                      image={pageImages[page.id]}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-5 bg-white">
          <div className="container text-center py-4">
            <h2 className="mb-4 fw-bold">Prêt à améliorer vos performances ?</h2>
            <p className="lead text-muted mb-4 mx-auto" style={{ maxWidth: "700px" }}>
              Rejoignez des milliers de nageurs, entraîneurs et triathlètes qui utilisent notre application pour atteindre leurs objectifs aquatiques.
            </p>
            <div className="mt-3">
              <Link to="/login" className="text-decoration-none">
                Déjà inscrit ? Connectez-vous
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;