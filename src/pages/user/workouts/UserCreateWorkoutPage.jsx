// src/pages/user/workouts/UserCreateWorkoutPage.jsx
// ages accessibles après connexion

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave, FaSwimmer, FaInfoCircle } from "react-icons/fa";
import Footer from "../../../components/template/Footer";
import { createWorkout } from "../../../services/workouts";

const UserCreateWorkoutPage = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    workout_category: "",
    user_id: "",
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Workout categories
  const workoutCategories = [
    "Aero 1",
    "Vitesse",
    "Mixte",
    "Technique",
    "Récupération",
  ];

  // Get current user ID (in a real app, this would come from auth context)
  useEffect(() => {
    // Temporary: set a default user ID
    setFormData((prev) => ({
      ...prev,
      user_id: "1", // This should come from auth context in a real app
    }));
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate current step
  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.title) {
          setError("Le titre est requis");
          return false;
        }
        if (!formData.workout_category) {
          setError("La catégorie est requise");
          return false;
        }
        break;
      // Add validation for other steps if needed
      default:
        break;
    }
    setError(null);
    return true;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await createWorkout(formData);

      // Redirect to the new workout's detail page
      navigate(`/user/workouts/${response.data.id}`);
    } catch (err) {
      console.error("Error creating workout:", err);
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors de la création de la séance"
      );
      setLoading(false);
    }
  };

  return (
    <>
      <main className="container py-5">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h1 className="h2 mb-0">
                  Création d'Une Nouvelle Séance d'Entraînement
                </h1>

                <h3 className="h5 mb-3">en cours de création</h3>
                <div className="alert alert-info">
                  <FaInfoCircle className="me-2" />
                  Disponibles bientôt en V2.0.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default UserCreateWorkoutPage;
