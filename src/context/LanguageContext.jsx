import React, { createContext, useState, useContext, useEffect } from 'react';

// Language Context for multilingual support (English, Hindi & Tamil)
const LanguageContext = createContext();

// All translations for the entire application
const translations = {
  en: {
    // Language Selection
    selectLanguage: 'Select Language',
    english: 'English',
    hindi: 'हिन्दी',
    tamil: 'தமிழ்',
    
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
    soil: 'Soil Moisture (Real)',
    soilTemp: 'Soil Temp (°C)',
    nitrogen: 'Nitrogen (Mock)',
    phosphorus: 'Phosphorus (Mock)',
    potassium: 'Potassium (Mock)',
    phLevel: 'pH Level (Mock)',
    electricalConductivity: 'EC (Mock)',
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
    successfullyFetched: 'Successfully fetched data from 3 devices',
    dataUpdated: 'Data updated at',
    readyForAnalysis: 'Ready for AI analysis',
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
    phInstruction: 'Place the pH paper in the soil and match the color with the box',
    
    // Historical Farm Profile
    historicalFarmProfile: 'Historical Farm Profile',
    crop1Name: 'Previous Crop 1',
    crop1DateGrown: 'Crop 1 — Date Grown',
    crop2Name: 'Previous Crop 2',
    crop2DateGrown: 'Crop 2 — Date Grown',
    cropNamePlaceholder: 'e.g., Wheat, Rice',
    fertilizerUsed: 'Fertilizer Used',
    chooseFertilizer: 'Select fertilizer...',
    fertilizerNamePlaceholder: 'Enter fertilizer name',
    fertilizerAmount: 'Fertilizer Amount',
    fertilizerUnit: 'Fertilizer Unit',

    // Additional Query
    additionalQuery: 'Additional Query',
    queryPlaceholder: 'Enter any specific questions or observations about your crops or environmental conditions...',
    
    // Missing AI Dashboard Items
    selectedCrop: 'Selected crop:',
    sensorOnline: 'SENSOR ONLINE',
    sensorOffline: 'SENSOR OFFLINE',
    lastSynced: 'Last synced:',
    soilMoistureTitle: 'SOIL MOISTURE',
    phLevelTitle: 'pH LEVEL',
    acidic: 'ACIDIC',
    alkaline: 'ALKALINE',
    idealPh: 'SLIGHTLY ACIDIC — IDEAL FOR MOST CROPS',
    npkLevels: 'NPK LEVELS',
    mockedData: 'MOCKED DATA',
    weather: 'WEATHER',
    today: 'TODAY',
    tomorrow: 'TOMORROW',
    soilTemperatureTitle: 'SOIL TEMPERATURE',
    deviceTitle: 'DEVICE',
    reading: 'READING...',
    demoDataBtn: 'DEMO DATA',
    deviceCleared: 'Device cleared — enter new ID',
    changeDevice: 'CHANGE DEVICE',
    poweredBy: 'Powered by',
    developedBy: 'Developed by',
    poor: 'Poor',
    fair: 'Fair',
    good: 'Good',
    rainy: 'Rainy',
    partlyCloudy: 'Partly Cloudy',
    overcast: 'Overcast',
    clear: 'Clear',
    
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
    soil: 'मिट्टी नमी (असली)',
    soilTemp: 'मिट्टी तापमान (°C)',
    nitrogen: 'नाइट्रोजन (मॉक)',
    phosphorus: 'फॉस्फोरस (मॉक)',
    potassium: 'पोटैशियम (मॉक)',
    phLevel: 'pH स्तर (मॉक)',
    electricalConductivity: 'EC (मॉक)',
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
    successfullyFetched: '3 डिवाइस से डेटा मिल गया',
    dataUpdated: 'डेटा अपडेट हुआ',
    readyForAnalysis: 'AI जांच के लिए तैयार',
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
    phInstruction: 'pH पेपर को मिट्टी में रखें और रंग को बॉक्स से मिलाएं',
    
    // Historical Farm Profile
    historicalFarmProfile: 'पिछली खेती की जानकारी',
    crop1Name: 'पिछली फसल 1',
    crop1DateGrown: 'फसल 1 — उगाई गई तारीख',
    crop2Name: 'पिछली फसल 2',
    crop2DateGrown: 'फसल 2 — उगाई गई तारीख',
    cropNamePlaceholder: 'जैसे: गेहूं, धान',
    fertilizerUsed: 'इस्तेमाल की खाद',
    chooseFertilizer: 'खाद चुनें...',
    fertilizerNamePlaceholder: 'खाद का नाम लिखें',
    fertilizerAmount: 'खाद की मात्रा',
    fertilizerUnit: 'खाद की इकाई',

    // Additional Query
    additionalQuery: 'और सवाल',
    queryPlaceholder: 'फसल या मौसम के बारे में कोई सवाल लिखें...',
    
    // Missing AI Dashboard Items
    selectedCrop: 'चुनी गई फसल:',
    sensorOnline: 'सेंसर ऑनलाइन',
    sensorOffline: 'सेंसर ऑफलाइन',
    lastSynced: 'अंतिम सिंक:',
    soilMoistureTitle: 'मिट्टी की नमी',
    phLevelTitle: 'pH स्तर',
    acidic: 'अम्लीय',
    alkaline: 'क्षारीय',
    idealPh: 'आदर्श — तटस्थ',
    npkLevels: 'NPK स्तर',
    mockedData: 'मॉक डेटा',
    weather: 'मौसम',
    today: 'आज',
    tomorrow: 'कल',
    soilTemperatureTitle: 'मिट्टी का तापमान',
    deviceTitle: 'डिवाइस',
    reading: 'डेटा पढ़ रहा है...',
    demoDataBtn: 'डेमो डेटा',
    deviceCleared: 'डिवाइस ID हटाया — नया ID डालें',
    changeDevice: 'ID बदलें',
    poweredBy: 'द्वारा संचालित',
    developedBy: 'द्वारा विकसित',
    poor: 'खराब',
    fair: 'सामान्य',
    good: 'अच्छा',
    rainy: 'बारिश',
    partlyCloudy: 'आंशिक बादल',
    overcast: 'बादल',
    clear: 'साफ',

    // Help
    help: '?',
  },
  ta: {
    // Language Selection
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    english: 'English',
    hindi: 'हिन्दी',
    tamil: 'தமிழ்',
    
    // Main Menu
    mainMenu: 'பிரதான மெனு',
    deviceControl: 'சாதன கட்டுப்பாடு',
    deviceControlDesc: 'இணைக்கப்பட்ட IoT சாதனங்களைப் பார்க்கவும் கட்டுப்படுத்தவும்',
    aiAnalysis: 'AI பகுப்பாய்வு',
    aiAnalysisDesc: 'AI உதவியுடன் வயல் தரவைப் பார்க்கவும்',
    backToMenu: '← மெனுவுக்குத் திரும்பு',
    
    // Device Control
    enterIP: 'சாதன IP முகவரியை உள்ளிடவும்',
    ipPlaceholder: 'எ.கா: 192.168.1.100',
    connect: 'இணைக்கவும்',
    cancel: 'ரத்து செய்',
    
    // AI Analysis Dashboard
    aiAnalysisDashboard: 'AI பகுப்பாய்வு டாஷ்போர்டு',
    deviceInformation: 'சாதன தகவல்',
    environmentalData: 'வயல் தரவு',
    device: 'சாதனம்',
    temperature: 'வெப்பநிலை (°C)',
    humidity: 'ஈரப்பதம் (%)',
    soil: 'மண் ஈரப்பதம் (உண்மை)',
    soilTemp: 'மண் வெப்பநிலை (°C)',
    nitrogen: 'நைட்ரஜன் (மாக்)',
    phosphorus: 'பாஸ்பரஸ் (மாக்)',
    potassium: 'பொட்டாசியம் (மாக்)',
    phLevel: 'pH நிலை (மாக்)',
    electricalConductivity: 'EC (மாக்)',
    light: 'ஒளி',
    gps: 'இடம்',
    timestamp: 'நேரம்',
    
    // Buttons
    getData: 'தரவைப் பெறவும்',
    exportJSON: 'JSON சேமிக்கவும்',
    clearData: 'தரவை அழிக்கவும்',
    runAIAnalysis: 'AI பகுப்பாய்வு செய்யவும்',
    
    // Status Log
    statusLog: 'நிலை',
    successfullyFetched: '3 சாதனங்களிலிருந்து தரவு பெறப்பட்டது',
    dataUpdated: 'தரவு புதுப்பிக்கப்பட்டது',
    readyForAnalysis: 'AI பகுப்பாய்வுக்கு தயார்',
    noDataAvailable: 'தரவு இல்லை. "தரவைப் பெறவும்" பொத்தானை அழுத்தவும்.',
    
    // Crop Selection
    selectCropType: 'பயிரைத் தேர்ந்தெடுக்கவும்',
    chooseCrop: 'பயிரைத் தேர்ந்தெடுக்கவும்...',
    wheat: 'கோதுமை',
    rice: 'நெல்',
    maize: 'சோளம்',
    sugarcane: 'கரும்பு',
    cotton: 'பருத்தி',
    
    // pH Scale
    soilPHScale: 'மண் pH அளவு',
    phNote: 'pH - அமிலம் (சிவப்பு) முதல் நடுநிலை (பச்சை) முதல் காரம் (நீலம்)',
    phInstruction: 'pH காகிதத்தை மண்ணில் வைத்து நிறத்தை பெட்டியுடன் பொருத்தவும்',
    
    // Historical Farm Profile
    historicalFarmProfile: 'முந்தைய வயல் விவரங்கள்',
    crop1Name: 'முந்தைய பயிர் 1',
    crop1DateGrown: 'பயிர் 1 — வளர்க்கப்பட்ட தேதி',
    crop2Name: 'முந்தைய பயிர் 2',
    crop2DateGrown: 'பயிர் 2 — வளர்க்கப்பட்ட தேதி',
    cropNamePlaceholder: 'எ.கா: கோதுமை, நெல்',
    fertilizerUsed: 'பயன்படுத்திய உரம்',
    chooseFertilizer: 'உரத்தைத் தேர்ந்தெடுக்கவும்...',
    fertilizerNamePlaceholder: 'உரத்தின் பெயரை உள்ளிடவும்',
    fertilizerAmount: 'உர அளவு',
    fertilizerUnit: 'உர அலகு',

    // Additional Query
    additionalQuery: 'கூடுதல் கேள்வி',
    queryPlaceholder: 'பயிர் அல்லது வானிலை பற்றி ஏதேனும் கேள்விகளை எழுதவும்...',
    
    // Missing AI Dashboard Items
    selectedCrop: 'தேர்ந்தெடுக்கப்பட்ட பயிர்:',
    sensorOnline: 'உணரி ஆன்லைன்',
    sensorOffline: 'உணரி ஆஃப்லைன்',
    lastSynced: 'கடைசி ஒத்திசைவு:',
    soilMoistureTitle: 'மண் ஈரப்பதம்',
    phLevelTitle: 'pH நிலை',
    acidic: 'அமிலத்தன்மை',
    alkaline: 'காரத்தன்மை',
    idealPh: 'சிறிது அமிலத்தன்மை - பெரும்பாலான பயிர்களுக்கு உகந்தது',
    npkLevels: 'NPK அளவுகள்',
    mockedData: 'போலி தரவு',
    weather: 'வானிலை',
    today: 'இன்று',
    tomorrow: 'நாளை',
    soilTemperatureTitle: 'மண் வெப்பநிலை',
    deviceTitle: 'சாதனம்',
    reading: 'படிக்கிறது...',
    demoDataBtn: 'டெமோ தரவு',
    deviceCleared: 'சாதனம் அழிக்கப்பட்டது — புதிய ID உள்ளிடவும்',
    changeDevice: 'சாதனத்தை மாற்றுக',
    poweredBy: 'வழங்குபவர்',
    developedBy: 'உருவாக்கியவர்',
    poor: 'மோசம்',
    fair: 'சுமார்',
    good: 'நன்று',
    rainy: 'மழை',
    partlyCloudy: 'பகுதி மேகமூட்டம்',
    overcast: 'மேகமூட்டம்',
    clear: 'தெளிவானது',

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
    // Only return saved language if it's valid ('en', 'hi', or 'ta'), otherwise return null
    return (savedLanguage === 'en' || savedLanguage === 'hi' || savedLanguage === 'ta') ? savedLanguage : null;
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
