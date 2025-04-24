import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaDownload, FaUser, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import { getUpload } from '../../../services/uploads';

const UploadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [upload, setUpload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchUpload = async () => {
      try {
        setLoading(true);
        const response = await getUpload(id);
        setUpload(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUpload();
  }, [id]);

  const handleBack = () => {
    navigate('/admin/uploads');
  };

  const handleEdit = () => {
    navigate(`/admin/uploads/${id}/edit`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };

  // Gestion de l'erreur d'image
  const handleImageError = () => {
    console.error("Erreur de chargement de l'image:", upload?.url);
    setImageError(true);
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

  if (!upload) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning" role="alert">
          Fichier non trouvé
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
      <div className="card shadow">
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-secondary me-3"
                onClick={handleBack}
              >
                <FaArrowLeft className="me-2" /> Retour
              </button>
              <h5 className="mb-0">Détails du fichier</h5>
            </div>
            <div>
              <button
                className="btn btn-primary me-2"
                onClick={handleEdit}
              >
                <FaEdit className="me-2" /> Modifier
              </button>
              <a 
                href={upload.url}
                className="btn btn-success"
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaDownload className="me-2" /> Télécharger
              </a>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <h6 className="card-title">
                    <FaFileAlt className="me-2" /> Informations du fichier
                  </h6>
                  <dl className="row mb-0">
                    <dt className="col-sm-4">Nom du fichier</dt>
                    <dd className="col-sm-8">{upload.filename}</dd>
                    
                    <dt className="col-sm-4">Type</dt>
                    <dd className="col-sm-8">
                      <span className={`badge bg-${upload.type === 'image' ? 'info' : 'secondary'}`}>
                        {upload.type}
                      </span>
                    </dd>
                    
                    <dt className="col-sm-4">Taille</dt>
                    <dd className="col-sm-8">{formatFileSize(upload.size)}</dd>
                    
                    <dt className="col-sm-4">Chemin</dt>
                    <dd className="col-sm-8">{upload.path}</dd>

                    <dt className="col-sm-4">URL</dt>
                    <dd className="col-sm-8">
                      <small className="text-break">{upload.url}</small>
                    </dd>
                  </dl>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">
                    <FaUser className="me-2" /> Informations de l'upload
                  </h6>
                  <dl className="row mb-0">
                    <dt className="col-sm-4">Uploadé par</dt>
                    <dd className="col-sm-8">User #{upload.user_id}</dd>
                    
                    <dt className="col-sm-4">
                      <FaCalendarAlt className="me-2" /> Date d'upload
                    </dt>
                    <dd className="col-sm-8">{formatDate(upload.created_at)}</dd>
                    
                    <dt className="col-sm-4">Dernière modification</dt>
                    <dd className="col-sm-8">{formatDate(upload.updated_at)}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              {upload.type === 'image' && upload.url && (
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title mb-3">Aperçu</h6>
                    {imageError ? (
                      <div className="alert alert-warning">
                        <p>Impossible de charger l'image. Vérifiez que le fichier existe et que l'URL est correcte.</p>
                        <p className="mb-0">
                          <a 
                            href={upload.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary mt-2"
                          >
                            Ouvrir l'URL directement
                          </a>
                        </p>
                      </div>
                    ) : (
                      <img 
                        src={upload.url}
                        alt={upload.filename}
                        className="img-fluid rounded"
                        style={{ maxHeight: '400px', width: '100%', objectFit: 'contain' }}
                        onError={handleImageError}
                      />
                    )}
                    <div className="mt-3">
                      <p className="text-muted mb-0">
                        <small>Cette image est stockée sur le serveur. Voir la configuration du stockage</small>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDetailPage;