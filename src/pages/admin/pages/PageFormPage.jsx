import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaSave, 
  FaUpload, 
  FaImage, 
  FaTrash 
} from 'react-icons/fa';
import { getPage, createPage, updatePage } from '../../../services/pages';
import { getUpload, createUpload, getUploads } from '../../../services/uploads';
import { getUsers } from '../../../services/users';

import "quill/dist/quill.snow.css"; // Import du CSS
import TextEditor from "../../../components/ui/forms/TextEditor";

const PageFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    page_category: '',
    upload_id: '',
    user_id: ''
  });

  // File upload state
  const [newImageFile, setNewImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  // Status states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 12;

  // Page categories
  const pageCategories = ['Information', 'Conseils', 'Règles', 'Foire aux questions'];

  /**
   * 🇬🇧 Load page data if in edit mode
   * 🇫🇷 Charger les données de la page si en mode édition
   */
  useEffect(() => {
    const fetchPage = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const response = await getPage(id);
          const pageData = response.data;
          
          setFormData({
            title: pageData.title || '',
            content: pageData.content || '',
            page_category: pageData.page_category || '',
            upload_id: pageData.upload_id ? pageData.upload_id.toString() : '',
            user_id: pageData.user_id ? pageData.user_id.toString() : ''
          });
          
          // Fetch current image if available
          if (pageData.upload_id) {
            try {
              const imageResponse = await getUpload(pageData.upload_id);
              setCurrentImage(imageResponse.data);
            } catch (imageError) {
              console.error('Erreur lors du chargement de l\'image:', imageError);
            }
          }
          
          setLoading(false);
        } catch (err) {
          console.error('Erreur lors du chargement de la page:', err);
          setError(`Erreur lors du chargement de la page: ${err.response?.data?.message || err.message}`);
          setLoading(false);
        }
      }
    };

    fetchPage();
  }, [id, isEditMode]);

  /**
   * 🇬🇧 Load uploads and users
   * 🇫🇷 Charger les uploads et les utilisateurs
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Chargement des données...');
        
        // Utiliser les services pour récupérer les données
        const [uploadsResponse, usersResponse] = await Promise.all([
          getUploads(),
          getUsers()
        ]);

        console.log('Données uploads:', uploadsResponse.data);
        console.log('Données users:', usersResponse.data);

        // Vérifier que les données sont un tableau
        const uploadsData = Array.isArray(uploadsResponse.data) ? uploadsResponse.data : [];
        const usersData = Array.isArray(usersResponse.data) ? usersResponse.data : [];

        // Trier les uploads par nom de fichier
        const sortedUploads = uploadsData.sort((a, b) => {
          const filenameA = a?.filename || '';
          const filenameB = b?.filename || '';
          return filenameA.localeCompare(filenameB);
        });

        setUploads(sortedUploads);
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données détaillée:", err);
        console.error("Réponse d'erreur:", err.response);
        console.error("Données d'erreur:", err.response?.data);
        setError("Erreur lors du chargement des données: " + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * 🇬🇧 Handle form input changes
   * 🇫🇷 Gérer les changements dans les champs du formulaire
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changement ${name}: ${value}`);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * 🇬🇧 Handle category selection
   * 🇫🇷 Gérer la sélection de catégorie
   */
  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      page_category: prev.page_category === category ? '' : category
    }));
  };

  /**
   * 🇬🇧 Handle file selection
   * 🇫🇷 Gérer la sélection de fichier
   */
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

  /**
   * 🇬🇧 Handle image removal
   * 🇫🇷 Gérer la suppression d'image
   */
  const handleRemoveImage = () => {
    setNewImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      upload_id: ''
    }));
  };

  /**
   * 🇬🇧 Handle existing image selection
   * 🇫🇷 Gérer la sélection d'une image existante
   */
  const handleExistingImageSelect = (uploadId) => {
    console.log('Image sélectionnée:', uploadId);
    setFormData(prev => ({
      ...prev,
      upload_id: uploadId.toString()
    }));
    setNewImageFile(null);
    setImagePreview(null);
  };

  /**
   * 🇬🇧 Handle form submission
   * 🇫🇷 Gérer la soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.content) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      console.log('Données du formulaire avant envoi:', formData);

      // Upload new image if provided
      let finalUploadId = formData.upload_id;
      
      if (newImageFile) {
        console.log('Upload d\'une nouvelle image...');
        const imageFormData = new FormData();
        imageFormData.append('filename', newImageFile.name);
        imageFormData.append('file', newImageFile);
        imageFormData.append('type', 'image');
        
        // Utiliser l'ID de l'utilisateur actuel si disponible, sinon utiliser l'ID sélectionné
        const currentUserId = localStorage.getItem('user_id') || formData.user_id;
        if (currentUserId) {
          imageFormData.append('user_id', currentUserId);
        }
        
        const uploadResponse = await createUpload(imageFormData);
        console.log('Réponse upload:', uploadResponse.data);
        finalUploadId = uploadResponse.data.id.toString();
      }

      // Préparer les données à envoyer
      const submitData = {
        title: formData.title,
        content: formData.content,
        page_category: formData.page_category || null,
        upload_id: finalUploadId ? parseInt(finalUploadId) : null,
        user_id: parseInt(formData.user_id) || parseInt(localStorage.getItem('user_id') || '1')
      };

      console.log('Données finales à envoyer:', submitData);

      if (isEditMode) {
        await updatePage(id, submitData);
        console.log('Page mise à jour avec succès');
      } else {
        await createPage(submitData);
        console.log('Page créée avec succès');
      }

      // Rediriger vers la liste des pages
      navigate('/admin/pages');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(`Erreur lors de l'enregistrement: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-4">
      <button 
        className="btn btn-outline-primary mb-4" 
        onClick={() => navigate('/admin/pages')}
      >
        <FaArrowLeft className="me-2" /> Retour à la liste
      </button>

      <div className="card shadow">
        <div className="card-header bg-white">
          <h5 className="card-title mb-0">
            {isEditMode ? "Modifier la page" : "Créer une nouvelle page"}
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
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="title" className="form-label">Titre *</label>
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
                <label className="form-label">Contenu *</label>
                <TextEditor
                  value={formData.content} 
                  onChange={(value) => {
                    console.log('Contenu changé');
                    setFormData((prev) => ({ ...prev, content: value }));
                  }} 
                />
              </div>

              {/* Catégorie - Boutons à cocher */}
              <div className="mb-4">
                <label className="form-label d-block">Catégorie</label>
                <div className="d-flex flex-wrap gap-2">
                  {pageCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`btn ${formData.page_category === category ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image d'en-tête - Upload et sélection */}
              <div className="mb-4">
                <label className="form-label">Image d'en-tête</label>
                
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
                  <div className="card-body">
                    <h6 className="card-subtitle mb-3">
                      Ou sélectionner une image existante
                      {formData.upload_id && !newImageFile && (
                        <span className="text-success ms-2">
                          (Image sélectionnée)
                        </span>
                      )}
                    </h6>
                    
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
                    
                    {/* Liste des images disponibles */}
                    {uploads.filter(u => u.type === 'image').length > 0 ? (
                      <>
                        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
                          {uploads
                            .filter(upload => upload.type === 'image')
                            .slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage)
                            .map((upload) => (
                              <div key={upload.id} className="col">
                                <div 
                                  className={`card h-100 ${formData.upload_id === upload.id.toString() ? 'border-primary border-2' : ''}`}
                                  onClick={() => handleExistingImageSelect(upload.id)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <div className="card-img-top" style={{ height: '120px', overflow: 'hidden' }}>
                                    <img 
                                      src={upload.url}
                                      alt={upload.filename}
                                      className="img-fluid w-100 h-100"
                                      style={{ objectFit: 'cover' }}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://placehold.co/100x100?text=Error';
                                      }}
                                    />
                                  </div>
                                  <div className="card-body p-2">
                                    <p className="card-text small text-truncate mb-0" title={upload.filename}>
                                      {upload.filename}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                        
                        {/* Pagination */}
                        {uploads.filter(u => u.type === 'image').length > imagesPerPage && (
                          <div className="mt-3 d-flex justify-content-center">
                            <nav>
                              <ul className="pagination">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                  <button 
                                    className="page-link"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                  >
                                    Précédent
                                  </button>
                                </li>
                                
                                {Array.from({ 
                                  length: Math.ceil(uploads.filter(u => u.type === 'image').length / imagesPerPage) 
                                }, (_, i) => i + 1).map(pageNum => (
                                  <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                                    <button 
                                      className="page-link"
                                      onClick={() => setCurrentPage(pageNum)}
                                    >
                                      {pageNum}
                                    </button>
                                  </li>
                                ))}
                                
                                <li className={`page-item ${currentPage === Math.ceil(uploads.filter(u => u.type === 'image').length / imagesPerPage) ? 'disabled' : ''}`}>
                                  <button 
                                    className="page-link"
                                    onClick={() => setCurrentPage(prev => 
                                      Math.min(prev + 1, Math.ceil(uploads.filter(u => u.type === 'image').length / imagesPerPage))
                                    )}
                                    disabled={currentPage === Math.ceil(uploads.filter(u => u.type === 'image').length / imagesPerPage)}
                                  >
                                    Suivant
                                  </button>
                                </li>
                              </ul>
                            </nav>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-muted">
                        Aucune image disponible. Veuillez télécharger une nouvelle image.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="user_id" className="form-label">Créé par</label>
                <select
                  className="form-select"
                  id="user_id"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner un créateur</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username || user.email || `User #${user.id}`}
                    </option>
                  ))}
                </select>
                <small className="text-muted">
                  Si non sélectionné, l'utilisateur actuel sera utilisé
                </small>
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
    </div>
  );
};

export default PageFormPage;