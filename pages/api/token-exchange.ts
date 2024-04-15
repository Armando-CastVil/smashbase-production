// pages/api/token-exchange.ts

import { NextApiRequest, NextApiResponse } from 'next';
import exchangeCode from '../../globalComponents/modules/exchangeCode';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Define your OAuth client credentials and redirect URI
    const CLIENT_ID = 51;
    const CLIENT_SECRET = 'b0c3a1680f67aa9d7577113d3f1808e6374458ec64377e69dcf5df8175a3309c';
    const REDIRECT_URI = "https://aerodusk.smashbase.gg/oauth";

    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }

    const { code } = req.body; // Assuming you are sending the code in the request body

    if (!code) {
        return res.status(400).json({ error: 'Missing code in the request body' });
    }

    try {
        // Create the data object with OAuth parameters for token exchange
        const data = {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
            scope: 'user.identity%20user.email',
        };

        // Define headers for the HTTP POST request
        const headers = {
            'Content-Type': 'application/json',
        };

        // Make a POST request to exchange the authorization code for tokens
        const response = await axios.post('https://api.start.gg/oauth/access_token', data, {
            headers,
        });

        // Return the response from the exchangeCode function
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error during token exchange:', error);
        res.status(500).json({ error: 'Token exchange failed' });
    }
}