import React from 'react';

interface NavButtonsProps {
  showHIPAAPrompt: () => void;
  showConfigPrompt: () => void;
  navigateToSSOLogin: () => void;
}

const NavButtons: React.FC<NavButtonsProps> = ({
  showHIPAAPrompt,
  showConfigPrompt,
  navigateToSSOLogin,
}) => {
  return (
    <div className="nav-buttons">
      <div className="nav-item">
        <button className="nav-button" onClick={showHIPAAPrompt}>
          <i className="fas fa-shield-alt"></i>
        </button>
        <span className="nav-label">HIPAA</span>
      </div>
      <div className="nav-item">
        <button className="nav-button" onClick={showConfigPrompt}>
          <i className="fas fa-cog"></i>
        </button>
        <span className="nav-label">Config</span>
      </div>
      <div className="nav-item">
        <button className="nav-button">
          <i className="fas fa-bell"></i>
        </button>
        <span className="nav-label">Alerts</span>
      </div>
      <div className="nav-item">
        <button className="nav-button" onClick={navigateToSSOLogin}>
          <i className="fas fa-sign-in-alt"></i>
        </button>
        <span className="nav-label">SSO Login</span>
      </div>
    </div>
  );
};

export default NavButtons;
