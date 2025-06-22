#!/usr/bin/env node

const webpush = require("web-push");

// Generate VAPID keys
const vapidKeys = webpush.generateVAPIDKeys();

console.log("VAPID Keys generated successfully!");
console.log("");
console.log("Public Key:");
console.log(vapidKeys.publicKey);
console.log("");
console.log("Private Key:");
console.log(vapidKeys.privateKey);
console.log("");
console.log("Add these to your environment variables:");
console.log(`VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
console.log("");
console.log("Update the public key in:");
console.log("- src/components/NotificationManager.jsx (line ~80)");
console.log("- public/sw.js (if needed)");
