import React from "react";
import User from "../assets/profile-picture.png";
import "./PSideBar.css";
import { Scrollbars } from "react-custom-scrollbars";

function ProfileSidebar(p) {
  return (
    <>
      <div className="sidebar">
        {/**this is the container ^ */}
        <div className="user">
          <div>
            <img src={User} alt="profile" />
            <h2>xXxRaysanxXx</h2>
            <button>Follow</button>
          </div>
        </div>
        {/**insert here for new container */}
      </div>
    </>
  );
}

export default ProfileSidebar;
