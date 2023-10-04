// auth.js
const { google } = require('googleapis');
const fs = require('fs'); // Import the 'fs' module to read the JSON file

// Read the credentials JSON from the file
const credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf-8'));

const { client_id, client_secret, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Token handling
oAuth2Client.setCredentials({
  // You can store and retrieve the token from a secure location
  // Replace with your token retrieval logic
});

module.exports = oAuth2Client;
