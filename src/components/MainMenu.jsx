import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

/**
 * MainMenu Component
 *
 * Entry hub for IoT device monitoring and AI analysis.
 * Device connection is handled on the AI Analysis page via WebSocket (device_id).
 */
const MainMenu = () => {
  const { t, changeLanguage, language } = useLanguage();
  const navigate = useNavigate();

  const handleLanguageSwitch = () => {
    localStorage.removeItem('language');
    changeLanguage(null);
  };

  const handleDeviceConnection = () => {
    navigate('/ai-analysis');
  };

  const handleAIAnalysis = () => {
    navigate('/ai-analysis');
  };

  const handleMultiCrop = () => {
    navigate('/multi-crop');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="hidden sm:block sm:w-24 md:w-32"></div>
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

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-6 sm:gap-8 max-w-5xl mx-auto">
          <div
            onClick={handleDeviceConnection}
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

          <div
            onClick={handleMultiCrop}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full sm:max-w-md md:w-96 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-amber-100 rounded-full p-4 sm:p-6">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-3 sm:mb-4">
              {language === 'en'
                ? '🌿 Companion Planting'
                : language === 'hi'
                ? '🌿 साथी फसल'
                : '🌿 கூட்டுப் பயிர்'}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              {language === 'en'
                ? 'Find the best companion crops for better yields and pest control'
                : language === 'hi'
                ? 'बेहतर पैदावार और कीट नियंत्रण के लिए सर्वश्रेष्ठ साथी फसलें खोजें'
                : 'சிறந்த மகசூல் மற்றும் கீட் கட்டுப்பாட்டிற்கான சிறந்த கூட்டுப் பயிர்களைக் கண்டறியவும்'}
            </p>
          </div>
        </div>
      </div>

      <button className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gray-800 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors duration-200 active:scale-95">
        <span className="text-xl sm:text-2xl">{t('help')}</span>
      </button>
    </div>
  );
};

export default MainMenu;
