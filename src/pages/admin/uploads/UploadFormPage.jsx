import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaSave, 
  FaUpload, 
  FaImage, 
  FaFile, 
  FaVideo, 
  FaMusic,
  FaTrash
} from 'react-icons/fa';
import { getUpload, createUpload, updateUpload } from '../../../services/uploads';
import { getUsers } from '../../../services/users';


const UploadFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    filename: '',
    type: '',
    user_id: '',
    file: null
  });

  // UI states
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  // Load upload data if in edit mode
  useEffect(() => {
    const fetchUpload = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const response = await getUpload(id);
          const uploadData = response.data;
          
          setFormData({
            filename: uploadData.filename || '',
            type: uploadData.type || '',
            user_id: uploadData.user_id ? uploadData.user_id.toString() : '',
            file: null
          });

          // Set preview for images
          if (uploadData.type === 'image') {
            // Construire une URL complète à partir du chemin stocké dans le modèle
            const baseUrl = 'http://127.0.0.1:8000'; // URL de base API
            if (uploadData.path) {
              // Vérifier si le chemin commence par un slash
              const path = uploadData.path.startsWith('/') ? uploadData.path : `/${uploadData.path}`;
              setPreview(`${baseUrl}${path}`);
            }
          }
          
          setLoading(false);
        } catch (err) {
          console.error('Error loading upload:', err);
          setError('Error loading file data');
          setLoading(false);
        }
      }
    };

    fetchUpload();
  }, [id, isEditMode]);

  // Load users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Remplacer ceci
        // const response = await fetch('http://127.0.0.1:8000/api/users');
        // const data = await response.json();
        
        // Par ceci
        const response = await getUsers();
        const data = response.data;
        
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
  
    fetchUsers();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = {
      'image/jpeg': 'image',
      'image/png': 'image',
      'image/gif': 'image',
      'video/mp4': 'video',
      'audio/mpeg': 'audio',
      'application/pdf': 'document'
    };

    if (!allowedTypes[file.type]) {
      setError('Type de fichier non supporté');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Le fichier est trop volumineux (max 5MB)');
      return;
    }

    setFormData(prev => ({
      ...prev,
      file: file,
      filename: file.name,
      type: allowedTypes[file.type]
    }));

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    // Clear any previous errors
    setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formPayload = new FormData();
      formPayload.append('filename', formData.filename);
      formPayload.append('type', formData.type);
      formPayload.append('user_id', formData.user_id);
      
      if (formData.file) {
        formPayload.append('file', formData.file);
      }

      if (isEditMode) {
        await updateUpload(id, formPayload);
      } else {
        await createUpload(formPayload);
      }

      navigate('/admin/uploads');
    } catch (err) {
      console.error('Error saving file:', err);
      setError(err.response?.data?.message || 'Error saving file');
    } finally {
      setLoading(false);
    }
  };

  // Get icon based on file type
  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <FaImage size={40} />;
      case 'video': return <FaVideo size={40} />;
      case 'audio': return <FaMusic size={40} />;
      default: return <FaFile size={40} />;
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow">
        <div className="card-header bg-white">
          <div className="d-flex align-items-center">
            <button 
              className="btn btn-outline-primary me-3"
              onClick={() => navigate('/admin/uploads')}
            >
              <FaArrowLeft className="me-2" /> Retour
            </button>
            <h1 className="h4 mb-0">
              {isEditMode ? "Modifier le fichier" : "Ajouter un fichier"}
            </h1>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="row">
                <div className="col-md-8">
                  {/* File Upload */}
                  <div className="mb-4">
                    <label className="form-label">Fichier</label>
                    <div className="card bg-light">
                      <div className="card-body">
                        <div className="d-flex flex-column align-items-center">
                          <div className="text-primary mb-3">
                            {formData.type ? getFileIcon(formData.type) : <FaUpload size={40} />}
                          </div>
                          <div className="text-center mb-3">
                            <h5 className="mb-1">
                              {formData.file ? formData.file.name : 'Sélectionnez un fichier'}
                            </h5>
                            <p className="text-muted small mb-0">
                              PNG, JPG, GIF jusqu'à 5MB
                            </p>
                          </div>
                          <div className="d-flex gap-2">
                            <label className="btn btn-primary mb-0">
                              <input
                                type="file"
                                className="d-none"
                                onChange={handleFileChange}
                                accept="image/*,video/*,audio/*,.pdf"
                              />
                              <FaUpload className="me-2" />
                              {formData.file ? 'Changer le fichier' : 'Sélectionner un fichier'}
                            </label>
                            {formData.file && (
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => {
                                  setFormData(prev => ({...prev, file: null}));
                                  setPreview(null);
                                }}
                              >
                                <FaTrash className="me-2" />
                                Retirer
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* File Details */}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="filename" className="form-label">Nom du fichier</label>
                      <input
                        type="text"
                        className="form-control"
                        id="filename"
                        name="filename"
                        value={formData.filename}
                        onChange={(e) => setFormData(prev => ({ ...prev, filename: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="type" className="form-label">Type de fichier</label>
                      <select
                        className="form-select"
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        required
                      >
                        <option value="">Sélectionner un type</option>
                        <option value="image">Image</option>
                        <option value="video">Vidéo</option>
                        <option value="audio">Audio</option>
                        <option value="document">Document</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label htmlFor="user_id" className="form-label">Utilisateur</label>
                      <select
                        className="form-select"
                        id="user_id"
                        name="user_id"
                        value={formData.user_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
                        required
                      >
                        <option value="">Sélectionner un utilisateur</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.username || user.email}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  {/* Preview */}
                  {preview && formData.type === 'image' && (
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title mb-3">Aperçu</h5>
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="img-fluid rounded"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || (!isEditMode && !formData.file)}
                >
                  {loading ? (
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

export default UploadFormPage;