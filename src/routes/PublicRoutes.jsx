// src/routes/PublicRoutes.jsx
// Ce fichier définit toutes les routes publiques de l'application 
// Ces routes sont accessibles sans authentification

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import VisitorLayout from '../layouts/VisitorLayout';


import NotFoundPage from '../pages/ErrorPages/NotFoundPage'; 


// Pages visiteurs
import HomePage from '../pages/visitor/HomePage';
import AboutPage from '../pages/visitor/AboutPage';
import ContactPage from '../pages/visitor/ContactPage';
import FeaturesPage from '../pages/visitor/FeaturesPage';
import PricingPage from '../pages/visitor/PricingPage';
import PageDetailPage from '../pages/visitor/PageDetailPage';
import PageInfosList from '../pages/visitor/PageInfosList';
import SearchPage from '../pages/visitor/SearchPage';

// Pages légales
import LegalNoticePage from '../pages/visitor/LegalNoticePage';
import PolicyPage from '../pages/visitor/PolicyPage';
import CookiesPolicy from '../pages/visitor/CookiesPolicy';
import Accessibility from '../pages/visitor/Accessibility';

// Pages d'authentification
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// Pages Gadgets
import ToolsIndexPage from '../pages/gadgets/ToolsIndexPage';
import TargetHeartRateCalculator from '../pages/gadgets/TargetHeartRateCalculator';
import CalorieCalculator from '../pages/gadgets/CalorieCalculator';
import BMICalculator from '../pages/gadgets/BMICalculator';
import SwimmingPerformancePredictor from '../pages/gadgets/SwimmingPerformancePredictor';
import OneRMCalculator from '../pages/gadgets/OneRMCalculator';
import InteractiveMap from '../pages/gadgets/InteractiveMap';
import FitnessCalculator from '../pages/gadgets/FitnessCalculator';
import Chronometer from '../pages/gadgets/Chronometer';
import TDEECalculator from '../pages/gadgets/TDEECalculator';
import BodyFatCalculator from '../pages/gadgets/BodyFatCalculator';
import HydrationCalculator from '../pages/gadgets/HydrationCalculator';
import KcalMacroConverter from '../pages/gadgets/KcalMacroConverter';
import RunningPlanner from '../pages/gadgets/RunningPlanner';
import TriathlonPlanner from '../pages/gadgets/TriathlonPlanner';
import SwimmingPlanner from '../pages/gadgets/SwimmingPlanner';

// Pages Guides FAq
import UserGuidePage from '../pages/visitor/UserGuidePage';










const PublicRoutes = () => {
  return (
    <Routes>
      {/* 
        IMPORTANT: Dans Router.jsx, ces routes sont imbriquées sous path="/*"
        Les chemins ici sont donc relatifs à la racine "/" 
        On peut utiliser des chemins comme "/a-propos" ou simplement "a-propos"
      */}
      
      {/* Routes principales du site */}
      <Route path="/" element={<HomePage />} />
      <Route path="/a-propos" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/fonctionnalites" element={<FeaturesPage />} />
      <Route path="/plan-inscription" element={<PricingPage />} />
      <Route path="/pages/:id" element={<PageDetailPage />} />
      <Route path="/articles" element={<PageInfosList />} />
      <Route path="/search" element={<SearchPage />} />
      
      {/* Routes d'authentification */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      
      {/* Routes légales */}
      <Route path="/mentions-legales" element={<LegalNoticePage />} />
      <Route path="/politique-confidentialite" element={<PolicyPage />} />
      <Route path="/cookies" element={<CookiesPolicy />} />
      <Route path="/declaration-Accessibilite" element={<Accessibility />} />
      {/* Route 404 pour les chemins publics inexistants */}
      <Route path="*" element={<NotFoundPage />} />
      {/* Routes gadgets */}
      <Route path="/outils" element={<ToolsIndexPage />} />
      <Route path="/outils/calculateur-imc" element={<BMICalculator />} />
      <Route path="/outils/prediction-performance-natation" element={<SwimmingPerformancePredictor />} />
      <Route path="/outils/calculateur-charge-maximale" element={<OneRMCalculator />} />
      <Route path="/outils/carte-interactive" element={<InteractiveMap />} />
      <Route path="/outils/sante-calculateur" element={<FitnessCalculator />} />
      <Route path="/outils/chronometre-groupe" element={<Chronometer />} />
      <Route path="/outils/calculateur-calories-sport" element={<CalorieCalculator />} />
      <Route path="/outils/calculateur-fc-zones" element={<TargetHeartRateCalculator />} />
      <Route path="/outils/calculateur-tdee" element={<TDEECalculator />} />

<Route path="/outils/calculateur-masse-grasse" element={<BodyFatCalculator />} />
<Route path="/outils/calculateur-hydratation" element={<HydrationCalculator />} />
<Route path="/outils/planificateur-course" element={<RunningPlanner />} />


<Route path="/outils/convertisseur-kcal-macros" element={<KcalMacroConverter />} />
<Route path="/outils/planificateur-triathlon" element={<TriathlonPlanner />} />
<Route path="/outils/planificateur-natation" element={<SwimmingPlanner />} />


       {/* Route Gude Utilisation */}
       <Route path="guide" element={<UserGuidePage />} />

      
      
    </Routes>
  );
};

export default PublicRoutes;