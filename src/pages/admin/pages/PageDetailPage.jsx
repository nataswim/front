import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaUser, 
  FaCalendarAlt, 
  FaImage,
  FaFileAlt,
  FaTag
} from 'react-icons/fa';
import { getPage } from '../../../services/pages';
import { getUpload } from '../../../services/uploads';

const PageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [page, setPage] = useState(null);
  const [headerImage, setHeaderImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        // Fetch page details
        const pageResponse = await getPage(id);
        setPage(pageResponse.data);

        // If page has an upload_id, fetch the image
        if (pageResponse.data.upload_id) {
          try {
            const imageResponse = await getUpload(pageResponse.data.upload_id);
            setHeaderImage(imageResponse.data);
          } catch (imageError) {
            console.error('Error fetching header image:', imageError);
          }
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching page data:', err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
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

  if (error || !page) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          {error || "Page non trouvée"}
        </div>
        <button 
          className="btn btn-outline-primary" 
          onClick={() => navigate('/admin/pages')}
        >
          <FaArrowLeft className="me-2" /> Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="card shadow mb-4">
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-primary me-3"
                onClick={() => navigate('/admin/pages')}
              >
                <FaArrowLeft className="me-2" /> Retour
              </button>
              <div>
                <h1 className="h4 mb-0">{page.title}</h1>
                {page.page_category && (
                  <span className="badge bg-info mt-1">
                    {page.page_category}
                  </span>
                )}
              </div>
            </div>
            <Link
              to={`/admin/pages/${id}/edit`}
              className="btn btn-primary"
            >
              <FaEdit className="me-2" /> Modifier
            </Link>
          </div>
        </div>

        {/* Header Image */}
        {headerImage && headerImage.url && (
          <div className="position-relative">
            <img 
              src={headerImage.url}
              alt={page.title}
              className="w-100"
              style={{ 
                height: '200px', 
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
            <div 
              className="position-absolute bottom-0 start-0 end-0 p-3"
              style={{ 
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                color: 'white'
              }}
            >
              <div className="container">
                <h2 className="h5 mb-0">{page.title}</h2>
              </div>
            </div>
          </div>
        )}

        <div className="card-body">
          <div className="row">
            {/* Main Content */}
            <div className="col-md-8">
              <div className="card mb-4">
                <div className="card-body">
                  <h2 className="h5 mb-3">Contenu</h2>
                  <div 
                    className="content-area"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-md-4">
              {/* Page Information */}
              <div className="card mb-4">
                <div className="card-body">
                  <h3 className="h5 mb-3">Informations</h3>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <FaUser className="text-primary me-2" />
                      Créé par: User #{page.user_id}
                    </li>
                    <li className="mb-2">
                      <FaCalendarAlt className="text-primary me-2" />
                      Créé le: {new Date(page.created_at).toLocaleDateString()}
                    </li>
                    {page.updated_at && (
                      <li>
                        <FaCalendarAlt className="text-primary me-2" />
                        Dernière modification: {new Date(page.updated_at).toLocaleDateString()}
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Page Metadata */}
              <div className="card mb-4">
                <div className="card-body">
                  <h3 className="h5 mb-3">Métadonnées</h3>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <FaTag className="text-primary me-2" />
                      Catégorie: {page.page_category || 'Non catégorisé'}
                    </li>
                    <li className="mb-2">
                      <FaFileAlt className="text-primary me-2" />
                      ID: {page.id}
                    </li>
                    {headerImage && (
                      <li>
                        <FaImage className="text-primary me-2" />
                        Image: {headerImage.filename}
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Preview Link */}
              <div className="card">
                <div className="card-body">
                  <h3 className="h5 mb-3">Actions</h3>
                  <div className="d-grid gap-2">
                    <Link 
                      to={`/pages/${page.id}`} 
                      className="btn btn-outline-primary"
                      target="_blank"
                    >
                      Voir en tant que visiteur
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageDetailPage;