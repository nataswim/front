import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaFilter, 
  FaSearch, 
  FaSync,
  FaSwimmingPool,
  FaSwimmer
} from 'react-icons/fa';
import { getExercises } from '../../services/exercises';
import { getUpload } from '../../services/uploads';

/**
 * 🇬🇧 User's exercises list component with card display
 * This component displays a grid of swimming training exercises with filtering and pagination
 * 
 * 🇫🇷 Composant de liste d'exercices utilisateur avec affichage en cartes
 * Ce composant affiche une grille d'exercices d'entraînement de natation avec filtrage et pagination
 */
const UserExercisesList = () => {
  const navigate = useNavigate();
  
  /**
   * 🇬🇧 State management for the component
   * 
   * 🇫🇷 Gestion des états du composant
   */
  const [exercises, setExercises] = useState([]);
  const [imageData, setImageData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12); // Augmenté pour afficher plus de cartes à la fois
  const [thumbnailErrors, setThumbnailErrors] = useState({});

  // Catégories et niveaux d'exercices
  const exerciseCategories = ['Correctif De Nage', 'Correctif De Style', 'Travail de Base'];
  const exerciseLevels = ['Débutant', 'Intermédiaire', 'Avancé'];

  /**
   * 🇬🇧 Fetch exercises data from API
   * 
   * 🇫🇷 Récupération des données d'exercices depuis l'API
   */
  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getExercises();
      setExercises(response.data);
      
      // Récupérer les images pour les exercices avec upload_id
      const exercisesWithImages = response.data.filter(exercise => exercise.upload_id);
      
      // Récupérer les images en parallèle
      const imagePromises = exercisesWithImages.map(exercise => 
        getUpload(exercise.upload_id)
          .then(res => ({ exerciseId: exercise.id, imageData: res.data }))
          .catch(err => {
            console.error(`Erreur de chargement de l'image pour l'exercice ${exercise.id}:`, err);
            return { exerciseId: exercise.id, imageData: null };
          })
      );
      
      const imagesResults = await Promise.all(imagePromises);
      
      // Créer un objet de données d'images
      const imagesObj = imagesResults.reduce((acc, item) => {
        if (item.imageData) {
          acc[item.exerciseId] = item.imageData;
        }
        return acc;
      }, {});
      
      setImageData(imagesObj);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des exercices:', err);
      setError('Impossible de charger les exercices. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les exercices au montage du composant
  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  /**
   * 🇬🇧 Filter exercises based on search term, category and level
   * 
   * 🇫🇷 Filtrer les exercices selon le terme de recherche, la catégorie et le niveau
   */
  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (exercise.description && exercise.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || exercise.exercise_category === categoryFilter;
      const matchesLevel = levelFilter === 'all' || exercise.exercise_level === levelFilter;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [exercises, searchTerm, categoryFilter, levelFilter]);

  // Pagination
  const paginationData = useMemo(() => {
    const pageCount = Math.ceil(filteredExercises.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentExercises = filteredExercises.slice(offset, offset + itemsPerPage);
    return { pageCount, currentExercises };
  }, [filteredExercises, currentPage, itemsPerPage]);

  /**
   * 🇬🇧 Handle thumbnail loading errors
   * 
   * 🇫🇷 Gestion des erreurs de chargement des miniatures
   */
  const handleThumbnailError = useCallback((exerciseId) => {
    setThumbnailErrors(prev => ({
      ...prev,
      [exerciseId]: true
    }));
  }, []);

  /**
   * 🇬🇧 Navigate to exercise details
   * 
   * 🇫🇷 Naviguer vers les détails de l'exercice
   */
  const handleExerciseClick = useCallback((exerciseId) => {
    navigate(`/user/exercises/${exerciseId}`);
  }, [navigate]);

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center" role="status" aria-live="polite">
          <div className="spinner-border text-primary" aria-hidden="true">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* En-tête */}
      <div>
        <h1 className="display-6 fw-bold mb-4 title-swim">Educatifs</h1>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <p className="text-muted mb-0">
            {exercises.length} exercice{exercises.length > 1 ? 's' : ''} au total
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <FaSearch aria-hidden="true" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher un exercice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Rechercher un exercice"
                />
              </div>
            </div>
            <div className="col-md-8">
              <div className="d-flex gap-2">
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaFilter aria-hidden="true" />
                  </span>
                  <select
                    className="form-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    aria-label="Filtrer par catégorie"
                  >
                    <option value="all">Toutes les catégories</option>
                    {exerciseCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaFilter aria-hidden="true" />
                  </span>
                  <select
                    className="form-select"
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    aria-label="Filtrer par niveau"
                  >
                    <option value="all">Tous les niveaux</option>
                    {exerciseLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={fetchExercises}
                  title="Rafraîchir"
                  aria-label="Rafraîchir la liste"
                >
                  <FaSync aria-hidden="true" />
                </button>
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

      {/* Affichage en cartes */}
      {paginationData.currentExercises.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body p-5 text-center">
            <FaSwimmer className="text-muted fs-1 mb-3" aria-hidden="true" />
            <p className="text-muted">
              Aucun exercice ne correspond à vos critères de recherche.
            </p>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-4 g-4 mb-4">
          {paginationData.currentExercises.map((exercise) => (
            <div key={exercise.id} className="col">
              <div 
                className="card h-100 shadow-sm hover-lift" 
                style={{ cursor: 'pointer' }}
                onClick={() => handleExerciseClick(exercise.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleExerciseClick(exercise.id);
                  }
                }}
                tabIndex="0"
                role="button"
                aria-label={`Voir les détails de l'exercice ${exercise.title}`}
              >
                <div className="card-img-container" style={{ height: '180px', overflow: 'hidden' }}>
                  {exercise.upload_id && imageData[exercise.id] && imageData[exercise.id].url && !thumbnailErrors[exercise.id] ? (
                    <img
                      src={imageData[exercise.id].url}
                      alt=""
                      className="card-img-top"
                      style={{ 
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onError={() => handleThumbnailError(exercise.id)}
                    />
                  ) : (
                    <div className="bg-light d-flex justify-content-center align-items-center h-100">
                      <FaSwimmingPool className="text-primary" style={{ fontSize: '3rem' }} aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title">{exercise.title}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredExercises.length > itemsPerPage && (
        <nav aria-label="Pagination des exercices">
          <div className="card mt-4">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <span className="me-2">Afficher</span>
                <select 
                  className="form-select form-select-sm" 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(0);
                  }}
                  style={{width: '70px'}}
                  aria-label="Nombre d'éléments par page"
                >
                  <option value="8">8</option>
                  <option value="12">12</option>
                  <option value="16">16</option>
                  <option value="24">24</option>
                </select>
                <span className="ms-2">éléments</span>
              </div>
              
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}
                    aria-label="Page précédente"
                  >
                    &laquo;
                  </button>
                </li>
                
                {[...Array(paginationData.pageCount)].map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index)}
                      aria-label={`Page ${index + 1}`}
                      aria-current={currentPage === index ? 'page' : undefined}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === paginationData.pageCount - 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === paginationData.pageCount - 1}
                    aria-label="Page suivante"
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}

      {/* CSS pour l'effet de survol */}
      <style jsx="true">{`
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.12) !important;
          transition: all 0.3s ease;
        }
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover img {
          transform: scale(1.05);
        }
        .hover-lift:focus {
          outline: 3px solid #048080;
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.12) !important;
        }
      `}</style>
    </div>
  );
};

export default React.memo(UserExercisesList);