/**
 * 🇬🇧 User Dashboard Page
 * 
 * 🇫🇷 Page du tableau de bord utilisateur
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaChartLine, 
  FaSwimmer, 
  FaCalendarCheck, 
  FaListAlt, 
  FaUserEdit,
  FaRunning,
  FaUpload,
  FaClipboardList,
  FaTrophy,
  FaStopwatch,
  FaRulerHorizontal,
  FaCalendarAlt,
  FaBookOpen,
  FaDumbbell,
  FaVideo,
  FaBolt,
  FaRegClock,
  FaRegLightbulb,
  FaBiking,
  FaTools
} from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

/**
 * 🇬🇧 Quick Access Card Component
 * 
 * 🇫🇷 Composant pour les cartes d'accès rapide
 */
const QuickAccessCard = ({ icon: Icon, title, description, link, color = "primary" }) => (
  <div className="col-md-4 mb-4">
    <div className="card h-100 hover-lift">
      <div className="card-body text-center">
        <div className={`bg-${color}-subtle p-3 rounded-circle d-inline-block mb-3`}>
          <Icon className={`text-${color} fs-2`} />
        </div>
        <h3 className="card-title h5">{title}</h3>
        <p className="card-text text-muted mb-3">{description}</p>
        <Link to={link} className={`btn btn-lg btn-block btn-${color}`}>
         Consulter
        </Link>
      </div>
    </div>
  </div>
);

/**
 * 🇬🇧 Library Resource Card Component
 * 
 * 🇫🇷 Composant pour les cartes de ressources de bibliothèque
 */
const LibraryCard = ({ icon: Icon, title, items, color = "primary" }) => (
  <div className="col-md-6 col-lg-3 mb-4">
    <div className="card h-100 shadow-sm">
      <div className="card-header bg-light p-3">
        <div className="d-flex align-items-center">
          <Icon className={`text-${color} me-2 fs-4`} />
          <h3 className="card-title h5 mb-0">{title}</h3>
        </div>
      </div>
      <div className="card-body">
        <ul className="list-unstyled mb-0">
          {items.map((item, index) => (
            <li key={index} className="mb-2 d-flex align-items-start">
              <span className="me-2">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-footer bg-white border-top-light">
        
      </div>
    </div>
  </div>
);

/**
 * 🇬🇧 Main User Dashboard Page Component
 * 
 * 🇫🇷 Composant principal de la page du tableau de bord utilisateur
 */
const UserDashboardPage = () => {
  /**
   * 🇬🇧 Quick Access Card Data
   * 
   * 🇫🇷 Données des cartes d'accès rapide
   */
  const quickAccessCards = [
    {
      icon: FaSwimmer,
      title: 'Séances',
      description: 'Gérez vos entraînements et suivez vos séances',
      link: '/user/workouts',
      color: 'primary'
    },
    {
      icon: FaCalendarCheck,
      title: 'Programmes d entraînement',
      description: "Consultez et créez vos plans d'entraînement",
      link: '/user/plans',
      color: 'success'
    },
    {
      icon: FaRunning,
      title: 'Exercices',
      description: 'Bibliothèque d exercices personnalisés',
      link: '/user/exercises',
      color: 'info',
    },
    {
      icon: FaClipboardList,
      title: 'Mes Carnets Mes Entraînements',
      description: 'Organisez vos objectifs et exercices favoris',
      link: '/user/mylists',
      color: 'warning'
    },
    {
      icon: FaUpload,
      title: 'Conseils et ressources',
      description: "Articles, Publications, Infos, News et Plus",
      link: '/articles',
      color: 'danger'
    },
    {
      icon: FaUserEdit,
      title: 'Mon Profil',
      description: 'Modifiez vos informations personnelles',
      link: '/user/profile',
      color: 'secondary'
    }
  ];

  /**
   * 🇬🇧 Library Resources Data
   * 
   * 🇫🇷 Données des ressources de la bibliothèque
   */
  const libraryResources = [
    {
      icon: FaRegLightbulb,
      title: "Exercices Techniques",
      items: [
        "Amélioration technique des 4 nages",
        "Battements de jambes optimisés",
        "Exercices de respiration spécifiques",
        "Mouvements de bras isolés"
      ],
      color: "secondary"
    },
    {
      icon: FaRegLightbulb,
      title: "Exercices d'Endurance",
      items: [
        "Séries longue distance à allure modérée",
        "Entraînements à rythme variable",
        "Nage continue progressive",
        "Séances d'endurance fondamentale"
      ],
      color: "secondary"
    },
    {
      icon: FaRegLightbulb,
      title: "Exercices de Vitesse",
      items: [
        "Sprints courts haute intensité",
        "Perfectionnement départs et virages",
        "Séries explosives chronométrées",
        "Exercices d'accélération progressive"
      ],
      color: "secondary"
    },
    {
      icon: FaRegLightbulb,
      title: "Renforcement Musculaire",
      items: [
        "Exercices avec élastiques spécifiques",
        "Circuits de gainage pour nageurs",
        "Musculation adaptée à la natation",
        "Travail des muscles stabilisateurs"
      ],
      color: "secondary"
    },
    {
      icon: FaRegLightbulb,
      title: "Programmes Débutants",
      items: [
        "Initiation aux techniques de base",
        "Progression méthodique par niveau",
        "Exercices d'aisance aquatique",
        "Familiarisation avec les 4 nages"
      ],
      color: "secondary"
    },
    {
      icon: FaRegLightbulb,
      title: "Programmes Avancés",
      items: [
        "Entraînement fractionné haute intensité",
        "Préparation spécifique compétition",
        "Perfectionnement technique avancé",
        "Optimisation des performances"
      ],
      color: "secondary"
    },
    {
      icon: FaRegLightbulb,
      title: "Programmes Spécifiques",
      items: [
        "Préparation triathlon et eau libre",
        "Entraînements par spécialité",
        "Séances adaptées aux masters",
        "Programmes récupération post-blessure"
      ],
      color: "secondary"
    },
    {
      icon: FaRegLightbulb,
      title: "Ressources Complémentaires",
      items: [
        "Vidéos techniques et démonstrations",
        "Articles nutrition et récupération",
        "Guides de préparation mentale",
        "Outils de suivi des performances"
      ],
      color: "secondary"
    }
  ];

  return (
    <>
      <main className="container-fluid py-4">
        {/* 🇬🇧 Header Section | 🇫🇷 Section d'en-tête */}
        <header className="title-swim">
          <h1>Mon Espace</h1>
          <p className="lead text-muted">
            Bienvenue dans votre espace personnel
          </p>
        </header>

        {/* 🇬🇧 Quick Access Section | 🇫🇷 Section d'accès rapide */}
        <section className="mb-5">
          <div className="row">
            {quickAccessCards.map((card, index) => (
              <QuickAccessCard 
                key={index}
                icon={card.icon}
                title={card.title}
                description={card.description}
                link={card.link}
                color={card.color}
              />
            ))}
          </div>
        </section>

        

        {/* 🇬🇧 Library Resources Section | 🇫🇷 Section des ressources de bibliothèque */}
        <section className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 mb-0">Bibliothèque d'Entraînement</h2>
            
          </div>
          
          <div className="bg-light p-4 rounded-3 mb-4">
            <p className="lead mb-0">
              Une collection complète de ressources pour améliorer votre technique, endurance et vitesse en natation - que vous soyez débutant ou nageur confirmé.
            </p>
          </div>
          
          <div className="row">
            {libraryResources.map((resource, index) => (
              <LibraryCard
                key={index}
                icon={resource.icon}
                title={resource.title}
                items={resource.items}
                color={resource.color}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default UserDashboardPage;