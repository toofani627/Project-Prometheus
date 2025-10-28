const path = require("path");
const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Serve static assets from the public directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from your Azure-backed Node API!" });
});

// Support client-side routing by returning index.html for unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
