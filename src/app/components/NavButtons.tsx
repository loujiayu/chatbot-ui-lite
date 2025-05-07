import React from 'react';

interface NavButtonsProps {
  showHIPAAPrompt: () => void;
  showConfigPrompt: () => void;
  handleLogout: () => void;
  showNotesPrompt: () => void;
  disabled?: boolean; // Add this prop
}

const NavButtons: React.FC<NavButtonsProps> = ({
  showHIPAAPrompt,
  showConfigPrompt,
  handleLogout,
  showNotesPrompt,
  disabled = false // Default to false
}) => {
  return (
    <div className="nav-buttons">
      <div className="nav-item">
        <button className="nav-button" onClick={showHIPAAPrompt} disabled={disabled}>
          <i className="fas fa-shield-alt"></i>
        </button>
        <span className="nav-label">HIPAA</span>
      </div>
      <div className="nav-item">
        <button className="nav-button" onClick={showConfigPrompt} disabled={disabled}>
          <i className="fas fa-cog"></i>
        </button>
        <span className="nav-label">Config</span>
      </div>
      <div className="nav-item">
        <button className="nav-button" onClick={showNotesPrompt} disabled={disabled}>
          <i className="fas fa-bell"></i>
        </button>
        <span className="nav-label">Note</span>
      </div>
      <div className="nav-item">
        <button className="nav-button" onClick={handleLogout} disabled={disabled}>
          <i className="fas fa-sign-out-alt"></i>
        </button>
        <span className="nav-label">Logout</span>
      </div>
    </div>
  );
};

export default NavButtons;
