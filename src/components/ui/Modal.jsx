// Composant pour afficher des modals (pop-ups)
// Exemple d'utilisation: 
// {/* Modal de base */} 
// <Modal    isOpen={isModalOpen}    onClose={() => setIsModalOpen(false)} >   
// <p>Contenu de la modal</p> </Modal>


import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Versatile Modal component for the application
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Controls the visibility of the modal
 * @param {function} props.onClose - Callback function to close the modal
 * @param {string} [props.title] - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} [props.size='md'] - Modal size (sm, md, lg, xl)
 * @param {React.ReactNode} [props.footer] - Footer content
 * @param {string} [props.className] - Additional CSS classes for the modal
 * @param {string} [props.ariaLabel] - Accessible label for the modal
 * @param {string} [props.ariaDescribedby] - ID of element that describes the modal
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
  className = '',
  ariaLabel,
  ariaDescribedby
}) => {
  const modalRef = useRef(null);
  const firstFocusableElementRef = useRef(null);
  const lastFocusableElementRef = useRef(null);

  // Size configurations
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };
  const validSize = Object.keys(sizeStyles).includes(size) ? size : 'md';

  // Handle keyboard events (Escape key and Tab key for focus trap)
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleTabKey = (event) => {
      // Only trap focus when modal is open
      if (!isOpen || !firstFocusableElementRef.current || !lastFocusableElementRef.current) return;

      // If shift + tab pressed and focus is on first element, move to last element
      if (event.shiftKey && document.activeElement === firstFocusableElementRef.current) {
        event.preventDefault();
        lastFocusableElementRef.current.focus();
      }
      // If tab pressed and focus is on last element, move to first element
      else if (!event.shiftKey && document.activeElement === lastFocusableElementRef.current) {
        event.preventDefault();
        firstFocusableElementRef.current.focus();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleEscapeKey(event);
      } else if (event.key === 'Tab') {
        handleTabKey(event);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      
      // Set focus to the modal when it opens
      if (modalRef.current) {
        // Find all focusable elements
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length) {
          firstFocusableElementRef.current = focusableElements[0];
          lastFocusableElementRef.current = focusableElements[focusableElements.length - 1];
          
          // Focus the first element
          firstFocusableElementRef.current.focus();
        }
      }
      
      // Prevent scrolling of the body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Prevent rendering if modal is not open
  if (!isOpen) return null;

  // Generate unique IDs for accessibility
  const modalId = `modal-${Math.random().toString(36).substring(2, 9)}`;
  const titleId = `modal-title-${Math.random().toString(36).substring(2, 9)}`;
  const descriptionId = ariaDescribedby || `modal-description-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-label={!title && ariaLabel ? ariaLabel : undefined}
      aria-describedby={descriptionId}
    >
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black opacity-50" 
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal Container */}
      <div 
        ref={modalRef}
        className={`
          relative w-full mx-auto bg-white rounded-lg shadow-xl 
          ${sizeStyles[validSize]}
          ${className}
        `}
        role="document"
        tabIndex="-1"
      >
        {/* Header */}
        {title && (
          <div className="flex items-start justify-between p-4 border-b border-gray-200 rounded-t">
            <h3 className="text-xl font-semibold text-gray-900" id={titleId}>{title}</h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={onClose}
              aria-label="Fermer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path 
                  fillRule="evenodd" 
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4" id={descriptionId}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center p-4 border-t border-gray-200 rounded-b">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// PropTypes for type checking
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  footer: PropTypes.node,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaDescribedby: PropTypes.string
};

export default Modal;