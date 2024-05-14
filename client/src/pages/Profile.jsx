import React from "react";
import Post from "../components/Post";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileNavBar from "../components/ProfileNavBar";
import User from "../assets/profile-picture.png";
import Pen from "../assets/pen.png";
import "../components/css/Profile.css";

function Profile(p) {
  return (
    <>
      <div className="flex flex-col gap-3 p-3 h-svh bg-zinc-950">
        <ProfileNavBar />
        <ProfileSidebar />
        <div className="create-post">
          <div className="create">
            <img src={User} alt="User" />
            <div className="input">
              <input
                type="text"
                placeholder="Do you have a recipe to share?"
                className="white-placeholder"
              />
              <button>
                <img src={Pen} alt="create post" />
              </button>
            </div>
          </div>
        </div>
        <div className="post">
          <Post />
          <Post />
        </div>
      </div>
    </>
  );
}

export default Profile;