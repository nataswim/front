// src/components/ui/Notification.jsx
import React from 'react';
import { useUI } from '../../context/UIContext';
import { FaCheck, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

/**
 * Composant de notification pour afficher les messages système globaux
 * S'intègre avec le contexte UI
 */
const Notification = () => {
  const { globalNotification, clearGlobalNotification, NOTIFICATION_TYPES } = useUI();
  
  // Si pas de notification, ne rien afficher
  if (!globalNotification) return null;
  
  // Déterminer l'icône et la classe CSS en fonction du type de notification
  let icon = <FaInfoCircle />;
  let bgClass = 'bg-info';
  
  switch (globalNotification.type) {
    case NOTIFICATION_TYPES.SUCCESS:
      icon = <FaCheck />;
      bgClass = 'bg-success';
      break;
    case NOTIFICATION_TYPES.ERROR:
      icon = <FaTimes />;
      bgClass = 'bg-danger';
      break;
    case NOTIFICATION_TYPES.WARNING:
      icon = <FaExclamationTriangle />;
      bgClass = 'bg-warning';
      break;
    default:
      // Par défaut, info
      break;
  }
  
  return (
    <div 
      className={`notification-container position-fixed top-0 end-0 m-3 p-3 ${bgClass} text-white rounded shadow-lg`}
      style={{ zIndex: 9999, maxWidth: '350px' }}
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
          aria-label="Fermer"
        />
      </div>
    </div>
  );
};

export default Notification;