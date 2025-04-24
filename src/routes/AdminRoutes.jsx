// src/routes/AdminRoutes.jsx
// Ce fichier définit toutes les routes de l'interface d'administration
// Ces routes sont accessibles uniquement aux utilisateurs authentifiés avec le rôle admin
// Toutes ces routes sont imbriquées sous le chemin /admin/*

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import DashboardPage from '../pages/admin/DashboardPage';

import NotFoundPage from '../pages/ErrorPages/NotFoundPage'; 


// Import des pages d'administration
// Pages de gestion des exercices
import AdminExercisesPage from '../pages/admin/exercises/AdminExercisesPage';
import ExerciseFormPage from '../pages/admin/exercises/ExerciseFormPage';
import ExerciseDetailPage from '../pages/admin/exercises/ExerciseDetailPage';

// Pages de gestion des utilisateurs
import UsersPage from '../pages/admin/users/UsersPage';
import UserFormPage from '../pages/admin/users/UserFormPage';

// Pages de gestion des contenus
import ContentPagesPage from '../pages/admin/pages/ContentPagesPage';
import PageDetailPage from '../pages/admin/pages/PageDetailPage';
import PageFormPage from '../pages/admin/pages/PageFormPage';

// Pages de gestion des séances d'entraînement
import AdminWorkoutsPage from '../pages/admin/workouts/AdminWorkoutsPage';
import WorkoutFormPage from '../pages/admin/workouts/WorkoutFormPage';
import WorkoutDetailPage from '../pages/admin/workouts/WorkoutDetailPage';

// Pages de gestion des séries de natation
import AdminSwimSetsPage from '../pages/admin/swimsets/AdminSwimSetsPage';
import SwimSetsFormPage from '../pages/admin/swimsets/SwimSetsFormPage';
import SwimSetsPage from '../pages/admin/swimsets/SwimSetsPage';

// Pages de gestion des plans
import AdminPlansPage from '../pages/admin/plans/AdminPlansPage';
import PlanFormPage from '../pages/admin/plans/PlanFormPage';
import PlanDetailPage from '../pages/admin/plans/PlanDetailPage';

// Pages de gestion des téléchargements
import AdminUploadsPage from '../pages/admin/uploads/AdminUploadsPage';
import UploadFormPage from '../pages/admin/uploads/UploadFormPage';
import UploadDetailPage from '../pages/admin/uploads/UploadDetailPage';

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Toutes les routes admin utilisent le même layout AdminLayout */}
      <Route element={<AdminLayout />}>
        {/* Page d'accueil du tableau de bord admin */}
        <Route index element={<DashboardPage />} />
          
        {/* GESTION DES EXERCICES */}
        <Route path="exercises">
          <Route index element={<AdminExercisesPage />} />
          <Route path="new" element={<ExerciseFormPage />} />
          <Route path=":id" element={<ExerciseDetailPage />} />
          <Route path=":id/edit" element={<ExerciseFormPage />} />
        </Route>
        
        {/* GESTION DES UTILISATEURS */}
        <Route path="users">
          <Route index element={<UsersPage />} />
          <Route path="new" element={<UserFormPage />} />
          <Route path=":id" element={<UserFormPage />} />
          <Route path=":id/edit" element={<UserFormPage />} />
        </Route>

        {/* GESTION DES PAGES DE CONTENU */}
        <Route path="pages">
          <Route index element={<ContentPagesPage />} />
          <Route path="new" element={<PageFormPage />} />
          <Route path=":id" element={<PageDetailPage />} />
          <Route path=":id/edit" element={<PageFormPage />} />
        </Route>

        {/* GESTION DES SÉANCES D'ENTRAÎNEMENT */}
        <Route path="workouts">
          <Route index element={<AdminWorkoutsPage />} />
          <Route path="new" element={<WorkoutFormPage />} />
          <Route path=":id" element={<WorkoutDetailPage />} />
          <Route path=":id/edit" element={<WorkoutFormPage />} />
        </Route>
        
        {/* GESTION DES SÉRIES DE NATATION */}
        <Route path="swim-sets">
          <Route index element={<AdminSwimSetsPage />} />
          <Route path="new" element={<SwimSetsFormPage />} />
          <Route path=":id" element={<SwimSetsPage />} />
          <Route path=":id/edit" element={<SwimSetsFormPage />} />
        </Route>

        {/* GESTION DES PLANS D'ENTRAÎNEMENT */}
        <Route path="plans">
          <Route index element={<AdminPlansPage />} />
          <Route path="new" element={<PlanFormPage />} />
          <Route path=":id" element={<PlanDetailPage />} />
          <Route path=":id/edit" element={<PlanFormPage />} />
        </Route>

        {/* GESTION DES TÉLÉCHARGEMENTS */}
        <Route path="uploads">
          <Route index element={<AdminUploadsPage />} />
          <Route path="new" element={<UploadFormPage />} />
          <Route path=":id" element={<UploadDetailPage />} />
          <Route path=":id/edit" element={<UploadFormPage />} />
        </Route>

        {/* Route 404 pour les chemins admin inexistants */}
        <Route path="*" element={<NotFoundPage />} />
        
      </Route>
    </Routes>
  );
};

export default AdminRoutes;