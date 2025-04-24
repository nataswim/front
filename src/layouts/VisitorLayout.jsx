// src/layouts/VisitorLayout.jsx # Layout pour les visiteurs (sans authentification) 
// Gabarits de mise en page pour chaque espace utilisateur (visiteur, utilisateur authentifié, administrateur)

import React from 'react';
//import VisitorNav from '../components/navigation/VisitorNav';

const VisitorLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>
      <footer className="bg-gray-100 py-4 text-center text-gray-500">
        <div className="container mx-auto">
          © {new Date().getFullYear()} NSV01 - Tous droits réservés
        </div>
      </footer>
    </div>
  );
};

export default VisitorLayout;