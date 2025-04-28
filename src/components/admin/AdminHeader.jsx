// src/components/admin/AdminHeader.jsx
/**
 * 🇬🇧 AdminHeader component for navigation in admin interface
 * 🇫🇷 Composant AdminHeader pour la navigation dans l'interface d'administration
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaBars, 
  FaTimes, 
  FaUser,
  FaSignOutAlt,
  FaUserCircle,
  FaWater,
  FaSwimmer,
  FaSwimmingPool,
  FaCalendarCheck,
  FaList,
  FaFileAlt,
  FaImages,
  FaUsers,
  FaTachometerAlt
} from 'react-icons/fa';
import '../../assets/styles/Admin-layout.css';
import useAuth from '../../hooks/useAuth';

const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  /**
   * 🇬🇧 Check if link is active
   * 🇫🇷 Vérifier si un lien est actif
   */
  const isActive = useCallback(
    (path) => location.pathname === path || location.pathname.startsWith(path + '/'),
    [location.pathname]
  );

  /**
   * 🇬🇧 Handle scroll effect for header shadow
   * 🇫🇷 Gérer l'effet de scroll pour l'ombre du header
   */
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

  /**
   * 🇬🇧 Close mobile menu after navigation
   * 🇫🇷 Fermer le menu mobile après navigation
   */
  const handleMobileNavigation = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  /**
   * 🇬🇧 Handle user logout
   * 🇫🇷 Gérer la déconnexion de l'utilisateur
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  /**
   * 🇬🇧 Navigation links structure
   * 🇫🇷 Structure des liens de navigation
   */
  const navLinks = [
    {
      label: 'Utilisateurs',
      to: '/admin/users',
      icon: <FaUsers className="me-2" />
    },
    {
      label: 'Exercices',
      to: '/admin/exercises',
      icon: <FaWater className="me-2" />
    },
    {
      label: 'Séances',
      to: '/admin/workouts',
      icon: <FaSwimmer className="me-2" />
    },
    {
      label: 'Plans',
      to: '/admin/plans',
      icon: <FaCalendarCheck className="me-2" />
    },
    {
      label: 'Séries',
      to: '/admin/swim-sets',
      icon: <FaList className="me-2" />
    },
    {
      label: 'Pages',
      to: '/admin/pages',
      icon: <FaFileAlt className="me-2" />
    },
    {
      label: 'Médias',
      to: '/admin/uploads',
      icon: <FaImages className="me-2" />
    }
  ];

  return (
    <header className={`admin-header ${scrolled ? 'shadow-sm sticky-top' : ''} transition-all duration-300`}>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          {/* Logo et titre */}
          <Link className="navbar-brand d-flex align-items-center" to="/admin">
            <img 
              src="/assets/images/logo/nataswim_app_logo_4.png" 
              alt="Logo Administration" 
              height="100"
              className="admin-logo-wrapper"
            />
          </Link>

          {/* Bouton menu mobile */}
          <button 
            className="navbar-toggler border-0 shadow-none" 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          {/* Navigation principale */}
          <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {navLinks.map((link, index) => (
                <li key={index} className={`nav-item ${isActive(link.to) ? 'active' : ''}`}>
                  <Link
                    to={link.to}
                    className={`admin-nav-link admin-menu-item fw-medium d-flex align-items-center ${isActive(link.to) ? 'active' : ''}`}
                    onClick={handleMobileNavigation}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Menu utilisateur */}
            <div className="ms-3">
              <div className="dropdown">
                <button
                  className="btn btn-outline-light d-flex align-items-center"
                  type="button"
                  id="adminUserDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaUserCircle className="me-2" />
                  {user?.name || user?.email || 'Admin'}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="adminUserDropdown">
                  <li>
                    <Link 
                      to="/admin" 
                      className="dropdown-item d-flex align-items-center" 
                      onClick={handleMobileNavigation}
                    >
                      <FaTachometerAlt className="me-2" /> Tableau de bord
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/user/profile" 
                      className="dropdown-item d-flex align-items-center" 
                      onClick={handleMobileNavigation}
                    >
                      <FaUser className="me-2" /> Mon profil
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item text-danger d-flex align-items-center" 
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="me-2" /> Déconnexion
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu mobile - Affichage uniquement sur mobile */}
      <div className={`admin-mobile-menu d-lg-none ${mobileMenuOpen ? 'd-block' : 'd-none'}`}>
        <div className="container-fluid">
          <ul className="list-unstyled mb-0">
            {navLinks.map((link, index) => (
              <li key={index} className="mb-2">
                <Link
                  to={link.to}
                  className={`d-flex align-items-center text-white text-decoration-none p-2 rounded ${isActive(link.to) ? 'bg-primary' : ''}`}
                  onClick={handleMobileNavigation}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;