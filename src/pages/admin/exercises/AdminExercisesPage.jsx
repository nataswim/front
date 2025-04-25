import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaFilter, 
  FaSearch, 
  FaSync,
  FaDumbbell,
  FaTag,
  FaUser,
  FaCalendarAlt,
  FaImage
} from 'react-icons/fa';
import { getExercises, deleteExercise } from '../../../services/exercises';
import { getUpload } from '../../../services/uploads';
import { getUser } from '../../../services/users';

/**
 * 🇬🇧 Admin page for exercises management
 * 🇫🇷 Page d'administration pour la gestion des exercices
 */
const AdminExercisesPage = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [imageData, setImageData] = useState({});
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const [thumbnailErrors, setThumbnailErrors] = useState({});

  // Exercise categories and levels
  const exerciseCategories = ['Correctif De Nage', 'Correctif De Style', 'Travail de Base'];
  const exerciseLevels = ['Débutant', 'Intermédiaire', 'Avancé'];

  // Fetch exercises
  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await getExercises();
      const exercisesData = response.data;
      setExercises(exercisesData);
      
      // Fetch images for exercises with upload_id
      const exercisesWithImages = exercisesData.filter(exercise => exercise.upload_id);
      
      // Fetch images in parallel
      const imagePromises = exercisesWithImages.map(exercise => 
        getUpload(exercise.upload_id)
          .then(res => ({ exerciseId: exercise.id, imageData: res.data }))
          .catch(err => {
            console.error(`Erreur de chargement de l'image pour l'exercice ${exercise.id}:`, err);
            return { exerciseId: exercise.id, imageData: null };
          })
      );
      
      const imagesResults = await Promise.all(imagePromises);
      
      // Create image data object
      const imagesObj = imagesResults.reduce((acc, item) => {
        if (item.imageData) {
          acc[item.exerciseId] = item.imageData;
        }
        return acc;
      }, {});
      
      setImageData(imagesObj);
      
      // Fetch user data for each unique user_id
      const uniqueUserIds = [...new Set(exercisesData.map(exercise => exercise.user_id))];
      
      const userPromises = uniqueUserIds.map(userId => 
        getUser(userId)
          .then(res => ({ userId, userData: res.data }))
          .catch(err => {
            console.error(`Erreur de chargement des données de l'utilisateur ${userId}:`, err);
            return { userId, userData: null };
          })
      );
      
      const usersResults = await Promise.all(userPromises);
      
      // Create user data object
      const usersObj = usersResults.reduce((acc, item) => {
        if (item.userData) {
          acc[item.userId] = item.userData;
        }
        return acc;
      }, {});
      
      setUserData(usersObj);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des exercices:', err);
      setError('Impossible de charger les exercices. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  // Filter exercises
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (exercise.description && exercise.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || exercise.exercise_category === categoryFilter;
    const matchesLevel = levelFilter === 'all' || exercise.exercise_level === levelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Pagination
  const pageCount = Math.ceil(filteredExercises.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentExercises = filteredExercises.slice(offset, offset + itemsPerPage);

  // Delete handler
  const handleDelete = async (id, title) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'exercice "${title}" ?`)) {
      try {
        await deleteExercise(id);
        await fetchExercises();
      } catch (err) {
        setError('Erreur lors de la suppression: ' + err.message);
      }
    }
  };

  // Handle thumbnail error
  const handleThumbnailError = (exerciseId) => {
    setThumbnailErrors(prev => ({
      ...prev,
      [exerciseId]: true
    }));
  };

  // Get level badge color
  const getLevelBadgeColor = (level) => {
    switch (level) {
      case 'Débutant': return 'success';
      case 'Intermédiaire': return 'warning';
      case 'Avancé': return 'danger';
      default: return 'secondary';
    }
  };

  // Format description preview - remove HTML tags
  const formatDescriptionPreview = (description, maxLength = 120) => {
    if (!description) return "Aucune description disponible";
    
    // Remove HTML tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = description;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...'
      : textContent;
  };

  // Get user name from user_id
  const getUserName = (userId) => {
    if (!userData[userId]) return `User #${userId}`;
    
    const user = userData[userId];
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    
    return user.username || `User #${userId}`;
  };

  // Calculate days since creation
  const getDaysSinceCreation = (createdAt) => {
    const creationDate = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today - creationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "aujourd'hui";
    if (diffDays === 1) return "hier";
    return `il y a ${diffDays} jours`;
  };

  // Format date to French locale
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
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

  return (
    <div className="container-fluid py-4">

         {/* Titre Section */}
         <div className="row mb-4">
                 <div className="col-12">
                   <div className="card border-0 shadow-sm">
                     <div className="card-header bg-primary-subtle">
                       <h2 className="card-title mb-0">
                         <FaDumbbell className="me-2" />
                         Gestion des Exercices
                       </h2>
                     </div>
                   </div>
                 </div>
               </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <p className="text-muted mb-0">
            {exercises.length} exercice{exercises.length > 1 ? 's' : ''} au total
          </p>
        </div>
 

        <button 
          className="btn btn-success btn-lg d-flex align-items-center"
          onClick={() => navigate('/admin/exercises/new')}
        >
          <FaPlus className="me-2" /> Nouvel exercice
        </button>
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher un exercice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-8">
              <div className="d-flex gap-2">
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
                    {exerciseCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaFilter />
                  </span>
                  <select
                    className="form-select"
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
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
                >
                  <FaSync />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Exercises List */}
      <div className="row g-4">
        {currentExercises.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info" role="alert">
              Aucun exercice ne correspond à vos critères de recherche.
            </div>
          </div>
        ) : (
          currentExercises.map((exercise) => (
            <div key={exercise.id} className="col-md-6 col-xl-4">
              <div className="card h-100 shadow-sm hover-lift">
                <div className="card-header bg-white border-bottom-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className={`badge bg-${getLevelBadgeColor(exercise.exercise_level)}`}>
                      {exercise.exercise_level || 'Non défini'}
                    </span>
                    <small className="text-muted">
                      ID: {exercise.id}
                    </small>
                  </div>
                </div>
                <div className="card-body d-flex flex-column align-items-center">
                  {/* Image or Icon */}
                  <div 
                    className="mb-3 d-flex justify-content-center align-items-center" 
                    style={{ height: '150px', width: '100%' }}
                  >
                    {exercise.upload_id && imageData[exercise.id] && imageData[exercise.id].url && !thumbnailErrors[exercise.id] ? (
                      <img
                        src={imageData[exercise.id].url}
                        alt={exercise.title}
                        className="img-fluid rounded"
                        style={{ 
                          maxHeight: '150px',
                          maxWidth: '100%',
                          objectFit: 'contain'
                        }}
                        onError={() => handleThumbnailError(exercise.id)}
                      />
                    ) : (
                      <div className="bg-light rounded d-flex justify-content-center align-items-center" style={{ height: '100px', width: '100px' }}>
                        {exercise.upload_id ? <FaImage size={32} /> : <FaDumbbell size={32} />}
                      </div>
                    )}
                  </div>
                  
                  {/* Title and Category */}
                  <h3 className="h5 card-title text-center mb-2">{exercise.title}</h3>
                  
                  {exercise.exercise_category && (
                    <span className="badge bg-info bg-opacity-10 text-info mb-3">
                      <FaTag className="me-1" /> {exercise.exercise_category}
                    </span>
                  )}

                  {/* Description */}
                  <p className="card-text text-muted small mb-3 text-center">
                    {formatDescriptionPreview(exercise.description)}
                  </p>

                  <div className="mt-auto w-100">
                    <div className="d-flex align-items-center text-muted small mb-2">
                      <FaUser className="me-2" />
                      Créé par: {getUserName(exercise.user_id)}
                    </div>

                    <div className="d-flex align-items-center text-muted small">
                      <FaCalendarAlt className="me-2" />
                      Créé le: {formatDate(exercise.created_at)} ({getDaysSinceCreation(exercise.created_at)})
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-white border-top-0">
                  <div className="d-flex justify-content-between">
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/admin/exercises/${exercise.id}`)}
                    >
                      <FaEye className="me-1" /> Détails
                    </button>
                    <div>
                      <button 
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => navigate(`/admin/exercises/${exercise.id}/edit`)}
                      >
                        <FaEdit className="me-1" /> Modifier
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(exercise.id, exercise.title)}
                      >
                        <FaTrash className="me-1" /> Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredExercises.length > itemsPerPage && (
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
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span className="ms-2">éléments</span>
            </div>
            
            <nav aria-label="Navigation des pages">
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    &laquo;
                  </button>
                </li>
                
                {[...Array(pageCount)].map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === pageCount - 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pageCount - 1}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExercisesPage;