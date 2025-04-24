import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaUser, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaPinterest, 
  FaEnvelope,
  FaWhatsapp,
  FaTags,
  FaShare,
  FaClock,
  FaEye,
  FaBookmark,
  FaChevronRight,
  FaAngleRight
} from 'react-icons/fa';
import Header from '../../components/template/Header';
import Footer from '../../components/template/Footer';
import { getPage, getPages } from '../../services/pages';
import { getUpload } from '../../services/uploads';

const PageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [page, setPage] = useState(null);
  const [headerImage, setHeaderImage] = useState(null);
  const [latestPages, setLatestPages] = useState([]);
  const [latestPagesImages, setLatestPagesImages] = useState({});
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

        // Fetch latest pages
        try {
          const pagesResponse = await getPages();
          // Sort by created_at date (most recent first) and take the first 3
          const latestPagesData = [...pagesResponse.data]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .filter(p => p.id !== parseInt(id)) // Exclude current page
            .slice(0, 6);
          setLatestPages(latestPagesData);

          // Fetch images for latest pages
          const imagesObj = {};
          for (const page of latestPagesData) {
            if (page.upload_id) {
              try {
                const imageResponse = await getUpload(page.upload_id);
                imagesObj[page.id] = imageResponse.data;
              } catch (err) {
                console.error(`Error fetching image for page ${page.id}:`, err);
              }
            }
          }
          setLatestPagesImages(imagesObj);
          
        } catch (pagesError) {
          console.error('Error fetching additional pages:', pagesError);
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
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  // Format content preview for latest pages
  const formatContentPreview = (content, maxLength = 100) => {
    if (!content) return "Aucun contenu";
    
    // Remove HTML tags
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    
    // Limit length
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...'
      : textContent;
  };

  // Get current page URL for sharing
  const getPageUrl = () => {
    return window.location.href;
  };

  // Get category badge color
  const getCategoryBadgeColor = (category) => {
    if (!category) return 'secondary';
    
    switch (category.toLowerCase()) {
      case 'information': return 'info';
      case 'conseils': return 'success';
      case 'règles': return 'warning';
      case 'foire aux questions': return 'primary';
      default: return 'secondary';
    }
  };

  // Format date with more details
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleDateString('fr-FR', options);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="py-5">
          <div className="container">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-3">Chargement de l'article...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !page) {
    return (
      <>
        <Header />
        <main className="py-5">
          <div className="container">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-5 text-center">
                <div className="mb-4">
                  <span className="bg-danger text-white d-inline-flex align-items-center justify-content-center rounded-circle" style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-exclamation-triangle fs-3"></i>
                  </span>
                </div>
                <h2 className="h4 mb-3">Contenu indisponible</h2>
                <p className="text-muted mb-4">
                  {error || "Cette page n'existe pas ou a été supprimée"}
                </p>
                <button 
                  className="btn btn-primary btn-lg px-4"
                  onClick={() => navigate('/')}
                >
                  <FaArrowLeft className="me-2" /> Retour à l'accueil
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Section with Header Image */}
        {headerImage && headerImage.url ? (
          <div 
            className="position-relative"
            style={{
              height: '500px',
              backgroundImage: `url(${headerImage.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          >
            <div 
              className="position-absolute w-100 h-100" 
              style={{
                background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7))'
              }}
            ></div>
            <div className="container h-100 position-relative">
              <div className="row h-100 align-items-end">
                <div className="col-12 text-white pb-5">
                  <div className="mb-3">
                    {page.page_category && (
                      <span className={`badge bg-${getCategoryBadgeColor(page.page_category)} rounded-pill px-3 py-2 fs-6`}>
                        {page.page_category}
                      </span>
                    )}
                  </div>
                  <h1 className="display-3 fw-bold mb-3">{page.title}</h1>
                  <div className="d-flex align-items-center">
                    <span className="me-3 d-flex align-items-center">
                      <FaCalendarAlt className="me-2" />
                      {formatDate(page.created_at)}
                    </span>
                    <span className="d-flex align-items-center">
                      <FaUser className="me-2" />
                      Auteur ID: {page.user_id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-5 bg-gradient" style={{ background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' }}>
            <div className="container py-5">
              <div className="text-white mb-3">
                {page.page_category && (
                  <span className={`badge bg-${getCategoryBadgeColor(page.page_category)} rounded-pill px-3 py-2 fs-6`}>
                    {page.page_category}
                  </span>
                )}
              </div>
              <h1 className="display-3 fw-bold text-white mb-4">{page.title}</h1>
              <div className="d-flex align-items-center text-white opacity-75">
                <span className="me-4 d-flex align-items-center">
                  <FaCalendarAlt className="me-2" />
                  {formatDate(page.created_at)}
                </span>
                <span className="d-flex align-items-center">
                  <FaUser className="me-2" />
                  Auteur ID: {page.user_id}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-8">
              {/* Main Content */}
              <article className="card border-0 shadow-sm mb-4 overflow-hidden">
                <div className="card-body p-md-5">
                  <div 
                    className="content-area"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                  />
                </div>
              </article>

              {/* Sharing Options */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h3 className="h5 mb-3 d-flex align-items-center">
                    <FaShare className="text-primary me-2" />
                    Partager cet article
                  </h3>
                  <div className="d-flex flex-wrap gap-2">
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${getPageUrl()}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn btn-outline-primary rounded-pill"
                      aria-label="Partager sur Facebook"
                    >
                      <FaFacebook size={18} />
                    </a>
                    <a 
                      href={`https://twitter.com/intent/tweet?url=${getPageUrl()}&text=${encodeURIComponent(page.title)}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn btn-outline-info rounded-pill"
                      aria-label="Partager sur Twitter"
                    >
                      <FaTwitter size={18} />
                    </a>
                    <a 
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${getPageUrl()}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn btn-outline-secondary rounded-pill"
                      aria-label="Partager sur LinkedIn"
                    >
                      <FaLinkedin size={18} />
                    </a>
                    <a 
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(page.title + ' ' + getPageUrl())}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn btn-outline-success rounded-pill"
                      aria-label="Partager sur WhatsApp"
                    >
                      <FaWhatsapp size={18} />
                    </a>
                    <a 
                      href={`mailto:?subject=${encodeURIComponent(page.title)}&body=${encodeURIComponent(getPageUrl())}`} 
                      className="btn btn-outline-secondary rounded-pill"
                      aria-label="Partager par email"
                    >
                      <FaEnvelope size={18} />
                    </a>
                  </div>
                </div>
              </div>

              {/* About this page - Mobile only */}
              <div className="card border-0 shadow-sm mb-4 d-block d-lg-none">
                <div className="card-body p-4">
                  <ul className="list-unstyled mb-0">
                    {page.updated_at && page.updated_at !== page.created_at && (
                      <li className="mb-3 d-flex">
                        <div className="bg-light rounded-circle p-2 me-3">
                          <FaClock className="text-primary" />
                        </div>
                        <div>
                          <strong>Dernière mise à jour</strong>
                          <div className="text-muted">{formatDate(page.updated_at)}</div>
                        </div>
                      </li>
                    )}
                    <li className="mb-3 d-flex">
                      <div className="bg-light rounded-circle p-2 me-3">
                        <FaUser className="text-primary" />
                      </div>
                      <div>
                        <strong>Auteur</strong>
                        <div className="text-muted">ID: {page.user_id}</div>
                      </div>
                    </li>
                    {page.page_category && (
                      <li className="d-flex">
                        <div className="bg-light rounded-circle p-2 me-3">
                          <FaTags className="text-primary" />
                        </div>
                        <div>
                          <strong>Catégorie</strong>
                          <div>
                            <span className={`badge bg-${getCategoryBadgeColor(page.page_category)}`}>
                              {page.page_category}
                            </span>
                          </div>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Back button - Mobile only */}
              <div className="d-flex justify-content-center d-lg-none">
                <button 
                  className="btn btn-primary btn-lg px-4"
                  onClick={() => navigate(-1)}
                >
                  <FaArrowLeft className="me-2" /> Retour
                </button>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="sticky-top" style={{ top: '2rem' }}>
                {/* About this page - Desktop only */}
                <div className="card border-0 shadow-sm mb-4 d-none d-lg-block">
                  <div className="card-body p-4">
                    <ul className="list-unstyled mb-0">
                      {page.updated_at && page.updated_at !== page.created_at && (
                        <li className="mb-3 d-flex">
                          <div className="bg-light rounded-circle p-2 me-3">
                            <FaClock className="text-primary" />
                          </div>
                          <div>
                            <strong>Dernière mise à jour</strong>
                            <div className="text-muted">{formatDate(page.updated_at)}</div>
                          </div>
                        </li>
                      )}
                      <li className="mb-3 d-flex">
                        <div className="bg-light rounded-circle p-2 me-3">
                          <FaUser className="text-primary" />
                        </div>
                        <div>
                          <strong>Auteur</strong>
                          <div className="text-muted">ID: {page.user_id}</div>
                        </div>
                      </li>
                      {page.page_category && (
                        <li className="d-flex">
                          <div className="bg-light rounded-circle p-2 me-3">
                            <FaTags className="text-primary" />
                          </div>
                          <div>
                            <strong>Catégorie</strong>
                            <div>
                              <span className={`badge bg-${getCategoryBadgeColor(page.page_category)}`}>
                                {page.page_category}
                              </span>
                            </div>
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Latest Pages */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <h3 className="h5 mb-3 d-flex align-items-center">
                      <FaBookmark className="text-primary me-2" />
                      Publications
                    </h3>
                    
                    {latestPages.length > 0 ? (
                      <div className="latest-pages">
                        {latestPages.map(latestPage => (
                          <Link 
                            key={latestPage.id} 
                            to={`/pages/${latestPage.id}`}
                            className="card mb-3 border-0 shadow-sm hover-lift text-decoration-none"
                          >
                            <div className="row g-0">
                              <div className="col-4">
                                <div 
                                  className="bg-light h-100" 
                                  style={{
                                    backgroundImage: latestPagesImages[latestPage.id]?.url 
                                      ? `url(${latestPagesImages[latestPage.id].url})` 
                                      : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    minHeight: '80px'
                                  }}
                                >
                                  {!latestPagesImages[latestPage.id]?.url && (
                                    <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                                      <FaBookmark />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="col-8">
                                <div className="card-body p-3">
                                  <h4 className="card-title h6 mb-1 text-dark">{latestPage.title}</h4>
                                  <small className="text-muted d-flex align-items-center">
                                    <FaCalendarAlt className="me-1" size={10} /> 
                                    {new Date(latestPage.created_at).toLocaleDateString()}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="alert alert-light mb-0">
                        Aucune page récente disponible.
                      </div>
                    )}
                  </div>
                </div>

                {/* Back button - Desktop only */}
                <div className="d-none d-lg-block">
                  <button 
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center py-3"
                    onClick={() => navigate(-1)}
                  >
                    <FaArrowLeft className="me-2" /> Retour
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More Content CTA */}
        <div className="bg-light py-5">
          <div className="container">
            <div className="row align-items-center text-center text-md-start">
              <div className="col-md-8 mb-4 mb-md-0">
                <h2 className="h3 fw-bold mb-2">Découvrez plus d'articles</h2>
                <p className="text-muted mb-0">Explorez notre collection d'articles, conseils et informations.</p>
              </div>
              <div className="col-md-4 text-md-end">
                <Link to="/articles" className="btn btn-outline-primary px-4 py-2">
                  Voir tous les articles <FaAngleRight className="ms-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PageDetailPage;