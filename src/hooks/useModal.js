// src/hooks/useModal.js
// Gestion des modals 
// Hooks React personnalisés


import { useState, useCallback } from 'react';

/**
 * Custom hook for managing modal state
 * @returns {Object} Modal management functions and state
 */
const useModal = () => {
  // State to track whether the modal is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // State to store any additional data that might be passed to the modal
  const [modalData, setModalData] = useState(null);

  /**
   * Open the modal with optional data
   * @param {*} [data] - Optional data to be passed to the modal
   */
  const openModal = useCallback((data = null) => {
    setIsOpen(true);
    setModalData(data);
  }, []);

  /**
   * Close the modal and reset the modal data
   */
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalData(null);
  }, []);

  /**
   * Toggle the modal's open/closed state
   */
  const toggleModal = useCallback(() => {
    setIsOpen(prevState => !prevState);
  }, []);

  // Return an object with modal state and control functions
  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
    toggleModal
  };
};

export default useModal;