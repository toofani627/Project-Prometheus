import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const MultiCrop = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentCrop, setCurrentCrop] = useState(() => localStorage.getItem('multiCrop_currentCrop') || '');
  const [growthStage, setGrowthStage] = useState(() => localStorage.getItem('multiCrop_growthStage') || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(() => {
    const saved = localStorage.getItem('multiCrop_result');
    try { return saved ? JSON.parse(saved) : null; } catch { return null; }
  });
  const [error, setError] = useState('');

  // Pre-fill crop from ?crop= query param (set by AnalysisResults PLANT NOW button).
  // Fuzzy-match the AI crop name against the crops list keys and display labels.
  useEffect(() => {
    const cropParam = searchParams.get('crop');
    if (!cropParam) return;
    // Normalise: lowercase, strip non-alpha chars for comparison
    const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, '');
    const needle = norm(cropParam);
    // Check crops (defined later in the component but captured at render time)
    const cropsList = [
      'wheat','rice','maize','sugarcane','cotton','soybean','chickpea',
      'pigeon-pea','lentil','groundnut','mustard','potato','onion','tomato',
      'chili','millet','sorghum','barley','sunflower','sesame',
    ];
    // Exact normalised key match first
    let match = cropsList.find(k => norm(k) === needle);
    // Fallback: key contains needle or needle contains key
    if (!match) match = cropsList.find(k => norm(k).includes(needle) || needle.includes(norm(k)));
    setCurrentCrop(match || needle);
    setResult(null);
  }, [searchParams]);


  useEffect(() => { localStorage.setItem('multiCrop_currentCrop', currentCrop); }, [currentCrop]);
  useEffect(() => { localStorage.setItem('multiCrop_growthStage', growthStage); }, [growthStage]);
  useEffect(() => {
    if (result) localStorage.setItem('multiCrop_result', JSON.stringify(result));
    else localStorage.removeItem('multiCrop_result');
  }, [result]);

  const handleFindCompanion = async () => {
    if (!currentCrop || !growthStage) {
      setError(language === 'hi' ? 'कृपया फसल और चरण दोनों चुनें' : language === 'ta' ? 'தயவுசெய்து பயிர் மற்றும் நிலை இரண்டையும் தேர்ந்தெடுக்கவும்' : 'Please select both crop and growth stage');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setLoading(true); setError(''); setResult(null);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const authDeviceId = localStorage.getItem('auth_deviceId') || '';
      const farmHistoryDataStr = localStorage.getItem('farmHistoryData');
      const farmHistory = farmHistoryDataStr ? JSON.parse(farmHistoryDataStr) : undefined;
      
      const savedDevicesStr = localStorage.getItem('ai_analysis_devices');
      const savedDevices = savedDevicesStr ? JSON.parse(savedDevicesStr) : [];
      const latestTelemetry = savedDevices.length > 0 ? savedDevices[0].raw : undefined;
      
      const response = await fetch(`${baseUrl}/api/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mode: 'companion', 
          crop: currentCrop, 
          stage: growthStage, 
          language: language || 'en',
          deviceId: authDeviceId,
          farmHistory: farmHistory,
          telemetry: latestTelemetry
        })
      });
      if (!response.ok) { const e = await response.json(); throw new Error(e.error || `HTTP ${response.status}`); }
      setResult(await response.json());
    } catch (err) {
      setError(language === 'hi' ? 'AI से सुझाव नहीं मिल सका। कृपया दोबारा कोशिश करें।' : language === 'ta' ? 'AI யிலிருந்து பரிந்துரை பெற முடியவில்லை.' : 'Could not get recommendation from AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const crops = [
    ['wheat',      language === 'hi' ? 'गेहूं'      : language === 'ta' ? 'கோதுமை'         : 'Wheat'],
    ['rice',       language === 'hi' ? 'धान'         : language === 'ta' ? 'நெல்'             : 'Rice'],
    ['maize',      language === 'hi' ? 'मक्का'       : language === 'ta' ? 'சோளம்'           : 'Maize / Corn'],
    ['sugarcane',  language === 'hi' ? 'गन्ना'       : language === 'ta' ? 'கரும்பு'          : 'Sugarcane'],
    ['cotton',     language === 'hi' ? 'कपास'        : language === 'ta' ? 'பருத்தி'          : 'Cotton'],
    ['soybean',    language === 'hi' ? 'सोयाबीन'     : language === 'ta' ? 'சோயாபீன்'        : 'Soybean'],
    ['chickpea',   language === 'hi' ? 'चना'         : language === 'ta' ? 'கொண்டைக்கடலை'   : 'Chickpea / Gram'],
    ['pigeon-pea', language === 'hi' ? 'तूर / अरहर'  : language === 'ta' ? 'துவரை'           : 'Pigeon Pea / Arhar'],
    ['lentil',     language === 'hi' ? 'मसूर'        : language === 'ta' ? 'பருப்பு'          : 'Lentil'],
    ['groundnut',  language === 'hi' ? 'मूंगफली'     : language === 'ta' ? 'நிலக்கடலை'       : 'Groundnut / Peanut'],
    ['mustard',    language === 'hi' ? 'सरसों'       : language === 'ta' ? 'கடுகு'            : 'Mustard'],
    ['potato',     language === 'hi' ? 'आलू'         : language === 'ta' ? 'உருளைக்கிழங்கு'  : 'Potato'],
    ['onion',      language === 'hi' ? 'प्याज'       : language === 'ta' ? 'வெங்காயம்'       : 'Onion'],
    ['tomato',     language === 'hi' ? 'टमाटर'       : language === 'ta' ? 'தக்காளி'          : 'Tomato'],
    ['chili',      language === 'hi' ? 'मिर्च'       : language === 'ta' ? 'மிளகாய்'          : 'Chili / Pepper'],
    ['millet',     language === 'hi' ? 'बाजरा'       : language === 'ta' ? 'கம்பு'            : 'Pearl Millet / Bajra'],
    ['sorghum',    language === 'hi' ? 'ज्वार'       : language === 'ta' ? 'சோளம்'           : 'Sorghum / Jowar'],
    ['tea',        language === 'hi' ? 'चाय'         : language === 'ta' ? 'தேநீர்'           : 'Tea'],
    ['coffee',     language === 'hi' ? 'कॉफी'        : language === 'ta' ? 'காபி'             : 'Coffee'],
    ['banana',     language === 'hi' ? 'केला'        : language === 'ta' ? 'வாழை'             : 'Banana'],
    ['mango',      language === 'hi' ? 'आम'          : language === 'ta' ? 'மாம்பழம்'         : 'Mango'],
  ];

  const stages = [
    ['sowing',      language === 'hi' ? 'बुवाई'        : language === 'ta' ? 'விதைத்தல்'    : 'Sowing'],
    ['vegetative',  language === 'hi' ? 'बढ़ोतरी'       : language === 'ta' ? 'வளர்ச்சி'     : 'Vegetative'],
    ['flowering',   language === 'hi' ? 'फूल आना'      : language === 'ta' ? 'பூக்கும் நிலை' : 'Flowering'],
    ['fruiting',    language === 'hi' ? 'फल बनना'      : language === 'ta' ? 'பழ வளர்ச்சி'  : 'Fruiting'],
  ];

  return (
    <div className="min-h-screen bg-transparent text-neo-cream">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">

        {/* Page Header */}
        <div className="mb-10 border-b border-neo-cream/20 pb-6">
          <p className="font-subheading text-neo-cream/50 text-xs uppercase tracking-widest mb-1">AI-POWERED</p>
          <h1 className="font-heading text-5xl sm:text-6xl text-neo-cream uppercase leading-none">
            {language === 'hi' ? 'साथी फसल' : language === 'ta' ? 'கூட்டுப் பயிர்' : 'COMPANION PLANTING'}
          </h1>
          <p className="font-body text-neo-cream/40 text-sm mt-3">
            {language === 'en'
              ? 'Find the best companion crops for better yields, pest control, and nutrient balance.'
              : language === 'hi'
              ? 'बेहतर पैदावार, कीट नियंत्रण और पोषक संतुलन के लिए साथी फसलें खोजें।'
              : 'சிறந்த மகசூல், கீட கட்டுப்பாடு மற்றும் ஊட்ட சமநிலைக்கு கூட்டுப் பயிர்களை கண்டறியவும்.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Input Card */}
          <div className="neo-card border-2 border-neo-cream rounded-2xl shadow-[4px_4px_0px_#F4E7D5] p-6 h-fit">
            <h2 className="font-subheading font-bold text-sm uppercase tracking-widest text-neo-cream mb-6">
              {language === 'en' ? 'SELECT YOUR CROP' : language === 'hi' ? 'अपनी फसल चुनें' : 'உங்கள் பயிரைத் தேர்ந்தெடுக்கவும்'}
            </h2>

            <div className="space-y-5">
              {/* Crop Dropdown */}
              <div>
                <label className="block font-subheading text-[10px] uppercase tracking-widest text-neo-cream/50 mb-2">
                  {language === 'en' ? 'CURRENTLY PLANTED CROP' : language === 'hi' ? 'वर्तमान में लगाई गई फसल' : 'தற்போது நடப்படும் பயிர்'}
                </label>
                <select
                  value={currentCrop}
                  onChange={(e) => setCurrentCrop(e.target.value)}
                  className="w-full text-neo-cream border-2 border-neo-cream/60 rounded-xl px-4 py-3 focus:outline-none focus:border-neo-cream font-body text-sm transition-colors"
                >
                  <option value="">
                    {language === 'en' ? 'Choose a crop...' : language === 'hi' ? 'एक फसल चुनें...' : 'ஒரு பயிரைத் தேர்ந்தெடுக்கவும்...'}
                  </option>
                  {crops.map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Stage Dropdown */}
              <div>
                <label className="block font-subheading text-[10px] uppercase tracking-widest text-neo-cream/50 mb-2">
                  {language === 'en' ? 'CURRENT GROWTH STAGE' : language === 'hi' ? 'वर्तमान वृद्धि चरण' : 'தற்போதைய வளர்ச்சி நிலை'}
                </label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full text-neo-cream border-2 border-neo-cream/60 rounded-xl px-4 py-3 focus:outline-none focus:border-neo-cream font-body text-sm transition-colors"
                >
                  <option value="">
                    {language === 'en' ? 'Choose a stage...' : language === 'hi' ? 'एक चरण चुनें...' : 'ஒரு நிலையைத் தேர்ந்தெடுக்கவும்...'}
                  </option>
                  {stages.map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Error */}
              {error && (
                <div className="neo-card border border-red-500/50 rounded-xl px-4 py-3">
                  <p className="font-subheading text-xs text-red-400 uppercase tracking-widest">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleFindCompanion}
                disabled={loading}
                className="w-full bg-neo-green-dark text-neo-cream border-2 border-neo-cream rounded-xl py-4 font-heading text-xl uppercase shadow-[4px_4px_0px_#F4E7D5] hover:translate-y-[3px] hover:translate-x-[3px] hover:shadow-[1px_1px_0px_#F4E7D5] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{backgroundImage:'none'}}
              >
                {loading
                  ? (language === 'hi' ? 'ढूंढ रहे हैं...' : language === 'ta' ? 'கண்டறிகிறது...' : 'FINDING...')
                  : (language === 'hi' ? 'साथी खोजें' : language === 'ta' ? 'கண்டறிக' : 'FIND COMPANION')}
              </button>
            </div>
          </div>

          {/* Results Column */}
          <div className="space-y-4">

            {/* Loading skeleton */}
            {loading && (
              <div className="neo-card border-2 border-neo-cream/40 rounded-2xl p-6 animate-pulse">
                <div className="h-3 bg-neo-cream/20 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-neo-cream/10 rounded mb-3"></div>
                <div className="h-3 bg-neo-cream/20 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-neo-cream/10 rounded w-1/2"></div>
              </div>
            )}

            {/* Result Card */}
            {result && !loading && (
              <div className="neo-card border-2 border-neo-cream rounded-2xl shadow-[4px_4px_0px_#F4E7D5] p-6">
                <h3 className="font-subheading font-bold text-sm uppercase tracking-widest text-neo-cream mb-6">
                  {language === 'en' ? 'BEST COMPANION' : language === 'hi' ? 'सर्वश्रेष्ठ साथी' : 'சிறந்த கூட்டுப் பயிர்'}
                </h3>

                <div className="space-y-4">
                  {typeof result === 'string' ? (
                    <div>
                      <p className="font-subheading text-[10px] uppercase tracking-widest text-neo-cream/50 mb-2">
                        {language === 'en' ? 'RECOMMENDATION' : language === 'hi' ? 'सिफारिश' : 'பரிந்துரை'}
                      </p>
                      <p className="font-body text-neo-cream text-base leading-relaxed whitespace-pre-wrap">{result}</p>
                    </div>
                  ) : (
                    <>
                      {(result.recommendation || result.companion_crop) && (
                        <div className="rounded-xl border border-neo-cream/30 p-4" style={{backgroundColor:'#1a1a1a', backgroundImage:'none'}}>
                          <p className="font-subheading text-[10px] uppercase tracking-widest text-neo-green-light mb-2">
                            {language === 'en' ? 'COMPANION CROP' : language === 'hi' ? 'साथी फसल' : 'கூட்டுப் பயிர்'}
                          </p>
                          <p className="font-heading text-3xl text-neo-cream">
                            {result.recommendation || result.companion_crop}
                          </p>
                        </div>
                      )}

                      {result.reason && (
                        <div className="rounded-xl border border-neo-cream/30 p-4" style={{backgroundColor:'#1a1a1a', backgroundImage:'none'}}>
                          <p className="font-subheading text-[10px] uppercase tracking-widest text-neo-cream/50 mb-2">
                            {language === 'en' ? 'WHY' : language === 'hi' ? 'क्यों' : 'ஏன்'}
                          </p>
                          <p className="font-body text-neo-cream text-sm leading-relaxed">{result.reason}</p>
                        </div>
                      )}

                      {result.benefits && (
                        <div className="rounded-xl border border-neo-cream/30 p-4" style={{backgroundColor:'#1a1a1a', backgroundImage:'none'}}>
                          <p className="font-subheading text-[10px] uppercase tracking-widest text-neo-cream/50 mb-3">
                            {language === 'en' ? 'BENEFITS' : language === 'hi' ? 'लाभ' : 'நன்மைகள்'}
                          </p>
                          <ul className="space-y-1.5">
                            {Array.isArray(result.benefits)
                              ? result.benefits.map((b, i) => (
                                  <li key={i} className="font-body text-neo-cream text-sm flex items-start gap-2">
                                    <span className="text-neo-green-light mt-0.5">—</span>{b}
                                  </li>
                                ))
                              : <li className="font-body text-neo-cream text-sm">{result.benefits}</li>}
                          </ul>
                        </div>
                      )}

                      {result.warning && (
                        <div className="rounded-xl border border-yellow-500/50 p-4" style={{backgroundColor:'rgba(234,179,8,0.08)', backgroundImage:'none'}}>
                          <p className="font-subheading text-[10px] uppercase tracking-widest text-yellow-400 mb-2">
                            {language === 'en' ? 'WARNING' : language === 'hi' ? 'चेतावनी' : 'எச்சரிக்கை'}
                          </p>
                          <p className="font-body text-yellow-200 text-sm leading-relaxed">{result.warning}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!result && !loading && !error && (
              <div className="neo-card border-2 border-dashed border-neo-cream/30 rounded-2xl p-8 text-center">
                <p className="font-subheading text-neo-cream/40 text-xs uppercase tracking-widest mb-2">WAITING</p>
                <p className="font-heading text-2xl text-neo-cream/30">
                  {language === 'en' ? 'SELECT A CROP TO BEGIN' : language === 'hi' ? 'शुरू करने के लिए फसल चुनें' : 'பயிரைத் தேர்ந்தெடுக்கவும்'}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MultiCrop;
