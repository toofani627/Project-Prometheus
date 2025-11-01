import React from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * LanguageSelect Component
 * 
 * This is the first screen users see on app load.
 * Allows users to select between English and Hindi.
 * The selection is stored in localStorage and affects all UI text throughout the app.
 */
const LanguageSelect = () => {
  const { changeLanguage, t } = useLanguage();

  const handleLanguageSelect = (lang) => {
    changeLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-8 sm:mb-12">
          Select Language
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
          {/* English Button */}
          <button
            onClick={() => handleLanguageSelect('en')}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 sm:py-6 px-10 sm:px-12 rounded-xl text-lg sm:text-xl transition-all duration-200 transform hover:scale-105 shadow-lg active:scale-95"
          >
            English
          </button>
          
          {/* Hindi Button */}
          <button
            onClick={() => handleLanguageSelect('hi')}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-5 sm:py-6 px-10 sm:px-12 rounded-xl text-lg sm:text-xl transition-all duration-200 transform hover:scale-105 shadow-lg active:scale-95"
          >
            हिन्दी
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelect;
