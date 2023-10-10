// pages/api/oauth.ts
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'OAuth login failed. Missing code.' });
  }

  const data = {
    client_id: 51,
    client_secret:'7b685b7d111ec191220d31fb3779fa158c621bba5175375855c47ff4e1f9d46d',
    grant_type: 'authorization_code',
    code: code as string,
    redirect_uri: 'https://aerodusk.smashbase.gg/api/oauth',
    scope: 'user.identity', // Replace with your desired scope
  };

  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const tokenResponse = await fetch('https://api.start.gg/oauth/access_token', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!tokenResponse.ok) {
      throw new Error('Error exchanging code for access token');
    }

    const tokenData = await tokenResponse.json();

    // Handle the token data as needed, e.g., save it to a database, use it for authentication, etc.
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresIn = tokenData.expires_in;

    console.log("token data:")
    console.log(tokenData)

    // Close the OAuth popup or redirect to a success page
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error completing OAuth login.' });
  }
}
