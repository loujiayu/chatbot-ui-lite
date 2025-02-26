import React from 'react';

interface NavButtonsProps {
  showHIPAAPrompt: () => void;
  showConfigPrompt: () => void;
  handleLogout: () => void;
}

const NavButtons: React.FC<NavButtonsProps> = ({
  showHIPAAPrompt,
  showConfigPrompt,
  handleLogout,
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
        <button className="nav-button" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
        </button>
        <span className="nav-label">Logout</span>
      </div>
    </div>
  );
};

export default NavButtons;
