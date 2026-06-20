import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import India from '@react-map/india';
import { stateAnalytics, defaultStateAnalytics } from '../lib/adminData';
import { LogOut, Sprout, Users, Droplets, AlertTriangle, MapPin } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState('Telangana');
  const [analytics, setAnalytics] = useState(stateAnalytics['Telangana']);

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem('isAdminAuth');
    if (!isAuth) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuth');
    navigate('/admin-login');
  };

  const handleStateClick = (stateName) => {
    // Note: The package might return state name or an object with name. We handle both just in case.
    const name = typeof stateName === 'string' ? stateName : (stateName?.name || stateName?.id || 'Telangana');
    setSelectedState(name);
    setAnalytics(stateAnalytics[name] || defaultStateAnalytics);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden relative">
      {/* Background aesthetics */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text font-bold text-2xl tracking-wide">
            GeoAnalytics
          </div>
          <div className="text-sm px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Admin Mode
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-80px)] items-center">
        
        {/* Left Column: Interactive Map */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl shadow-2xl relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          <div className="w-full max-w-lg aspect-square text-emerald-100 fill-emerald-900 hover:fill-emerald-400 cursor-pointer transition-all duration-300">
             <India
               onClick={handleStateClick}
               size="100%"
               mapColor="#1e293b"
               strokeColor="#334155"
               strokeWidth="1"
               hoverColor="#10b981"
             />
          </div>
        </div>

        {/* Right Column: Analytics Data */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl transform transition-all duration-500">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
                <MapPin className="text-emerald-400 w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
                  {selectedState}
                </h2>
                <p className="text-emerald-400/80 text-sm mt-1">Real-time Farmer Analytics</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stat 1 */}
              <div className="bg-black/20 rounded-2xl p-6 border border-white/5 hover:border-emerald-500/30 transition-colors duration-300">
                <div className="flex items-center space-x-3 mb-4 text-emerald-400">
                  <Sprout size={24} />
                  <span className="font-medium text-gray-300">Most Grown Crop</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {analytics.mostGrownCrop}
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bg-black/20 rounded-2xl p-6 border border-white/5 hover:border-blue-500/30 transition-colors duration-300">
                <div className="flex items-center space-x-3 mb-4 text-blue-400">
                  <Users size={24} />
                  <span className="font-medium text-gray-300">Active Farmers</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {analytics.farmersUsingApp.toLocaleString()}
                </div>
              </div>

              {/* Stat 3 */}
              <div className="bg-black/20 rounded-2xl p-6 border border-white/5 hover:border-cyan-500/30 transition-colors duration-300">
                <div className="flex items-center space-x-3 mb-4 text-cyan-400">
                  <Droplets size={24} />
                  <span className="font-medium text-gray-300">Water Efficiency</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {analytics.waterEfficiency}
                </div>
              </div>

              {/* Stat 4 */}
              <div className="bg-black/20 rounded-2xl p-6 border border-white/5 hover:border-amber-500/30 transition-colors duration-300">
                <div className="flex items-center space-x-3 mb-4 text-amber-400">
                  <AlertTriangle size={24} />
                  <span className="font-medium text-gray-300">IoT Alerts Triggered</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {analytics.alerts.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center text-sm text-gray-500">
              Data is periodically synced with regional agricultural centers.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
