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
  FaSort,
  FaRulerHorizontal,
  FaLayerGroup,
  FaClock,
  FaSwimmer,
  FaRegSadTear
} from 'react-icons/fa';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';
import { getWorkouts } from '../../services/workouts';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import RandomBanner from '../../components/template/RandomBanner';


/**
 * 🇬🇧 Swimming workouts list component with card display
 * This component displays a list of swimming workouts as cards
 * Only authenticated users can access the complete content
 * 
 * 🇫🇷 Composant de liste de séances d'entraînement de natation avec affichage en cartes
 * Ce composant affiche une liste de séances d'entraînement sous forme de cartes
 * Seuls les utilisateurs authentifiés peuvent accéder au contenu complet
 */
const SwimWorkout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [workouts, setWorkouts] = useState([]);
  const [workoutsWithStats, setWorkoutsWithStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Catégories de séances
  const workoutCategories = ['Aero 1', 'Vitesse', 'Mixte', 'Technique', 'Récupération'];

  /**
   * 🇬🇧 Fetch workouts and their details from API
   * 
   * 🇫🇷 Récupération des séances et leurs détails depuis l'API
   */
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const response = await getWorkouts();
        
        // Pour les visiteurs non authentifiés, limiter à 6 séances comme aperçu
        const workoutsToShow = isAuthenticated 
          ? response.data 
          : response.data.slice(0, 6);
        
        setWorkouts(workoutsToShow);
        
        // Récupérer des statistiques supplémentaires pour chaque séance
        const workoutsWithAdditionalData = await Promise.all(
          workoutsToShow.map(async (workout) => {
            try {
              // Récupérer les exercices
              const exercisesResponse = await axios.get(`http://127.0.0.1:8000/api/workouts/${workout.id}/exercises`);
              const exercisesCount = exercisesResponse.data.length;
              
              // Récupérer les séries
              const setsResponse = await axios.get(`http://127.0.0.1:8000/api/workouts/${workout.id}/swim-sets`);
              const sets = setsResponse.data;
              const setsCount = sets.length;
              
              // Calculer la distance totale
              const totalDistance = sets.reduce((acc, set) => {
                return acc + ((set.set_distance || 0) * (set.set_repetition || 1));
              }, 0);
              
              // Calculer la durée approximative
              // En supposant 1 minute par 100m avec un temps de repos
              const estimatedDuration = Math.ceil(totalDistance / 100) + 
                                       sets.reduce((acc, set) => acc + (set.rest_time || 0)/60, 0);
              
              return {
                ...workout,
                exercisesCount,
                setsCount,
                totalDistance,
                estimatedDuration
              };
            } catch (err) {
              console.error(`Erreur lors de la récupération des détails pour la séance ${workout.id}:`, err);
              return {
                ...workout,
                exercisesCount: 0,
                setsCount: 0,
                totalDistance: 0,
                estimatedDuration: 0
              };
            }
          })
        );
        
        setWorkoutsWithStats(workoutsWithAdditionalData);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des séances:', err);
        setError('Pour accéder à ce contenu, veuillez vous connecter et vérifier que votre profil est complet...');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [isAuthenticated]);

  /**
   * 🇬🇧 Filter workouts based on search term and category
   * 
   * 🇫🇷 Filtrer les séances selon le terme de recherche et la catégorie
   */
  const filteredWorkouts = workoutsWithStats.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (workout.description && workout.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || workout.workout_category === categoryFilter;
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
    const mins = Math.round(minutes);
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours}h ${remainingMins > 0 ? remainingMins + 'min' : ''}`;
    }
    return `${mins} min`;
  };

  /**
   * 🇬🇧 Get color for category badge
   * 
   * 🇫🇷 Obtenir la couleur du badge pour la catégorie
   */
  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'Aero 1': return 'success';
      case 'Vitesse': return 'danger';
      case 'Technique': return 'info';
      case 'Récupération': return 'warning';
      case 'Mixte': return 'primary';
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


        <h1 className="title-swim mb-4">Séances d'Entraînement</h1>

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
                    placeholder="Rechercher une séance..."
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
                    {workoutCategories.map(category => (
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

        {/* Affichage des cartes de séances */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredWorkouts.length === 0 ? (
            <div className="col-12">
             
            </div>
          ) : (
            filteredWorkouts.map(workout => (
              <div key={workout.id} className="col">
                <div className="card h-100 shadow-sm hover-card">
                  {/* En-tête de la carte */}
                  <div className="card-header bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className={`badge bg-${getCategoryBadgeColor(workout.workout_category)}`}>
                        {workout.workout_category || 'Non catégorisé'}
                      </span>
                      <small className="text-muted">ID: {workout.id}</small>
                    </div>
                  </div>
                  
                  {/* Corps de la carte */}
                  <div className="card-body">
                    <h5 className="card-title mb-3">{workout.title}</h5>
                    <p className="card-text small mb-3">
                      {formatDescriptionPreview(workout.description)}
                    </p>
                    
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <div className="bg-light rounded p-2 text-center">
                          <div className="d-flex align-items-center justify-content-center mb-1">
                            <FaRulerHorizontal className="text-primary me-1" />
                            <small className="fw-medium">Distance</small>
                          </div>
                          <span className="badge bg-primary">
                            {formatDistance(workout.totalDistance)}
                          </span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="bg-light rounded p-2 text-center">
                          <div className="d-flex align-items-center justify-content-center mb-1">
                            <FaClock className="text-primary me-1" />
                            <small className="fw-medium">Durée</small>
                          </div>
                          <span className="badge bg-secondary">
                            {formatDuration(workout.estimatedDuration)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <FaLayerGroup className="text-primary me-1" />
                        <small className="text-muted">
                          {workout.setsCount} séries
                        </small>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaSwimmingPool className="text-primary me-1" />
                        <small className="text-muted">
                          {workout.exercisesCount} exercices
                        </small>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pied de la carte */}
                  <div className="card-footer bg-white border-top-0">
                    {isAuthenticated ? (
                      <Link 
                        to={`/user/workouts/${workout.id}`} 
                        className="btn btn-outline-primary w-100"
                      >
                        <FaEye className="me-2" /> Voir les détails
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
              <h2 className="mb-4">Accédez à toutes nos séances d'entraînement</h2>
              <p className="lead mb-4">
                Cette page n'affiche qu'un aperçu limité des séances disponibles pour les membres.
              </p>
              <p className="mb-4">
                Inscrivez-vous ou connectez-vous pour accéder à notre bibliothèque complète de séances d'entraînement,
                incluant des programmes structurés, des séries détaillées et un suivi personnalisé.
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

export default SwimWorkout;