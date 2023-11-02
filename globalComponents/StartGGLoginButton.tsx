// components/LoginButton.js
// OAuth configuration

import { useEffect, useState } from "react";
import { User } from "./modules/globalTypes";

const CLIENT_ID = 51;
const CLIENT_SECRET = '21ed6b22f88c7b4f01fc8c1caef94837098e950d903456a1d0b1aa4f4eee4617';
const REDIRECT_URI = "http://localhost:3000/oauth";
const scopes = 'user.identity';
export const StartGGLoginButton = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>();
  
    useEffect(() => {
      const currentUser = localStorage.getItem('currentUser');
  
      if (currentUser) {
        const userObject: any = JSON.parse(currentUser);
        setUser(userObject);
        setIsLoggedIn(true);
      }
    }, []);
  
    const handleLoginClick = () => {
      window.location.href = `http://start.gg/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&scope=user.identity%20user.email&redirect_uri=${REDIRECT_URI}&client_secret=${CLIENT_SECRET}`;
    };
  
    const handleLogoutClick = () => {
      // Remove currentUser from local storage and set isLoggedIn to false
      localStorage.removeItem('currentUser');
      setIsLoggedIn(false);
    };
  
    return (
      <div>
        {isLoggedIn ? (
          <div>
            <p>{user?.user.userName} (rating: {user?.user.rating})</p>
            <button onClick={handleLogoutClick}>Logout</button>
          </div>
        ) : (
          <button onClick={handleLoginClick}>Login</button>
        )}
      </div>
    );
  };
  
