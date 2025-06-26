const express = require('express');
const path = require('path');
const fs = require('fs');
const admin = require("firebase-admin");

const app = express();
const PORT = 3000;

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// ✅ Redirect `.html` URLs to clean URLs (e.g., /about.html → /about)
app.use((req, res, next) => {
  if (req.url.endsWith('.html')) {
    const cleanUrl = req.url.replace('.html', '');
    return res.redirect(301, cleanUrl);
  }
  next();
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON requests
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// ✅ Auto-routing: Clean URL to .html mapping
const publicDir = path.join(__dirname, 'public');

const walkAndRouteHtmlFiles = (dir, baseRoute = '') => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const relativePath = path.relative(publicDir, fullPath);
    const routePath = '/' + relativePath.replace(/\.html$/, '').replace(/\\/g, '/');

    if (fs.statSync(fullPath).isDirectory()) {
      walkAndRouteHtmlFiles(fullPath, routePath);
    } else if (file.endsWith('.html')) {
      app.get(routePath, (req, res) => {
        res.sendFile(fullPath);
      });
    }
  });
};

walkAndRouteHtmlFiles(publicDir);


// ✅ Webhook to add money to recharge wallet
app.post("/pay0/webhook", async (req, res) => {
  const { status, amount, uid } = req.body;

  if (status === "success" && uid) {
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();
    const currentBalance = userSnap.data().rechargeWallet || 0;

    await userRef.update({
      rechargeWallet: currentBalance + Number(amount),
    });

    return res.status(200).send("Updated");
  }

  return res.status(400).send("Invalid data");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
