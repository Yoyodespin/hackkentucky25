import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="linkedin-header">
      <div className="header-content">
        <div className="header-left">
          <a href="#" className="back-button">
            <FaArrowLeft className="icon" />
            <span>Back to Programs</span>
          </a>
          <div className="logo">TradeEdu</div>
        </div>
        
        <div className="header-right">
          <button className="help-button">Need Help?</button>
          <button className="contact-button">Contact Us</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
