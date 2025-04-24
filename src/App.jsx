// src/App.jsx
// App component is the main component of the application.
// It is the parent component of all other components.
// It wraps the Router component with both AuthProvider and UIProvider context providers.

import React from 'react';
import Router from './routes/Router';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import ErrorBoundary from './components/ErrorBoundary';
import Notification from './components/ui/Notification';
import './assets/styles/global.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import TextEditor from "./components/ui/forms/TextEditor";

function App() {
  return (
    <ErrorBoundary>
      <UIProvider>
        <AuthProvider>
          <Router />
          <Notification />
        </AuthProvider>
      </UIProvider>
    </ErrorBoundary>
  );
}

export default App;