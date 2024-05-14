import React from "react";
import "./css/PNavBar.css";
import Logo from "../assets/luto-logo-gradient.png";
import BackButton from "../assets/back-button.png";
import User from "../assets/profile-picture.png";

const ProfilePage = () => {
  return (
    <div>
      <div className="header">
        <div className="back-button">
          <button>
            <img src={BackButton} alt="" />
          </button>
        </div>
        <div className="logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="user-button">
          <button>
            <img src={User} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
