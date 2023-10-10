// components/LoginButton.js
// OAuth configuration

const CLIENT_ID = 51;
const CLIENT_SECRET = '21ed6b22f88c7b4f01fc8c1caef94837098e950d903456a1d0b1aa4f4eee4617';
const REDIRECT_URI = 'https://aerodusk.smashbase.gg/api/oauth';
const scopes = 'user.identity';
export const StartGGLoginButton = () => {
    const handleLoginClick = () => {
      // Redirect the user to the start.gg authorization URL
      window.location.href = `http://start.gg/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&scope=user.identity&client_secret=${CLIENT_SECRET}`;
    };
  
    return (
      <button onClick={handleLoginClick}>Log In with start.gg</button>
    );
  };
  

  