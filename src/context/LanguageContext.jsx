import React, { createContext, useState, useContext, useEffect } from 'react';

// Language Context for bilingual support (English & Hindi)
const LanguageContext = createContext();

// All translations for the entire application
const translations = {
  en: {
    // Language Selection
    selectLanguage: 'Select Language',
    english: 'English',
    hindi: 'हिन्दी',
    
    // Main Menu
    mainMenu: 'Main Menu',
    deviceControl: 'Device Control',
    deviceControlDesc: 'Monitor and control connected IoT devices',
    aiAnalysis: 'AI Analysis',
    aiAnalysisDesc: 'Analyze environmental data with AI insights',
    backToMenu: '← Back to Menu',
    
    // Device Control
    enterIP: 'Enter Device IP Address',
    ipPlaceholder: 'e.g., 192.168.1.100',
    connect: 'Connect',
    cancel: 'Cancel',
    
    // AI Analysis Dashboard
    aiAnalysisDashboard: 'AI Analysis Dashboard',
    deviceInformation: 'Device Information',
    environmentalData: 'Environmental Data',
    device: 'Device',
    temperature: 'Temperature (°C)',
    humidity: 'Humidity (%)',
    soil: 'Soil (%)',
    light: 'Light',
    gps: 'GPS',
    timestamp: 'Timestamp',
    
    // Buttons
    getData: 'Get Data',
    exportJSON: 'Export JSON',
    clearData: 'Clear Data',
    runAIAnalysis: 'Run AI Analysis',
    
    // Status Log
    statusLog: 'Status Log',
    successfullyFetched: '✓ Successfully fetched data from 3 devices',
    dataUpdated: '📊 Data updated at',
    readyForAnalysis: '→ Ready for AI analysis',
    noDataAvailable: 'No data available. Click "Get Data" to fetch from device.',
    
    // Crop Selection
    selectCropType: 'Select Crop Type',
    chooseCrop: 'Choose a crop...',
    wheat: 'Wheat',
    rice: 'Rice',
    maize: 'Maize',
    sugarcane: 'Sugarcane',
    cotton: 'Cotton',
    
    // pH Scale
    soilPHScale: 'Soil pH Scale',
    phNote: 'pH values from acidic (red) to neutral (green) to alkaline (blue)',
    
    // Additional Query
    additionalQuery: 'Additional Query',
    queryPlaceholder: 'Enter any specific questions or observations about your crops or environmental conditions...',
    
    // Help
    help: '?',
  },
  hi: {
    // Language Selection
    selectLanguage: 'भाषा चुनें',
    english: 'English',
    hindi: 'हिन्दी',
    
    // Main Menu
    mainMenu: 'मुख्य मेनू',
    deviceControl: 'डिवाइस कंट्रोल',
    deviceControlDesc: 'जुड़े IoT डिवाइस को देखें और कंट्रोल करें',
    aiAnalysis: 'AI जांच',
    aiAnalysisDesc: 'AI की मदद से खेत का डेटा देखें',
    backToMenu: '← मेनू पर वापस',
    
    // Device Control
    enterIP: 'डिवाइस IP एड्रेस लिखें',
    ipPlaceholder: 'जैसे: 192.168.1.100',
    connect: 'जोड़ें',
    cancel: 'रद्द करें',
    
    // AI Analysis Dashboard
    aiAnalysisDashboard: 'AI जांच डैशबोर्ड',
    deviceInformation: 'डिवाइस की जानकारी',
    environmentalData: 'खेत का डेटा',
    device: 'डिवाइस',
    temperature: 'तापमान (°C)',
    humidity: 'नमी (%)',
    soil: 'मिट्टी नमी (%)',
    light: 'रोशनी',
    gps: 'लोकेशन',
    timestamp: 'समय',
    
    // Buttons
    getData: 'डेटा लाएं',
    exportJSON: 'JSON सेव करें',
    clearData: 'डेटा मिटाएं',
    runAIAnalysis: 'AI से जांच करें',
    
    // Status Log
    statusLog: 'स्टेटस',
    successfullyFetched: '✓ 3 डिवाइस से डेटा मिल गया',
    dataUpdated: '📊 डेटा अपडेट हुआ',
    readyForAnalysis: '→ AI जांच के लिए तैयार',
    noDataAvailable: 'डेटा नहीं है। "डेटा लाएं" बटन दबाएं।',
    
    // Crop Selection
    selectCropType: 'फसल चुनें',
    chooseCrop: 'फसल चुनें...',
    wheat: 'गेहूं',
    rice: 'चावल',
    maize: 'मक्का',
    sugarcane: 'गन्ना',
    cotton: 'कपास',
    
    // pH Scale
    soilPHScale: 'मिट्टी pH लेवल',
    phNote: 'pH - खट्टा (लाल) से साधारण (हरा) से खारी (नीला)',
    
    // Additional Query
    additionalQuery: 'और सवाल',
    queryPlaceholder: 'फसल या मौसम के बारे में कोई सवाल लिखें...',
    
    // Help
    help: '?',
  },
};

export const LanguageProvider = ({ children }) => {
  // Check localStorage for saved language preference, default to null to show language selection
  const [language, setLanguage] = useState(() => {
    // Version check - force language selection for new deployment
    const APP_VERSION = '2.0'; // Increment this to force language reselection
    const savedVersion = localStorage.getItem('appVersion');
    
    // If version doesn't match, clear language and force reselection
    if (savedVersion !== APP_VERSION) {
      localStorage.removeItem('language');
      localStorage.setItem('appVersion', APP_VERSION);
      return null;
    }
    
    const savedLanguage = localStorage.getItem('language');
    // Only return saved language if it's valid ('en' or 'hi'), otherwise return null
    return (savedLanguage === 'en' || savedLanguage === 'hi') ? savedLanguage : null;
  });

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    if (language) {
      localStorage.setItem('language', language);
    }
  }, [language]);

  // Get translated text based on current language
  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
