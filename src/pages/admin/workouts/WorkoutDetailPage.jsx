import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// Importer l'instance API configurée au lieu d'axios direct
import api from '../../../services/api';
import { API_ENDPOINTS } from '../../../config/api.config';

// Importer les services pour les workouts
import { getWorkout, getWorkoutExercises, getWorkoutPlans } from '../../../services/workouts';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaPlus, 
  FaTasks, 
  FaSwimmer, 
  FaDumbbell, 
  FaCalendarAlt, 
  FaRulerHorizontal, 
  FaRedoAlt, 
  FaStopwatch,
  FaChartLine,
  FaExternalLinkAlt,
  FaUser
} from 'react-icons/fa';

/**
 * 🇬🇧 Component to display detailed information about a workout
 * 🇫🇷 Composant pour afficher les informations détaillées d'une séance d'entraînement
 */
const WorkoutDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [workout, setWorkout] = useState(null);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [workoutSets, setWorkoutSets] = useState([]);
  const [relatedPlans, setRelatedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les données de base de la séance avec le service approprié
        const workoutResponse = await getWorkout(id);
        setWorkout(workoutResponse.data);
        
        // Récupérer les exercices associés avec le service approprié
        const exercisesResponse = await getWorkoutExercises(id);
        setWorkoutExercises(exercisesResponse.data || []);
        
        // Récupérer les séries associées avec l'API authentifiée
        const setsResponse = await api.get(API_ENDPOINTS.WORKOUT_SWIM_SETS(id));
                
        // Enrichir les séries avec des données d'exercice
        const enrichedSets = await Promise.all(
          (setsResponse.data || []).map(async (set) => {
            try {
              if (set.exercise_id) {
                // Utiliser l'API authentifiée
                const exerciseResponse = await api.get(`/api/exercises/${set.exercise_id}`);
                return { 
                  ...set, 
                  exerciseTitle: exerciseResponse.data.title,
                  totalDistance: (set.set_distance || 0) * (set.set_repetition || 1)
                };
              }
              return { 
                ...set, 
                exerciseTitle: `Exercise #${set.exercise_id}`,
                totalDistance: (set.set_distance || 0) * (set.set_repetition || 1)
              };
            } catch (err) {
              console.error(`Error fetching exercise for set ${set.id}:`, err);
              return { 
                ...set, 
                exerciseTitle: `Exercise #${set.exercise_id}`,
                totalDistance: (set.set_distance || 0) * (set.set_repetition || 1)
              };
            }
          })
        );
        
        setWorkoutSets(enrichedSets);
        
        // Récupérer les plans associés avec le service approprié
        try {
          const plansResponse = await getWorkoutPlans(id);
          setRelatedPlans(plansResponse.data || []);
        } catch (planErr) {
          console.error("Erreur lors du chargement des plans:", planErr);
          setRelatedPlans([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.");
        setLoading(false);
      }
    };
    
    fetchWorkoutData();
  }, [id]);

  // Calculer la distance totale d'une séance
  const calculateTotalDistance = (sets) => {
    if (!sets || sets.length === 0) return 0;
    
    const totalDistance = sets.reduce((acc, set) => {
      return acc + (set.set_distance * (set.set_repetition || 1));
    }, 0);
    
    return totalDistance;
  };

  // Format distance with units
  const formatDistance = (meters) => {
    if (meters >= 1000) {
      return `${(meters/1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  // Format rest time in seconds to MM:SS
  const formatRestTime = (seconds) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render description with proper HTML
  const renderDescription = (description) => {
    if (!description) return <p className="text-muted">Aucune description disponible</p>;
    
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
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button 
          className="btn btn-outline-primary" 
          onClick={() => navigate('/admin/workouts')}
        >
          <FaArrowLeft className="me-2" /> Retour à la liste
        </button>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning" role="alert">
          Séance non trouvée
        </div>
        <button 
          className="btn btn-outline-primary" 
          onClick={() => navigate('/admin/workouts')}
        >
          <FaArrowLeft className="me-2" /> Retour à la liste
        </button>
      </div>
    );
  }

  // Calculate total workout stats
  const totalDistance = calculateTotalDistance(workoutSets);
  const cumulativeDistances = [];
  let runningTotal = 0;
  
  workoutSets.forEach(set => {
    runningTotal += set.totalDistance;
    cumulativeDistances.push(runningTotal);
  });

  return (
    <div className="container-fluid py-4">
      {/* 1. Titre Section - en pleine largeur */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary-subtle bg-gradient py-3">
              <h2 className="card-title mb-0 text-center fs-2">
                <FaEdit className="me-2" />
                {workout.title}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Distance totale et Catégorie - cartes séparées */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-light">
              <h2 className="h5 mb-0">Distance totale</h2>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <span className="badge bg-primary fs-4 px-4 py-2">
                {formatDistance(totalDistance)}
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-light">
              <h2 className="h5 mb-0">Catégorie</h2>
            </div>
            <div className="card-body d-flex align-items-center">
              <span className={`badge bg-${
                workout.workout_category === 'Aero 1' ? 'success' :
                workout.workout_category === 'Vitesse' ? 'danger' :
                workout.workout_category === 'Technique' ? 'info' :
                workout.workout_category === 'Récupération' ? 'warning' :
                'secondary'
              } fs-5 px-3 py-2 me-2`}>
                {workout.workout_category || "Non catégorisé"}
              </span>
              {workout.workout_level && (
                <span className={`badge bg-${
                  workout.workout_level === 'Débutant' ? 'success' :
                  workout.workout_level === 'Intermédiaire' ? 'warning' :
                  workout.workout_level === 'Avancé' ? 'danger' :
                  'secondary'
                } fs-5 px-3 py-2`}>
                  {workout.workout_level}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Description - carte séparée */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h2 className="h5 mb-0">Description</h2>
            </div>
            <div className="card-body">
              {renderDescription(workout.description)}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Liste des séries - carte séparée */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h2 className="h5 mb-0">
                <FaSwimmer className="text-primary me-2" /> 
                Séries ({workoutSets.length})
              </h2>
            </div>
            <div className="card-body p-0">
              {workoutSets.length === 0 ? (
                <div className="p-4 text-center">
                  <div className="alert alert-info mb-0">
                    Aucune série associée à cette séance
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="text-center">
                          <FaRedoAlt /> Répétitions
                        </th>
                        <th className="text-center">
                          <FaRulerHorizontal /> Distance
                        </th>
                        <th>
                          <FaDumbbell /> Exercice
                        </th>
                        <th className="text-center">
                          <FaStopwatch /> Repos
                        </th>
                        <th className="text-center">
                          <FaSwimmer /> Total série
                        </th>
                        <th className="text-center">
                          <FaChartLine /> Total cumulé
                        </th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workoutSets.map((set, index) => (
                        <tr key={set.id}>
                          <td className="text-center">
                            <span className="badge bg-primary">
                              x{set.set_repetition || 1}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-info text-dark">
                              {set.set_distance} m
                            </span>
                          </td>
                          <td>
                            <Link to={`/admin/exercises/${set.exercise_id}`} className="text-decoration-none">
                              {set.exerciseTitle}
                            </Link>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-secondary">
                              {formatRestTime(set.rest_time)}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-success">
                              {set.totalDistance} m
                            </span>
                          </td>
                          <td className="text-center fw-bold">
                            {formatDistance(cumulativeDistances[index])}
                          </td>
                          <td className="text-center">
                            <Link 
                              to={`/admin/swim-sets/${set.id}`}
                              className="btn btn-sm btn-outline-primary me-2"
                            >
                              Détails
                            </Link>
                            <Link 
                              to={`/admin/swim-sets/${set.id}/edit`}
                              className="btn btn-sm btn-outline-secondary"
                            >
                              <FaEdit />
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
        </div>
      </div>

      {/* 5. Informations - carte séparée */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h2 className="h5 mb-0">Informations</h2>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <FaUser className="text-primary me-2" />
                  Créé par: User #{workout.user_id}
                </li>
                <li className="mb-2">
                  <FaCalendarAlt className="text-primary me-2" />
                  Créé le: {new Date(workout.created_at).toLocaleDateString()}
                </li>
                {workout.updated_at && (
                  <li>
                    <FaCalendarAlt className="text-primary me-2" />
                    Dernière modification: {new Date(workout.updated_at).toLocaleDateString()}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Boutons - séparés sans carte */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3 mb-md-0">
          <button
            className="btn btn-outline-secondary w-100 py-3"
            onClick={() => navigate('/admin/workouts')}
          >
            <FaArrowLeft className="me-2" /> Liste des Séances
          </button>
        </div>
        <div className="col-md-4 mb-3 mb-md-0">
          <a
            href={`http://localhost:3000/user/workouts/${id}`}
            className="btn btn-outline-primary w-100 py-3"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaExternalLinkAlt className="me-2" /> Vue Par Utilisateur
          </a>
        </div>
        <div className="col-md-4">
          <button
            className="btn btn-outline-success w-100 py-3"
            onClick={() => navigate(`/admin/workouts/${id}/edit`)}
          >
            <FaEdit className="me-2" /> Modifier Cette Séance
          </button>
        </div>
      </div>

      {/* 7. Plans associés - carte séparée */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h2 className="h5 mb-0">
                <FaCalendarAlt className="text-primary me-2" /> 
                Plans associés ({relatedPlans.length})
              </h2>
            </div>
            <div className="card-body">
              {relatedPlans.length === 0 ? (
                <div className="alert alert-info">
                  Cette séance n'est associée à aucun plan d'entraînement.
                </div>
              ) : (
                <div className="list-group">
                  {relatedPlans.map(plan => (
                    <Link 
                      key={plan.id}
                      to={`/admin/plans/${plan.id}`}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h6 className="mb-1">{plan.title}</h6>
                        <small className="text-muted">
                          {plan.plan_level && (
                            <span className="badge bg-secondary me-2">{plan.plan_level}</span>
                          )}
                          {plan.plan_category}
                        </small>
                      </div>
                      <span className="badge bg-primary rounded-pill">
                        {plan.duration || 'N/A'} sem.
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailPage;