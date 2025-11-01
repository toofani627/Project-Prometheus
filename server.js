import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static assets from the dist directory (Vite build output)
app.use(express.static(path.join(__dirname, "dist")));

// API routes can be added here
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from your Azure-backed Node API!" });
});

/**
 * Proxy endpoint for ESP8266 device data
 * 
 * Solves Mixed Content issue:
 * - Azure website is HTTPS
 * - ESP8266 serves HTTP
 * - Browsers block HTTP requests from HTTPS pages
 * 
 * Solution: Server-side proxy that fetches from HTTP device
 * Frontend calls: https://azure.../api/device-data?ip=192.168.1.100
 * Server fetches: http://192.168.1.100/data
 */
app.get("/api/device-data", async (req, res) => {
  const deviceIP = req.query.ip;
  
  if (!deviceIP) {
    return res.status(400).json({ 
      error: "Missing device IP. Use ?ip=192.168.1.100" 
    });
  }

  // Validate IP format (allow both IPs and domains)
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  const domainPattern = /^[a-zA-Z0-9][-a-zA-Z0-9]*(\.[a-zA-Z0-9][-a-zA-Z0-9]*)+$/;
  
  if (!ipPattern.test(deviceIP) && !domainPattern.test(deviceIP)) {
    return res.status(400).json({ 
      error: "Invalid IP address or domain format" 
    });
  }

  // Check if it's a private/local IP address
  const isLocalIP = /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|127\.)/.test(deviceIP);
  if (isLocalIP) {
    return res.status(400).json({ 
      error: "Cannot access local/private IP addresses from Azure server",
      details: `${deviceIP} is on your local network and not accessible from the cloud. Use ngrok (https://ngrok.com) to create a public tunnel, or set up port forwarding on your router.`,
      deviceIP: deviceIP,
      suggestions: [
        "Option 1: Use ngrok - Download from https://ngrok.com, run: ngrok http " + deviceIP.split(':')[0] + ":80",
        "Option 2: Configure port forwarding on your router to make device publicly accessible",
        "Option 3: Test on local network (open website at http://localhost:3000)"
      ]
    });
  }

  try {
    // Import fetch for Node.js
    const fetch = (await import('node-fetch')).default;
    
    // If deviceIP looks like a domain (e.g., ngrok), use https
    const protocol = deviceIP.includes('.') && !ipPattern.test(deviceIP) ? 'https' : 'http';
    const deviceURL = `${protocol}://${deviceIP}/data`;
    console.log(`Proxying request to: ${deviceURL}`);
    
    // Use AbortController for timeout (node-fetch v3)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(deviceURL, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Device returned ${response.status}`);
    }

    const data = await response.json();
    
    // Forward device data to frontend
    res.json(data);
    
  } catch (error) {
    console.error('Device proxy error:', error.message);
    
    res.status(500).json({ 
      error: "Failed to fetch from device",
      details: error.message,
      deviceIP: deviceIP
    });
  }
});

// Support client-side routing by returning index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
