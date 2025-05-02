import React, { useEffect, useState } from 'react';
import useAuthStore from './store/useAuthStore';
import { checkLoginStatus, getGoogleLoginUrl } from './services/authService';

const SSOLogin = () => {
  const { isLoggedIn, setIsLoggedIn, setShowSSOLogin, setUserId } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const verifyLoginStatus = async () => {
      try {
        const { isLoggedIn: loggedIn, userId, error } = await checkLoginStatus();
        
        setIsLoggedIn(loggedIn);
        if (userId) {
          setUserId(userId);
        }
        
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

  const handleLoginClick = () => {
    setIsAnimating(true);
  };

  let origin;
  if (typeof window !== "undefined") {
    origin = window.location.origin;
  } else {
    origin = "http://localhost:3000";
  }
  const googleSSOUrl = getGoogleLoginUrl(origin);

  return (
    <div className="sso-login-container">
      {isLoading ? (
        <>
          <div className="loading-spinner" />
          <p className="text-white/60">Checking login status...</p>
        </>
      ) : isLoggedIn ? (
        <div className="animate-fadeIn">
          <h1 className="welcome-text">Welcome Back!</h1>
          <p>Redirecting to your dashboard...</p>
        </div>
      ) : (
        <div className="animate-fadeIn space-y-6">
          <a 
            href={googleSSOUrl} 
            className="sso-login-button" 
            onClick={handleLoginClick}
          >
            <i className={`fab fa-google ${isAnimating ? 'animate-spin' : ''}`}></i>
            {isAnimating ? 'Connecting...' : 'Login with Google'}
          </a>
        </div>
      )}
    </div>
  );
};

export default SSOLogin;
