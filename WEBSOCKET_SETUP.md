# WebSocket Setup Guide - Bidirectional Communication

## 🎯 **What Was Implemented**

We've implemented a **Reverse WebSocket** architecture that completely solves the local IP problem!

### **Architecture:**
```
ESP8266 (Home Network) → WebSocket Client → Connects OUT → Azure Server (Public)
                                                              ↑
React App (Browser) → HTTP Requests → Azure Server → Commands ESP8266 via WebSocket
```

### **Why This Works:**
- ✅ ESP8266 initiates connection FROM your home network (routers allow outbound connections)
- ✅ Azure server is publicly accessible (React app can reach it)
- ✅ No port forwarding needed!
- ✅ No ngrok needed!
- ✅ Works from anywhere in the world!
- ✅ Only reads sensors when you click "Get Data" (saves power)

---

## 📋 **ESP8266 Setup Instructions**

### **Step 1: Install Required Library**

In Arduino IDE, install the **WebSocketsClient** library:

1. Open Arduino IDE
2. Go to: **Sketch → Include Library → Manage Libraries**
3. Search for: `WebSocketsClient`
4. Install: **WebSockets by Markus Sattler** (version 2.3.6 or higher)

### **Step 2: Upload New Code**

1. Open `temporary.cpp` in Arduino IDE
2. Update WiFi credentials if needed:
   ```cpp
   const char* ssid = "YOUR_WIFI_NAME";
   const char* password = "YOUR_WIFI_PASSWORD";
   ```
3. Upload to ESP8266
4. Open Serial Monitor (115200 baud)

### **Step 3: Verify Connection**

You should see in Serial Monitor:
```
====================================
ESP8266 IoT Sensor Dashboard
====================================
✓ DHT11 initialized on D6 (GPIO12)
✓ Soil Moisture initialized on A0
✓ LDR initialized on D5 (GPIO14)
✓ Motor initialized on D7 (GPIO13) - OFF
✓ GPS timeout: 60s | Default location: 28.7045168, 77.1566982

⏳ Connecting to Wi-Fi: YOUR_WIFI_NAME
.........
✓ Wi-Fi connected!
  IP Address: 192.168.1.7
  Signal: -45 dBm

====================================
✓ HTTP Server Started
====================================
Available endpoints:
  http://192.168.1.7/         - Redirects to Azure
  http://192.168.1.7/Website  - Dashboard
  http://192.168.1.7/data     - JSON API
  http://192.168.1.7/status   - Health Check
  http://192.168.1.7/test     - Sensor Test
====================================

🌐 Connecting to Azure WebSocket server...
   Host: firstaiproject-b3a0ggccafdveyg8.centralindia-01.azurewebsites.net:443/
✓ WebSocket configured
====================================

✅ WebSocket Connected to Azure!
📤 Sent device identification
```

**Important:** Look for `✅ WebSocket Connected to Azure!` - this means it's working!

---

## 🌐 **Azure Website Usage**

### **Step 1: Access Deployed Website**

Visit: https://firstaiproject-b3a0ggccafdveyg8.centralindia-01.azurewebsites.net/

### **Step 2: Check Device Connection**

The device ID is set to `ESP1` by default. The website will use this automatically.

### **Step 3: Get Sensor Data**

1. Go to **AI Analysis** page
2. Click **"Get Data"** button
3. Watch the status messages:
   - "⏳ Requesting data from device..."
   - "⏳ Device is reading sensors..."
   - "✓ Successfully fetched data from device!"

### **Step 4: View Data**

Data appears in the table with:
- Device ID
- Temperature (°C)
- Humidity (%)
- Soil Moisture (%)
- Light Level
- GPS Coordinates
- Timestamp

**Note:** Newest data appears at the top!

---

## 🔧 **How It Works (Technical)**

### **1. ESP8266 Connects to Azure**
```cpp
webSocket.beginSSL(wsHost, wsPort, wsPath);  // Connects to Azure
```

### **2. User Clicks "Get Data"**
```javascript
// Frontend sends command
fetch('/api/request-data?device=ESP1', { method: 'POST' })
```

### **3. Azure Sends Command to ESP8266**
```javascript
// Server sends via WebSocket
device.ws.send(JSON.stringify({
  type: 'READ_SENSORS',
  timestamp: Date.now()
}));
```

### **4. ESP8266 Reads Sensors**
```cpp
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  if (message.indexOf("READ_SENSORS") >= 0) {
    readAndSendSensorData();  // Read DHT11, Soil, LDR, GPS
  }
}
```

