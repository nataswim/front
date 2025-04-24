import React from 'react';

const LoadingComponent = () => {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
      <p className="mt-3">Chargement des données...</p>
    </div>
  );
};

export default LoadingComponent;