import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaUser, 
  FaCalendarAlt, 
  FaImage,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { getExercise } from '../../../services/exercises';
import { getUpload } from '../../../services/uploads';

/**
 * 🇬🇧 Exercise detail page component - Displays full information about a specific exercise
 * 🇫🇷 Composant de la page de détail d'exercice - Affiche les informations complètes d'un exercice spécifique
 */
const ExerciseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [mediaImage, setMediaImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        setLoading(true);
        // Fetch exercise details
        const exerciseResponse = await getExercise(id);
        setExercise(exerciseResponse.data);

        // If exercise has an upload_id, fetch the image
        if (exerciseResponse.data.upload_id) {
          try {
            const imageResponse = await getUpload(exerciseResponse.data.upload_id);
            setMediaImage(imageResponse.data);
          } catch (imageError) {
            console.error('Erreur lors du chargement du média associé:', imageError);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseData();
  }, [id]);

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
          onClick={() => navigate('/admin/exercises')}
        >
          <FaArrowLeft className="me-2" /> Retour à la liste
        </button>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning" role="alert">
          Exercice non trouvé
        </div>
        <button 
          className="btn btn-outline-primary" 
          onClick={() => navigate('/admin/exercises')}
        >
          <FaArrowLeft className="me-2" /> Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* 1. Titre Section - en pleine largeur */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary-subtle bg-gradient py-3">
              <h2 className="card-title mb-0 text-center fs-2">
                <FaEdit className="me-2" />
                {exercise.title}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Niveau et Catégorie - cartes séparées */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-light">
              <h2 className="h5 mb-0">Niveau</h2>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <span className={`badge bg-${
                exercise.exercise_level === 'Débutant' ? 'success' :
                exercise.exercise_level === 'Intermédiaire' ? 'warning' :
                exercise.exercise_level === 'Avancé' ? 'danger' :
                'secondary'
              } fs-4 px-4 py-2`}>
                {exercise.exercise_level || "Non défini"}
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-light">
              <h2 className="h5 mb-0">Catégorie</h2>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <span className="badge bg-info fs-5 px-3 py-2">
                {exercise.exercise_category || "Non catégorisé"}
              </span>
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
              {exercise.description ? (
                <div 
                  className="description-content"
                  dangerouslySetInnerHTML={{ __html: exercise.description }}
                />
              ) : (
                <p className="text-muted">Aucune description disponible</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Média associé - carte séparée */}
      {mediaImage && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h2 className="h5 mb-0">
                  <FaImage className="text-primary me-2" />
                  Média associé
                </h2>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <img 
                      src={mediaImage.url} 
                      alt={mediaImage.filename}
                      className="img-fluid rounded w-100"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/400x300?text=Image+non+disponible';
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <h3 className="h6 mb-3">Détails du fichier</h3>
                    <dl className="row">
                      <dt className="col-sm-4">Nom</dt>
                      <dd className="col-sm-8">{mediaImage.filename}</dd>
                      
                      <dt className="col-sm-4">Type</dt>
                      <dd className="col-sm-8">{mediaImage.type || "Non spécifié"}</dd>
                      
                      <dt className="col-sm-4">ID</dt>
                      <dd className="col-sm-8">{mediaImage.id}</dd>
                      
                      <dt className="col-sm-4">Actions</dt>
                      <dd className="col-sm-8">
                        <a 
                          href={mediaImage.url} 
                          className="btn btn-outline-primary"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Voir en plein écran
                        </a>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  Créé par: User #{exercise.user_id}
                </li>
                <li className="mb-2">
                  <FaCalendarAlt className="text-primary me-2" />
                  Créé le: {new Date(exercise.created_at).toLocaleDateString()}
                </li>
                {exercise.updated_at && (
                  <li>
                    <FaCalendarAlt className="text-primary me-2" />
                    Dernière modification: {new Date(exercise.updated_at).toLocaleDateString()}
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
            onClick={() => navigate('/admin/exercises')}
          >
            <FaArrowLeft className="me-2" /> Liste des Exercices
          </button>
        </div>
        <div className="col-md-4 mb-3 mb-md-0">
          <a
            href={`http://localhost:3000/user/exercises/${id}`}
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
            onClick={() => navigate(`/admin/exercises/${id}/edit`)}
          >
            <FaEdit className="me-2" /> Modifier Cet Exercice
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailPage;