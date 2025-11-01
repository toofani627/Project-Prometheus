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

  // Validate IP format
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipPattern.test(deviceIP)) {
    return res.status(400).json({ 
      error: "Invalid IP format" 
    });
  }

  try {
    // Import fetch for Node.js
    const fetch = (await import('node-fetch')).default;
    
    const deviceURL = `http://${deviceIP}/data`;
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
