import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaSwimmer, 
  FaDumbbell, 
  FaLayerGroup,
  FaRuler,
  FaHourglass,
  FaCalculator,
  FaRunning,
  FaInfoCircle
} from 'react-icons/fa';
import axios from 'axios';

/**
 * 🇬🇧 Component for displaying swim set details
 * 🇫🇷 Composant pour afficher les détails d'une série de natation
 */
const SwimSetsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [swimSet, setSwimSet] = useState(null);
  const [workout, setWorkout] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les détails d'une série, de sa séance et de son exercice
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer le token JWT stocké
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        };
        
        // 1. Récupérer les détails de la série
        const swimSetResponse = await axios.get(`http://127.0.0.1:8000/api/swim-sets/${id}`, {
          headers,
          withCredentials: true
        });
        
        const swimSetData = swimSetResponse.data;
        setSwimSet(swimSetData);
        
        // 2. Récupérer les détails de la séance associée
        if (swimSetData.workout_id) {
          const workoutResponse = await axios.get(`http://127.0.0.1:8000/api/workouts/${swimSetData.workout_id}`, {
            headers,
            withCredentials: true
          });
          setWorkout(workoutResponse.data);
        }
        
        // 3. Récupérer les détails de l'exercice associé
        if (swimSetData.exercise_id) {
          const exerciseResponse = await axios.get(`http://127.0.0.1:8000/api/exercises/${swimSetData.exercise_id}`, {
            headers,
            withCredentials: true
          });
          setExercise(exerciseResponse.data);
        }
        
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError(`Erreur lors du chargement des données: ${err.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBack = () => {
    navigate('/admin/swim-sets');
  };

  const handleEdit = () => {
    navigate(`/admin/swim-sets/${id}/edit`);
  };

  // Fonction pour formater le temps de repos
  const formatRestTime = (seconds) => {
    if (!seconds) return '0';
    
    if (seconds < 60) {
      return `${seconds} secondes`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (remainingSeconds === 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''} et ${remainingSeconds} seconde${remainingSeconds > 1 ? 's' : ''}`;
    }
  };

  // Calculer la distance totale
  const calculateTotalDistance = () => {
    if (!swimSet) return 0;
    return (swimSet.set_distance || 0) * (swimSet.set_repetition || 1);
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <FaInfoCircle className="me-2" /> {error}
        </div>
        <button 
          className="btn btn-outline-secondary" 
          onClick={handleBack}
        >
          <FaArrowLeft className="me-2" /> Retour à la liste
        </button>
      </div>
    );
  }

  if (!swimSet) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning d-flex align-items-center" role="alert">
          <FaInfoCircle className="me-2" /> Série non trouvée
        </div>
        <button 
          className="btn btn-outline-secondary" 
          onClick={handleBack}
        >
          <FaArrowLeft className="me-2" /> Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Titre Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary-subtle">
              <h2 className="card-title mb-0">
                <FaSwimmer className="me-2" />
                Détails de la Série
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          className="btn btn-success btn-lg d-flex align-items-center"
          onClick={handleBack}
        >
          <FaArrowLeft className="me-2" /> Voir Les Séries
        </button>
        
        <button
          className="btn btn-danger btn-lg d-flex align-items-center"
          onClick={handleEdit}
        >
          <FaEdit className="me-2" /> Modifier cette Série
        </button>
      </div>

      <div className="row">
        <div className="col-lg-6">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0 d-flex align-items-center">
                <FaSwimmer className="me-2 text-primary" /> Informations de la série
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <small className="text-muted d-block mb-1">ID</small>
                <p className="fw-medium mb-0">{swimSet.id}</p>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card bg-light border-0">
                    <div className="card-body py-3">
                      <div className="d-flex align-items-center mb-2">
                        <FaRuler className="text-primary me-2" />
                        <span className="text-muted">Distance:</span>
                      </div>
                      <p className="h4 fw-medium mb-0">{swimSet.set_distance} m</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card bg-light border-0">
                    <div className="card-body py-3">
                      <div className="d-flex align-items-center mb-2">
                        <FaLayerGroup className="text-primary me-2" />
                        <span className="text-muted">Répétitions:</span>
                      </div>
                      <p className="h4 fw-medium mb-0">{swimSet.set_repetition || 1}</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card bg-light border-0">
                    <div className="card-body py-3">
                      <div className="d-flex align-items-center mb-2">
                        <FaHourglass className="text-primary me-2" />
                        <span className="text-muted">Temps de repos:</span>
                      </div>
                      <p className="h5 fw-medium mb-0">{formatRestTime(swimSet.rest_time)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card bg-primary bg-opacity-10 border-0">
                    <div className="card-body py-3">
                      <div className="d-flex align-items-center mb-2">
                        <FaCalculator className="text-primary me-2" />
                        <span className="text-muted">Distance totale:</span>
                      </div>
                      <p className="h3 text-primary fw-bold mb-0">{calculateTotalDistance()} m</p>
                      <small className="text-muted">
                        {swimSet.set_distance} × {swimSet.set_repetition || 1}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {workout && (
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <FaRunning className="me-2 text-primary" /> Séance associée
                </h5>
              </div>
              <div className="card-body">
                <h5 className="mb-3">{workout.title}</h5>
                
                {workout.workout_category && (
                  <span className={`badge bg-${
                    workout.workout_category === 'Aero 1' ? 'success' :
                    workout.workout_category === 'Vitesse' ? 'danger' :
                    workout.workout_category === 'Technique' ? 'info' :
                    workout.workout_category === 'Récupération' ? 'warning' :
                    'secondary'
                  } mb-3`}>
                    {workout.workout_category}
                  </span>
                )}
                
                {workout.description ? (
                  <div className="p-3 bg-light rounded">
                    <div dangerouslySetInnerHTML={{ __html: workout.description }} />
                  </div>
                ) : (
                  <p className="text-muted">Aucune description disponible</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="col-lg-6">
          {exercise && (
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <FaDumbbell className="me-2 text-primary" /> Détails de l'exercice
                </h5>
              </div>
              <div className="card-body">
                <h5 className="mb-3">{exercise.title}</h5>
                
                <div className="d-flex gap-2 mb-4">
                  {exercise.exercise_level && (
                    <span className={`badge bg-${
                      exercise.exercise_level === 'Débutant' ? 'success' :
                      exercise.exercise_level === 'Intermédiaire' ? 'warning' :
                      exercise.exercise_level === 'Avancé' ? 'danger' :
                      'secondary'
                    }`}>
                      {exercise.exercise_level}
                    </span>
                  )}
                  
                  {exercise.exercise_category && (
                    <span className="badge bg-info">
                      {exercise.exercise_category}
                    </span>
                  )}
                </div>
                
                <h6>Description</h6>
                <div className="p-3 bg-light rounded">
                  {exercise.description ? (
                    <div dangerouslySetInnerHTML={{ __html: exercise.description }} />
                  ) : (
                    <p className="text-muted mb-0">Aucune description disponible</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {!exercise && (
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <FaDumbbell className="me-2 text-primary" /> Détails de l'exercice
                </h5>
              </div>
              <div className="card-body text-center py-5">
                <FaInfoCircle size={32} className="text-muted mb-3" />
                <p className="text-muted">
                  Détails de l'exercice #{swimSet.exercise_id} non disponibles
                </p>
              </div>
            </div>
          )}
          
          {!workout && (
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <FaRunning className="me-2 text-primary" /> Séance associée
                </h5>
              </div>
              <div className="card-body text-center py-5">
                <FaInfoCircle size={32} className="text-muted mb-3" />
                <p className="text-muted">
                  Détails de la séance #{swimSet.workout_id} non disponibles
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwimSetsPage;