import React from 'react';
import './PNavBar.css'
import Logo from '../assets/luto-logo-gradient.png'
import BackButton from '../assets/back-button.png'


const ProfilePage = () => {
  return (
    <div>
      <div className="header">
        <div className="back-button">
          <button onClick={() => console.log('Go back')}>
            <img src={BackButton} alt="" />
          </button>
        </div>
        <div className="logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="user-button">
          <button onClick={() => console.log('Go to user profile')}>User</button>
        </div>
      </div>
      <h1>Profile Page</h1>
      {/* Other profile page content */}
    </div>
  );
};

export default ProfilePage;