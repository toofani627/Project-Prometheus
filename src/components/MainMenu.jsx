import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useDeviceStore } from '../store/deviceStore';

/**
 * MainMenu Component
 * 
 * Displays two main options:
 * 1. Device Control - Prompts for IP and redirects to device webpage
 * 2. AI Analysis - Opens the AI analysis dashboard
 * 
 * All text automatically switches based on selected language.
 */
const MainMenu = () => {
  const { t, changeLanguage, language } = useLanguage();
  const navigate = useNavigate();
  const [showIPModal, setShowIPModal] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  
  // Device store for stored IP from ESP8266 redirection
  const { deviceIP, getDeviceWebsiteURL, setDeviceIP } = useDeviceStore();

  const handleLanguageSwitch = () => {
    // Clear language to show selection screen again
    localStorage.removeItem('language');
    changeLanguage(null);
  };

  const handleDeviceControl = () => {
    // If device IP is already stored, use it directly
    const websiteURL = getDeviceWebsiteURL();
    if (websiteURL) {
      window.open(websiteURL, '_blank');
    } else {
      // Otherwise, prompt for IP
      setShowIPModal(true);
    }
  };

  const handleIPSubmit = () => {
    if (ipAddress.trim()) {
      // Save IP to store for future use
      setDeviceIP(ipAddress.trim());
      
      // Redirect to device Website endpoint
      window.open(`http://${ipAddress.trim()}/Website`, '_blank');
      setShowIPModal(false);
      setIpAddress('');
    }
  };

  const handleAIAnalysis = () => {
    navigate('/ai-analysis');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="hidden sm:block sm:w-24 md:w-32"></div> {/* Spacer */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 flex-1 sm:flex-none">
            {t('mainMenu')}
          </h1>
          <button
            onClick={handleLanguageSwitch}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-xs sm:text-sm whitespace-nowrap flex items-center gap-1"
          >
            <span className="hidden xs:inline">
              {language === 'en' ? '🌐 हिन्दी / தமிழ்' : language === 'hi' ? '🌐 English / தமிழ்' : '🌐 English / हिन्दी'}
            </span>
            <span className="xs:hidden">🌐</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-6 sm:gap-8 max-w-5xl mx-auto">
          
          {/* Device Control Card */}
          <div 
            onClick={handleDeviceControl}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full sm:max-w-md md:w-96 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-blue-100 rounded-full p-4 sm:p-6">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-3 sm:mb-4">
              {t('deviceControl')}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              {t('deviceControlDesc')}
            </p>
          </div>

          {/* AI Analysis Card */}
          <div 
            onClick={handleAIAnalysis}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full sm:max-w-md md:w-96 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-purple-100 rounded-full p-4 sm:p-6">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-3 sm:mb-4">
              {t('aiAnalysis')}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              {t('aiAnalysisDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* IP Address Modal */}
      {showIPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
              {t('enterIP')}
            </h3>
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder={t('ipPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 sm:mb-6 text-sm sm:text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleIPSubmit()}
            />
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleIPSubmit}
                className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 active:scale-95"
              >
                {t('connect')}
              </button>
              <button
                onClick={() => {
                  setShowIPModal(false);
                  setIpAddress('');
                }}
                className="w-full sm:flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition-colors duration-200 active:scale-95"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Button */}
      <button className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gray-800 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors duration-200 active:scale-95">
        <span className="text-xl sm:text-2xl">{t('help')}</span>
      </button>
    </div>
  );
};

export default MainMenu;
