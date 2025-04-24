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
import { getUpload, createUpload } from '../../../services/uploads';

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

  // Page categories
  const pageCategories = ['Information', 'Conseils', 'Règles', 'Foire aux questions'];

  // Load page data if in edit mode
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

  // Load uploads and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uploadsResponse, usersResponse] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/uploads'),
          fetch('http://127.0.0.1:8000/api/users')
        ]);

        const uploadsData = await uploadsResponse.json();
        const usersData = await usersResponse.json();

        // Trier les uploads par nom de fichier
        const sortedUploads = uploadsData.sort((a, b) => 
          a.filename.localeCompare(b.filename)
        );

        setUploads(sortedUploads);
        setUsers(usersData);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
      }
    };

    fetchData();
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
      page_category: prev.page_category === category ? '' : category
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.content || !formData.user_id) {
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
        content: formData.content,
        page_category: formData.page_category || null,
        upload_id: finalUploadId ? parseInt(finalUploadId) : null,
        user_id: parseInt(formData.user_id)
      };

      if (isEditMode) {
        await updatePage(id, submitData);
      } else {
        await createPage(submitData);
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
                <label htmlFor="title" className="form-label">Titre</label>
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
                <label className="form-label">Contenu</label>
                <TextEditor
                  value={formData.content} 
                  onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))} 
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
                      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
                        {uploads
                          .filter(upload => upload.type === 'image')
                          .map((upload) => (
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
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
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
                  required
                >
                  <option value="">Sélectionner un créateur</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username || user.email}
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
    </div>
  );
};

export default PageFormPage;