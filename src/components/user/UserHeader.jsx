import React, { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

import '../../assets/styles/user-layout.css';

const UserHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const isActive = useCallback(
    (path) => (location.pathname.startsWith(path) ? 'active' : ''),
    [location.pathname]
  );

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Générer dynamiquement les liens en fonction du rôle de l'utilisateur
  const navLinks = [
    {
      label: 'Tableau de bord', icon: 'bi bi-water me-2', subLinks: [
        // Si l'utilisateur est admin, le lien "Mon Espace" pointe vers /admin, sinon vers /user
        { to: isAdmin() ? '/admin' : '/user', label: 'Mon Espace' },
        { to: '/user/profile', label: 'Mon Compte' }
      ]
    },
    {
      label: 'Mes Listes', icon: 'bi-list-check', subLinks: [
        { to: '/user/mylists', label: 'Mes Carnets' },
        { to: '/user/mylists/new', label: 'Créer Un Carnet' },
        { to: '/user/mylists/mes_listes', label: 'Mes Favoris' }
      ]
    },
    {
      label: 'Exercices', icon: 'bi bi-life-preserver me-2', subLinks: [
        { to: '/user/exercises', label: 'Tous les exercices' },
        { to: '/user/exercises/mes_exercices', label: 'Mes exercices' }
      ]
    },
    {
      label: 'Séances', icon: 'bi bi-card-checklist me-2', subLinks: [
        { to: '/user/workouts', label: 'Toutes les séances' },
        { to: '/user/workouts/mes_seances', label: 'Mes séances' }
      ]
    },
    {
      label: 'Plans', icon: 'bi-calendar-check', subLinks: [
        { to: '/user/plans', label: 'Tous les plans' },
        { to: '/user/plans/mes_plans', label: 'Mes plans' }
      ]
    },
  ];

  // Ajouter un lien pour l'administration si l'utilisateur est admin
  if (isAdmin()) {
    navLinks.unshift({
      label: 'Administration', 
      icon: 'bi bi-shield-lock me-2', 
      subLinks: [
        { to: '/admin', label: 'Tableau de bord admin' },
        { to: '/admin/users', label: 'Gestion utilisateurs' },
        { to: '/admin/content', label: 'Gestion contenu' }
      ]
    });
  }

  return (
    <header className="user-header" role="banner">
      <div className="container-fluid">
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm" aria-label="Navigation utilisateur">
      <div className="container-fluid px-4">
        <Link to={isAdmin() ? "/admin" : "/user"} className="navbar-brand">
          <img
            src="/assets/images/logo/nataswim_app_logo_4.png"
            alt=""
            height="120"
            className="logo-wrapper"
          />
          <span className="visually-hidden">Accueil espace utilisateur</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#userHeaderNavbar"
          aria-controls="userHeaderNavbar"
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>


        <div
          className={`collapse navbar-collapse user-nav ${isMobileMenuOpen ? 'show' : ''}`}
          id="userHeaderNavbar"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {navLinks.map((link, index) => (
              <li key={index} className={`nav-item ${link.subLinks ? 'dropdown' : ''}`}>
                {link.subLinks ? (
                  <>
                    <button
                      className={`user-nav-link dropdown-toggle fw-bold ${isActive(link.to)}`}
                      id={`dropdownMenu${index}`}
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded={openDropdown === index}
                      onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                      aria-haspopup="true"
                    >
                      <i className={`bi ${link.icon} me-2`} aria-hidden="true"></i>
                      {link.label}
                    </button>
                    <ul 
                      className="dropdown-menu" 
                      aria-labelledby={`dropdownMenu${index}`}
                    >
                      {link.subLinks.map((subLink, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            to={subLink.to}
                            className={`dropdown-user ${isActive(subLink.to)}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-current={isActive(subLink.to) ? 'page' : undefined}
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
                    className={`nav-link d-flex align-items-center ${isActive(link.to)}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActive(link.to) ? 'page' : undefined}
                  >
                    <i className={`bi ${link.icon} me-2`} aria-hidden="true"></i>
                    {link.label}
                  </Link>
                )}
              </li>
            ))}

          </ul>

          <div className="d-flex align-items-center user-logout-btn">
            <div className="dropdown">
              <button
                className="btn btn-outline-light dropdown-toggle"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle me-2" aria-hidden="true"></i>
                {user?.username || user?.email}
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown">
                <li>
                  <Link
                    to="/user/profile"
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="bi bi-person me-2" aria-hidden="true"></i> Profil
                  </Link>
                </li>
                {isAdmin() && (
                  <li>
                    <Link
                      to="/admin"
                      className="dropdown-item d-flex align-items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className="bi bi-shield-lock me-2" aria-hidden="true"></i> Administration
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item text-danger d-flex align-items-center"
                  >
                    <i className="bi bi-box-arrow-right me-2" aria-hidden="true"></i> Déconnexion
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
    </div>
    </header>
  );
};

export default UserHeader;