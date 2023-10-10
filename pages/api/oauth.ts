// pages/api/oauth.js

import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

// Define your OAuth client credentials and redirect URI
const CLIENT_ID = 51;
const CLIENT_SECRET = '21ed6b22f88c7b4f01fc8c1caef94837098e950d903456a1d0b1aa4f4eee4617';
const REDIRECT_URI = "https://aerodusk.smashbase.gg/api/oauth";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Extract the 'code' query parameter from the request
    const { code } = req.query as { code: string };

    // Check if the 'code' parameter is missing
    if (!code) {
      return res.status(400).json({ error: 'OAuth login failed. Please restart the flow. Error: missing code' });
    }

    // Create the data object with OAuth parameters for token exchange
    const data = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code:code,
      redirect_uri: REDIRECT_URI,
      scope: 'user.identity',
    };

    // Define headers for the HTTP POST request
    const headers = {
      'Content-Type': 'application/json',
    };

    // Make a POST request to exchange the authorization code for tokens
    const response = await axios.post('https://api.start.gg/oauth/access_token', data, {
      headers,
    });

   

    console.log("response:")
    console.log(response)

    
     res.redirect('https://aerodusk.smashbase.gg');
  } catch (error) {
    console.error(error);

    // Handle errors by sending an error response
    res.status(500).send('Error completing OAuth login.');
  }
};
