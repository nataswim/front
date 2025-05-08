// src/components/ui/Notification.jsx
import React from 'react';
import { useUI } from '../../context/UIContext';
import { FaCheck, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

/**
 * Composant de notification pour afficher les messages système globaux
 * S'intègre avec le contexte UI
 */
const Notification = () => {
  const { globalNotification, clearGlobalNotification, NOTIFICATION_TYPES } = useUI();
  
  // Si pas de notification, ne rien afficher
  if (!globalNotification) return null;
  
  // Déterminer l'icône et la classe CSS en fonction du type de notification
  let icon = <FaInfoCircle aria-hidden="true" />;
  let bgClass = 'bg-info';
  let ariaLive = 'polite';
  
  switch (globalNotification.type) {
    case NOTIFICATION_TYPES.SUCCESS:
      icon = <FaCheck aria-hidden="true" />;
      bgClass = 'bg-success';
      break;
    case NOTIFICATION_TYPES.ERROR:
      icon = <FaTimes aria-hidden="true" />;
      bgClass = 'bg-danger';
      ariaLive = 'assertive';
      break;
    case NOTIFICATION_TYPES.WARNING:
      icon = <FaExclamationTriangle aria-hidden="true" />;
      bgClass = 'bg-warning';
      ariaLive = 'assertive';
      break;
    default:
      // Par défaut, info
      break;
  }
  
  return (
    <div 
      className={`notification-container position-fixed top-0 end-0 m-3 p-3 ${bgClass} text-white rounded shadow-lg`}
      style={{ zIndex: 9999, maxWidth: '350px' }}
      role="alert"
      aria-live={ariaLive}
    >
      <div className="d-flex align-items-start">
        <div className="me-3 mt-1">
          {icon}
        </div>
        <div className="flex-grow-1">
          <p className="mb-0">{globalNotification.message}</p>
        </div>
        <button 
          className="btn-close btn-close-white ms-2" 
          onClick={clearGlobalNotification}
          aria-label="Fermer la notification"
        />
      </div>
    </div>
  );
};

Notification.propTypes = {
  // Pas de props directes car ce composant utilise le contexte UI
};

export default Notification;