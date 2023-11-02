import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function exchangeCode(
  code: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Define your OAuth client credentials and redirect URI
  const CLIENT_ID = 51;
  const CLIENT_SECRET = '21ed6b22f88c7b4f01fc8c1caef94837098e950d903456a1d0b1aa4f4eee4617';
  const REDIRECT_URI = "http://localhost:3000/oauth";

  if (!code) {
    return res.status(400).json({ error: 'OAuth login failed. Please restart the flow. Error: missing code' });
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

    // Extract and return the response data as a JSON object
    return response.data;
  } catch (error) {
    // Handle errors, e.g., log the error or return an error response
    console.error('Error exchanging code for access token:', error);
    return { error: 'Failed to exchange code for access token' };
  }
}
