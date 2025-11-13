import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { useDeviceStore } from './store/deviceStore';
import LanguageSelect from './components/LanguageSelect';
import MainMenu from './components/MainMenu';
import AIAnalysis from './components/AIAnalysis';

/**
 * DeviceIPHandler Component
 * 
 * Captures device IP from URL query parameter when redirected from ESP8266.
 * Example: https://firstaiproject...net/?deviceIP=192.168.1.100
 */
const DeviceIPHandler = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const setDeviceIP = useDeviceStore((state) => state.setDeviceIP);

  useEffect(() => {
    const deviceIP = searchParams.get('deviceIP');
    if (deviceIP) {
      // Validate IP format
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (ipPattern.test(deviceIP)) {
        console.log('Device IP captured:', deviceIP);
        setDeviceIP(deviceIP);
        
        // Remove deviceIP from URL to clean it up
        searchParams.delete('deviceIP');
        setSearchParams(searchParams, { replace: true });
      }
    }
  }, [searchParams, setDeviceIP, setSearchParams]);

  return children;
};

/**
 * AppContent Component
 * 
 * Handles routing logic based on language selection:
 * - If no language is selected, show LanguageSelect screen
 * - Once language is selected, show MainMenu and allow navigation
 */
const AppContent = () => {
  const { language } = useLanguage();

  // If no language selected yet, show language selection screen
  if (!language) {
    return <LanguageSelect />;
  }

  // Once language is selected, redirect directly to AI Analysis
  return (
    <Router>
      <DeviceIPHandler>
        <Routes>
          <Route path="/" element={<Navigate to="/ai-analysis" replace />} />
          <Route path="/ai-analysis" element={<AIAnalysis />} />
          <Route path="*" element={<Navigate to="/ai-analysis" replace />} />
        </Routes>
      </DeviceIPHandler>
    </Router>
  );
};

/**
 * Main App Component
 * 
 * Wraps entire application with LanguageProvider context.
 * This ensures all components have access to language state and translations.
 */
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
