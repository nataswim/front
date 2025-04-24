// src/context/WorkoutContext.jsx  
// Stocker et gérer les entraînements en mémoire  
// Contexte React pour gérer l'état global

import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

// Création du contexte Workout
const WorkoutContext = createContext();

// Type de définition pour un entraînement
const WorkoutPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'cardio', 
    'strength', 
    'flexibility', 
    'hiit', 
    'yoga', 
    'other'
  ]).isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  duration: PropTypes.number.isRequired, // en minutes
  intensity: PropTypes.oneOf(['low', 'medium', 'high']),
  exercises: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    sets: PropTypes.number,
    reps: PropTypes.number,
    weight: PropTypes.number,
    duration: PropTypes.number
  })),
  notes: PropTypes.string
});

// Fournisseur de contexte Workout
export const WorkoutProvider = ({ children }) => {
  // États des entraînements
  const [workouts, setWorkouts] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState(null);

  // Ajouter un nouvel entraînement
  const addWorkout = useCallback((workout) => {
    const newWorkout = {
      ...workout,
      id: `workout_${Date.now()}`, // Génération d'un ID unique
      date: workout.date || new Date()
    };
    setWorkouts(prev => [...prev, newWorkout]);
    return newWorkout;
  }, []);

  // Mettre à jour un entraînement existant
  const updateWorkout = useCallback((id, updatedWorkout) => {
    setWorkouts(prev => 
      prev.map(workout => 
        workout.id === id ? { ...workout, ...updatedWorkout } : workout
      )
    );
  }, []);

  // Supprimer un entraînement
  const deleteWorkout = useCallback((id) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id));
  }, []);

  // Récupérer des entraînements filtrés
  const getFilteredWorkouts = useCallback((filters = {}) => {
    return workouts.filter(workout => {
      const { 
        type, 
        minDate, 
        maxDate, 
        minDuration, 
        maxDuration, 
        intensity 
      } = filters;

      if (type && workout.type !== type) return false;
      if (intensity && workout.intensity !== intensity) return false;
      
      if (minDate && workout.date < minDate) return false;
      if (maxDate && workout.date > maxDate) return false;
      
      if (minDuration && workout.duration < minDuration) return false;
      if (maxDuration && workout.duration > maxDuration) return false;

      return true;
    });
  }, [workouts]);

  // Calculer des statistiques d'entraînement
  const getWorkoutStats = useMemo(() => {
    if (workouts.length === 0) return {};

    return {
      totalWorkouts: workouts.length,
      totalDuration: workouts.reduce((sum, workout) => sum + workout.duration, 0),
      workoutsByType: workouts.reduce((acc, workout) => {
        acc[workout.type] = (acc[workout.type] || 0) + 1;
        return acc;
      }, {}),
      averageIntensity: workouts.reduce((acc, workout) => {
        const intensityValue = {
          'low': 1,
          'medium': 2,
          'high': 3
        }[workout.intensity] || 0;
        return acc + intensityValue;
      }, 0) / workouts.length
    };
  }, [workouts]);

  // Commencer un nouvel entraînement
  const startWorkout = useCallback((workoutTemplate) => {
    const newWorkout = {
      ...workoutTemplate,
      id: `workout_${Date.now()}`,
      date: new Date(),
      startTime: new Date()
    };
    setCurrentWorkout(newWorkout);
    return newWorkout;
  }, []);

  // Terminer l'entraînement en cours
  const finishWorkout = useCallback(() => {
    if (currentWorkout) {
      const finishedWorkout = {
        ...currentWorkout,
        endTime: new Date(),
        duration: Math.round((new Date() - currentWorkout.startTime) / 60000) // durée en minutes
      };
      
      addWorkout(finishedWorkout);
      setCurrentWorkout(null);
      return finishedWorkout;
    }
    return null;
  }, [currentWorkout, addWorkout]);

  // Mémorisation des valeurs du contexte
  const contextValue = useMemo(() => ({
    // États
    workouts,
    currentWorkout,

    // Méthodes
    addWorkout,
    updateWorkout,
    deleteWorkout,
    getFilteredWorkouts,
    getWorkoutStats,
    startWorkout,
    finishWorkout,
    setCurrentWorkout
  }), [
    workouts, 
    currentWorkout,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    getFilteredWorkouts,
    getWorkoutStats,
    startWorkout,
    finishWorkout
  ]);

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
};

// Validation des props
WorkoutProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Hook personnalisé pour utiliser le contexte Workout
export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  
  return context;
};

export default WorkoutContext;