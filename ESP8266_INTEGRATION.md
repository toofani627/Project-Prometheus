# ESP8266 IoT Device Integration Guide

## Overview
This document explains how the ESP8266 (WEMOS D1 R1) board integrates with the Azure-hosted React website for real-time sensor monitoring.

## Architecture

### ESP8266 Board Setup
```
ESP8266 WiFi Connection
     ↓
Root URL (/) → Redirects to Azure Website with IP parameter
Dashboard (/Website) → Local device control interface
API Endpoint (/data) → Returns cached sensor readings as JSON
```

### Azure Website Integration
```
User visits board IP (192.168.1.100)
     ↓
ESP8266 redirects to: https://firstaiproject...net/?deviceIP=192.168.1.100
     ↓
React App captures IP → Stores in Zustand + localStorage
     ↓
Device Control: Opens http://192.168.1.100/Website
AI Analysis: Fetches from http://192.168.1.100/data
```

## ESP8266 Endpoints

### 1. Root Endpoint `/`
**Purpose**: Auto-redirect to Azure website with device IP

**ESP8266 Code**:
```cpp
void handleRoot() {
  String deviceIP = WiFi.localIP().toString();
  String redirectURL = String(externalWebsite) + "?deviceIP=" + deviceIP;
  
  server.sendHeader("Location", redirectURL);
  server.send(302, "text/plain", "Redirecting...");
}
```

### 2. Dashboard Endpoint `/Website`
**Purpose**: Local device control and monitoring interface

### 3. Data API Endpoint `/data`
**Purpose**: Returns cached sensor data as JSON

**Response Format**:
```json
{
  "deviceID": "ESP1",
  "temperature": 28.5,
  "humidity": 65,
  "soilMoisture": 45,
  "lightLevel": 850,
  "lightStatus": "Bright",
  "latitude": 28.7045168,
  "longitude": 77.1566982,
  "motorState": false,
  "motorAutoMode": true,
  "uptime": 123456,
  "requestCount": 42
}
```

**CORS Header**: Must include `Access-Control-Allow-Origin: *` for cross-origin requests

## React Website Integration

### 1. Device Store (`src/store/deviceStore.js`)
Manages device IP state using Zustand with localStorage persistence.

**Key Functions**:
- `setDeviceIP(ip)`: Stores IP when captured from URL
- `getDeviceDataURL()`: Returns `http://<IP>/data`
- `getDeviceWebsiteURL()`: Returns `http://<IP>/Website`

### 2. IP Capture Logic (`src/App.jsx`)
```javascript
// Captures ?deviceIP=192.168.1.100 from URL
const deviceIP = searchParams.get('deviceIP');
if (deviceIP) {
  setDeviceIP(deviceIP);
  // Clean URL
  searchParams.delete('deviceIP');
}
```

### 3. Device Control (`src/components/MainMenu.jsx`)
- If device IP stored → Opens `http://<IP>/Website` directly
- Otherwise → Prompts user to enter IP manually

### 4. AI Analysis Data Fetch (`src/components/AIAnalysis.jsx`)
```javascript
const fetchDeviceData = async () => {
  const dataURL = getDeviceDataURL(); // http://192.168.1.100/data
  const response = await fetch(dataURL);
  const data = await response.json();
  
  // Transform to table format
  const device = {
    id: data.deviceID,
    temperature: data.temperature,
    humidity: data.humidity,
    soil: data.soilMoisture,
    light: data.lightLevel,
    gps: `${data.latitude}, ${data.longitude}`,
    timestamp: new Date().toLocaleString()
  };
  
  setDevices(prev => [...prev, device]);
};
```

## Data Flow

### First-Time Connection
1. User types `192.168.1.100` in browser
2. ESP8266 receives request at `/`
3. Board redirects to `https://firstaiproject...net/?deviceIP=192.168.1.100`
4. React app captures IP from URL parameter
5. IP stored in localStorage (persists across sessions)

### Subsequent Usage
1. **Device Control**: Click button → Opens `http://192.168.1.100/Website` in new tab
2. **AI Analysis**: Click "Get Data" → Fetches from `http://192.168.1.100/data` → Displays in table

## ESP8266 Sensor Reading Strategy

### Non-Blocking Cache Architecture
```cpp
void loop() {
  server.handleClient();      // Handle HTTP requests
  delay(1);                   // Yield to WiFi stack
  updateSensorReadings();     // Update cache every 2 seconds
}

void updateSensorReadings() {
  if (currentMillis - lastSensorRead >= 2000) {
    // Read sensors once
    cachedTemperature = dht.readTemperature();
    cachedHumidity = dht.readHumidity();
    cachedSoilMoisture = analogRead(A0);
    
    // Cache is valid
    sensorValid = true;
  }
}

void handleDataRequest() {
  // Instant response from cache (no sensor delays)
  String json = buildJSONFromCache();
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", json);
}
```

**Why This Works**:
- Sensors read once every 2 seconds in background
- HTTP requests serve cached values instantly (~50ms response)
- No blocking delays during API calls
- ESP8266 can handle multiple requests per second

## Testing Locally

### 1. Test ESP8266 Endpoints
```bash
# Check root redirect
curl -I http://192.168.1.100/

# Fetch sensor data
curl http://192.168.1.100/data

# Open dashboard
open http://192.168.1.100/Website
```

### 2. Test React Integration
```bash
# Simulate device redirection
http://localhost:3000/?deviceIP=192.168.1.100

# Check console for "Device IP captured: 192.168.1.100"
# Check localStorage for device-storage entry
```

## Troubleshooting

### Issue: CORS Error
**Symptom**: `Access to fetch blocked by CORS policy`
**Fix**: Ensure ESP8266 sends CORS header:
```cpp
server.sendHeader("Access-Control-Allow-Origin", "*");
```

### Issue: Device Not Found
**Symptom**: `ERR_CONNECTION_REFUSED`
**Checks**:
- ESP8266 is powered and connected to WiFi
- Device IP hasn't changed (use static IP in router)
- Firewall allows HTTP on port 80

### Issue: IP Not Captured
**Symptom**: Device Control still asks for IP
**Checks**:
- URL contains `?deviceIP=` parameter
- localStorage not disabled in browser
- Check browser console for errors

## Production Deployment

### ESP8266 Changes
1. Update `externalWebsite` constant to production URL:
```cpp
const char* externalWebsite = 
  "https://firstaiproject-b3a0ggccafdveyg8.centralindia-01.azurewebsites.net/";
```

2. Enable CORS on `/data` endpoint
3. Use static IP or DDNS for consistent device address

### Azure Website
- Already configured with device store
- URL parameter capture automatic
- No additional backend needed

## Security Considerations

1. **Local Network Only**: ESP8266 serves HTTP (not HTTPS) - use only on trusted networks
2. **No Authentication**: Current setup has no auth - add if exposing publicly
3. **CORS Open**: `Access-Control-Allow-Origin: *` allows any origin - restrict if needed

## Future Enhancements

- Add device authentication token
- Support multiple device connections
- Real-time websocket updates
- Device discovery/auto-detection
- HTTPS support with certificates
