// src/pages/user/plans/UserPlanDetailPage.jsx
// Pages accessibles après connexion

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaCalendarAlt,
  FaSwimmer,
  FaChartLine,
  FaListAlt,
  FaInfoCircle,
  FaEye,
  FaRulerHorizontal,
  FaBook,
  FaSwimmingPool,
  FaLayerGroup,
  FaDumbbell,
  FaFileAlt,
  FaTint,
  FaClock
} from 'react-icons/fa';
import axios from 'axios';
import Footer from '../../../components/template/Footer';
import { getPlan, getPlans } from '../../../services/plans';
import { getWorkouts } from '../../../services/workouts';
import { getPages } from '../../../services/pages';
import { getWorkoutsForPlan } from '../../../services/planWorkouts';
import { useUI } from '../../../context/UIContext';

const UserPlanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useUI();
  
  // États
  const [plan, setPlan] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [workoutsDetails, setWorkoutsDetails] = useState({});
  const [relatedPlans, setRelatedPlans] = useState([]);
  const [featuredWorkouts, setFeaturedWorkouts] = useState([]);
  const [featuredPages, setFeaturedPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données du plan et ses séances
  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        setLoading(true);
        // Charger les détails du plan
        const planResponse = await getPlan(id);
        
        if (!planResponse || !planResponse.data) {
          throw new Error("Données du plan non disponibles");
        }
        
        setPlan(planResponse.data);

        // Charger les séances du plan
        const workoutsResponse = await getWorkoutsForPlan(id);
        
        if (!workoutsResponse) {
          throw new Error("Impossible de charger les séances");
        }
        
        const workoutsData = workoutsResponse.data || [];
        setWorkouts(workoutsData);

        // Récupérer les détails pour chaque séance
        const details = {};
        await Promise.all(workoutsData.map(async (workout) => {
          try {
            // Récupérer les séries de natation
            const swimSetsResponse = await axios.get(`http://127.0.0.1:8000/api/workouts/${workout.id}/swim-sets`);
            const swimSets = swimSetsResponse.data || [];
            
            // Récupérer les exercices
            const exercisesResponse = await axios.get(`http://127.0.0.1:8000/api/workouts/${workout.id}/exercises`);
            const exercises = exercisesResponse.data || [];
            
            // Calculer la distance totale
            const totalDistance = swimSets.reduce((total, set) => {
              return total + (set.set_distance * (set.set_repetition || 1));
            }, 0);
            
            details[workout.id] = {
              totalDistance,
              setsCount: swimSets.length,
              exercisesCount: exercises.length
            };
          } catch (err) {
            console.error(`Erreur lors de la récupération des détails pour la séance ${workout.id}:`, err);
            details[workout.id] = {
              totalDistance: 0,
              setsCount: 0,
              exercisesCount: 0
            };
          }
        }));
        
        setWorkoutsDetails(details);
        
        // Charger d'autres plans similaires
        const plansResponse = await getPlans();
        if (plansResponse && plansResponse.data) {
          // Filtrer pour exclure le plan actuel et limiter à 3 plans
          const otherPlans = plansResponse.data
            .filter(p => p.id !== parseInt(id))
            .slice(0, 3);
          setRelatedPlans(otherPlans);
        }
        
        // Charger d'autres séances pour "Voir plus de séances"
        const allWorkoutsResponse = await getWorkouts();
        if (allWorkoutsResponse && allWorkoutsResponse.data) {
          // Filtrer pour exclure les séances déjà dans ce plan
          const planWorkoutIds = workoutsData.map(w => w.id);
          const otherWorkouts = allWorkoutsResponse.data
            .filter(w => !planWorkoutIds.includes(w.id))
            .slice(0, 3);
            
          // Récupérer les détails basiques pour ces séances
          await Promise.all(otherWorkouts.map(async (workout) => {
            try {
              const swimSetsResponse = await axios.get(`http://127.0.0.1:8000/api/workouts/${workout.id}/swim-sets`);
              const swimSets = swimSetsResponse.data || [];
              
              const totalDistance = swimSets.reduce((total, set) => {
                return total + (set.set_distance * (set.set_repetition || 1));
              }, 0);
              
              workout.totalDistance = totalDistance;
              workout.setsCount = swimSets.length;
            } catch (err) {
              workout.totalDistance = 0;
              workout.setsCount = 0;
            }
          }));
          
          setFeaturedWorkouts(otherWorkouts);
        }
        
        // Charger des pages pour "Voir plus de pages"
        const pagesResponse = await getPages();
        if (pagesResponse && pagesResponse.data) {
          // Limiter à 3 pages
          setFeaturedPages(pagesResponse.data.slice(0, 3));
        }
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError(err.message || 'Impossible de charger les détails du plan.');
        showError && showError('Impossible de charger les détails du plan.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [id, showError]);

  // Calculer les statistiques du plan
  const calculatePlanStats = () => {
    if (!workouts.length) return { totalDistance: 0, totalSessions: 0 };

    const totalDistance = Object.values(workoutsDetails).reduce((total, details) => {
      return total + (details.totalDistance || 0);
    }, 0);

    return {
      totalDistance,
      totalSessions: workouts.length
    };
  };

  // Obtenir la couleur du badge selon la catégorie
  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'Débutant': return 'success';
      case 'Intermédiaire': return 'warning';
      case 'Avancé': return 'danger';
      default: return 'secondary';
    }
  };

  // Obtenir la couleur du badge selon la catégorie de séance
  const getWorkoutCategoryBadgeColor = (category) => {
    switch (category) {
      case 'Récupération': return 'success';
      case 'Technique': return 'info';
      case 'Vitesse': return 'danger';
      case 'Aero 1': return 'warning';
      case 'Mixte': return 'primary';
      default: return 'secondary';
    }
  };

  // Formatter la distance
  const formatDistance = (meters) => {
    if (meters >= 1000) {
      return `${(meters/1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  /**
   * Rendre le contenu HTML en toute sécurité
   */
  const renderDescription = (description) => {
    if (!description) return <p className="text-muted mb-0">Aucune description disponible.</p>;
    
    return (
      <div 
        className="description-content"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement des détails du plan...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          <FaInfoCircle className="me-2" />
          {error || "Plan non trouvé"}
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/user/plans')}
        >
          <FaArrowLeft className="me-2" /> Retour aux plans
        </button>
      </div>
    );
  }

  const planStats = calculatePlanStats();

  return (
    <div className="container py-5">
      {/* En-tête */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-3">
            <div className="bg-primary text-white rounded-circle p-3 me-3">
              <FaSwimmingPool size={24} />
            </div>
            <div>
              <h1 className="h2 mb-1">{plan.title}</h1>
              <div className="d-flex align-items-center">
                <span className={`badge bg-${getCategoryBadgeColor(plan.plan_category)} me-3 px-3 py-2`}>
                  {plan.plan_category || 'Non catégorisé'}
                </span>
              </div>
            </div>
          </div>
          
          <button
            className="btn btn-outline-primary px-4"
            onClick={() => navigate('/user/plans')}
          >
            <FaArrowLeft className="me-2" /> Retour aux plans
          </button>
        </div>
      </div>
      
      {/* Statistiques principales */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <FaSwimmer className="text-primary mb-3" size={28} />
              <h3 className="h5">Séances</h3>
              <p className="display-5 fw-bold text-primary mb-0">{planStats.totalSessions}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <FaRulerHorizontal className="text-primary mb-3" size={28} />
              <h3 className="h5">Distance totale</h3>
              <p className="display-5 fw-bold text-primary mb-0">{formatDistance(planStats.totalDistance)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white py-3">
          <h2 className="h4 mb-0">
            <FaBook className="text-primary me-2" /> Description du plan
          </h2>
        </div>
        <div className="card-body p-4">
          {renderDescription(plan.description)}
        </div>
      </div>
      
      {/* Séances du plan */}
      <div className="card shadow-sm border-0 mb-5">
        <div className="card-header bg-white py-3">
          <h2 className="h4 mb-0">
            <FaSwimmer className="text-primary me-2" /> Séances d'entraînement
          </h2>
        </div>
        <div className="card-body p-0">
          {workouts.length === 0 ? (
            <div className="alert alert-info m-4">
              <FaInfoCircle className="me-2" />
              Aucune séance n'a encore été ajoutée à ce plan.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Titre</th>
                    <th>Catégorie</th>
                    <th className="text-center"><FaRulerHorizontal className="me-1" /> Distance</th>
                    <th className="text-center"><FaLayerGroup className="me-1" /> Séries</th>
                    <th className="text-center"><FaDumbbell className="me-1" /> Exercices</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map(workout => (
                    <tr key={workout.id}>
                      <td className="ps-4 fw-medium">{workout.title}</td>
                      <td>
                        <span className={`badge bg-${
                          workout.workout_category === 'Récupération' ? 'success' :
                          workout.workout_category === 'Technique' ? 'info' :
                          workout.workout_category === 'Vitesse' ? 'danger' :
                          workout.workout_category === 'Aero 1' ? 'warning' :
                          workout.workout_category === 'Mixte' ? 'primary' :
                          'secondary'
                        }`}>
                          {workout.workout_category || 'Non défini'}
                        </span>
                      </td>
                      <td className="text-center">{formatDistance(workoutsDetails[workout.id]?.totalDistance || 0)}</td>
                      <td className="text-center">
                        <span className="badge bg-secondary">
                          {workoutsDetails[workout.id]?.setsCount || 0}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-info text-dark">
                          {workoutsDetails[workout.id]?.exercisesCount || 0}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <Link 
                          to={`/user/workouts/${workout.id}`}
                          className="btn btn-sm btn-outline-primary"
                          title="Voir les détails"
                        >
                          <FaEye className="me-1" /> Détails
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Voir plus de plans */}
      <div className="mt-5 mb-4">
        <h2 className="h4 mb-4">
          <FaChartLine className="text-primary me-2" /> Plus de plans
        </h2>
        
        <div className="row g-4">
          {relatedPlans.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info" role="alert">
                <FaInfoCircle className="me-2" />
                Aucun autre plan disponible actuellement.
              </div>
            </div>
          ) : (
            relatedPlans.map(relatedPlan => (
              <div key={relatedPlan.id} className="col-md-4">
                <div className="card h-100 shadow-sm hover-lift">
                  <div className="card-header bg-white border-bottom-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className={`badge bg-${getCategoryBadgeColor(relatedPlan.plan_category)}`}>
                        {relatedPlan.plan_category || 'Non catégorisé'}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary text-white rounded-circle p-3 me-3">
                        <FaSwimmingPool />
                      </div>
                      <h3 className="h5 card-title mb-0">{relatedPlan.title}</h3>
                    </div>
                    <p className="card-text text-muted small mb-0">
                      {relatedPlan.description ? 
                        (relatedPlan.description.length > 100 
                          ? relatedPlan.description.substring(0, 100) + '...' 
                          : relatedPlan.description)
                        : 'Aucune description disponible.'}
                    </p>
                  </div>
                  <div className="card-footer bg-white">
                    <Link 
                      to={`/user/plans/${relatedPlan.id}`}
                      className="btn btn-outline-primary w-100"
                    >
                      <FaEye className="me-1" /> Voir 
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Voir plus de séances */}
      <div className="mt-5 mb-4">
        <h2 className="h4 mb-4">
          <FaSwimmer className="text-primary me-2" /> Séances
        </h2>
        
        <div className="row g-4">
          {featuredWorkouts.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info" role="alert">
                <FaInfoCircle className="me-2" />
                Aucune autre séance disponible actuellement.
              </div>
            </div>
          ) : (
            featuredWorkouts.map(workout => (
              <div key={workout.id} className="col-md-4">
                <div className="card h-100 shadow-sm hover-lift">
                  <div className="card-header bg-white border-bottom-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className={`badge bg-${getWorkoutCategoryBadgeColor(workout.workout_category)}`}>
                        {workout.workout_category || 'Non catégorisé'}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-info text-white rounded-circle p-3 me-3">
                        <FaTint />
                      </div>
                      <h3 className="h5 card-title mb-0">{workout.title}</h3>
                    </div>
                    
                    <div className="d-flex justify-content-between text-muted small mb-3">
                      <div>
                        <FaRulerHorizontal className="me-1" />
                        {formatDistance(workout.totalDistance || 0)}
                      </div>
                      <div>
                        <FaLayerGroup className="me-1" />
                        {workout.setsCount || 0} séries
                      </div>
                    </div>
                    
                    <p className="card-text text-muted small mb-0">
                      {workout.description ? 
                        (workout.description.length > 80
                          ? workout.description.substring(0, 80) + '...' 
                          : workout.description)
                        : 'Aucune description disponible.'}
                    </p>
                  </div>
                  <div className="card-footer bg-white">
                    <Link 
                      to={`/user/workouts/${workout.id}`}
                      className="btn btn-outline-info w-100"
                    >
                      <FaEye className="me-1" /> Voir 
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="text-center mt-3">
          <Link to="/user/workouts" className="btn btn-warning">
            Toutes les séances
          </Link>
        </div>
      </div>
      
      {/* Voir plus de pages */}
      <div className="mt-5 mb-3">
        <h2 className="h4 mb-4">
          <FaFileAlt className="text-primary me-2" /> Infos Articles
        </h2>
        
        <div className="row g-4">
          {featuredPages.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info" role="alert">
                <FaInfoCircle className="me-2" />
                Aucune page disponible actuellement.
              </div>
            </div>
          ) : (
            featuredPages.map(page => (
              <div key={page.id} className="col-md-4">
                <div className="card h-100 shadow-sm hover-lift">
                  <div className="card-header bg-white border-bottom-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-secondary">
                        {page.page_category || 'Article'}
                      </span>
                      <small className="text-muted">
                        <FaClock className="me-1" />
                        {new Date(page.created_at).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                  <div className="card-body">
                    <h3 className="h5 card-title mb-3">{page.title}</h3>
                    <p className="card-text text-muted small mb-0">
                      {page.content ? 
                        (page.content.length > 120
                          ? page.content.substring(0, 120) + '...' 
                          : page.content)
                        : 'Aucun contenu disponible.'}
                    </p>
                  </div>
                  <div className="card-footer bg-white">
                    <Link 
                      to={`/pages/${page.id}`}
                      className="btn btn-outline-secondary w-100"
                    >
                      <FaEye className="me-1" /> Lire
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="text-center mt-3">
          <Link to="/articles" className="btn btn-warning">
            Toutes les pages
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserPlanDetailPage;