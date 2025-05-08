import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaSwimmingPool,
  FaInfoCircle,
  FaClock,
  FaRulerHorizontal,
  FaLayerGroup,
  FaSwimmer
} from 'react-icons/fa';
import { getWorkout } from '../../../services/workouts';
import { getSwimSetsForWorkout } from '../../../services/workoutSwimSets';
import { getExercise } from '../../../services/exercises'; // Importation du service pour récupérer les exercices

/**
 * 🇬🇧 Workout detail page that displays all information without tab navigation
 * 
 * 🇫🇷 Page de détail d'une séance qui affiche toutes les informations sans navigation par onglets
 */
const UserWorkoutDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // États
  const [workout, setWorkout] = useState(null);
  const [swimSets, setSwimSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrichedSwimSets, setEnrichedSwimSets] = useState([]);

  // Charger les données de la séance
  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        setLoading(true);
        
        // Charger les détails de la séance
        const workoutResponse = await getWorkout(id);
        setWorkout(workoutResponse.data);

        // Charger les séries de la séance
        const setsResponse = await getSwimSetsForWorkout(id);
        setSwimSets(setsResponse.data);

        // Enrichir les séries avec des informations d'exercices
        if (setsResponse.data && setsResponse.data.length > 0) {
          const enriched = await Promise.all(setsResponse.data.map(async (set) => {
            try {
              // Si l'exercise_id existe, récupérer les détails de l'exercice
              if (set.exercise_id) {
                // Utiliser le service d'exercices existant au lieu de fetch
                const exerciseResponse = await getExercise(set.exercise_id);
                
                // Vérifier que la réponse est valide
                if (exerciseResponse && exerciseResponse.data) {
                  return {
                    ...set,
                    exerciseTitle: exerciseResponse.data.title,
                    exerciseLevel: exerciseResponse.data.exercise_level,
                    exerciseCategory: exerciseResponse.data.exercise_category,
                    totalDistance: (set.set_distance || 0) * (set.set_repetition || 1)
                  };
                }
              }
              // Fallback si l'exercise_id n'existe pas ou si la récupération échoue
              return {
                ...set,
                exerciseTitle: set.exercise_id ? `Exercice #${set.exercise_id}` : 'Non spécifié',
                totalDistance: (set.set_distance || 0) * (set.set_repetition || 1)
              };
            } catch (error) {
              console.error(`Erreur lors de la récupération de l'exercice ${set.exercise_id}:`, error);
              return {
                ...set,
                exerciseTitle: `Exercice #${set.exercise_id}`,
                totalDistance: (set.set_distance || 0) * (set.set_repetition || 1)
              };
            }
          }));
          
          setEnrichedSwimSets(enriched);
          console.log("Séries enrichies:", enriched); // Log pour débogage
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching workout data:', err);
        setError('Impossible de charger les détails de la séance.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutData();
  }, [id]);

  // Calculer les statistiques de la séance
  const calculateWorkoutStats = useCallback(() => {
    const sets = enrichedSwimSets.length > 0 ? enrichedSwimSets : swimSets;
    
    const totalDistance = sets.reduce((acc, set) => {
      return acc + ((set.set_distance || 0) * (set.set_repetition || 1));
    }, 0);

    const totalTime = sets.reduce((acc, set) => {
      // Estimation: 2min/100m + temps de repos
      const swimTime = ((set.set_distance || 0) / 100) * 2 * (set.set_repetition || 1);
      const restTime = (set.rest_time || 0) / 60; // Convertir en minutes
      return acc + swimTime + restTime;
    }, 0);

    return {
      totalDistance,
      totalTime: Math.round(totalTime),
      totalSets: sets.length
    };
  }, [enrichedSwimSets, swimSets]);

  // Formater la durée
  const formatDuration = useCallback((minutes) => {
    if (!minutes) return '0 min';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ''}`;
  }, []);

  // Format rest time in seconds to MM:SS
  const formatRestTime = useCallback((seconds) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Obtenir la couleur du badge selon la catégorie
  const getCategoryBadgeColor = useCallback((category) => {
    switch (category) {
      case 'Aero 1': return 'success';
      case 'Vitesse': return 'danger';
      case 'Technique': return 'info';
      case 'Récupération': return 'warning';
      case 'Mixte': return 'purple';
      default: return 'secondary';
    }
  }, []);

  /**
   * 🇬🇧 Render HTML content safely
   * 
   * 🇫🇷 Rendre le contenu HTML en toute sécurité
   */
  const renderDescription = useCallback((description) => {
    if (!description) return <p className="text-muted mb-0">Aucune description disponible.</p>;
    
    return (
      <div 
        className="description-content"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );
  }, []);

  // Mémoiser les statistiques pour éviter des recalculs inutiles
  const stats = useMemo(() => calculateWorkoutStats(), [calculateWorkoutStats]);
  
  // Mémoiser les séries pour éviter des recalculs inutiles
  const sets = useMemo(() => enrichedSwimSets.length > 0 ? enrichedSwimSets : swimSets, [enrichedSwimSets, swimSets]);

  if (loading) {
    return (
      <>
        <main className="container py-4">
          <div className="text-center" role="status" aria-live="polite">
            <div className="spinner-border text-primary" aria-hidden="true">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error || !workout) {
    return (
      <>
        <main className="container py-4">
          <div className="alert alert-danger" role="alert">
            <FaInfoCircle className="me-2" aria-hidden="true" />
            {error || "Séance non trouvée"}
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/user/workouts')}
          >
            <FaArrowLeft className="me-2" aria-hidden="true" /> Retour aux séances
          </button>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="container-fluid py-4">

        {/* En-tête */}
        <button
          className="btn btn-outline-primary me-3"
          onClick={() => navigate('/user/workouts')}
          aria-label="Retour à la liste des séances"
        >
          <FaArrowLeft className="me-2" aria-hidden="true" /> Plus de séances
        </button>
        <div>
        </div>
        <br />

        <h1 className="h2 mb-0 title-swim">{workout.title}</h1>
        <br />

        <div className="mt-2">
          <span className={`badge bg-${getCategoryBadgeColor(workout.workout_category)}`}>
            {workout.workout_category || 'Non catégorisé'}
          </span>
        </div>
        
        <br />

        {/* Cartes statistiques */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card bg-light h-100">
              <div className="card-body text-center">
                <FaRulerHorizontal className="text-primary mb-2" size={30} aria-hidden="true" />
                <h3 className="h5 mb-2">Distance</h3>
                <p className="h3 mb-0 text-primary fw-bold">{stats.totalDistance}m</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-light h-100">
              <div className="card-body text-center">
                <FaClock className="text-primary mb-2" size={30} aria-hidden="true" />
                <h3 className="h5 mb-2">Durée estimée</h3>
                <p className="h3 mb-0 text-primary fw-bold">{formatDuration(stats.totalTime)}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-light h-100">
              <div className="card-body text-center">
                <FaLayerGroup className="text-primary mb-2" size={30} aria-hidden="true" />
                <h3 className="h5 mb-2">Séries</h3>
                <p className="h3 mb-0 text-primary fw-bold">{stats.totalSets}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Séries */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h2 className="h5 mb-0">
              <FaSwimmingPool className="me-2 text-primary" aria-hidden="true" />
              La Séance ({sets.length})
            </h2>
          </div>
          <div className="card-body p-0">
            {sets.length === 0 ? (
              <div className="alert alert-info m-3">
                <FaInfoCircle className="me-2" aria-hidden="true" />
                Aucune série n'a encore été ajoutée à cette séance.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="text-center" scope="col">Répétitions</th>
                      <th className="text-center" scope="col">Distance</th>
                      <th scope="col">Exercice</th>
                      <th className="text-center" scope="col">Repos</th>
                      <th className="text-center" scope="col">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sets.map(set => (
                      <tr key={set.id}>
                        <td className="text-center">
                          <span className="badge bg-primary">
                            x{set.set_repetition || 1}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-info text-dark">
                            {set.set_distance}m
                          </span>
                        </td>
                        <td>
                          {set.exercise_id ? (
                            <Link 
                              to={`/user/exercises/${set.exercise_id}`} 
                              className="text-decoration-none"
                              aria-label={`Voir les détails de l'exercice ${set.exerciseTitle}`}
                            >
                              {set.exerciseTitle}
                            </Link>
                          ) : (
                            'Non défini'
                          )}
                        </td>
                        <td className="text-center">
                          <span className="badge bg-secondary">
                            {formatRestTime(set.rest_time)}
                          </span>
                        </td>
                        <td className="text-center fw-bold">
                          {(set.set_distance || 0) * (set.set_repetition || 1)}m
                        </td>
                      </tr>
                    ))}
                    <tr className="table-light">
                      <td colSpan="4" className="text-end fw-bold">
                        Distance totale:
                      </td>
                      <td className="text-center fw-bold">
                        {stats.totalDistance}m
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h2 className="h5 mb-0">
              <FaInfoCircle className="me-2 text-primary" aria-hidden="true" />
              Description
            </h2>
          </div>
          <div className="card-body">
            {renderDescription(workout.description)}
          </div>
        </div>
      </main>
    </>
  );
};

export default React.memo(UserWorkoutDetailPage);