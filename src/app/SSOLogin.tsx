import React, { useEffect, useState } from 'react';
import useAuthStore from './store/useAuthStore';
import { checkLoginStatus, getGoogleLoginUrl } from './services/authService';

const SSOLogin = () => {
  const { isLoggedIn, setIsLoggedIn, setShowSSOLogin, setUserId } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyLoginStatus = async () => {
      try {
        const { isLoggedIn: loggedIn, userId, error } = await checkLoginStatus();
        
        setIsLoggedIn(loggedIn);
        if (userId) {
          setUserId(userId);
        }
        
        // If the user is logged in, hide the login screen
        if (loggedIn) {
          setShowSSOLogin(false);
        }
        
        if (error) {
          console.error('Login status check error:', error);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyLoginStatus();
  }, [setIsLoggedIn, setShowSSOLogin, setUserId]);

  const origin = window.location.origin;
  const googleSSOUrl = getGoogleLoginUrl(origin);

  return (
    <div className="sso-login-container">
      {isLoading ? (
        <div className="loading-spinner" />
      ) : isLoggedIn ? (
        <p>You are already logged in.</p>
      ) : (
        <a href={googleSSOUrl} className="sso-login-button google">
          <i className="fab fa-google"></i> Login with Google
        </a>
      )}
    </div>
  );
};

export default SSOLogin;