### **5. ESP8266 Sends Data Back**
```cpp
String json = "{\"device\":\"ESP1\",\"temperature\":28.5,...}";
webSocket.sendTXT(json);  // Send to Azure
```

### **6. Frontend Fetches Data**
```javascript
// Get latest data from Azure
const response = await fetch('/api/device-data-ws?device=ESP1');
const data = await response.json();
```

---

## 🐛 **Troubleshooting**

### **Problem: "Device not connected"**

**Solution:**
1. Check ESP8266 Serial Monitor - should show `✅ WebSocket Connected to Azure!`
2. If not connected, check WiFi credentials
3. Restart ESP8266 (press reset button)
4. Wait 10-15 seconds for connection

### **Problem: "Device is offline"**

**Solution:**
1. ESP8266 was connected but disconnected
2. Check power supply is stable
3. Check WiFi signal strength
4. Restart ESP8266

### **Problem: "No data available yet"**

**Solution:**
1. Device is connected but hasn't sent data yet
2. Click "Get Data" button again
3. Check ESP8266 Serial Monitor for sensor readings

### **Problem: Sensors showing 0 values**

**Solution:**
1. Check sensor wiring:
   - DHT11 → D6 (GPIO12)
   - Soil Sensor → A0
   - LDR → D5 (GPIO14)
2. Check DHT11 is properly powered (3.3V or 5V + GND)
3. Open http://192.168.1.7/test (use ESP8266's IP) to test sensors locally

---

## 📊 **API Endpoints**

### **1. Request Data from Device**
```http
POST /api/request-data?device=ESP1
```
Sends "READ_SENSORS" command to ESP8266 via WebSocket.

**Response:**
```json
{
  "success": true,
  "message": "Data request sent to device",
  "deviceId": "ESP1"
}
```

### **2. Get Latest Sensor Data**
```http
GET /api/device-data-ws?device=ESP1
```
Returns latest sensor data received from device.

**Response:**
```json
{
  "device": "ESP1",
  "temperature": 28.5,
  "humidity": 65.0,
  "soilMoisture": 45,
  "lightLevel": 850,
  "latitude": 28.7045168,
  "longitude": 77.1566982,
  "timestamp": 12345678
}
```

### **3. List Connected Devices**
```http
GET /api/devices
```
Shows all devices currently connected via WebSocket.

**Response:**
```json
{
  "count": 1,
  "devices": [
    {
      "deviceId": "ESP1",
      "connected": true,
      "lastUpdate": 1730476800000,
      "hasData": true
    }
  ]
}
```

---

## 🎉 **Benefits of This Solution**

| Feature | Old (HTTP) | New (WebSocket) |
|---------|-----------|-----------------|
| **Works from Anywhere** | ❌ No (local IP only) | ✅ Yes |
| **Port Forwarding** | ❌ Required | ✅ Not needed |
| **ngrok Required** | ❌ Yes | ✅ No |
| **Real-time** | ❌ Poll-based | ✅ Bidirectional |
| **Power Efficient** | ❌ Always on | ✅ On-demand |
| **Easy Setup** | ❌ Complex | ✅ Just upload code |

---

## 🔒 **Security Notes**

1. **WebSocket uses SSL/TLS** - Connection is encrypted
2. **Azure HTTPS** - All communication is secure
3. **No device password** - Consider adding authentication if needed
4. **Device ID** - Currently "ESP1", can be changed for multiple devices

---

## 🚀 **Next Steps**

### **Multiple Devices Support**

To add more devices, just change the device ID in ESP8266 code:

```cpp
const char* deviceID = "ESP2";  // Change to ESP2, ESP3, etc.
```

Then in React app, specify device when fetching:
```javascript
fetch('/api/device-data-ws?device=ESP2')
```

### **Add Authentication**

You can add a secret key to device identification:

```cpp
String connectMsg = "{\"type\":\"DEVICE_CONNECT\",\"deviceId\":\"ESP1\",\"secret\":\"YOUR_SECRET_KEY\"}";
```

---

## 📞 **Support**

If you encounter issues:
1. Check ESP8266 Serial Monitor for detailed logs
2. Check browser console (F12) for errors
3. Verify ESP8266 shows "✅ WebSocket Connected to Azure!"
4. Try restarting both ESP8266 and refreshing website

---

**Deployment Status:** ✅ Pushed to GitHub - will auto-deploy to Azure in 2-3 minutes!
