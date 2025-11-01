import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Device Store
 * 
 * Manages IoT device connection state using Zustand with localStorage persistence.
 * Stores device IP address when user is redirected from ESP8266 board.
 * 
 * USAGE:
 * 1. ESP8266 redirects to: https://firstaiproject...net/?deviceIP=192.168.1.100
 * 2. App extracts IP and stores it
 * 3. Device Control uses stored IP to connect to http://<IP>/Website
 * 4. AI Analysis uses stored IP to fetch data from http://<IP>/data
 */

export const useDeviceStore = create(
  persist(
    (set, get) => ({
      deviceIP: null,
      isConnected: false,
      lastConnected: null,

      setDeviceIP: (ip) => {
        set({
          deviceIP: ip,
          isConnected: true,
          lastConnected: new Date().toISOString(),
        });
      },

      clearDevice: () => {
        set({
          deviceIP: null,
          isConnected: false,
          lastConnected: null,
        });
      },

      getDeviceDataURL: () => {
        const { deviceIP } = get();
        return deviceIP ? `http://${deviceIP}/data` : null;
      },

      getDeviceWebsiteURL: () => {
        const { deviceIP } = get();
        return deviceIP ? `http://${deviceIP}/Website` : null;
      },
    }),
    {
      name: 'device-storage',
    }
  )
);
