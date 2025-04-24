// src/layouts/AuthLayout.jsx
// Layout pour les pages d'authentification 
// Gabarits de mise en page pour chaque espace utilisateur

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Waves, Shield } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Section Présentation / Côté Gauche */}
      <div className="w-full md:w-1/2 bg-blue-600 text-white flex flex-col justify-center items-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 opacity-75"></div>
        
        <div className="z-10 text-center">
          <div className="flex justify-center items-center mb-6">
            <Waves className="w-16 h-16 mr-4" />
            <h1 className="text-4xl font-bold">NSAPP</h1>
          </div>
          
          <p className="text-xl mb-4 max-w-md mx-auto">
            Votre plateforme complète pour la gestion et le suivi de l'entraînement en natation.
          </p>
          
          <div className="flex justify-center space-x-4 mt-6">
            <div className="flex items-center bg-white/20 px-4 py-2 rounded-lg">
              <Shield className="w-5 h-5 mr-2" />
              <span>Sécurisé</span>
            </div>
            <div className="flex items-center bg-white/20 px-4 py-2 rounded-lg">
              <Waves className="w-5 h-5 mr-2" />
              <span>Personnalisé</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section Formulaire / Côté Droit */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Les formulaires (login, register, etc.) seront rendus ici */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;