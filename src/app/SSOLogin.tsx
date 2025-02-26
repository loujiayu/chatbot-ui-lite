import React, { useEffect, useState } from 'react';
import useAuthStore from './store/useAuthStore';

const SSOLogin = () => {
  const { isLoggedIn, setIsLoggedIn, setShowSSOLogin } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/loginstatus', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status == 401) {
            setIsLoggedIn(false);
            setIsLoading(false);
            return;
          }
          throw new Error('Failed to check login status');
        }

        const data = await response.json();
        setIsLoggedIn(data.logged_in);
        
        // If the user is logged in, hide the login screen
        if (data.logged_in) {
          setShowSSOLogin(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, [setIsLoggedIn, setShowSSOLogin]);

  const origin = window.location.origin;
  const googleSSOUrl = `http://localhost:5000/login/google/patient?cb=${encodeURIComponent(origin)}`;

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
