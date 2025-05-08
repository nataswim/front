// src/components/template/Header.jsx
// Composant Header responsive amélioré avec menu déroulant et meilleure structure
// Logo - slogan - menu de navigation - Bannières

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBars, 
  FaTimes, 
  FaSearch, 
  FaUser, 
  FaSignInAlt, 
  FaUserPlus, 
  FaInfoCircle, 
  FaHome, 
  FaList, 
  FaTag, 
  FaBlog, 
  FaEnvelope,
  FaSignOutAlt,
  FaUserCircle,
  FaWater,
  FaSwimmer,
  FaChartLine,
  FaSwimmingPool,
  FaTachometerAlt
} from 'react-icons/fa';
import '../../assets/styles/visitor-layout.css';
import useAuth from '../../hooks/useAuth';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Liste des logos à alterner
  const logos = [
    "/assets/images/logo/nataswim_app_logo_1.png",
    "/assets/images/logo/nataswim_app_logo_2.png",
    "/assets/images/logo/nataswim_app_logo_3.png",
    "/assets/images/logo/nataswim_app_logo_4.png",
    "/assets/images/logo/nataswim_app_logo_0.png"
  ];

  // Vérifier si un lien est actif
  const isActive = useCallback(
    (path) => location.pathname === path || location.pathname.startsWith(path + '/'),
    [location.pathname]
  );

  // Alterner les logos à intervalle régulier
  useEffect(() => {
    const logoInterval = setInterval(() => {
      setCurrentLogoIndex((prevIndex) => (prevIndex + 1) % logos.length);
    }, 4000); // Change de logo toutes les 4 secondes
    
    return () => clearInterval(logoInterval);
  }, [logos.length]);

  // Gérer le scroll pour l'effet d'ombre
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors d'un changement de navigation
  const handleMobileNavigation = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  // Gérer la déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Gérer la recherche
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Rediriger vers la page de recherche avec le terme de recherche
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      handleMobileNavigation(); // Fermer le menu mobile après recherche
    }
  };

  // Structure de navigation avec dropdowns
  const navLinks = [
    {
      label: 'Fonctionnalités',
      to: '/fonctionnalites',
      icon: <FaWater className="me-2" aria-hidden="true" />
    },
    {
      label: 'Découvrir',
      icon: <FaWater className="me-2" aria-hidden="true" />,
      subLinks: [
        { to: '/plans-de-natation', label: 'Plans', icon: <FaSwimmer className="me-2" aria-hidden="true" /> },
        { to: '/seances-de-natation', label: 'Séances', icon: <FaSwimmer className="me-2" aria-hidden="true" /> },
        { to: '/educatifs-de-natation', label: 'Exercices', icon: <FaSwimmer className="me-2" aria-hidden="true" /> }
      ]
    },
    {
      label: 'Infos',
      to: '/articles',
      icon: <FaWater className="me-2" aria-hidden="true" />
    },
    {
      label: 'Outils',
      to: '/outils',
      icon: <FaWater className="me-2" aria-hidden="true" />
    },
    {
      label: 'Utiliser',
      to: '/guide',
      icon: <FaWater className="me-2" aria-hidden="true" />
    }
  ];

  return (
    <header className={`visitor-header ${scrolled ? 'shadow-sm sticky-top visitor-bg' : ''} transition-all duration-300`} role="banner">
      <nav className="navbar navbar-expand-lg navbar-light" aria-label="Navigation principale">
        <div className="container">
          {/* Logo avec animation */}
          <Link className="navbar-brand d-flex align-items-center" to="/" aria-label="Accueil NataSwim">
            <img 
              src={logos[currentLogoIndex]} 
              alt="" 
              height="100"
              className="me-2"
              style={{ transition: 'opacity 0.5s ease-in-out' }}
            />
          </Link>

          {/* Bouton menu mobile */}
          <button 
            className="navbar-toggler border-0 shadow-none" 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileMenuOpen ? <FaTimes size={20} aria-hidden="true" /> : <FaBars size={20} aria-hidden="true" />}
          </button>

          {/* Navigation principale */}
          <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="mainNavigation">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              {navLinks.map((link, index) => (
                <li key={index} className={`nav-item ${link.subLinks ? 'dropdown' : ''} ${isActive(link.to) ? 'active' : ''}`}>
                  {link.subLinks ? (
                    <>
                      <button
                        className={`visitor-nav-link dropdown-toggle fw-medium ${openDropdown === index ? 'active' : ''}`}
                        id={`dropdownMenu${index}`}
                        aria-expanded={openDropdown === index}
                        onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                        aria-haspopup="true"
                      >
                        {link.icon}
                        {link.label}
                      </button>
                      <div 
                        className={`dropdown-menu shadow-sm rounded-3 border-0 ${openDropdown === index ? 'show' : ''}`}
                        aria-labelledby={`dropdownMenu${index}`}
                      >
                        {link.subLinks.map((subLink, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subLink.to}
                            className={`dropdown-visitor py-2 ${isActive(subLink.to) ? 'active' : ''}`}
                            onClick={handleMobileNavigation}
                          >
                            {subLink.icon}
                            {subLink.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={link.to}
                      className={`visitor-nav-link fw-medium d-flex align-items-center ${isActive(link.to) ? 'active' : ''}`}
                      onClick={handleMobileNavigation}
                      aria-current={isActive(link.to) ? 'page' : undefined}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

              
              
              {/* Boutons d'authentification - affichage conditionnel */}
              {isAuthenticated ? (
                <div className="dropdown">
                  <button
                    className="d-flex align-items-center visitor-logout-btn"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FaUserCircle className="me-2" aria-hidden="true" />
                    {user?.username || user?.email || 'Mon compte'}
                  </button>
                  <ul 
                    className="dropdown-menu dropdown-menu-end shadow-sm" 
                    aria-labelledby="userDropdown"
                  >
                    <li>
                      <Link 
                        to="/user/dashboard" 
                        className="dropdown-item d-flex align-items-center" 
                        onClick={handleMobileNavigation}
                      >
                        <FaTachometerAlt className="me-2" aria-hidden="true" /> Mon espace
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/user/profile" 
                        className="dropdown-item d-flex align-items-center" 
                        onClick={handleMobileNavigation}
                      >
                        <FaUser className="me-2" aria-hidden="true" /> Mon profil
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger d-flex align-items-center" 
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="me-2" aria-hidden="true" /> Déconnexion
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link 
                    to="/login" 
                    className="btn btn-outline-primary btn-sm px-3 d-flex align-items-center"
                    onClick={handleMobileNavigation}
                  >
                    <FaSignInAlt className="me-1" aria-hidden="true" /> Connexion
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-primary btn-sm px-3 d-flex align-items-center"
                    onClick={handleMobileNavigation}
                  >
                    <FaUserPlus className="me-1" aria-hidden="true" /> S'inscrire
                  </Link>
                </div>
              )}
            
          </div>
        </div>
      </nav>

      {/* Barre de recherche mobile */}
      <div className={`bg-light py-2 d-lg-none ${mobileMenuOpen ? 'd-block' : 'd-none'}`}>
        <div className="container">
          <form onSubmit={handleSearch} className="d-flex" role="search">
            <div className="input-group">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Rechercher..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Rechercher"
              />
              <button className="btn btn-outline-primary" type="submit" aria-label="Lancer la recherche">
                <FaSearch aria-hidden="true" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;