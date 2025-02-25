import React, { useEffect, useState } from 'react';

const SSOLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

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
