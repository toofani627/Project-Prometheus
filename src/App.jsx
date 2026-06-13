import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { getSession } from './lib/auth';

import Login        from './pages/Login';
import LanguageSelect from './components/LanguageSelect';
import AIAnalysis   from './components/AIAnalysis';
import Profile      from './components/Profile';
import MultiCrop    from './components/MultiCrop';
import Layout       from './components/Layout';
import AnalysisResults from './components/AnalysisResults';

/** Redirects to /login if not authenticated */
const ProtectedRoute = ({ children }) => {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  return children;
};

/**
 * After login, if no language is chosen yet show LanguageSelect.
 * Once language is set, proceed to the normal Layout + routes.
 */
const AppContent = () => {
  const { language } = useLanguage();
  const session = getSession();

  return (
    <Routes>
      {/* Public: login */}
      <Route
        path="/login"
        element={session ? <Navigate to={language ? '/ai-analysis' : '/language-select'} replace /> : <Login />}
      />

      {/* After login: language selection (only if language not yet set) */}
      <Route
        path="/language-select"
        element={
          <ProtectedRoute>
            {language ? <Navigate to="/ai-analysis" replace /> : <LanguageSelect />}
          </ProtectedRoute>
        }
      />

      {/* Protected app routes */}
      <Route
        element={
          <ProtectedRoute>
            {!language ? <Navigate to="/language-select" replace /> : <Layout />}
          </ProtectedRoute>
        }
      >
        <Route path="/ai-analysis"       element={<AIAnalysis />} />
        <Route path="/analysis-results"  element={<AnalysisResults />} />
        <Route path="/profile"           element={<Profile />} />
        <Route path="/multi-crop"        element={<MultiCrop />} />
      </Route>

      {/* Catch-all: if logged in → dashboard, else → login */}
      <Route
        path="*"
        element={
          session
            ? <Navigate to={language ? '/ai-analysis' : '/language-select'} replace />
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}

export default App;
