// components/LoginButton.js
// OAuth configuration
const CLIENT_ID = "51";
const CLIENT_SECRET = '7b685b7d111ec191220d31fb3779fa158c621bba5175375855c47ff4e1f9d46d';
const REDIRECT_URI = 'https://aerodusk.smashbase.gg/api/auth/callback/startgg';
const scopes = 'user.identity';
export const StartGGLoginButton = () => {
    const handleLoginClick = () => {
      // Redirect the user to the start.gg authorization URL
      window.location.href = `https://start.gg/oauth/authorize?response_type=code&client_id=${CLIENT_ID}scope=user.identity%20user.email&redirect_uri=${REDIRECT_URI}`;
    };
  
    return (
      <button onClick={handleLoginClick}>Log In with start.gg</button>
    );
  };
  

  