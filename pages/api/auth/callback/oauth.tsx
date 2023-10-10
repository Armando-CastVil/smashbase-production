import axios from "axios";

export {}

// Import necessary libraries and modules
const express = require('express');


// Define your OAuth client credentials and redirect URI
 // OAuth configuration
 const CLIENT_ID = 51;
 const CLIENT_SECRET = '7b685b7d111ec191220d31fb3779fa158c621bba5175375855c47ff4e1f9d46d';
 const REDIRECT_URI = 'https://aerodusk.smashbase.gg/api/auth/callback/oauth';

// Create an Express router
const router = express.Router();


// Define a route handler for '/oauth' endpoint
router.get("/api/auth/callback/oauth", async (req:any, res:any) => {
  console.log("so back")
  try {
    // Extract the 'code' query parameter from the request
    const { query: { code } } = req;
    console.log(code)
    
    

    // Check if the 'code' parameter is missing
    if (!code) {
      return res.status(400).json({ 'error': 'OAuth login failed. Please restart the flow. Error: missing code' });
    }

    // Create the data object with OAuth parameters for token exchange
    const data = {
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
      'grant_type': 'authorization_code',
      'code': code,
      'redirect_uri': REDIRECT_URI,
      'scope': "user.identity"
    };

    // Define headers for the HTTP POST request
    const headers = {
      'Content-Type': 'application/json',
    };

    
    // Make a POST request to exchange the authorization code for tokens
    const response = await axios.post('https://api.start.gg/oauth/access_token', data, {
      headers,
    });

    // Extract the access token, refresh token, and token expiration from the response
    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;
    const expiresIn = response.data.expires_in;

    // Log the tokens for debugging purposes
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
    console.log('Token Expires In:', expiresIn);

    // Send a response to the client to close the OAuth flow
    res.send(`
      <script>
        window.close();
      </script>
    `);
  } catch (error) {
    console.error(error);

    // Handle errors by sending an error response
    res.status(500).send('Error completing OAuth login.');
  }
});

// Export the router to use in your Express application
module.exports = router;

