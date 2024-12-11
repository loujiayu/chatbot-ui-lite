import React from 'react';
import { FaGoogle, FaFacebook, FaGithub, FaLinkedin, FaApple } from 'react-icons/fa';
import { BsTwitterX } from "react-icons/bs";

type SocialLoginProps = {
  onSocialLogin?: (provider: string) => void;
};

const SocialLogin: React.FC<SocialLoginProps> = ({ onSocialLogin }) => {
  const handleLogin = (provider: string) => {
    // Replace with actual API call or SDK integration
    console.log(`Logging in with ${provider}`);
    if (onSocialLogin) {
      onSocialLogin(provider);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={loginBoxStyle}>
        <h3 style={headerStyle}>Sign in to Your Account</h3>
        <div style={buttonContainerStyle}>
          <button
            onClick={() => handleLogin('Google')}
            style={buttonStyle('google')}
          >
            <FaGoogle style={{ marginRight: '8px' }} /> Login with Google
          </button>
          <button
            onClick={() => handleLogin('Facebook')}
            style={buttonStyle('facebook')}
          >
            <FaFacebook style={{ marginRight: '8px' }} /> Login with Facebook
          </button>
          <button
            onClick={() => handleLogin('GitHub')}
            style={buttonStyle('github')}
          >
            <FaGithub style={{ marginRight: '8px' }} /> Login with GitHub
          </button>
          <button
            onClick={() => handleLogin('X')}
            style={buttonStyle('x')}
          >
            <BsTwitterX style={{ marginRight: '8px' }} /> Login with X
          </button>
          <button
            onClick={() => handleLogin('LinkedIn')}
            style={buttonStyle('linkedin')}
          >
            <FaLinkedin style={{ marginRight: '8px' }} /> Login with LinkedIn
          </button>
          <button
            onClick={() => handleLogin('Apple')}
            style={buttonStyle('apple')}
          >
            <FaApple style={{ marginRight: '8px' }} /> Login with Apple
          </button>
        </div>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: '#f4f4f4',
};

const loginBoxStyle: React.CSSProperties = {
  textAlign: 'center',
  margin: '20px',
  padding: '20px',
  borderRadius: '10px',
  backgroundColor: '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const headerStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '20px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
};

type Provider = 'google' | 'facebook' | 'github' | 'x' | 'linkedin' | 'apple';

const buttonStyle = (provider: Provider): React.CSSProperties => ({
  width: '250px',
  margin: '10px',
  padding: '10px 20px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: getProviderColor(provider),
});

const getProviderColor = (provider: Provider): string => {
  const colors: Record<Provider, string> = {
    google: '#DB4437',
    facebook: '#4267B2',
    github: '#333',
    x: '#1DA1F2',
    linkedin: '#0077B5',
    apple: '#000',
  };
  return colors[provider];
};

export default SocialLogin;