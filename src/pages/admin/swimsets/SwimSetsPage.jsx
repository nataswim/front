import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaSwimmer, FaDumbbell, FaImage } from 'react-icons/fa';
import axios from 'axios';

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

  if (loading) {
    return (
      <div className="container py-4">
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
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          {error}
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
      <div className="container py-4">
        <div className="alert alert-warning" role="alert">
          Série non trouvée
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
    <div className="container py-4">
      <div className="card shadow mb-4">
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <button 
                className="btn btn-outline-secondary me-3" 
                onClick={handleBack}
              >
                <FaArrowLeft className="me-2" /> Retour
              </button>
              <div>
                <h5 className="mb-0">Détails de la Série</h5>
                <small className="text-muted">ID: {id}</small>
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleEdit}
            >
              <FaEdit className="me-2" /> Modifier
            </button>
          </div>
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mx-auto">
              <div className="card mb-3">
                <div className="card-header bg-primary text-white">
                  <h6 className="mb-0">
                    <FaSwimmer className="me-2" /> Informations de la série
                  </h6>
                </div>
                <div className="card-body">
                  <dl className="row mb-0">
                    <dt className="col-sm-4">ID:</dt>
                    <dd className="col-sm-8">{swimSet.id}</dd>
                    
                    <dt className="col-sm-4">Séance:</dt>
                    <dd className="col-sm-8">{workout ? workout.title : `Séance #${swimSet.workout_id}`}</dd>
                    
                    <dt className="col-sm-4">Exercice:</dt>
                    <dd className="col-sm-8">{exercise ? exercise.title : `Exercice #${swimSet.exercise_id}`}</dd>
                    
                    <dt className="col-sm-4">Distance:</dt>
                    <dd className="col-sm-8">{swimSet.set_distance} m</dd>
                    
                    <dt className="col-sm-4">Répétitions:</dt>
                    <dd className="col-sm-8">{swimSet.set_repetition || 1}</dd>
                    
                    <dt className="col-sm-4">Temps de repos:</dt>
                    <dd className="col-sm-8">{formatRestTime(swimSet.rest_time)}</dd>
                    
                    <dt className="col-sm-4">Distance totale:</dt>
                    <dd className="col-sm-8">
                      <strong className="text-primary fs-5">
                        {(swimSet.set_distance || 0) * (swimSet.set_repetition || 1)} m
                      </strong>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          {/* Détails de l'exercice en bas de la page */}
          <div className="card mt-4">
            <div className="card-header bg-secondary text-white">
              <h6 className="mb-0">
                <FaDumbbell className="me-2" /> Détails de l'exercice
              </h6>
            </div>
            <div className="card-body">
              {exercise ? (
                <div className="row">
                 
                  
                  <div className="col">
                    <h5 className="mb-3">{exercise.title}</h5>
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
              ) : (
                <p className="text-muted mb-0">
                  Détails de l'exercice non disponibles
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwimSetsPage;