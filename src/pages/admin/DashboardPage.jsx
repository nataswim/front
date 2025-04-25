// src/pages/admin/DashboardPage.jsx
// Tableau de bord administrateur avec des statistiques et des graphiques
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUsers, FaDumbbell, FaListAlt, FaCalendarAlt, FaFileAlt, FaSwimmer, 
         FaPlus, FaCog, FaChartLine, FaBell, FaArrowUp, FaArrowDown, 
         FaExclamationTriangle, FaInfoCircle, FaNetworkWired } from 'react-icons/fa';

const DashboardPage = () => {
  const [stats, setStats] = useState({ users: 0, exercises: 0, workouts: 0, plans: 0, pages: 0, swimSets: 0 });
  const [recentItems, setRecentItems] = useState({
    exercises: [],
    workouts: [],
    plans: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionInfo, setConnectionInfo] = useState({
    ip: "Chargement...",
    browser: "Chargement...",
    os: "Chargement..."
  });

  useEffect(() => {
    // Charger les informations de connexion
    const fetchConnectionInfo = async () => {
      try {
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const ip = ipResponse.data.ip;
        
        // Obtenir les informations du navigateur et du système d'exploitation
        const userAgent = navigator.userAgent;
        const browserInfo = getBrowserInfo(userAgent);
        const osInfo = getOSInfo(userAgent);
        
        setConnectionInfo({
          ip: ip,
          browser: browserInfo,
          os: osInfo
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des informations de connexion:", error);
        setConnectionInfo({
          ip: "Indisponible",
          browser: navigator.userAgent,
          os: "Indisponible"
        });
      }
    };
    
    fetchConnectionInfo();
    
    // Charger les statistiques du tableau de bord
    setIsLoading(true);
    Promise.all([
      axios.get('http://127.0.0.1:8000/api/users'),
      axios.get('http://127.0.0.1:8000/api/exercises'),
      axios.get('http://127.0.0.1:8000/api/workouts'),
      axios.get('http://127.0.0.1:8000/api/plans'),
      axios.get('http://127.0.0.1:8000/api/pages'),
      axios.get('http://127.0.0.1:8000/api/swim-sets')
    ]).then(([users, exercises, workouts, plans, pages, swimSets]) => {
      // Statistiques globales
      setStats({
        users: users.data.length,
        exercises: exercises.data.length,
        workouts: workouts.data.length,
        plans: plans.data.length,
        pages: pages.data.length,
        swimSets: swimSets.data.length
      });
      
      // Récupérer les éléments récents
      setRecentItems({
        exercises: exercises.data.slice(0, 5).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
        workouts: workouts.data.slice(0, 5).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
        plans: plans.data.slice(0, 5).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      });
      
      setIsLoading(false);
    }).catch((error) => {
      console.error("Erreur lors du chargement des données:", error);
      setError("Impossible de charger les données. Vérifiez votre connexion à l'API.");
      setIsLoading(false);
    });
  }, []);

  /**
   * 🇬🇧 Get browser information from user agent
   * 🇫🇷 Obtenir les informations du navigateur à partir de l'agent utilisateur
   */
  const getBrowserInfo = (userAgent) => {
    if (userAgent.includes("Firefox")) {
      return "Firefox";
    } else if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
      return "Chrome";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      return "Safari";
    } else if (userAgent.includes("Edg")) {
      return "Edge";
    } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
      return "Opera";
    } else {
      return "Navigateur inconnu";
    }
  };

  /**
   * 🇬🇧 Get OS information from user agent
   * 🇫🇷 Obtenir les informations du système d'exploitation à partir de l'agent utilisateur
   */
  const getOSInfo = (userAgent) => {
    if (userAgent.includes("Windows")) {
      return "Windows";
    } else if (userAgent.includes("Mac OS")) {
      return "MacOS";
    } else if (userAgent.includes("Linux")) {
      return "Linux";
    } else if (userAgent.includes("Android")) {
      return "Android";
    } else if (userAgent.includes("iOS") || userAgent.includes("iPhone") || userAgent.includes("iPad")) {
      return "iOS";
    } else {
      return "Système d'exploitation inconnu";
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Liens rapides pour la gestion
  const quickLinks = [
    { to: '/admin/users/new', label: 'Ajouter un utilisateur', icon: FaUsers, color: 'primary' },
    { to: '/admin/exercises/new', label: 'Ajouter un exercice', icon: FaDumbbell, color: 'success' },
    { to: '/admin/workouts/new', label: 'Créer une séance', icon: FaSwimmer, color: 'info' },
    { to: '/admin/plans/new', label: 'Créer un plan', icon: FaCalendarAlt, color: 'warning' },
    { to: '/admin/pages/new', label: 'Ajouter une page', icon: FaFileAlt, color: 'danger' },
    { to: '/admin/swim-sets/new', label: 'Ajouter une série', icon: FaListAlt, color: 'secondary' }
  ];

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <span className="ms-3">Chargement du tableau de bord...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <FaExclamationTriangle className="me-2" />
        {error}
        <button onClick={() => window.location.reload()} className="btn btn-sm btn-danger ms-3">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      

      {/* Tableau de bord Manager */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary-subtle">
              <h2 className="card-title mb-0">
                <FaCog className="me-2" />
                Tableau de bord Manager
              </h2>
            </div>
            
           
          </div>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <FaChartLine className="me-2" />
                Statistiques
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {[
                  { key: 'users', icon: FaUsers, label: 'Utilisateurs | Voir==>', color: 'primary-subtle', link: '/admin/users' },
                  { key: 'exercises', icon: FaDumbbell, label: 'Exercices | Voir==>', color: 'primary-subtle', link: '/admin/exercises' },
                  { key: 'workouts', icon: FaSwimmer, label: 'Séances | Voir==>', color: 'primary-subtle', link: '/admin/workouts' },
                  { key: 'plans', icon: FaCalendarAlt, label: 'Plans | Voir==>', color: 'primary-subtle', link: '/admin/plans' },
                  { key: 'pages', icon: FaFileAlt, label: 'Pages | Voir==>', color: 'primary-subtle', link: '/admin/pages' },
                  { key: 'swimSets', icon: FaListAlt, label: 'Séries | Voir==>', color: 'primary-subtle', link: '/admin/swim-sets' }
                ].map(({ key, icon: Icon, label, color, link }) => (
                  <div key={key} className="col-md-4 col-sm-6">
                    <Link to={link} className="text-decoration-none">
                      <div className={`card border-${color} hover-shadow h-100`}>
                        <div className="card-body p-4">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h3 className={`text-${color} fw-bold display-5`}>{stats[key]}</h3>
                              <h5 className="text-muted">{label}</h5>
                            </div>
                            <div className={`bg-${color} bg-opacity-10 p-3 rounded-circle`}>
                              <Icon className={`text-${color} fs-1`} />
                            </div>
                          </div>
                          <div className="progress mt-3" style={{ height: "5px" }}>
                            <div 
                              className={`progress-bar bg-warning`} 
                              role="progressbar" 
                              style={{ width: `50%` }}
                              aria-valuenow={stats[key]} 
                              aria-valuemin="0" 
                              aria-valuemax="100">
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


{/* Actions création */}
<div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <FaCog className="me-2" />
                Création
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {quickLinks.map((link, index) => (
                  <div key={index} className="col-md-4 col-sm-6">
                    <Link to={link.to} className={`btn btn-${link.color} w-100 d-flex align-items-center justify-content-between p-3`}>
                      <span><link.icon className="me-2" /> {link.label}</span>
                      <FaPlus />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm bg-primary-subtle">
            <div className="card-body">
              <h5 className="card-title mb-0">
                <FaChartLine className="me-3" />
                Infos
              </h5>
              <div className="mt-3 d-flex align-items-center">
                <FaNetworkWired className="me-2" />
                <span>Adresse IP: <strong>{connectionInfo.ip}</strong> <br></br>| Navigateur: <strong>{connectionInfo.browser}</strong> <br></br>| Système: <strong>{connectionInfo.os}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default DashboardPage;