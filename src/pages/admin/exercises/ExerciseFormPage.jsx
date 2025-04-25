import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaSave, 
  FaUpload, 
  FaImage, 
  FaTrash,
  FaExclamationTriangle,
  FaInfoCircle,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaDumbbell,
  FaSortAmountDownAlt
} from 'react-icons/fa';
import { getExercise, createExercise, updateExercise } from '../../../services/exercises';
import { getUpload, createUpload, getUploads } from '../../../services/uploads';
import { getUsers } from '../../../services/users';
import TextEditor from "../../../components/ui/forms/TextEditor";
import "quill/dist/quill.snow.css"; // Import du CSS pour TextEditor

/**
 * 🇬🇧 Form page for creating and editing exercises
 * 🇫🇷 Page de formulaire pour créer et modifier des exercices
 */
const ExerciseFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    exercise_level: '',
    exercise_category: '',
    upload_id: '',
    user_id: ''
  });

  // File upload state
  const [newImageFile, setNewImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  // Status states
  const [loading, setLoading] = useState(false);
  const [uploadsLoading, setUploadsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [apiErrors, setApiErrors] = useState({
    uploads: null,
    users: null
  });
  const [uploads, setUploads] = useState([]);
  const [users, setUsers] = useState([]);

  /**
   * 🇬🇧 New states for image search and pagination
   * 🇫🇷 Nouveaux états pour la recherche d'images et la pagination
   */
  const [imageSearchTerm, setImageSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(20);
  const [filteredUploads, setFilteredUploads] = useState([]);

  // Exercise levels and categories for dropdown options
  const exerciseLevels = ['Débutant', 'Intermédiaire', 'Avancé'];
  const exerciseCategories = ['Correctif De Nage', 'Correctif De Style', 'Travail de Base'];

  // Load exercise data if in edit mode
  useEffect(() => {
    const fetchExercise = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const response = await getExercise(id);
          const exerciseData = response.data;
          
          setFormData({
            title: exerciseData.title || '',
            description: exerciseData.description || '',
            exercise_level: exerciseData.exercise_level || '',
            exercise_category: exerciseData.exercise_category || '',
            upload_id: exerciseData.upload_id ? exerciseData.upload_id.toString() : '',
            user_id: exerciseData.user_id ? exerciseData.user_id.toString() : ''
          });
          
          // Fetch current image if available
          if (exerciseData.upload_id) {
            try {
              const imageResponse = await getUpload(exerciseData.upload_id);
              setCurrentImage(imageResponse.data);
            } catch (imageError) {
              console.error('Erreur lors du chargement de l\'image:', imageError);
            }
          }
          
          setError(null);
        } catch (err) {
          console.error('Erreur lors du chargement de l\'exercice:', err);
          setError(`Erreur lors du chargement de l'exercice: ${err.response?.data?.message || err.message}`);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchExercise();
  }, [id, isEditMode]);

  // Load uploads
  useEffect(() => {
    const fetchUploads = async () => {
      try {
        setUploadsLoading(true);
        setApiErrors(prev => ({ ...prev, uploads: null }));
        
        // Utiliser le service API au lieu de fetch direct
        const response = await getUploads();
        
        console.log('Uploads récupérés:', response.data);
        
        /**
         * 🇬🇧 Sort uploads by creation date (newest first) instead of by filename
         * 🇫🇷 Trier les uploads par date de création (les plus récents d'abord) au lieu du nom de fichier
         */
        const sortedUploads = response.data.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );

        setUploads(sortedUploads);
        
        /**
         * 🇬🇧 Initialize filtered uploads with only image type uploads
         * 🇫🇷 Initialiser les uploads filtrés avec uniquement les uploads de type image
         */
        setFilteredUploads(sortedUploads.filter(u => u.type === 'image'));
      } catch (err) {
        console.error("Erreur lors du chargement des images:", err);
        setApiErrors(prev => ({ 
          ...prev, 
          uploads: `Erreur lors du chargement des images: ${err.message}` 
        }));
      } finally {
        setUploadsLoading(false);
      }
    };

    fetchUploads();
  }, []);

  /**
   * 🇬🇧 Effect for filtering uploads based on search term
   * 🇫🇷 Effet pour filtrer les uploads en fonction du terme de recherche
   */
  useEffect(() => {
    // Reset to first page when search term changes
    setCurrentPage(1);
    
    // Filter uploads based on search term and image type
    const filteredResults = uploads
      .filter(upload => 
        upload.type === 'image' && 
        upload.filename.toLowerCase().includes(imageSearchTerm.toLowerCase())
      );
    
    setFilteredUploads(filteredResults);
  }, [imageSearchTerm, uploads]);

  // Load users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        setApiErrors(prev => ({ ...prev, users: null }));
        
        // Utiliser le service API au lieu de fetch direct
        const response = await getUsers();
        
        console.log('Utilisateurs récupérés:', response.data);
        
        // Trier les utilisateurs par nom d'utilisateur
        const sortedUsers = response.data.sort((a, b) => {
          const nameA = a.username || a.email || '';
          const nameB = b.username || b.email || '';
          return nameA.localeCompare(nameB);
        });

        setUsers(sortedUsers);
      } catch (err) {
        console.error("Erreur lors du chargement des utilisateurs:", err);
        setApiErrors(prev => ({ 
          ...prev, 
          users: `Erreur lors du chargement des utilisateurs: ${err.message}` 
        }));
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      exercise_category: prev.exercise_category === category ? '' : category
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Type de fichier non supporté. Utilisez JPG, PNG ou GIF.');
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setError('L\'image est trop volumineuse. Taille maximum: 2MB');
      return;
    }

    setNewImageFile(file);
    
    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Reset any existing upload_id
    setFormData(prev => ({
      ...prev,
      upload_id: ''
    }));
    
    // Clear any errors
    setError(null);
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setNewImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      upload_id: ''
    }));
  };

  // Handle existing image selection
  const handleExistingImageSelect = (uploadId) => {
    setFormData(prev => ({
      ...prev,
      upload_id: uploadId
    }));
    setNewImageFile(null);
    setImagePreview(null);
  };

  /**
   * 🇬🇧 Handle image search input change
   * 🇫🇷 Gérer le changement dans le champ de recherche d'images
   */
  const handleImageSearchChange = (e) => {
    setImageSearchTerm(e.target.value);
  };

  /**
   * 🇬🇧 Handle pagination - go to next page
   * 🇫🇷 Gérer la pagination - aller à la page suivante
   */
  const handleNextPage = () => {
    const totalPages = Math.ceil(filteredUploads.length / imagesPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  /**
   * 🇬🇧 Handle pagination - go to previous page
   * 🇫🇷 Gérer la pagination - aller à la page précédente
   */
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  /**
   * 🇬🇧 Get current images to display based on pagination
   * 🇫🇷 Obtenir les images actuelles à afficher en fonction de la pagination
   */
  const getCurrentImages = () => {
    const indexOfLastImage = currentPage * imagesPerPage;
    const indexOfFirstImage = indexOfLastImage - imagesPerPage;
    return filteredUploads.slice(indexOfFirstImage, indexOfLastImage);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.user_id) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Upload new image if provided
      let finalUploadId = formData.upload_id;
      
      if (newImageFile) {
        const imageFormData = new FormData();
        imageFormData.append('filename', newImageFile.name);
        imageFormData.append('file', newImageFile);
        imageFormData.append('type', 'image');
        imageFormData.append('user_id', formData.user_id);
        
        const uploadResponse = await createUpload(imageFormData);
        finalUploadId = uploadResponse.data.id.toString();
      }

      // Préparer les données à envoyer
      const submitData = {
        title: formData.title,
        description: formData.description,
        exercise_level: formData.exercise_level || null,
        exercise_category: formData.exercise_category || null,
        upload_id: finalUploadId ? parseInt(finalUploadId) : null,
        user_id: parseInt(formData.user_id)
      };

      if (isEditMode) {
        await updateExercise(id, submitData);
      } else {
        await createExercise(submitData);
      }

      // Rediriger vers la liste des exercices
      navigate('/admin/exercises');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(`Erreur lors de l'enregistrement: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Fonction pour déboguer l'état actuel des composants principaux
  const logDebugState = () => {
    console.log('État actuel:', {
      users: {
        count: users.length,
        firstUser: users[0],
        loading: usersLoading,
        error: apiErrors.users
      },
      uploads: {
        count: uploads.length,
        imagesCount: uploads.filter(u => u.type === 'image').length,
        firstUpload: uploads[0],
        loading: uploadsLoading,
        error: apiErrors.uploads
      },
      formData,
      pagination: {
        currentPage,
        imagesPerPage,
        totalImages: filteredUploads.length,
        totalPages: Math.ceil(filteredUploads.length / imagesPerPage)
      }
    });
  };

  return (
    <div className="container py-4">
      {/* Titre Section */}
               <div className="row mb-4">
                       <div className="col-12">
                         <div className="card border-0 shadow-sm">
                           <div className="card-header bg-primary-subtle">
                             <h2 className="card-title mb-0">
                               <FaDumbbell className="me-2" />
                               Créer un nouvel exercice
                             </h2>
                           </div>
                         </div>
                       </div>
                     </div>
                     <br></br>
      <button 
        className="btn btn-success btn-lg d-flex align-items-center" 
        onClick={() => navigate('/admin/exercises')}
      >
        <FaArrowLeft className="me-2" /> Retour à la liste Des Exercices
      </button>
<br></br>
      <div className="card shadow">
        <div className="card-header bg-white">
          <h5 className="card-title mb-0">
            {isEditMode ? "Modifier l'exercice" : "Nouveau exercice"}
          </h5>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-danger" role="alert">
                  <FaExclamationTriangle className="me-2" />
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="title" className="form-label">Titre <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <TextEditor
                  value={formData.description} 
                  onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))} 
                />
              </div>

              {/* Niveau - Menu déroulant */}
              <div className="mb-3">
                <label htmlFor="exercise_level" className="form-label">Niveau</label>
                <select
                  className="form-select"
                  id="exercise_level"
                  name="exercise_level"
                  value={formData.exercise_level}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner un niveau</option>
                  {exerciseLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Catégorie - Boutons à cocher */}
              <div className="mb-4">
                <label className="form-label d-block">Catégorie</label>
                <div className="d-flex flex-wrap gap-2">
                  {exerciseCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`btn ${formData.exercise_category === category ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image - Upload et sélection */}
              <div className="mb-4">
                <label className="form-label">Image</label>
                
                {/* Upload de nouvelle image */}
                <div className="card mb-3">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-3">Télécharger une nouvelle image</h6>
                    
                    {imagePreview ? (
                      <div className="mb-3">
                        <div className="position-relative mb-2" style={{ maxWidth: '300px' }}>
                          <img 
                            src={imagePreview} 
                            alt="Aperçu" 
                            className="img-fluid rounded"
                          />
                          <button 
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                            onClick={handleRemoveImage}
                            title="Supprimer l'image"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <small className="text-muted">
                          Fichier sélectionné: {newImageFile?.name}
                        </small>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <label className="btn btn-outline-primary">
                          <FaUpload className="me-2" /> Sélectionner une image
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="d-none"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Sélection d'une image existante */}
                <div className="card mb-3">
                  <div className="card-header bg-light">
                    <h6 className="card-subtitle mb-0">
                      Ou sélectionner une image existante
                      {formData.upload_id && !newImageFile && (
                        <span className="text-success ms-2">
                          (Image sélectionnée)
                        </span>
                      )}
                    </h6>
                  </div>
                  <div className="card-body">
                    {/* Message de chargement des images */}
                    {uploadsLoading && (
                      <div className="d-flex align-items-center mb-3">
                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                          <span className="visually-hidden">Chargement...</span>
                        </div>
                        <span>Chargement des images disponibles...</span>
                      </div>
                    )}
                    
                    {/* Erreur de chargement des images */}
                    {apiErrors.uploads && (
                      <div className="alert alert-warning" role="alert">
                        <FaExclamationTriangle className="me-2" />
                        {apiErrors.uploads}
                      </div>
                    )}
                    
                    {/* Image actuelle (si en mode édition) */}
                    {isEditMode && currentImage && formData.upload_id && (
                      <div className="mb-4">
                        <h6 className="mb-2">Image actuelle:</h6>
                        <div className="d-flex align-items-center">
                          <img 
                            src={currentImage.url} 
                            alt={currentImage.filename}
                            className="img-thumbnail me-3"
                            style={{ maxWidth: '100px', maxHeight: '100px' }}
                          />
                          <div>
                            <p className="mb-1">{currentImage.filename}</p>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => setFormData(prev => ({ ...prev, upload_id: '' }))}
                            >
                              Retirer
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Recherche d'images */}
                    {!uploadsLoading && !apiErrors.uploads && (
                      <div className="mb-3">
                        <div className="input-group">
                          <span className="input-group-text" id="image-search">
                            <FaSearch />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Rechercher une image par nom..."
                            value={imageSearchTerm}
                            onChange={handleImageSearchChange}
                            aria-label="Rechercher une image"
                            aria-describedby="image-search"
                          />
                        </div>
                        <div className="d-flex align-items-center mt-2">
                          <small className="text-muted">
                            <FaSortAmountDownAlt className="me-1" /> 
                            Les plus récentes en premier • 
                            {filteredUploads.length} image{filteredUploads.length !== 1 ? 's' : ''} disponible{filteredUploads.length !== 1 ? 's' : ''}
                          </small>
                        </div>
                      </div>
                    )}
                    
                    {/* Liste des images disponibles */}
                    {!uploadsLoading && !apiErrors.uploads && (
                      <>
                        {filteredUploads.length > 0 ? (
                          <>
                            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
                              {getCurrentImages().map((upload) => (
                                <div key={upload.id} className="col">
                                  <div 
                                    className={`card h-100 ${formData.upload_id === upload.id.toString() ? 'border-primary' : ''}`}
                                    onClick={() => handleExistingImageSelect(upload.id.toString())}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <div className="card-img-top" style={{ height: '120px', overflow: 'hidden' }}>
                                      <img 
                                        src={upload.url}
                                        alt={upload.filename}
                                        className="img-fluid w-100 h-100"
                                        style={{ objectFit: 'cover' }}
                                        onError={(e) => e.target.src = 'https://placehold.co/100x100?text=Error'}
                                      />
                                    </div>
                                    <div className="card-body p-2">
                                      <p className="card-text small text-truncate mb-0" title={upload.filename}>
                                        {upload.filename}
                                      </p>
                                      <small className="text-muted">
                                        {new Date(upload.created_at).toLocaleDateString()}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Pagination */}
                            {filteredUploads.length > imagesPerPage && (
                              <div className="d-flex justify-content-between align-items-center mt-4">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={handlePrevPage}
                                  disabled={currentPage === 1}
                                >
                                  <FaChevronLeft className="me-1" /> Précédent
                                </button>
                                
                                <div className="px-3">
                                  <span className="text-muted">
                                    Page {currentPage} sur {Math.ceil(filteredUploads.length / imagesPerPage)}
                                  </span>
                                </div>
                                
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={handleNextPage}
                                  disabled={currentPage >= Math.ceil(filteredUploads.length / imagesPerPage)}
                                >
                                  Suivant <FaChevronRight className="ms-1" />
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="alert alert-info" role="alert">
                            <FaInfoCircle className="me-2" />
                            {imageSearchTerm ? 
                              `Aucune image trouvée pour "${imageSearchTerm}".` : 
                              'Aucune image disponible. Veuillez télécharger une nouvelle image.'}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="user_id" className="form-label">Créé par <span className="text-danger">*</span></label>
                
                {/* Message de chargement des utilisateurs */}
                {usersLoading && (
                  <div className="d-flex align-items-center mb-3">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                      <span className="visually-hidden">Chargement...</span>
                    </div>
                    <span>Chargement des utilisateurs...</span>
                  </div>
                )}
                
                {/* Erreur de chargement des utilisateurs */}
                {apiErrors.users && (
                  <div className="alert alert-warning" role="alert">
                    <FaExclamationTriangle className="me-2" />
                    {apiErrors.users}
                  </div>
                )}
                
                <select
                  className="form-select"
                  id="user_id"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  required
                  disabled={usersLoading}
                >
                  <option value="">Sélectionner un créateur</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name && user.last_name 
                        ? `${user.first_name} ${user.last_name} (${user.username || user.email})` 
                        : user.username || user.email || `Utilisateur #${user.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" /> Enregistrer
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      {/* Section de débogage (visible seulement en mode dev) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="card mt-4">
          <div className="card-header bg-light">
            <h6 className="mb-0">Informations de débogage</h6>
          </div>
          <div className="card-body">
            <button 
              type="button" 
              className="btn btn-sm btn-outline-secondary me-2"
              onClick={logDebugState}
            >
              Logger l'état actuel dans la console
            </button>
            
            <div className="mt-3">
              <p className="mb-1"><strong>Images:</strong> {uploads.length} total, {uploads.filter(u => u.type === 'image').length} images</p>
              <p className="mb-1"><strong>Utilisateurs:</strong> {users.length} total</p>
              <p className="mb-1"><strong>États de chargement:</strong> Images: {uploadsLoading ? 'Oui' : 'Non'}, Utilisateurs: {usersLoading ? 'Oui' : 'Non'}</p>
              <p className="mb-1"><strong>Filtrage des images:</strong> {filteredUploads.length} sur {uploads.filter(u => u.type === 'image').length} affichées</p>
              <p className="mb-1"><strong>Pagination:</strong> Page {currentPage} sur {Math.ceil(filteredUploads.length / imagesPerPage)}</p>
              <p className="mb-0"><strong>Erreurs API:</strong> Images: {apiErrors.uploads ? 'Oui' : 'Non'}, Utilisateurs: {apiErrors.users ? 'Oui' : 'Non'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseFormPage;