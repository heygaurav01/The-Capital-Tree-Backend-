const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

//  Load Firebase service account key
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

//  Check if serviceAccountKey.json exists
if (!fs.existsSync(serviceAccountPath)) {
    console.error(" Firebase serviceAccountKey.json file is missing!");
    process.exit(1); // Stop the server if missing
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

console.log(" Firebase Admin SDK Initialized Successfully");

module.exports = admin;
