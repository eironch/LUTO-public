import React from "react";
import User from "../assets/profile-picture.png";
import "./css/PSideBar.css";

function ProfileSidebar(p) {
  return (
    <>
      <div className="sidebar">
        {/**User  */}
        <div className="user">
          <div>
            <img src={User} alt="profile" />
            <h2>xXxRaysanxXx</h2>
            <button>Follow</button>
          </div>
        </div>
        {/**Bio */}
        <div className="bio">
          <div>
            <h3>Bio</h3>
            <p>
              An aspiring cook from the Pearl of the Orient Sea, the
              Philippines. Here to learn and be part of the cooking community.
            </p>
          </div>
        </div>
        {/**Friends */}
        <div className="friends">
          <div>
            <h3>Friends</h3>
            <div className="friendlist">
              <div className="friend">
                <img src={User} alt="profile" />
                <h2>Friend 1</h2>
              </div>
            </div>
            <div className="friendlist">
              <div className="friend">
                <img src={User} alt="profile" />
                <h2>Friend 2</h2>
              </div>
            </div>
            <div className="friendlist">
              <div className="friend">
                <img src={User} alt="profile" />
                <h2>Friend 3</h2>
              </div>
            </div>
            <div className="friendlist">
              <div className="friend">
                <img src={User} alt="profile" />
                <h2>Friend 4</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileSidebar;
