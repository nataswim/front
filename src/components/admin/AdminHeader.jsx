import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../assets/styles/Admin-layout.css';

const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Liens de navigation  pour l'administration
  const navLinks = [
    {
      label: 'Utilisateurs', 
      icon: 'bi-people', 
      subLinks: [
        { to: '/admin/users', label: 'Liste des utilisateurs' },
        { to: '/admin/users/new', label: 'Ajouter un utilisateur' }
      ]
    },
    {
      label: 'Exercices', 
      icon: 'bi-water', 
      subLinks: [
        { to: '/admin/exercises', label: 'Liste des exercices' },
        { to: '/admin/exercises/new', label: 'Ajouter un exercice' }
      ]
    },
    {
      label: 'Séances', 
      icon: 'bi-life-preserver', 
      subLinks: [
        { to: '/admin/workouts', label: 'Liste des séances' },
        { to: '/admin/workouts/new', label: 'Ajouter une séance' }
      ]
    },
    {
      label: 'Plans', 
      icon: 'bi-calendar-check', 
      subLinks: [
        { to: '/admin/plans', label: 'Liste des plans' },
        { to: '/admin/plans/new', label: 'Ajouter un plan' }
      ]
    },
    {
      label: 'Séries', 
      icon: 'bi-list-check', 
      subLinks: [
        { to: '/admin/swim-sets', label: 'Liste des séries' },
        { to: '/admin/swim-sets/new', label: 'Ajouter une série' }
      ]
    },
    {
      label: 'Pages', 
      icon: 'bi-file-earmark-text', 
      subLinks: [
        { to: '/admin/pages', label: 'Liste des pages' },
        { to: '/admin/pages/new', label: 'Ajouter une page' }
      ]
    },
    {
      label: 'Médias', 
      icon: 'bi-images', 
      subLinks: [
        { to: '/admin/uploads', label: 'Liste des médias' },
        { to: '/admin/uploads/new', label: 'Ajouter un média' }
      ]
    }
  ];

  // Fonction pour déterminer si un lien est actif
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/') ? 'active' : '';

  return (
    <header className="admin-header">
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <Link to="/admin" className="navbar-brand admin-logo-wrapper">
            <img
              src="/assets/images/logo/nataswim_app_logo_4.png"
              alt="Logo Administration"
              height="120"
              className="me-2"
            />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#adminHeaderNavbar"
            aria-controls="adminHeaderNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="adminHeaderNavbar">
            <ul className="navbar-nav ms-auto">
              {navLinks.map((link, idx) => (
                <li key={idx} className={`nav-item ${link.subLinks ? 'dropdown' : ''} ${!link.subLinks ? isActive(link.to) : ''}`}>
                  {link.subLinks ? (
                    <>
                      <button
                        className={`admin-nav-link dropdown-toggle admin-menu-item ${link.subLinks.some(sub => isActive(sub.to)) ? 'active' : ''}`}
                        id={`navbarDropdown${idx}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className={`bi ${link.icon} me-2`}></i>{link.label}
                      </button>
                      <ul className="dropdown-menu" aria-labelledby={`navbarDropdown${idx}`}>
                        {link.subLinks.map((subLink, subIdx) => (
                          <li key={subIdx}>
                            <Link 
                              className={`dropdown-item ${isActive(subLink.to)}`} 
                              to={subLink.to}
                            >
                              {subLink.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      to={link.to}
                      className={`admin-nav-link admin-menu-item ${isActive(link.to)}`}
                    >
                      <i className={`bi ${link.icon} me-2`}></i>{link.label}
                    </Link>
                  )}
                </li>
              ))}
              <li className="nav-item ms-2">
                <div className="d-flex align-items-center">
                  <button
                    className="admin-logout-btn"
                    onClick={handleLogout}
                    title="Déconnexion"
                  >
                    <i className="bi bi-box-arrow-right"></i>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;