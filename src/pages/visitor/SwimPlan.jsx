import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaSwimmingPool, 
  FaSearch, 
  FaFilter, 
  FaSignInAlt, 
  FaUserPlus,
  FaLock,
  FaEye,
  FaCalendarAlt,
  FaChartLine,
  FaLayerGroup,
  FaRegSadTear,
  FaSwimmer,
  FaInfoCircle
} from 'react-icons/fa';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';
import { getPlans } from '../../services/plans';
import { getWorkoutsForPlan } from '../../services/planWorkouts';
import useAuth from '../../hooks/useAuth';
import RandomBanner from '../../components/template/RandomBanner';


/**
 * 🇬🇧 Swimming training plans list component with card display
 * This component displays a list of swimming training plans as cards
 * Only authenticated users can access the complete content
 * 
 * 🇫🇷 Composant de liste de plans d'entraînement de natation avec affichage en cartes
 * Ce composant affiche une liste de plans d'entraînement sous forme de cartes
 * Seuls les utilisateurs authentifiés peuvent accéder au contenu complet
 */
const SwimPlan = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [plans, setPlans] = useState([]);
  const [plansWithStats, setPlansWithStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Catégories de plans
  const planCategories = ['Débutant', 'Intermédiaire', 'Avancé'];

  /**
   * 🇬🇧 Fetch plans and their workouts from API
   * 
   * 🇫🇷 Récupération des plans et leurs séances depuis l'API
   */
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await getPlans();
        
        // Pour les visiteurs non authentifiés, limiter à 6 plans comme aperçu
        const plansToShow = isAuthenticated 
          ? response.data 
          : response.data.slice(0, 6);
        
        setPlans(plansToShow);
        
        // Récupérer des statistiques supplémentaires pour chaque plan
        const plansWithAdditionalData = await Promise.all(
          plansToShow.map(async (plan) => {
            try {
              // Récupérer les séances du plan
              const workoutsResponse = await getWorkoutsForPlan(plan.id);
              const workouts = workoutsResponse.data;
              const workoutsCount = workouts.length;
              
              // Calculer des statistiques estimées
              const estimatedDuration = workoutsCount * 60; // ~60 minutes par séance
              const estimatedDistance = workoutsCount * 2000; // ~2000m par séance
              
              return {
                ...plan,
                workoutsCount,
                estimatedDuration,
                estimatedDistance
              };
            } catch (err) {
              console.error(`Erreur lors de la récupération des séances pour le plan ${plan.id}:`, err);
              return {
                ...plan,
                workoutsCount: 0,
                estimatedDuration: 0,
                estimatedDistance: 0
              };
            }
          })
        );
        
        setPlansWithStats(plansWithAdditionalData);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des plans:', err);
        setError('Pour accéder à ce contenu, veuillez vous connecter et vérifier que votre profil est complet...');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [isAuthenticated]);

  /**
   * 🇬🇧 Filter plans based on search term and category
   * 
   * 🇫🇷 Filtrer les plans selon le terme de recherche et la catégorie
   */
  const filteredPlans = plansWithStats.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (plan.description && plan.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || plan.plan_category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  /**
   * 🇬🇧 Format distance with appropriate units
   * 
   * 🇫🇷 Formater la distance avec les unités appropriées
   */
  const formatDistance = (meters) => {
    if (meters >= 1000) {
      return `${(meters/1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  /**
   * 🇬🇧 Format duration nicely
   * 
   * 🇫🇷 Formater la durée de façon élégante
   */
  const formatDuration = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMins = minutes % 60;
      return `${hours}h ${remainingMins > 0 ? remainingMins + 'min' : ''}`;
    }
    return `${minutes} min`;
  };

  /**
   * 🇬🇧 Get color for category badge
   * 
   * 🇫🇷 Obtenir la couleur du badge pour la catégorie
   */
  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'Débutant': return 'success';
      case 'Intermédiaire': return 'warning';
      case 'Avancé': return 'danger';
      default: return 'secondary';
    }
  };

  /**
   * 🇬🇧 Format description for preview
   * 
   * 🇫🇷 Formater la description pour l'aperçu
   */
  const formatDescriptionPreview = (description, maxLength = 100) => {
    if (!description) return "Aucune description disponible";
    return description.length > maxLength 
      ? description.substring(0, maxLength) + '...'
      : description;
  };

  // Show loading spinner while checking authentication or loading data
  if (authLoading || loading) {
    return (
      <>
        <Header />
        <main className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement des données...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

        {/* Bannière */}
        <section className="bg-primary text-white py-5">
          <div className="container">
            <div className="row align-items-center">
            <h1 className="title-swim display-4 fw-bold mb-4">Plans d'Entraînement</h1>

              <div className="col-lg-6">
                <p className="lead mb-4">
                Plongez dans l'eau avec confiance et atteignez vos objectifs grâce à notre application de plans d'entraînement natation. 
                Que vous soyez un nageur débutant ou chevronné, notre application vous offre un accompagnement personnalisé pour optimiser vos performances dans l'eau.                </p>
                
              </div>
              <div className="col-lg-6 text-center mt-4 mt-lg-0">
                <FaSwimmer className="display-1" />
              </div>
            </div>
          </div>
        </section>

      <main className="container-fluid py-4">
        <p className="mb-4">Des programmes adaptés à votre niveau, vos objectifs et votre emploi du temps.</p>

        {/* Filtres de recherche */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher un plan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaFilter />
                  </span>
                  <select
                    className="form-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">Toutes les catégories</option>
                    {planCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Affichage des cartes de plans */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredPlans.length === 0 ? (
            <div className="col-12">
              
            </div>
          ) : (
            filteredPlans.map(plan => (
              <div key={plan.id} className="col">
                <div className="card h-100 shadow-sm hover-card">
                  {/* En-tête de la carte */}
                  <div className="card-header bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className={`badge bg-${getCategoryBadgeColor(plan.plan_category)}`}>
                        {plan.plan_category || 'Non catégorisé'}
                      </span>
                      <div className="d-flex align-items-center">
                        <FaCalendarAlt className="text-muted me-1" size={12} />
                        <small className="text-muted">
                          {plan.workoutsCount} 
                          {plan.workoutsCount > 1 ? ' séances' : ' séance'}
                        </small>
                      </div>
                    </div>
                  </div>
                  
                  {/* Corps de la carte */}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-3">{plan.title}</h5>
                    <p className="card-text small mb-4">
                      {formatDescriptionPreview(plan.description)}
                    </p>
                    
                    <div className="mt-auto">
  
                      
                      <div className="d-flex justify-content-between align-items-center">
 
                      </div>
                    </div>
                  </div>
                  
                  {/* Pied de la carte */}
                  <div className="card-footer bg-white border-top-0">
                    {isAuthenticated ? (
                      <Link 
                        to={`/user/plans/${plan.id}`} 
                        className="btn btn-outline-primary w-100"
                      >
                        <FaEye className="me-2" /> Voir le plan complet
                      </Link>
                    ) : (
                      <button 
                        className="btn btn-outline-primary w-100"
                        onClick={() => navigate('/login')}
                      >
                        <FaLock className="me-2" /> Connexion requise
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Section d'incitation à l'inscription pour visiteurs non connectés */}
        {!isAuthenticated && (
          <div className="card mt-5 shadow-sm border-0">
            <div className="card-body p-5 text-center">
              <FaLock className="text-muted mb-4" size={40} />
              <h2 className="mb-4">Découvrez les programmes d'entraînement</h2>
              <p className="lead mb-4">
                Cette page n'affiche qu'un aperçu limité des plans disponibles pour les membres.
              </p>
              <p className="mb-4">
                Inscrivez-vous ou connectez-vous pour accéder à notre bibliothèque complète de plans d'entraînement,
                incluant des programmes pour tous les niveaux, un suivi de progression et un accompagnement personnalisé.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/login" className="btn btn-primary">
                  <FaSignInAlt className="me-2" /> Se connecter
                </Link>
                <Link to="/register" className="btn btn-outline-primary">
                  <FaUserPlus className="me-2" /> S'inscrire
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <RandomBanner />

      <Footer />
    </>
  );
};

export default SwimPlan;