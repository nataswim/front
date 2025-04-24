// src/context/PlanContext.jsx  
// Stocker et gérer les plans en mémoire  # Contexte React pour gérer l'état global


import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

// Create PlanContext
const PlanContext = createContext(null);

/**
 * PlanProvider component to manage plan-related state
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components
 */
export const PlanProvider = ({ children }) => {
  // State for plans
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch plans from the server
   * @returns {Promise<void>}
   */
  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/plans', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }

      const data = await response.json();
      setPlans(data);
    } catch (err) {
      setError(err.message);
      setPlans([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new plan
   * @param {Object} planData - Plan details
   * @returns {Promise<Object>} Created plan
   */
  const createPlan = useCallback(async (planData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(planData)
      });

      if (!response.ok) {
        throw new Error('Failed to create plan');
      }

      const newPlan = await response.json();
      setPlans(prevPlans => [...prevPlans, newPlan]);
      return newPlan;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update an existing plan
   * @param {string} planId - ID of the plan to update
   * @param {Object} updatedData - Updated plan details
   * @returns {Promise<Object>} Updated plan
   */
  const updatePlan = useCallback(async (planId, updatedData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error('Failed to update plan');
      }

      const updatedPlan = await response.json();
      setPlans(prevPlans => 
        prevPlans.map(plan => 
          plan.id === planId ? updatedPlan : plan
        )
      );
      return updatedPlan;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete a plan
   * @param {string} planId - ID of the plan to delete
   * @returns {Promise<void>}
   */
  const deletePlan = useCallback(async (planId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete plan');
      }

      setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Select a plan
   * @param {Object} plan - Plan to select
   */
  const selectPlan = useCallback((plan) => {
    setSelectedPlan(plan);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    plans,
    selectedPlan,
    isLoading,
    error,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
    selectPlan
  }), [
    plans, 
    selectedPlan, 
    isLoading, 
    error, 
    fetchPlans, 
    createPlan, 
    updatePlan, 
    deletePlan, 
    selectPlan
  ]);

  return (
    <PlanContext.Provider value={contextValue}>
      {children}
    </PlanContext.Provider>
  );
};

// PropTypes for type checking
PlanProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Custom hook to use plan context
 * @returns {Object} Plan context
 */
export const usePlan = () => {
  const context = useContext(PlanContext);
  
  if (context === null) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  
  return context;
};