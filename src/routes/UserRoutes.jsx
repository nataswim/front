// src/routes/UserRoutes.jsx
// Ce fichier définit toutes les routes accessibles aux utilisateurs authentifiés
// Ces routes sont imbriquées sous le chemin /user/* et protégées par PrivateRoute
// Elles utilisent le layout UserLayout pour garder une interface cohérente

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import PrivateRoute from './PrivateRoute';

import NotFoundPage from '../pages/ErrorPages/NotFoundPage'; 


// Page principale de tableau de bord utilisateur
import UserDashboardPage from '../pages/user/UserDashboardPage';

// Pages utilisateur pour les exercices
import UserExercisesList from '../pages/user/UserExercisesList';
import UserExerciseDetailPage from '../pages/user/exercises/UserExerciseDetailPage';
import UserExercisesPage from '../pages/user/exercises/UserExercisesPage';

// Pages utilisateur pour les listes personnalisées
import UserMyLists from '../pages/user/UserMyLists';
import UserListDetailPage from '../pages/user/mylists/UserListDetailPage';
import UserMyListsPage from '../pages/user/mylists/UserMyListsPage';
import UserMyListFormPage from '../pages/user/mylists/UserMyListFormPage';
import UserMyListAddItemPage from '../pages/user/mylists/UserMyListAddItemPage';

// Pages utilisateur pour les plans d'entraînement
import UserPlansList from '../pages/user/UserPlansList';
import UserPlanDetailPage from '../pages/user/plans/UserPlanDetailPage';
import UserPlansPage from '../pages/user/plans/UserPlansPage';

// Pages utilisateur pour les séances d'entraînement
import UserWorkoutsList from '../pages/user/UserWorkoutsList';
import UserCreateWorkoutPage from '../pages/user/workouts/UserCreateWorkoutPage';
import UserWorkoutDetailPage from '../pages/user/workouts/UserWorkoutDetailPage';
import UserWorkoutsPage from '../pages/user/workouts/UserWorkoutsPage';

// Pages utilisateur pour les médias et le profil
import UserProfilePage from '../pages/user/UserProfilePage';
import UserUploadsPage from '../pages/user/uploads/UserUploadsPage';
import UserUploadList from '../pages/user/UserUploadList';



// Divers imports qui ne sont pas directement utilisés dans ce fichier
import { AuthProvider } from '../context/AuthContext';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

const UserRoutes = () => {
  return (
    <Routes>
      {/* Double vérification avec PrivateRoute, bien que déjà vérifié dans Router.jsx */}
      <Route element={<PrivateRoute />}>
        {/* Utilisation du layout commun pour toutes les routes utilisateur */}
        <Route element={<UserLayout />}>
          
          {/* Dashboard - page d'accueil de l'espace utilisateur */}
          <Route index element={<UserDashboardPage />} />
          <Route path="dashboard" element={<UserDashboardPage />} />

          {/* GESTION DES EXERCICES */}
          <Route path="exercises">
            <Route index element={<UserExercisesPage />} />
            <Route path=":id" element={<UserExerciseDetailPage />} />
            <Route path="mes_exercices" element={<UserExercisesList />} />
          </Route>

          {/* GESTION DES SÉANCES D'ENTRAÎNEMENT */}
          <Route path="workouts">
            <Route index element={<UserWorkoutsList />} />
            <Route path="create" element={<UserCreateWorkoutPage />} />
            <Route path=":id" element={<UserWorkoutDetailPage />} />
            <Route path="mes_seances" element={<UserWorkoutsPage />} />
          </Route>

          {/* GESTION DES PLANS D'ENTRAÎNEMENT */}
          <Route path="plans">
            <Route index element={<UserPlansPage />} />
            <Route path=":id" element={<UserPlanDetailPage />} />
            <Route path="mes_plans" element={<UserPlansList />} />
          </Route>

          {/* GESTION DES LISTES PERSONNALISÉES */}
          <Route path="mylists">
            <Route index element={<UserMyListsPage />} />
            <Route path="new" element={<UserMyListFormPage />} />
            <Route path=":id" element={<UserListDetailPage />} />
            <Route path=":id/edit" element={<UserMyListFormPage />} />
            <Route path=":id/add-item" element={<UserMyListAddItemPage />} />
            <Route path="mes_listes" element={<UserMyLists />} />
          </Route>

          {/* GESTION DU PROFIL UTILISATEUR */}
          <Route path="profile" element={<UserProfilePage />} />

          {/* GESTION DES MÉDIAS ET TÉLÉCHARGEMENTS */}
          <Route path="uploads">
            <Route index element={<UserUploadList />} />
            <Route path="medias" element={<UserUploadsPage />} />
          </Route>
        </Route>
       

        {/* Route 404 pour les chemins admin inexistants */}
        <Route path="*" element={<NotFoundPage />} />

      </Route>
    </Routes>
  );
};

export default UserRoutes;