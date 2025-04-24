import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Import des pages d'erreur
import NotFoundPage from '../pages/ErrorPages/NotFoundPage';
import ServerErrorPage from '../pages/ErrorPages/ServerErrorPage';
import ForbiddenPage from '../pages/ErrorPages/ForbiddenPage';
import UnauthorizedPage from '../pages/ErrorPages/UnauthorizedPage';
import MaintenancePage from '../pages/ErrorPages/MaintenancePage';
import TimeoutPage from '../pages/ErrorPages/TimeoutPage';

/**
 * Configuration des routes d'erreur
 * Chaque erreur HTTP courante possède sa propre page dédiée
 */
const ErrorRoutes = () => {
  return (
    <Routes>
      {/* Routes d'erreur standard */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="/500" element={<ServerErrorPage />} />
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="/401" element={<UnauthorizedPage />} />
      <Route path="/504" element={<TimeoutPage />} />
      
      {/* Page de maintenance */}
      <Route path="/maintenance" element={<MaintenancePage />} />
      
      {/* Capture toutes les autres routes non définies et redirige vers 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default ErrorRoutes;