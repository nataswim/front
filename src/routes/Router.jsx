// src/routes/Router.jsx (version corrigée)
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { UIProvider } from '../context/UIContext';
import ErrorBoundary from '../components/ErrorBoundary';
import PrivateRoute from './PrivateRoute';
import AdminRoutes from './AdminRoutes';
import UserRoutes from './UserRoutes';
import PublicRoutes from './PublicRoutes';

// Import des composants pour tous les utilisateurs
import SwimExercise from '../pages/visitor/SwimExercise';
import SwimWorkout from '../pages/visitor/SwimWorkout';
import SwimPlan from '../pages/visitor/SwimPlan';

// Import des pages d'erreur
import NotFoundPage from '../pages/ErrorPages/NotFoundPage'; 
import ServerErrorPage from '../pages/ErrorPages/ServerErrorPage';
import ForbiddenPage from '../pages/ErrorPages/ForbiddenPage';
import UnauthorizedPage from '../pages/ErrorPages/UnauthorizedPage';
import MaintenancePage from '../pages/ErrorPages/MaintenancePage';
import TimeoutPage from '../pages/ErrorPages/TimeoutPage';
import OfflinePage from '../pages/ErrorPages/OfflinePage';

const AppRouter = () => {
  return (
    <ErrorBoundary>
      <UIProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Routes publiques */}
              <Route path="/*" element={<PublicRoutes />} />
              
              {/* Routes communes accessibles à tous mais avec contenu différent selon authentification */}
              <Route path="/educatifs-de-natation" element={<SwimExercise />} />
              <Route path="/seances-de-natation" element={<SwimWorkout />} />
              <Route path="/plans-de-natation" element={<SwimPlan />} />
              
              {/* Routes administrateur protégées */}
              <Route path="/admin/*" element={<PrivateRoute />}>
                <Route path="*" element={<AdminRoutes />} />
              </Route>
              
              {/* Routes utilisateur protégées */}
              <Route path="/user/*" element={<PrivateRoute />}>
                <Route path="*" element={<UserRoutes />} />
              </Route>
              
              {/* Routes d'erreur explicites */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="/500" element={<ServerErrorPage />} />
              <Route path="/403" element={<ForbiddenPage />} />
              <Route path="/401" element={<UnauthorizedPage />} />
              <Route path="/504" element={<TimeoutPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/offline" element={<OfflinePage />} />
              
              {/* Route catch-all pour les URLs inexistantes */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </UIProvider>
    </ErrorBoundary>
  );
};

export default AppRouter;